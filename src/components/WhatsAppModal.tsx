import React, { useState } from 'react';
import { MessageCircle, X, Send, Music2, Sparkles, Check } from 'lucide-react';
import { StationConfig, Track } from '../types';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  station: StationConfig;
  currentTrack: Track;
  onMessageSent: (msg: string) => void;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  station,
  currentTrack,
  onMessageSent,
}) => {
  const [customMsg, setCustomMsg] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const presets = [
    `🎵 Petición musical: ¿Pueden poner más temas de darksynth en ${station.radioName}?`,
    `⚡ ¡Me encanta la mezcla! ¡Un gran saludo de un oyente en vivo por ${station.frequency.toFixed(1)} FM!`,
    `🔥 La pista actual "${currentTrack.title}" de ${currentTrack.artist} ¡está increíble!`,
    `📻 Solicitando la lista de temas del programa ${station.currentShow} de hoy.`
  ];

  const handleSend = (text: string) => {
    onMessageSent(text);
    setSentSuccess(true);

    // Also open real WhatsApp link with encoded text
    const encoded = encodeURIComponent(text);
    const waUrl = `https://wa.me/?text=${encoded}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    setTimeout(() => {
      setSentSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-lg glass-panel-modal rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center shadow-[0_0_15px_rgba(37,211,102,0.4)]">
              <MessageCircle className="w-5 h-5 text-[#25D366] fill-[#25D366]" />
            </div>
            <div>
              <h2 className="text-[20px] font-bold text-[#e4e1e9]">Mensaje a la Cabina</h2>
              <p className="text-[13px] text-[#25D366] font-semibold">Línea Directa de WhatsApp • {station.radioName}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#849396] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="space-y-2">
          <label className="text-[12px] font-bold text-[#849396] uppercase tracking-wider">
            Plantillas Rápidas
          </label>
          <div className="space-y-2">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedPreset(preset);
                  setCustomMsg(preset);
                }}
                className={`w-full p-3 rounded-xl border text-left text-[13px] transition-all ${
                  selectedPreset === preset
                    ? 'bg-[#25D366]/15 border-[#25D366] text-[#e4e1e9] shadow-[0_0_10px_rgba(37,211,102,0.2)]'
                    : 'bg-[#1b1b20]/60 border-white/5 text-[#bac9cc] hover:bg-white/5 hover:border-white/20'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Message Field */}
        <div className="space-y-2">
          <label className="text-[12px] font-bold text-[#849396] uppercase tracking-wider">
            Mensaje Personalizado
          </label>
          <textarea
            rows={3}
            value={customMsg}
            onChange={(e) => setCustomMsg(e.target.value)}
            placeholder="Escribe tu saludo o petición para el DJ en vivo..."
            className="w-full bg-[#1b1b20] border border-white/10 rounded-xl p-3 text-[14px] text-[#e4e1e9] focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366]/50 outline-none resize-none transition-all"
          />
        </div>

        {/* Action Button */}
        <div>
          {sentSuccess ? (
            <div className="w-full py-3.5 rounded-xl bg-[#25D366]/20 border border-[#25D366] text-[#25D366] font-bold text-[14px] flex items-center justify-center gap-2">
              <Check className="w-5 h-5" />
              Abriendo WhatsApp y Transmitiendo...
            </div>
          ) : (
            <button
              onClick={() => handleSend(customMsg || presets[0])}
              className="w-full py-3.5 rounded-xl bg-[#25D366] text-black font-bold text-[15px] hover:bg-[#2fe06f] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,211,102,0.5)] active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              Enviar al WhatsApp del Estudio
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
