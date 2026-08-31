import React from 'react';
import { Megaphone, Bell, X, Sparkles } from 'lucide-react';
import { BroadcastAlert } from '../types';

interface AlertToastProps {
  alert: BroadcastAlert | null;
  onDismiss: () => void;
}

export const AlertToast: React.FC<AlertToastProps> = ({ alert, onDismiss }) => {
  if (!alert) return null;

  return (
    <div 
      id="live-broadcast-toast"
      className="fixed top-20 right-4 md:right-8 z-50 max-w-md w-full animate-bounce-short"
    >
      <div className="glass-panel-neon rounded-2xl p-4 sm:p-5 flex items-start justify-between gap-3 shadow-[0_0_30px_rgba(0,229,255,0.4)] border border-[#0066ff] bg-black/85">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-full bg-[#ff24e4]/20 border border-[#ff24e4]/60 flex items-center justify-center shrink-0 shadow-[0_0_12px_#ff24e4]">
            <Megaphone className="w-5 h-5 text-[#fface8]" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-[#ff24e4] text-white">
                ALERTA DE TRANSMISIÓN
              </span>
              <span className="text-[11px] font-mono text-[#849396]">{alert.timestamp}</span>
            </div>
            <h4 className="text-[16px] font-bold text-[#e4e1e9] leading-snug">{alert.title}</h4>
            <p className="text-[13px] text-[#bac9cc] leading-relaxed">{alert.message}</p>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="p-1 rounded-full text-[#849396] hover:text-white hover:bg-white/10 transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
