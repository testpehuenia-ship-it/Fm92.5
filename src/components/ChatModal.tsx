import React, { useState } from 'react';
import { Send, X, MessageSquare } from 'lucide-react';
import { StationConfig } from '../types';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendMessage: (text: string, author: string) => void;
  station: StationConfig;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  onSendMessage,
  station
}) => {
  const [authorName, setAuthorName] = useState('');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSendMessage(message, authorName || 'Oyente Anónimo');
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-md bg-[#0e0e13] border border-[#0066ff]/30 rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(0,102,255,0.2)] animate-slideUp"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b border-white/5 bg-gradient-to-r from-[#0066ff]/10 to-transparent">
          <h2 className="text-[18px] font-bold text-[#e4e1e9] flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#0066ff]" />
            Mensaje al Estudio
          </h2>
          <button 
            onClick={onClose}
            className="p-1 text-[#849396] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-[14px] text-[#bac9cc] leading-relaxed mb-2">
            Escribe tu pedido o mensaje para {station.radioName}. Llegará directamente a la cabina del locutor en vivo.
          </p>
          
          <div className="space-y-1">
            <label className="text-[12px] font-semibold text-[#849396] uppercase tracking-wider">Tu Nombre (Opcional)</label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Ej. Juan de Neuquén"
              className="w-full bg-[#1b1b20] border border-white/10 rounded-xl px-4 py-3 text-[14px] text-[#e4e1e9] outline-none focus:border-[#0066ff] transition-colors"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-[12px] font-semibold text-[#849396] uppercase tracking-wider">Tu Mensaje</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hola, me gustaría pedir la canción..."
              rows={3}
              className="w-full bg-[#1b1b20] border border-white/10 rounded-xl px-4 py-3 text-[14px] text-[#e4e1e9] outline-none focus:border-[#0066ff] transition-colors resize-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-[#0066ff] text-[#00363d] py-3.5 rounded-xl font-bold text-[15px] hover:bg-[#9cf0ff] shadow-[0_0_15px_rgba(0,229,255,0.5)] transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            Enviar Mensaje
          </button>
        </form>
      </div>
    </div>
  );
};
