import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Share2, 
  ThumbsUp, 
  MessageCircle, 
  Smartphone, 
  ChevronRight, 
  Cloud, 
  BatteryMedium,
  Activity
} from 'lucide-react';
import { Track, StationConfig } from '../types';
import { audioEngine } from '../audio/audioEngine';

interface PlayerViewProps {
  station: StationConfig;
  currentTrack: Track;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onPrevTrack: () => void;
  onNextTrack: () => void;
  onOpenWhatsApp: () => void;
  onOpenInstallModal: () => void;
  onShare: () => void;
}

export const PlayerView: React.FC<PlayerViewProps> = ({
  station,
  currentTrack,
  isPlaying,
  onTogglePlay,
  onPrevTrack,
  onNextTrack,
  onOpenWhatsApp,
  onOpenInstallModal,
  onShare,
}) => {
  // Live Clock & Time
  const [timeString, setTimeString] = useState('9:24 PM');
  const [dateString, setDateString] = useState('Oct 24');
  const [likesCount, setLikesCount] = useState(1284);
  const [hasLiked, setHasLiked] = useState(false);
  const [progressPercent, setProgressPercent] = useState(65);
  const [remainingTime, setRemainingTime] = useState('-1:24');
  
  // Real-time Audio Spectrum heights (13 bars)
  const [spectrumHeights, setSpectrumHeights] = useState<number[]>([
    12, 22, 18, 34, 28, 42, 38, 48, 26, 32, 16, 22, 12
  ]);

  // Dial rotation angle
  const [dialRotation, setDialRotation] = useState(45);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      const formattedMin = minutes < 10 ? `0${minutes}` : minutes;
      setTimeString(`${hours}:${formattedMin} ${ampm}`);

      const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      setDateString(`${now.getDate()} ${months[now.getMonth()]}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Animate progress and countdown during playback
  useEffect(() => {
    if (!isPlaying) return;
    const progressInterval = setInterval(() => {
      setProgressPercent((prev) => (prev >= 98 ? 15 : prev + 0.5));
      setDialRotation((prev) => (prev + 3) % 360);
    }, 1000);
    return () => clearInterval(progressInterval);
  }, [isPlaying]);

  // Read real frequency data from audio engine
  useEffect(() => {
    let animFrame: number;
    const updateSpectrum = () => {
      if (isPlaying) {
        const freqData = audioEngine.getFrequencyData();
        // Map 13 bars
        const newHeights = Array.from({ length: 13 }).map((_, i) => {
          const sample = freqData[i * 2] || 0;
          // Scale from 0-255 to 8-48px height with natural variance
          const baseHeight = Math.max(8, Math.min(48, (sample / 255) * 44 + Math.sin(Date.now() / 200 + i) * 6 + 10));
          return Math.round(baseHeight);
        });
        setSpectrumHeights(newHeights);
      } else {
        // Idle gentle pulse
        const idleHeights = [10, 16, 12, 24, 20, 30, 26, 32, 18, 22, 12, 15, 10];
        setSpectrumHeights(idleHeights);
      }
      animFrame = requestAnimationFrame(updateSpectrum);
    };

    animFrame = requestAnimationFrame(updateSpectrum);
    return () => cancelAnimationFrame(animFrame);
  }, [isPlaying]);

  const handleLike = () => {
    if (hasLiked) {
      setLikesCount((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setLikesCount((prev) => prev + 1);
      setHasLiked(true);
    }
  };

  return (
    <div className="relative h-[calc(100dvh-64px)] md:min-h-screen flex flex-col items-center justify-center p-2 sm:p-6 overflow-hidden touch-none overscroll-none">
      {/* 100% Sharp, Crisp Background Image - No Darkening Overlays */}
      <div 
        id="crisp-background-image"
        className="fixed inset-0 z-0 bg-cover bg-center pointer-events-none"
        style={{
          backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBaAuR8_AIEoEDisQYbExpAOO13UMOEE70_Tme3jUGq0ERc1AWTyOvLotoFA476faHwz45LafwuriFcq7jhfw3y5DyKnUU5GfVG-PJTXMXitcetHDtRBxw537pTybXSjEyq332vjV7sCWGX6pbuAzJD8DEr5mMU9NOg6oVcueEYyeu63vf7BEP52TR22EumjJ-Dkczr3rjEjHyDdYTaA18SBc5cwv7itBqKyRAdcB5UpDmzjppo6IYw4n-C9_Ewa8Fozww')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Main Glassmorphism Device Container */}
      <div 
        id="player-card"
        className="relative z-10 w-full max-w-[420px] h-full md:h-auto rounded-[32px] overflow-hidden bg-black/25 border-2 border-[#0066ff] animate-neon-breathe flex flex-col transition-all duration-300"
      >
        {/* Content Area */}
        <div className="flex flex-col items-center justify-between h-full p-3 sm:p-6 pt-4 pb-4">
          {/* Frequency Dial Pill */}
          <div className="text-center w-full flex flex-col items-center">
            <div className="rounded-full px-5 py-1.5 border border-[#0066ff] bg-black/30 flex items-center gap-2.5 shadow-[0_0_12px_rgba(0,229,255,0.5)]">
              <Radio className="w-4 h-4 text-[#ff24e4] animate-pulse" />
              <span className="text-[17px] font-bold text-white font-mono tracking-tight">
                {station.frequency.toFixed(1)} MHz
              </span>
            </div>
          </div>

          {/* Glowing Volume / Dial Ring */}
          <div className="relative rounded-full border border-[#0066ff] shadow-[inset_0_0_18px_rgba(0,229,255,0.6)] flex items-center justify-center my-0.5 sm:my-1 w-24 h-24 sm:w-32 sm:h-32 bg-black/30 group shrink-0">
            {/* Outer Glow Ring */}
            <div 
              className="absolute inset-0 rounded-full border border-[#0066ff] shadow-[0_0_20px_rgba(0,229,255,0.8)] transition-all duration-300"
            />
            
            {/* Rotating Indicator Dot */}
            <div 
              className="absolute w-3 h-3 bg-[#0066ff] rounded-full shadow-[0_0_15px_#0066ff] transition-transform duration-500 ease-out"
              style={{
                transform: `rotate(${dialRotation}deg) translate(56px) rotate(-${dialRotation}deg)`
              }}
            />

            {/* Central Animated Equalizer Waveform */}
            <div className="text-center flex flex-col items-center justify-center w-full h-full rounded-full overflow-hidden relative z-10">
              <img 
                src={station.logoUrl || '/logo.png'} 
                alt={station.radioName} 
                className={`w-[85%] h-[85%] rounded-full object-cover transition-all duration-300 bg-black/50 ${
                  isPlaying ? 'scale-105 opacity-100 drop-shadow-[0_0_15px_rgba(0,102,255,0.8)]' : 'opacity-70 scale-95 grayscale-[20%]'
                }`} 
              />
            </div>
          </div>

          {/* Track Info & Live Status */}
          <div className="w-full flex flex-col items-center gap-2 sm:gap-4 shrink-0">
            <div className="text-center">
              <h2 className="text-[20px] sm:text-[22px] font-bold text-white mb-0.5 tracking-tight">
                {station.radioName}
              </h2>
              <p className="text-[14px] sm:text-[15px] font-medium text-[#0066ff]">
                {station.currentShow}
              </p>
            </div>

            {/* Live Status Badge */}
            <div className="flex items-center justify-center gap-2">
              <span className="text-[12px] sm:text-[13px] font-bold tracking-wider text-[#0066ff] flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 bg-black/40 rounded-full border border-[#0066ff]/30 shadow-[0_0_10px_rgba(0,229,255,0.2)]">
                <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-[#ff24e4] shadow-[0_0_8px_#ff24e4] animate-pulse' : 'bg-white/40'}`}></span>
                EN VIVO
              </span>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-center w-full mt-0.5 sm:mt-1">
              <button 
                id="btn-play-toggle"
                onClick={onTogglePlay}
                className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full border-2 border-[#0066ff] text-[#0066ff] bg-black/40 shadow-[0_0_25px_rgba(0,229,255,0.8)] hover:shadow-[0_0_35px_rgba(0,229,255,1)] hover:bg-[#0066ff]/20 transition-all active:scale-95 group"
                title={isPlaying ? 'Pausar Transmisión' : 'Iniciar Transmisión en Vivo'}
              >
                {isPlaying ? (
                  <Pause className="w-7 h-7 sm:w-8 sm:h-8 fill-[#0066ff]" />
                ) : (
                  <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-[#0066ff] ml-1" />
                )}
              </button>
            </div>
          </div>

          {/* VU Meter Spectrum (13 reactive bars) */}
          <div 
            id="vu-spectrum"
            className="h-10 sm:h-12 w-full flex items-end justify-center gap-1.5 px-4 shrink-0"
          >
            {spectrumHeights.map((height, idx) => {
              // Middle bars are magenta/pink matching the screenshot
              const isMagenta = idx >= 5 && idx <= 7;
              return (
                <div
                  key={idx}
                  className={`w-[4px] rounded-t-sm transition-all duration-100 ${
                    isMagenta 
                      ? 'bg-[#ff24e4] shadow-[0_0_12px_rgba(255,36,228,0.9)]' 
                      : 'bg-[#0066ff] shadow-[0_0_12px_rgba(0,229,255,0.9)]'
                  }`}
                  style={{ height: `${height}px` }}
                />
              );
            })}
          </div>

          {/* Social & Contact Actions */}
          <div className="w-full flex justify-between items-center px-1 sm:px-2 pt-2 sm:pt-3 border-t border-[#0066ff]/30 shrink-0">
            <div className="flex items-center gap-3">
              <button 
                id="btn-share"
                onClick={onShare}
                className="p-2 text-white/90 hover:text-[#0066ff] transition-colors active:scale-90"
                title="Compartir Emisora"
              >
                <Share2 className="w-5 h-5" />
              </button>
              
              <button 
                id="btn-like"
                onClick={handleLike}
                className={`p-2 transition-colors active:scale-90 flex items-center gap-1.5 text-[13px] ${
                  hasLiked ? 'text-[#ff24e4]' : 'text-white/90 hover:text-[#ff24e4]'
                }`}
                title="Me Gusta"
              >
                <ThumbsUp className={`w-5 h-5 ${hasLiked ? 'fill-[#ff24e4]' : ''}`} />
                <span className="font-mono text-[11px]">{likesCount}</span>
              </button>
            </div>

            {/* Prominent WhatsApp Message Us Button */}
            <button 
              id="btn-whatsapp-message"
              onClick={onOpenWhatsApp}
              className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border-2 border-[#25D366] text-[#25D366] font-semibold text-[13px] sm:text-[14px] shadow-[0_0_20px_rgba(37,211,102,0.6)] hover:bg-[#25D366]/20 transition-all active:scale-95 bg-black/40"
            >
              <MessageCircle className="w-4 h-4 fill-[#25D366]" />
              <span>Escríbenos</span>
            </button>
          </div>

          {/* Footer / Credits INSIDE */}
          <div className="w-full text-center mt-1">
            <p className="text-[10px] sm:text-[11px] font-medium tracking-wide flex items-center justify-center gap-1 opacity-80">
              <span className="text-[#849396]">Diseño</span>
              <a href="https://adnqn.ar/" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity">
                <span className="text-[#0066ff] drop-shadow-[0_0_8px_#0066ff]">ADNQN</span>
                <span className="text-[#ffd700]">.ar</span>
              </a>
              <span className="text-[#849396]">2026</span>
            </p>
          </div>
        </div>


      </div>

    </div>
  );
};
