/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { ActiveTab, StationConfig, Track, ChatMessage, BroadcastAlert } from './types';
import { INITIAL_STATION, INITIAL_TRACKS, INITIAL_CHAT, STATIONS_PRESETS } from './data/radioData';
import { Navigation } from './components/Navigation';
import { TopBar } from './components/TopBar';
import { PlayerView } from './components/PlayerView';
import { AdminView } from './components/AdminView';
import { MessagesView } from './components/MessagesView';
import { InstallModal } from './components/InstallModal';
import { WhatsAppModal } from './components/WhatsAppModal';
import { AlertToast } from './components/AlertToast';
import { LoginView } from './components/LoginView';
import { audioEngine } from './audio/audioEngine';
import { Sparkles, Check, Radio } from 'lucide-react';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<ActiveTab>('radio');

  // Auth State
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('etherfm_admin') === 'true';
  });
  const [showLogin, setShowLogin] = useState(() => {
    return window.location.hash === '#admin' && localStorage.getItem('etherfm_admin') !== 'true';
  });

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin' && !isAdmin) {
        setShowLogin(true);
      } else {
        setShowLogin(false);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAdmin]);

  const handleLogin = (password: string) => {
    if (password === 'etherfm') {
      setIsAdmin(true);
      setShowLogin(false);
      localStorage.setItem('etherfm_admin', 'true');
      setActiveTab('admin');
      window.location.hash = ''; 
      return true;
    }
    return false;
  };

  // Station & Playback State
  const [station, setStation] = useState<StationConfig>(() => {
    const saved = localStorage.getItem('etherfm_station');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_STATION;
  });
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);

  // Messages & Broadcast Alerts
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT);
  const [recentAlerts, setRecentAlerts] = useState<BroadcastAlert[]>([
    {
      id: 'alert-init',
      title: 'Transmisión de Noches de Neón en Vivo',
      message: 'Alex Mercer está en los controles transmitiendo synthwave en vivo por 104.5 MHz.',
      timestamp: '21:00',
      active: false
    }
  ]);
  const [activeToastAlert, setActiveToastAlert] = useState<BroadcastAlert | null>(null);

  // Modals & Banners
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [generalToast, setGeneralToast] = useState<string | null>(null);

  const currentTrack = INITIAL_TRACKS[currentTrackIndex] || INITIAL_TRACKS[0];

  // Sync Audio Volume
  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    audioEngine.setVolume(newVol);
  };

  // Play / Pause Toggle
  const handleTogglePlay = () => {
    if (isPlaying) {
      audioEngine.pause();
      setIsPlaying(false);
    } else {
      audioEngine.play(station.frequency, station.streamUrl);
      setIsPlaying(true);
    }
  };

  // Skip Tracks / Stations
  const handleNextTrack = () => {
    const nextIdx = (currentTrackIndex + 1) % INITIAL_TRACKS.length;
    setCurrentTrackIndex(nextIdx);
    audioEngine.playStaticBurst();
    if (isPlaying) {
      audioEngine.play(INITIAL_TRACKS[nextIdx].frequency);
    }
  };

  const handlePrevTrack = () => {
    const prevIdx = (currentTrackIndex - 1 + INITIAL_TRACKS.length) % INITIAL_TRACKS.length;
    setCurrentTrackIndex(prevIdx);
    audioEngine.playStaticBurst();
    if (isPlaying) {
      audioEngine.play(INITIAL_TRACKS[prevIdx].frequency);
    }
  };

  // Update Station Config from Admin Panel
  const handleUpdateStation = (updated: Partial<StationConfig>) => {
    setStation((prev) => {
      const next = { ...prev, ...updated };
      localStorage.setItem('etherfm_station', JSON.stringify(next));
      return next;
    });
    showToast('¡Identidad de la estación y flujo de audio actualizados!');
    
    if (updated.streamUrl !== undefined) {
      audioEngine.updateStreamUrl(updated.streamUrl);
    }
  };

  // Transmit Broadcast Alert from Admin Panel
  const handleTransmitAlert = (title: string, message: string) => {
    const newAlert: BroadcastAlert = {
      id: `alert-${Date.now()}`,
      title,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      active: true
    };

    setRecentAlerts((prev) => [newAlert, ...prev]);
    setActiveToastAlert(newAlert);
    audioEngine.playStaticBurst();

    // Auto dismiss toast after 6 seconds
    setTimeout(() => {
      setActiveToastAlert((curr) => (curr?.id === newAlert.id ? null : curr));
    }, 6000);
  };

  // Send Chat Message
  const handleSendMessage = (text: string, author: string) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      author,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      likes: 0
    };
    setMessages((prev) => [...prev, newMsg]);
    showToast('¡Mensaje enviado al chat del estudio!');
  };

  // Share station
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Escuchando ${station.radioName} en ETHER FM`,
          text: `¡Sintoniza ${station.currentShow} en ${station.frequency.toFixed(1)} MHz en vivo por ETHER FM!`,
          url: window.location.href,
        });
      } catch {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
        showToast('¡Enlace de transmisión copiado al portapapeles!');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('¡Enlace de transmisión copiado al portapapeles!');
    }
  };

  const showToast = (msg: string) => {
    setGeneralToast(msg);
    setTimeout(() => setGeneralToast(null), 3000);
  };

  const changeTabWithTransition = (tab: ActiveTab) => {
    if (tab === 'apps') {
      setIsInstallModalOpen(true);
      return;
    }

    if (!document.startViewTransition) {
      setActiveTab(tab);
      return;
    }

    document.startViewTransition(() => {
      flushSync(() => {
        setActiveTab(tab);
      });
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#e4e1e9] flex flex-col md:flex-row relative selection:bg-[#0066ff] selection:text-[#00363d]">
      {/* Left / Bottom Navigation - Only for Admin */}
      {isAdmin && (
        <Navigation
          activeTab={activeTab}
          setActiveTab={changeTabWithTransition}
          station={station}
          unreadMessagesCount={messages.length > 4 ? 2 : 0}
        />
      )}

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-h-screen pt-16 md:pt-0 relative z-10 ${isAdmin ? 'md:pl-[280px] pb-20 md:pb-0' : 'pb-0'}`}>
        
        {/* Top Bar Header */}
        <TopBar
          station={station}
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          onOpenSettings={isAdmin ? () => setActiveTab('admin') : undefined}
          volume={volume}
          onVolumeChange={handleVolumeChange}
          isAdmin={isAdmin}
        />

        {/* View Routing */}
        <main className="flex-grow flex flex-col">
          {showLogin ? (
            <LoginView 
              onLogin={handleLogin} 
              onBack={() => {
                setShowLogin(false);
                window.location.hash = '';
              }} 
            />
          ) : (
            <>
              {activeTab === 'radio' && (
                <PlayerView
                  station={station}
                  currentTrack={currentTrack}
                  isPlaying={isPlaying}
                  onTogglePlay={handleTogglePlay}
                  onPrevTrack={handlePrevTrack}
                  onNextTrack={handleNextTrack}
                  onOpenWhatsApp={() => setIsWhatsAppModalOpen(true)}
                  onOpenInstallModal={() => setIsInstallModalOpen(true)}
                  onShare={handleShare}
                />
              )}

              {activeTab === 'admin' && isAdmin && (
                <AdminView
                  station={station}
                  onUpdateStation={handleUpdateStation}
                  onTransmitAlert={handleTransmitAlert}
                  recentAlerts={recentAlerts}
                />
              )}

              {activeTab === 'messages' && isAdmin && (
                <MessagesView
                  station={station}
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  onOpenWhatsApp={() => setIsWhatsAppModalOpen(true)}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Modals & Overlays */}
      <InstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        onInstalledComplete={() => showToast('¡ETHER FM agregada con éxito a la pantalla de inicio!')}
      />

      <WhatsAppModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        station={station}
        currentTrack={currentTrack}
        onMessageSent={(msg) => {
          handleSendMessage(msg, 'Tú (vía WhatsApp)');
          showToast('¡Mensaje enviado a la cabina del estudio vía WhatsApp!');
        }}
      />

      {/* Live Broadcast Alert Notification Toast */}
      <AlertToast
        alert={activeToastAlert}
        onDismiss={() => setActiveToastAlert(null)}
      />

      {/* General Notification Toast */}
      {generalToast && (
        <div className="fixed bottom-24 md:bottom-8 right-6 z-50 px-5 py-3 rounded-xl bg-[#0066ff] text-[#00363d] font-bold text-[14px] shadow-[0_0_20px_rgba(0,229,255,0.6)] flex items-center gap-2 animate-bounce-short">
          <Sparkles className="w-4 h-4 text-[#00363d]" />
          <span>{generalToast}</span>
        </div>
      )}
    </div>
  );
}
