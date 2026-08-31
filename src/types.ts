export interface StationConfig {
  radioName: string;
  frequency: number; // e.g. 104.5
  streamUrl: string;
  bitrate: number;
  genre: string;
  currentShow: string;
  host: string;
  uptime: string;
  listeners: number;
  logoUrl?: string;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  station: string;
  frequency: number;
  duration: number; // in seconds
  coverUrl?: string;
  mood: string;
}

export interface BroadcastAlert {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  active: boolean;
}

export interface ChatMessage {
  id: string;
  author: string;
  avatar?: string;
  text: string;
  timestamp: string;
  isHost?: boolean;
  likes: number;
}

export interface EqualizerBand {
  freq: string;
  label: string;
  value: number; // -12 to +12 dB
}

export interface PushTemplate {
  id: string;
  title: string;
  message: string;
}

export type ActiveTab = 'radio' | 'messages' | 'admin';
