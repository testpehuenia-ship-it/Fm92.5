import { StationConfig, Track, ChatMessage, EqualizerBand } from '../types';

export const INITIAL_STATION: StationConfig = {
  radioName: 'Fm Golfo Azul',
  frequency: 92.5,
  streamUrl: 'https://streaming01.shockmedia.com.ar/9180/stream',
  bitrate: 320,
  genre: 'Radio FM',
  currentShow: 'Transmisión en Vivo',
  host: 'Locutor',
  uptime: '99.9%',
  listeners: 12458
};

export const STATIONS_PRESETS = [
  {
    name: 'Fm Golfo Azul',
    frequency: 92.5,
    tagline: 'Transmisión en Vivo',
    track: 'Transmisión Oficial',
    artist: 'Fm Golfo Azul',
    bitrate: 320
  },
  {
    name: 'Cyber Drift FM',
    frequency: 98.2,
    tagline: 'Transmisión de Outrun de Alta Velocidad y Darksynth',
    track: 'Overdrive 1984',
    artist: 'Kavinsky Resonance',
    bitrate: 320
  },
  {
    name: 'Deep Space Ambient',
    frequency: 107.9,
    tagline: 'Drones Atmosféricos de Sintetizador y Ondas Lo-Fi',
    track: 'Solar Winds Echo',
    artist: 'Nebula Protocol',
    bitrate: 256
  },
  {
    name: 'Tokyo Cyberpulse',
    frequency: 91.4,
    tagline: 'Future Funk, Chiptune y City Pop Synth',
    track: 'Midnight Shinjuku',
    artist: 'Vapor Waveform',
    bitrate: 320
  }
];

export const INITIAL_TRACKS: Track[] = [
  {
    id: 'track-1',
    title: 'Neon Nights',
    artist: 'Synthetix Studio',
    album: 'Synthetic Ether Vol. 1',
    station: 'Synthetix Studio',
    frequency: 104.5,
    duration: 245,
    mood: 'Cyberpunk Driving'
  },
  {
    id: 'track-2',
    title: 'Midnight Overdrive',
    artist: 'Kavinsky Resonance',
    album: 'Outrun Horizon',
    station: 'Cyber Drift FM',
    frequency: 98.2,
    duration: 210,
    mood: 'High Energy Retro'
  },
  {
    id: 'track-3',
    title: 'Solar Winds Echo',
    artist: 'Nebula Protocol',
    album: 'Orbital Transmissions',
    station: 'Deep Space Ambient',
    frequency: 107.9,
    duration: 380,
    mood: 'Ambient Calm'
  },
  {
    id: 'track-4',
    title: 'Chrome Hologram',
    artist: 'Arcade Odyssey',
    album: 'Future Grid 2099',
    station: 'Synthetix Studio',
    frequency: 104.5,
    duration: 195,
    mood: 'Synth Pop'
  }
];

export const INITIAL_CHAT: ChatMessage[] = [
  {
    id: 'msg-1',
    author: 'Synthetix Studio (Locutor)',
    text: '¡Bienvenidos a Noches de Neón en vivo por 104.5 MHz! Deja tus peticiones en el chat o vía WhatsApp.',
    timestamp: '21:30',
    isHost: true,
    likes: 24
  },
  {
    id: 'msg-2',
    author: 'Elena_Cyber',
    text: '¡Ese bajo en Noches de Neón es impresionante! 🔥🔊',
    timestamp: '21:31',
    likes: 12
  },
  {
    id: 'msg-3',
    author: 'Marcos_Runner',
    text: '¡Escuchando desde Madrid con calidad impecable de 320 kbps!',
    timestamp: '21:32',
    likes: 8
  },
  {
    id: 'msg-4',
    author: 'Vektor99',
    text: '¿Podemos escuchar algo de darksynth después de este tema? ⚡',
    timestamp: '21:33',
    likes: 15
  }
];

export const INITIAL_EQ_BANDS: EqualizerBand[] = [
  { freq: '60Hz', label: 'Subgraves', value: 4 },
  { freq: '150Hz', label: 'Graves', value: 3 },
  { freq: '400Hz', label: 'Medios Bajos', value: 0 },
  { freq: '1kHz', label: 'Medios', value: -1 },
  { freq: '2.5kHz', label: 'Medios Altos', value: 2 },
  { freq: '6kHz', label: 'Presencia', value: 5 },
  { freq: '12kHz', label: 'Brillo', value: 6 },
  { freq: '16kHz', label: 'Aire', value: 4 }
];
