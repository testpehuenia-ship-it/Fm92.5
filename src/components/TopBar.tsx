import React from 'react';
import { Radio, Settings, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { StationConfig } from '../types';

interface TopBarProps {
  station: StationConfig;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onOpenSettings?: () => void;
  volume: number;
  onVolumeChange: (val: number) => void;
  isAdmin?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  station,
  isPlaying,
  onTogglePlay,
  onOpenSettings,
  volume,
  onVolumeChange,
  isAdmin = false
}) => {
  return (
    <>
      {/* Top App Bar (Mobile ONLY) */}
      <header 
        id="mobile-top-bar"
        className="flex md:hidden justify-between items-center w-full px-5 h-16 bg-[#131318]/60 backdrop-blur-xl text-[#0066ff] fixed top-0 left-0 z-40 shadow-lg border-b border-white/5"
      >
        <button 
          id="mobile-radio-btn"
          onClick={onTogglePlay}
          className="text-[#bac9cc] hover:text-[#0066ff] transition-all duration-300 active:scale-90 p-2"
          aria-label="Alternar radio"
        >
          <Radio className={`w-6 h-6 ${isPlaying ? 'text-[#0066ff] animate-pulse' : ''}`} />
        </button>

        <div className="flex flex-col items-center">
          <h1 className="text-[20px] font-extrabold tracking-wider text-[#0066ff] drop-shadow-[0_0_10px_rgba(0,229,255,0.6)] truncate max-w-[200px]">
            {station.radioName.toUpperCase()}
          </h1>
          <span className="text-[10px] text-[#fface8] tracking-widest font-mono">
            {station.frequency.toFixed(1)} MHz
          </span>
        </div>

        {isAdmin && onOpenSettings && (
          <button 
            id="mobile-settings-btn"
            onClick={onOpenSettings}
            className="text-[#bac9cc] hover:text-[#0066ff] transition-all duration-300 active:scale-90 p-2"
            aria-label="Abrir ajustes"
          >
            <Settings className="w-6 h-6" />
          </button>
        )}
      </header>

      {/* Desktop Top Header Bar */}
      <header 
        id="desktop-top-header"
        className="hidden md:flex justify-between items-center w-full px-8 py-4 bg-transparent relative z-30"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0066ff]/10 border border-[#0066ff]/30 text-[#0066ff] text-[13px] font-semibold shadow-[0_0_10px_rgba(0,229,255,0.2)]">
            <span className="w-2 h-2 rounded-full bg-[#0066ff] animate-ping"></span>
            <span>TRANSMISIÓN EN VIVO: {station.frequency.toFixed(1)} MHz</span>
          </div>
          <span className="text-[13px] text-[#849396]">•</span>
          <span className="text-[13px] text-[#bac9cc]">{station.currentShow}</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Quick Volume Slider */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10">
            <button 
              onClick={() => onVolumeChange(volume > 0 ? 0 : 0.8)}
              className="text-[#849396] hover:text-[#0066ff] transition-colors"
            >
              {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#0066ff]" />}
            </button>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.05"
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#0066ff]"
            />
            <span className="text-[11px] font-mono text-[#849396] w-7 text-right">
              {Math.round(volume * 100)}%
            </span>
          </div>

          {isAdmin && onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#bac9cc] hover:text-[#0066ff] border border-white/10 transition-colors text-[13px]"
            >
              <Settings className="w-4 h-4" />
              <span>Ajustes</span>
            </button>
          )}
        </div>
      </header>
    </>
  );
};
