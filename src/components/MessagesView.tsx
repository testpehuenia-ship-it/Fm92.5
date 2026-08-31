import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Heart, 
  Radio, 
  MessageCircle, 
  Sparkles, 
  ShieldCheck,
  Music2
} from 'lucide-react';
import { ChatMessage, StationConfig } from '../types';

interface MessagesViewProps {
  station: StationConfig;
  messages: ChatMessage[];
  onSendMessage: (text: string, author: string) => void;
  onOpenWhatsApp: () => void;
}

export const MessagesView: React.FC<MessagesViewProps> = ({
  station,
  messages,
  onSendMessage,
  onOpenWhatsApp,
}) => {
  const [inputText, setInputText] = useState('');
  const [authorName, setAuthorName] = useState('CyberOyente');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText, authorName || 'Oyente Anónimo');
    setInputText('');
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[32px] sm:text-[40px] font-extrabold text-[#e4e1e9] neon-text-primary mb-1">
            Mensajes y Peticiones del Estudio
          </h1>
          <p className="text-[15px] text-[#bac9cc]">
            Chat en vivo con la cabina de {station.radioName} y la comunidad de oyentes.
          </p>
        </div>

        {/* WhatsApp Button */}
        <button
          onClick={onOpenWhatsApp}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-[#25D366] text-[#25D366] font-semibold text-[14px] shadow-[0_0_15px_rgba(37,211,102,0.5)] hover:bg-[#25D366]/20 transition-all active:scale-95 bg-black/40 self-start sm:self-auto shrink-0"
        >
          <MessageCircle className="w-4 h-4 fill-[#25D366]" />
          <span>Cabina WhatsApp Directa</span>
        </button>
      </div>

      {/* Messages Container */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col h-[520px] justify-between gap-4">
        {/* Message Feed */}
        <div className="flex-grow overflow-y-auto space-y-3.5 pr-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-4 rounded-xl transition-all ${
                msg.isHost
                  ? 'bg-[#0066ff]/10 border border-[#0066ff]/40 shadow-[0_0_15px_rgba(0,229,255,0.15)]'
                  : 'bg-[#1b1b20]/70 border border-white/5'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={`font-bold text-[14px] ${msg.isHost ? 'text-[#0066ff] flex items-center gap-1' : 'text-[#fface8]'}`}>
                    {msg.author}
                    {msg.isHost && <ShieldCheck className="w-4 h-4 text-[#0066ff]" />}
                  </span>
                  {msg.isHost && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#0066ff] text-[#00363d]">
                      LOCUTOR
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-mono text-[#849396]">{msg.timestamp}</span>
              </div>
              <p className="text-[14px] text-[#e4e1e9] leading-relaxed">{msg.text}</p>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-white/10">
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Tu Alias"
            className="sm:w-40 bg-[#131318] border border-white/10 rounded-xl px-3 py-2.5 text-[14px] text-[#e4e1e9] outline-none focus:border-[#0066ff]"
          />
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Escribe un mensaje o pide una canción a la cabina..."
            className="flex-grow bg-[#131318] border border-white/10 rounded-xl px-4 py-2.5 text-[14px] text-[#e4e1e9] outline-none focus:border-[#0066ff]"
          />
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#0066ff] text-[#00363d] font-bold text-[14px] hover:bg-[#9cf0ff] transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,229,255,0.4)] active:scale-95 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Enviar</span>
          </button>
        </form>
      </div>
    </div>
  );
};
