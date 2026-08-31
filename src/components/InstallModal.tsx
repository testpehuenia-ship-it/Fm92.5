import React, { useState } from 'react';
import { 
  Radio, 
  Smartphone, 
  Bell, 
  CheckCircle, 
  X, 
  Loader2,
  Sparkles
} from 'lucide-react';
import { StationConfig } from '../types';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstalledComplete: () => void;
  station: StationConfig;
}

export const InstallModal: React.FC<InstallModalProps> = ({
  isOpen,
  onClose,
  onInstalledComplete,
  station,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  React.useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!isOpen) return null;

  const handleNextFromStep1 = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }
      setDeferredPrompt(null);
    }
    setStep(2);
  };

  const handleNextFromStep2 = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Notification permission granted.');
      }
    }
    setStep(3);
    setTimeout(() => {
      onInstalledComplete();
      onClose();
      setStep(1);
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden animate-fadeIn">
      {/* 100% Crisp background layer with transparent click catcher */}
      <div 
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />

      {/* Sharp, crisp background image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none"
        style={{
          backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBObySOoUqKEK-_NJ5sTY9v6gosaarP_kvi2mWoaxbWvfeo2LF1sgPsm4fddJJzo8zmKU6T0gZ5cxDmgEl9BjcrUYwAiUgTno_PzQcLlP3XtXZwukBpEZBZla9VrQXbVz6tHPw946rLocqfG9YMFuoNPgt4kQCbDxdx2sFEAlCXns8FHMJO4TOZgdDsGDsoaxH72HSYxDny7DIv-KYGhHJPVMxee8qGZwqtEIhvavyO4cJgJDTELOtNmp2uHxNgwPd4KAw')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-md">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6">
          {station.logoUrl ? (
            <img src={station.logoUrl} alt="Logo" className="w-16 h-16 rounded-full object-cover mb-2 shadow-[0_0_15px_rgba(0,102,255,0.6)] animate-pulse" />
          ) : (
            <Radio className="w-12 h-12 text-[#0066ff] drop-shadow-[0_0_10px_rgba(0,102,255,0.6)] mb-2 animate-pulse" />
          )}
          <h1 className="text-[34px] font-black tracking-wider text-[#0066ff] drop-shadow-[0_0_15px_rgba(0,102,255,0.7)] font-mono uppercase text-center leading-none">
            {station.radioName}
          </h1>
        </div>

        {/* Modal Window Card with clean glass */}
        <div className="w-full bg-black/40 border border-[#0066ff] shadow-[0_0_25px_rgba(0,229,255,0.35)] rounded-2xl p-8 relative flex flex-col items-center text-center">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#849396] hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* STEP 1: Instalar Aplicación */}
          {step === 1 && (
            <div className="flex flex-col items-center text-center w-full animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-[#0066ff]/15 flex items-center justify-center mb-6 border border-[#0066ff]/40 shadow-[0_0_20px_rgba(0,229,255,0.4)]">
                <Smartphone className="w-8 h-8 text-[#0066ff]" />
              </div>

              <h2 className="text-[24px] font-bold text-[#e4e1e9] mb-3">
                Instalar Aplicación
              </h2>
              
              <p className="text-[15px] leading-relaxed text-[#bac9cc] mb-8">
                Agrega ETHER FM a tu pantalla de inicio para acceder rápidamente a transmisiones sintéticas y una experiencia de estudio inmersiva a pantalla completa.
              </p>

              <div className="w-full space-y-3">
                <button
                  id="btn-install-now"
                  onClick={handleNextFromStep1}
                  className="w-full py-3.5 rounded-lg bg-[#0066ff]/15 border border-[#0066ff] text-[#0066ff] font-bold text-[14px] hover:bg-[#0066ff] hover:text-[#00363d] transition-all duration-300 shadow-[0_0_18px_rgba(0,229,255,0.35)] uppercase tracking-wider cursor-pointer"
                >
                  INSTALAR AHORA
                </button>
                
                <button
                  id="btn-skip-install"
                  onClick={handleNextFromStep1}
                  className="w-full py-2.5 text-[#849396] hover:text-[#e4e1e9] transition-colors duration-200 text-[13px] font-semibold uppercase tracking-wider cursor-pointer"
                >
                  OMITIR POR AHORA
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Mantente en Sintonía */}
          {step === 2 && (
            <div className="flex flex-col items-center text-center w-full animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-[#ff24e4]/15 flex items-center justify-center mb-6 border border-[#ff24e4]/40 shadow-[0_0_20px_rgba(255,36,228,0.4)]">
                <Bell className="w-8 h-8 text-[#fface8]" />
              </div>

              <h2 className="text-[24px] font-bold text-[#e4e1e9] mb-3">
                Mantente en Sintonía
              </h2>
              
              <p className="text-[15px] leading-relaxed text-[#bac9cc] mb-8">
                Activa las notificaciones push para recibir alertas inmediatas cuando tus frecuencias favoritas estén en vivo y comiencen transmisiones especiales.
              </p>

              <div className="w-full space-y-3">
                <button
                  id="btn-enable-notify"
                  onClick={handleNextFromStep2}
                  className="w-full py-3.5 rounded-lg bg-[#ff24e4]/15 border border-[#ff24e4] text-[#fface8] font-bold text-[14px] hover:bg-[#ff24e4] hover:text-white transition-all duration-300 shadow-[0_0_18px_rgba(255,36,228,0.35)] uppercase tracking-wider cursor-pointer"
                >
                  Habilitar Notificaciones
                </button>
                
                <button
                  id="btn-skip-notify"
                  onClick={handleNextFromStep2}
                  className="w-full py-2.5 text-[#849396] hover:text-[#e4e1e9] transition-colors duration-200 text-[13px] font-semibold uppercase tracking-wider cursor-pointer"
                >
                  No Por Ahora
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Sintonizando... */}
          {step === 3 && (
            <div className="flex flex-col items-center text-center w-full animate-fadeIn py-4">
              <div className="w-16 h-16 rounded-full bg-[#d9c8ff]/15 flex items-center justify-center mb-6 border border-[#d9c8ff]/40 shadow-[0_0_20px_rgba(217,200,255,0.3)]">
                <CheckCircle className="w-8 h-8 text-[#d9c8ff]" />
              </div>

              <h2 className="text-[24px] font-bold text-[#e4e1e9] mb-3 flex items-center gap-2">
                Sintonizando... <Sparkles className="w-5 h-5 text-[#0066ff]" />
              </h2>
              
              <p className="text-[15px] leading-relaxed text-[#bac9cc] mb-8">
                Tu entorno de estudio está listo. Conectando al éter sintético.
              </p>

              <div className="w-full flex justify-center py-2">
                <Loader2 className="w-10 h-10 text-[#0066ff] animate-spin drop-shadow-[0_0_8px_#0066ff]" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
