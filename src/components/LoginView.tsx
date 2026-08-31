import React, { useState } from 'react';
import { Lock, User, ShieldAlert, LogIn, ChevronLeft } from 'lucide-react';

interface LoginViewProps {
  onLogin: (password: string) => boolean;
  onBack: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, onBack }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onLogin(password)) {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 animate-fadeIn relative z-20">
      <div className="w-full max-w-[400px] glass-panel rounded-2xl p-8 flex flex-col items-center relative overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)] border border-white/10">
        
        <button 
          onClick={onBack}
          className="absolute top-4 left-4 z-20 text-[#849396] hover:text-[#0066ff] transition-colors"
          title="Volver a la Radio"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>

        <div className="z-10 w-full flex flex-col items-center pt-2">
          <div className="w-16 h-16 rounded-full bg-black/60 border-2 border-[#fface8] shadow-[0_0_25px_rgba(255,172,232,0.4)] flex items-center justify-center mb-6">
            <Lock className="w-8 h-8 text-[#fface8]" />
          </div>

          <h2 className="text-[26px] font-extrabold text-white mb-2 text-center tracking-tight">
            Acceso al Estudio
          </h2>
          <p className="text-[13px] text-[#bac9cc] text-center mb-8 leading-relaxed">
            Ingresa la clave maestra para administrar la transmisión de Fm Golfo Azul.
          </p>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-[#849396]" />
              </div>
              <input
                type="text"
                value="admin"
                disabled
                className="w-full bg-[#1b1b20]/50 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-[#849396] font-mono cursor-not-allowed"
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className={`h-5 w-5 transition-colors ${error ? 'text-red-500' : 'text-[#849396] group-focus-within:text-[#0066ff]'}`} />
              </div>
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                className={`w-full bg-[#1b1b20]/90 border rounded-xl py-3 pl-11 pr-4 text-[#e4e1e9] font-mono outline-none transition-all ${
                  error ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'border-[#0066ff]/30 focus:border-[#0066ff] focus:shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                }`}
              />
            </div>

            {error && (
              <div className="flex items-center justify-center gap-2 text-red-400 text-[12px] font-mono animate-bounce-short pt-1">
                <ShieldAlert className="w-4 h-4" />
                <span>Credenciales denegadas.</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-[#0066ff]/20 to-[#fface8]/20 border border-[#0066ff]/50 text-white font-bold tracking-wide hover:from-[#0066ff]/40 hover:to-[#fface8]/40 hover:border-[#0066ff] shadow-[0_0_20px_rgba(0,229,255,0.2)] transition-all flex items-center justify-center gap-2 group"
            >
              <LogIn className="w-5 h-5 text-[#0066ff] group-hover:scale-110 transition-transform" />
              <span>INGRESAR</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
