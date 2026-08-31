import React, { useState } from 'react';
import { 
  Radio, 
  Sliders, 
  Activity, 
  Wifi, 
  RadioTower, 
  Copy, 
  Check, 
  Send, 
  Megaphone, 
  Save, 
  Flame, 
  CheckCircle2, 
  Sparkles,
  RefreshCw,
  X,
  Bookmark,
  Upload
} from 'lucide-react';
import { StationConfig, BroadcastAlert, PushTemplate } from '../types';

interface AdminViewProps {
  station: StationConfig;
  onUpdateStation: (updated: Partial<StationConfig>) => void;
  onTransmitAlert: (title: string, message: string) => void;
  recentAlerts: BroadcastAlert[];
}

export const AdminView: React.FC<AdminViewProps> = ({
  station,
  onUpdateStation,
  onTransmitAlert,
  recentAlerts,
}) => {
  // Form State for Station Identity
  const [radioName, setRadioName] = useState(station.radioName);
  const [frequency, setFrequency] = useState(station.frequency.toString());
  const [streamUrl, setStreamUrl] = useState(station.streamUrl);
  const [logoUrl, setLogoUrl] = useState(station.logoUrl || '');
  const [bitrate, setBitrate] = useState(station.bitrate.toString());
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Form State for Broadcast Alert
  const [alertTitle, setAlertTitle] = useState('En Vivo Ahora: Sesión Especial');
  const [alertBody, setAlertBody] = useState('Sintoniza una hora exclusiva de dark synthwave...');
  const [transmittedSuccess, setTransmittedSuccess] = useState(false);

  const [templates, setTemplates] = useState<PushTemplate[]>(() => {
    const saved = localStorage.getItem('etherfm_alert_templates');
    return saved ? JSON.parse(saved) : [];
  });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const MAX_SIZE = 512;
        let width = img.width;
        let height = img.height;

        if (width > height && width > MAX_SIZE) {
          height *= MAX_SIZE / width;
          width = MAX_SIZE;
        } else if (height > MAX_SIZE) {
          width *= MAX_SIZE / height;
          height = MAX_SIZE;
        }

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);
        
        const compressedBase64 = canvas.toDataURL('image/webp', 0.8);
        setLogoUrl(compressedBase64);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveTemplate = () => {
    if (!alertTitle.trim() || !alertBody.trim()) return;
    if (templates.length >= 6) {
      alert("Límite de plantillas alcanzado (máx 6). Elimina alguna para agregar más.");
      return;
    }
    const newTemplate: PushTemplate = {
      id: `tpl-${Date.now()}`,
      title: alertTitle,
      message: alertBody
    };
    const newTemplates = [...templates, newTemplate];
    setTemplates(newTemplates);
    localStorage.setItem('etherfm_alert_templates', JSON.stringify(newTemplates));
  };

  const handleLoadTemplate = (t: PushTemplate) => {
    setAlertTitle(t.title);
    setAlertBody(t.message);
  };

  const handleDeleteTemplate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newTemplates = templates.filter(t => t.id !== id);
    setTemplates(newTemplates);
    localStorage.setItem('etherfm_alert_templates', JSON.stringify(newTemplates));
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const numFreq = parseFloat(frequency) || 104.5;
    const numBitrate = parseInt(bitrate, 10) || 320;
    
    onUpdateStation({
      radioName,
      frequency: numFreq,
      streamUrl,
      bitrate: numBitrate,
      logoUrl,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(streamUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  const handleTransmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertTitle.trim() || !alertBody.trim()) return;

    onTransmitAlert(alertTitle, alertBody);
    setTransmittedSuccess(true);
    setTimeout(() => setTransmittedSuccess(false), 3500);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-fadeIn">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#0066ff]/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-[#ff24e4]/10 blur-[120px]"></div>
      </div>

      {/* Page Header */}
      <div className="relative z-10">
        <h1 className="text-[36px] sm:text-[48px] font-extrabold text-[#e4e1e9] neon-text-primary tracking-tight leading-none mb-2">
          Control de Administración
        </h1>
        <p className="text-[16px] sm:text-[18px] text-[#bac9cc]">
          Gestiona la configuración global de transmisión y la interacción con la audiencia.
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
        {/* Top 3 Stat Cards */}
        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Current Listeners */}
          <div 
            id="stat-listeners"
            className="glass-panel rounded-xl p-6 flex items-center gap-4 transition-all duration-300 hover:border-[#0066ff]/40 hover:shadow-[0_0_20px_rgba(0,229,255,0.15)]"
          >
            <div className="w-12 h-12 rounded-full bg-[#0066ff]/20 flex items-center justify-center border border-[#0066ff]/40 shrink-0">
              <Activity className="w-6 h-6 text-[#0066ff]" />
            </div>
            <div>
              <p className="text-[12px] font-semibold text-[#849396] uppercase tracking-wider">
                Oyentes Actuales
              </p>
              <p className="text-[30px] font-bold text-[#e4e1e9] neon-text-primary leading-tight font-mono">
                {station.listeners.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Stream Quality */}
          <div 
            id="stat-quality"
            className="glass-panel rounded-xl p-6 flex items-center gap-4 transition-all duration-300 hover:border-[#ff24e4]/40 hover:shadow-[0_0_20px_rgba(255,36,228,0.15)]"
          >
            <div className="w-12 h-12 rounded-full bg-[#ff24e4]/20 flex items-center justify-center border border-[#ff24e4]/40 shrink-0">
              <Wifi className="w-6 h-6 text-[#fface8]" />
            </div>
            <div>
              <p className="text-[12px] font-semibold text-[#849396] uppercase tracking-wider">
                Calidad de Transmisión
              </p>
              <p className="text-[30px] font-bold text-[#e4e1e9] leading-tight font-mono">
                {station.bitrate} <span className="text-[16px] font-normal text-[#bac9cc]">kbps</span>
              </p>
            </div>
          </div>

          {/* Uptime */}
          <div 
            id="stat-uptime"
            className="glass-panel rounded-xl p-6 flex items-center gap-4 transition-all duration-300 hover:border-[#d9c8ff]/40 hover:shadow-[0_0_20px_rgba(217,200,255,0.15)]"
          >
            <div className="w-12 h-12 rounded-full bg-[#6c00f7]/20 flex items-center justify-center border border-[#d9c8ff]/40 shrink-0">
              <RadioTower className="w-6 h-6 text-[#d9c8ff]" />
            </div>
            <div>
              <p className="text-[12px] font-semibold text-[#849396] uppercase tracking-wider">
                Tiempo en Línea
              </p>
              <p className="text-[30px] font-bold text-[#e4e1e9] leading-tight font-mono">
                {station.uptime}
              </p>
            </div>
          </div>
        </div>

        {/* Station Identity Configuration (7 Columns) */}
        <div className="md:col-span-7 glass-panel rounded-xl p-6 flex flex-col justify-between gap-6 relative">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sliders className="w-5 h-5 text-[#0066ff]" />
              <h2 className="text-[22px] font-bold text-[#e4e1e9]">Identidad de la Estación</h2>
            </div>

            <form id="form-station-config" onSubmit={handleSaveConfig} className="space-y-5">
              {/* Radio Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[14px] font-medium text-[#bac9cc]" htmlFor="radioName">
                  Nombre de la Radio
                </label>
                <input
                  id="radioName"
                  type="text"
                  value={radioName}
                  onChange={(e) => setRadioName(e.target.value)}
                  className="bg-transparent border-0 border-b border-[#3b494c] text-[#e4e1e9] py-2 px-1 text-[16px] focus:ring-0 focus:border-[#0066ff] transition-colors outline-none"
                  placeholder="ej. Synthetix Studio"
                />
              </div>

              {/* Frequency Dial */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[14px] font-medium text-[#bac9cc]" htmlFor="frequency">
                  Frecuencia (Dial)
                </label>
                <div className="flex items-center relative">
                  <input
                    id="frequency"
                    type="number"
                    step="0.1"
                    min="87.5"
                    max="108.0"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full bg-transparent border-0 border-b border-[#3b494c] text-[#e4e1e9] py-2 px-1 pr-12 text-[18px] font-mono focus:ring-0 focus:border-[#0066ff] transition-colors outline-none"
                  />
                  <span className="absolute right-2 text-[#849396] font-semibold text-[14px]">
                    FM
                  </span>
                </div>
              </div>

              {/* Master Streaming URL */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[14px] font-medium text-[#bac9cc]" htmlFor="streamUrl">
                  URL Principal de Transmisión (MP3/AAC)
                </label>
                <div className="flex items-center bg-[#0e0e13]/70 border border-[#3b494c] rounded-lg p-1.5">
                  <span className="px-2 text-[#849396]">🔗</span>
                  <input
                    id="streamUrl"
                    type="url"
                    value={streamUrl}
                    onChange={(e) => setStreamUrl(e.target.value)}
                    className="w-full bg-transparent border-0 text-[#e4e1e9] text-[13px] font-mono focus:ring-0 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleCopyUrl}
                    className="p-2 hover:text-[#0066ff] text-[#849396] transition-colors"
                    title="Copiar URL"
                  >
                    {copiedUrl ? <Check className="w-4 h-4 text-[#25D366]" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Logo Upload */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[14px] font-medium text-[#bac9cc]">
                  Logo de la Emisora (Recomendado 512x512 px)
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-[#0066ff]/40 bg-[#0066ff]/10 flex-shrink-0 flex items-center justify-center">
                    {logoUrl ? (
                      <img src={logoUrl} alt="Logo Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Radio className="w-6 h-6 text-[#0066ff]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <label 
                      htmlFor="logo-upload"
                      className="flex items-center justify-center gap-2 w-full bg-[#0e0e13]/70 border border-[#3b494c] rounded-lg p-2.5 text-[#849396] hover:text-[#e4e1e9] hover:border-[#0066ff] transition-all cursor-pointer font-medium text-[13px]"
                    >
                      <Upload className="w-4 h-4" />
                      Subir Imagen
                    </label>
                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Bitrate Selector */}
              <div className="flex flex-col gap-1.5 pt-1">
                <label className="text-[14px] font-medium text-[#bac9cc]">
                  Códec de Audio y Tasa de Bits
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['128', '256', '320'].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setBitrate(rate)}
                      className={`py-2 text-[13px] font-mono rounded-lg border transition-all ${
                        bitrate === rate 
                          ? 'bg-[#0066ff]/20 border-[#0066ff] text-[#0066ff] font-bold shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                          : 'bg-white/5 border-white/10 text-[#bac9cc] hover:bg-white/10'
                      }`}
                    >
                      {rate} kbps
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-white/5">
            {savedSuccess ? (
              <span className="text-[#25D366] text-[13px] font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> ¡Configuración guardada exitosamente!
              </span>
            ) : (
              <span className="text-[#849396] text-[12px]">Sincronización directa con transmisión en vivo</span>
            )}

            <button
              type="submit"
              form="form-station-config"
              id="btn-save-config"
              className="bg-[#0066ff] text-[#00363d] px-6 py-2.5 rounded-lg font-bold text-[14px] hover:bg-[#9cf0ff] shadow-[0_0_15px_rgba(0,229,255,0.5)] transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Guardar Configuración
            </button>
          </div>
        </div>

        {/* Broadcast Alert Composer (5 Columns) */}
        <div className="md:col-span-5 glass-panel rounded-xl p-6 flex flex-col justify-between gap-4 relative overflow-hidden">
          {/* Subtle background icon */}
          <div className="absolute right-[-15%] top-[-10%] opacity-5 pointer-events-none text-white">
            <Megaphone className="w-48 h-48" />
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-[#fface8]" />
              <h2 className="text-[22px] font-bold text-[#e4e1e9]">Alerta de Transmisión</h2>
            </div>
            
            <div className="flex justify-between items-start gap-4">
              <p className="text-[14px] text-[#bac9cc]">
                Envía una notificación push a todos los oyentes activos de la app móvil.
              </p>
              <button
                type="button"
                onClick={handleSaveTemplate}
                className="shrink-0 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#0066ff] bg-[#0066ff]/15 px-3 py-1.5 rounded-lg hover:bg-[#0066ff] hover:text-[#00363d] transition-colors border border-[#0066ff]"
              >
                <Bookmark className="w-3.5 h-3.5" />
                Guardar Plantilla
              </button>
            </div>

            {/* Templates List */}
            {templates.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {templates.map(t => (
                  <div 
                    key={t.id}
                    onClick={() => handleLoadTemplate(t)}
                    className="flex items-center gap-1 bg-[#1b1b20] border border-white/10 rounded-full pl-3 pr-1 py-1 text-[12px] text-[#bac9cc] cursor-pointer hover:border-[#fface8] hover:text-[#fface8] transition-colors group"
                  >
                    <span className="truncate max-w-[120px] font-medium">{t.title}</span>
                    <button 
                      onClick={(e) => handleDeleteTemplate(t.id, e)}
                      className="p-1 text-[#849396] hover:text-[#ff24e4] rounded-full hover:bg-white/10"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <form id="form-broadcast-alert" onSubmit={handleTransmit} className="space-y-4 pt-1">
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-semibold text-[#849396] uppercase tracking-wider">
                  Título
                </label>
                <input
                  type="text"
                  value={alertTitle}
                  onChange={(e) => setAlertTitle(e.target.value)}
                  placeholder="En Vivo Ahora: Sesión Especial"
                  className="bg-[#1b1b20]/80 border border-white/10 rounded-lg p-3 text-[#e4e1e9] focus:border-[#fface8] focus:ring-1 focus:ring-[#fface8]/50 outline-none transition-all text-[14px]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-semibold text-[#849396] uppercase tracking-wider">
                  Cuerpo del Mensaje
                </label>
                <textarea
                  rows={3}
                  value={alertBody}
                  onChange={(e) => setAlertBody(e.target.value)}
                  placeholder="Sintoniza una hora exclusiva de dark synthwave..."
                  className="bg-[#1b1b20]/80 border border-white/10 rounded-lg p-3 text-[#e4e1e9] focus:border-[#fface8] focus:ring-1 focus:ring-[#fface8]/50 outline-none transition-all resize-none text-[14px]"
                />
              </div>
            </form>
          </div>

          <div className="relative z-10 pt-2">
            {transmittedSuccess && (
              <div className="mb-3 px-3 py-2 rounded-lg bg-[#ff24e4]/20 border border-[#ff24e4]/50 text-[#fface8] text-[12px] font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#fface8]" />
                ¡Alerta emitida a 12.458 oyentes conectados!
              </div>
            )}

            <button
              type="submit"
              form="form-broadcast-alert"
              id="btn-transmit-alert"
              className="w-full border border-[#fface8] text-[#fface8] hover:bg-[#fface8]/15 px-4 py-3 rounded-lg font-bold text-[14px] flex justify-center items-center gap-2 transition-all shadow-[0_0_12px_rgba(255,172,232,0.3)] active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Transmitir Alerta</span>
            </button>
          </div>
        </div>
      </div>

      {/* Broadcast Alerts History Section */}
      {recentAlerts.length > 0 && (
        <div className="glass-panel rounded-xl p-6 relative z-10">
          <h3 className="text-[16px] font-bold text-[#e4e1e9] mb-4 flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#ff24e4]" />
            Alertas Emitidas Recientemente
          </h3>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div 
                key={alert.id} 
                className="p-4 rounded-lg bg-[#1b1b20]/60 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <h4 className="text-[14px] font-bold text-[#0066ff]">{alert.title}</h4>
                  <p className="text-[13px] text-[#bac9cc]">{alert.message}</p>
                </div>
                <span className="text-[11px] font-mono text-[#849396] shrink-0">
                  {alert.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
