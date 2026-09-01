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
import { ChatModal } from './components/ChatModal';
import { AlertToast } from './components/AlertToast';
import { LoginView } from './components/LoginView';
import { audioEngine } from './audio/audioEngine';
import { Sparkles, Check, Radio } from 'lucide-react';
import { collection, addDoc, onSnapshot, query, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { db } from './lib/firebase';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<ActiveTab>('radio');

  // Auth State
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('etherfm_admin') === 'true';
  });
  const [showLogin, setShowLogin] = useState(() => {
    const wantsAdmin = window.location.hash === '#admin' || window.location.pathname === '/admin' || window.location.pathname === '/admin/';
    return wantsAdmin && localStorage.getItem('etherfm_admin') !== 'true';
  });

  useEffect(() => {
    const handleNavigation = () => {
      const wantsAdmin = window.location.hash === '#admin' || window.location.pathname === '/admin' || window.location.pathname === '/admin/';
      if (wantsAdmin && !isAdmin) {
        setShowLogin(true);
      } else {
        setShowLogin(false);
      }
      if (wantsAdmin && isAdmin) {
        setActiveTab('admin');
      }
    };
    window.addEventListener('hashchange', handleNavigation);
    window.addEventListener('popstate', handleNavigation);
    return () => {
      window.removeEventListener('hashchange', handleNavigation);
      window.removeEventListener('popstate', handleNavigation);
    };
  }, [isAdmin]);

  const handleLogin = (password: string) => {
    if (password === 'etherfm') {
      setIsAdmin(true);
      setShowLogin(false);
      localStorage.setItem('etherfm_admin', 'true');
      setActiveTab('admin');
      if (window.location.pathname.includes('/admin')) {
        window.history.replaceState(null, '', '/');
      } else {
        window.location.hash = ''; 
      }
      return true;
    }
    return false;
  };

  // Station & Playback State
  const [station, setStation] = useState<StationConfig>(() => {
    const saved = localStorage.getItem('etherfm_station');
    if (saved) {
      try {
        return { ...INITIAL_STATION, ...JSON.parse(saved) };
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
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [generalToast, setGeneralToast] = useState<string | null>(null);

  // Install Modal Auto-show
  useEffect(() => {
    // Check if running as PWA (standalone)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         ('standalone' in navigator && (navigator as any).standalone);
    
    // Check if user already installed it
    const hasInstalledFlag = localStorage.getItem('etherfm_app_installed');
    const hasSeenPromptSession = sessionStorage.getItem('etherfm_install_prompted');

    // Listen for successful native install
    const handleAppInstalled = () => {
      localStorage.setItem('etherfm_app_installed', 'true');
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    // Only show if not in standalone app, not installed before, and not on login screen
    if (!isStandalone && !hasInstalledFlag && !hasSeenPromptSession && !showLogin) {
      const timer = setTimeout(() => {
        setIsInstallModalOpen(true);
        sessionStorage.setItem('etherfm_install_prompted', 'true');
      }, 2000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('appinstalled', handleAppInstalled);
      };
    }

    return () => window.removeEventListener('appinstalled', handleAppInstalled);
  }, [showLogin]);

  // Auto-play attempt on mount
  useEffect(() => {
    if (!showLogin) {
      audioEngine.play(station.frequency, station.streamUrl)
        .then(() => setIsPlaying(true))
        .catch((e) => {
          console.warn('Autoplay blocked by browser policy:', e);
          setIsPlaying(false);
        });
    }
  }, [showLogin, station.frequency, station.streamUrl]);

  // Firebase Firestore Listener for Push Alerts
  useEffect(() => {
    const q = query(collection(db, 'alerts'), orderBy('createdAt', 'desc'), limit(1));
    let initialLoad = true;
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (initialLoad) {
        initialLoad = false;
        return;
      }
      
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const data = change.doc.data();
          const newAlert: BroadcastAlert = {
            id: change.doc.id,
            title: data.title,
            message: data.message,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            active: true
          };
          
          setRecentAlerts((prev) => [newAlert, ...prev]);
          setActiveToastAlert(newAlert);
          audioEngine.playStaticBurst();
          
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(newAlert.title, {
              body: newAlert.message,
              icon: '/logo.png',
            });
          }

          setTimeout(() => {
            setActiveToastAlert((curr) => (curr?.id === newAlert.id ? null : curr));
          }, 6000);
        }
      });
    }, (error) => {
      console.warn("Firestore Listener Error. Base de datos tal vez no activada aún:", error);
    });
    
    return () => unsubscribe();
  }, []);

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
  const handleTransmitAlert = async (title: string, message: string) => {
    try {
      await addDoc(collection(db, 'alerts'), {
        title,
        message,
        createdAt: serverTimestamp()
      });
      showToast('¡Alerta enviada a la red (Firebase)!');
    } catch (e) {
      console.error(e);
      showToast('Error al enviar. Verifica que creaste la base de datos Firestore en modo prueba.');
    }
  };

  // Listen to Firestore for Messages
  useEffect(() => {
    if (!station.useInternalChat) return;
    
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: ChatMessage[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        msgs.push({
          id: doc.id,
          author: data.author,
          text: data.text,
          timestamp: data.timestamp || '',
          likes: data.likes || 0,
          isHost: data.isHost || false,
          status: data.status || 'unread'
        });
      });
      setMessages(msgs.reverse());
    }, (error) => {
      console.warn("Firestore Messages Listener Error:", error);
    });
    return () => unsubscribe();
  }, [station.useInternalChat]);

  // Send Chat Message
  const handleSendMessage = async (text: string, author: string, isHost = false) => {
    try {
      await addDoc(collection(db, 'messages'), {
        author,
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        likes: 0,
        isHost,
        status: 'unread',
        createdAt: serverTimestamp()
      });
      showToast('¡Mensaje enviado exitosamente!');
    } catch(e) {
      console.error(e);
      showToast('Error al enviar. Verifica tu conexión.');
    }
  };

  const handleUpdateMessageStatus = async (id: string, status: 'unread' | 'read' | 'completed') => {
    try {
      const { doc, updateDoc } = await import('firebase/firestore');
      await updateDoc(doc(db, 'messages', id), { status });
    } catch (e) {
      console.error(e);
      showToast('Error al actualizar mensaje.');
    }
  };

  const handleOpenChatAction = () => {
    if (station.whatsappNumber) {
      setIsWhatsAppModalOpen(true);
    } else if (station.useInternalChat) {
      setIsChatModalOpen(true);
    }
  };

  // Share station
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Escuchando ${station.radioName} en vivo`,
          text: `¡Sintoniza ${station.currentShow} en ${station.frequency.toFixed(1)} MHz en vivo!`,
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
                  onOpenWhatsApp={handleOpenChatAction}
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
                  onUpdateMessageStatus={handleUpdateMessageStatus}
                  onOpenWhatsApp={station.whatsappNumber ? () => setIsWhatsAppModalOpen(true) : undefined}
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
        onInstalledComplete={async () => {
          localStorage.setItem('etherfm_app_installed', 'true');
          showToast(`¡${station.radioName} agregada con éxito a la pantalla de inicio!`);
          try {
            const { doc, setDoc, increment } = await import('firebase/firestore');
            await setDoc(doc(db, 'stats', 'downloads'), { count: increment(1) }, { merge: true });
          } catch(e) { console.error(e); }
        }}
        station={station}
      />

      <WhatsAppModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        station={station}
        currentTrack={currentTrack}
        onMessageSent={(msg) => {
          handleSendMessage(msg, 'Tú (vía WhatsApp)', false);
        }}
      />

      <ChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        onSendMessage={(text, author) => handleSendMessage(text, author, false)}
        station={station}
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
