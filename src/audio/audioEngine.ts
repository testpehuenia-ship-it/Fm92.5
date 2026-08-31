// Web Audio API Synthesizer & Audio Analyzer for ETHER FM
class AudioEngine {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying = false;
  private timerId: number | null = null;
  private currentStep = 0;
  private frequency = 104.5;
  private currentVolume = 0.8;
  
  private audioElement: HTMLAudioElement | null = null;
  private mediaSource: MediaElementAudioSourceNode | null = null;
  private currentStreamUrl: string = '';

  // Chord progression for synthwave (Am - F - C - G)
  private chords = [
    [220.0, 261.63, 329.63, 440.0], // Am
    [174.61, 220.0, 261.63, 349.23], // F
    [130.81, 164.81, 196.0, 261.63], // C
    [196.0, 246.94, 293.66, 392.0]  // G
  ];

  public init(): boolean {
    try {
      if (!this.ctx) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioContextClass();
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 64;
        this.analyser.smoothingTimeConstant = 0.75;
        this.gainNode = this.ctx.createGain();
        this.gainNode.gain.setValueAtTime(this.currentVolume, this.ctx.currentTime);
        this.gainNode.connect(this.ctx.destination);
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return true;
    } catch (e) {
      console.warn('Web Audio initialization error:', e);
      return false;
    }
  }

  public play(frequency = 104.5, streamUrl?: string) {
    this.frequency = frequency;
    if (!this.init()) return;
    if (this.isPlaying) return;

    this.isPlaying = true;
    
    if (streamUrl && streamUrl.trim() !== '') {
      this.playStream(streamUrl);
    } else {
      this.currentStep = 0;
      this.startSequencer();
    }
  }

  private playStream(url: string) {
    if (!this.audioElement) {
      this.audioElement = new Audio();
      this.audioElement.crossOrigin = 'anonymous'; // Re-added to prevent Web Audio API from muting the stream!
      
      try {
        if (this.ctx && this.analyser && this.gainNode) {
          this.mediaSource = this.ctx.createMediaElementSource(this.audioElement);
          this.mediaSource.connect(this.analyser);
          this.analyser.connect(this.gainNode);
        }
      } catch (e) {
        console.warn('Could not connect media element source:', e);
      }
    }
    
    // Add semicolon for SHOUTcast compatibility if not present
    const finalUrl = url.endsWith(';') ? url : url + ';';
    
    this.currentStreamUrl = url;
    this.audioElement.src = finalUrl;
    this.audioElement.volume = this.currentVolume;
    this.audioElement.play().catch(e => {
      console.error('Error playing stream:', e);
    });
  }

  public updateStreamUrl(url: string) {
    if (this.isPlaying && this.currentStreamUrl !== url) {
      this.pause();
      this.play(this.frequency, url);
    }
  }

  public pause() {
    this.isPlaying = false;
    
    if (this.audioElement) {
      this.audioElement.pause();
    }

    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  public setVolume(vol: number) {
    this.currentVolume = Math.max(0, Math.min(1, vol));
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(this.currentVolume, this.ctx.currentTime);
    }
    if (this.audioElement) {
      this.audioElement.volume = this.currentVolume;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getFrequencyData(): Uint8Array {
    if (!this.analyser) {
      return new Uint8Array(16);
    }
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }

  private startSequencer() {
    const tempo = 118; // BPM
    const stepIntervalMs = (60 / tempo / 4) * 1000; // 16th notes

    this.timerId = window.setInterval(() => {
      if (!this.isPlaying || !this.ctx || !this.gainNode || !this.analyser) return;

      const chordIdx = Math.floor(this.currentStep / 16) % this.chords.length;
      const currentChord = this.chords[chordIdx];
      const stepInMeasure = this.currentStep % 16;

      // Synth Bassline on every 8th note
      if (stepInMeasure % 2 === 0) {
        this.triggerBass(currentChord[0] / 2);
      }

      // Arpeggiator on 16th notes
      const noteIdx = stepInMeasure % currentChord.length;
      this.triggerArp(currentChord[noteIdx]);

      // Synth Kick on 1, 5, 9, 13
      if (stepInMeasure % 4 === 0) {
        this.triggerKick();
      }

      // Snare on 5, 13
      if (stepInMeasure === 4 || stepInMeasure === 12) {
        this.triggerSnare();
      }

      // Hi-hat on offbeats
      if (stepInMeasure % 2 === 1) {
        this.triggerHiHat();
      }

      this.currentStep++;
    }, stepIntervalMs);
  }

  private triggerBass(freq: number) {
    if (!this.ctx || !this.gainNode || !this.analyser) return;
    const osc = this.ctx.createOscillator();
    const env = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.18);

    env.gain.setValueAtTime(0.35, this.ctx.currentTime);
    env.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);

    osc.connect(filter);
    filter.connect(env);
    env.connect(this.analyser);
    this.analyser.connect(this.gainNode);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }

  private triggerArp(freq: number) {
    if (!this.ctx || !this.gainNode || !this.analyser) return;
    const osc = this.ctx.createOscillator();
    const env = this.ctx.createGain();

    osc.type = 'sine';
    // Modulate pitch slightly based on tuned station frequency
    const mod = 1 + ((this.frequency - 104.5) * 0.02);
    osc.frequency.setValueAtTime(freq * 2 * mod, this.ctx.currentTime);

    env.gain.setValueAtTime(0.12, this.ctx.currentTime);
    env.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

    osc.connect(env);
    env.connect(this.analyser);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.16);
  }

  private triggerKick() {
    if (!this.ctx || !this.gainNode || !this.analyser) return;
    const osc = this.ctx.createOscillator();
    const env = this.ctx.createGain();

    osc.frequency.setValueAtTime(130, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);

    env.gain.setValueAtTime(0.5, this.ctx.currentTime);
    env.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

    osc.connect(env);
    env.connect(this.analyser);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  private triggerSnare() {
    if (!this.ctx || !this.gainNode || !this.analyser) return;
    // Noise buffer for synth snare
    const bufferSize = this.ctx.sampleRate * 0.1;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1000, this.ctx.currentTime);

    const env = this.ctx.createGain();
    env.gain.setValueAtTime(0.18, this.ctx.currentTime);
    env.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

    noise.connect(filter);
    filter.connect(env);
    env.connect(this.analyser);

    noise.start();
    noise.stop(this.ctx.currentTime + 0.1);
  }

  private triggerHiHat() {
    if (!this.ctx || !this.gainNode || !this.analyser) return;
    const bufferSize = this.ctx.sampleRate * 0.04;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(7000, this.ctx.currentTime);

    const env = this.ctx.createGain();
    env.gain.setValueAtTime(0.08, this.ctx.currentTime);
    env.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

    noise.connect(filter);
    filter.connect(env);
    env.connect(this.analyser);

    noise.start();
    noise.stop(this.ctx.currentTime + 0.04);
  }

  public playStaticBurst() {
    if (!this.init() || !this.ctx || !this.gainNode) return;
    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.15;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const env = this.ctx.createGain();
    env.gain.setValueAtTime(0.2, this.ctx.currentTime);
    env.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
    noise.connect(env);
    env.connect(this.gainNode);
    noise.start();
  }
}

export const audioEngine = new AudioEngine();
