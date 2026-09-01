import React from 'react';
import { ActiveTab, StationConfig } from '../types';
import { 
  Radio, 
  Activity, 
  MessageSquare, 
  LayoutDashboard, 
  Download, 
  Settings, 
  BarChart2, 
  Bell, 
  User,
  RadioTower,
  LogOut
} from 'lucide-react';

interface NavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  station: StationConfig;
  unreadMessagesCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  station,
  unreadMessagesCount,
}) => {
  return (
    <>
      {/* Desktop Left Navigation Drawer */}
      <aside 
        id="desktop-sidebar"
        className="hidden md:flex flex-col p-6 gap-3 bg-[#1b1b20]/60 backdrop-blur-2xl text-[#fface8] fixed left-0 top-0 h-full w-[280px] border-r border-white/5 shadow-2xl z-40"
      >
        {/* Header Profile */}
        <div className="flex items-center gap-3 mb-6 px-1">
          <div className="w-12 h-12 rounded-full overflow-hidden border border-[#fface8]/40 relative shadow-[0_0_12px_rgba(255,172,232,0.3)]">
            <img 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiPcSiXTrMncF_BPcLLOjGhdivpsuahRoFrUqG4lZNJZGqEXMNqFhBwocU8TYwqb4UC6ZZUYdUI88AoxWdSHjzW2zLwQ_xLOPZQUtW3YCYnTQIO8O6KFt55hnzfFoxPrjeX9CTqVHMGOQsmL0Q-y7udRIJWxHM0zccJ0VVIVptUejkC7n7-f5Hyba0Ibtn5zRsQ4njOvyRzHndV9WdKdE4tcv7DioPRKPUJ9lGirLw3T2dzH_hruWifA" 
              alt="Synthetix Studio Avatar"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-[#e4e1e9] leading-snug">{station.radioName}</h2>
            <p className="text-[12px] font-semibold text-[#fface8] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0066ff] animate-pulse"></span>
              Al Aire: {station.currentShow}
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col gap-1.5 mt-2">
          <button
            id="nav-btn-radio"
            onClick={() => setActiveTab('radio')}
            className={`flex items-center gap-3.5 px-4 py-3 rounded-lg font-medium text-[14px] transition-all duration-200 text-left ${
              activeTab === 'radio'
                ? 'bg-[#0066ff]/15 text-[#0066ff] border-l-2 border-[#0066ff] shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                : 'text-[#bac9cc] hover:bg-white/5 hover:text-[#0066ff]'
            }`}
          >
            <Radio className="w-5 h-5" />
            <span>Transmisión en Vivo</span>
          </button>

          <button
            id="nav-btn-messages"
            onClick={() => setActiveTab('messages')}
            className={`flex items-center justify-between px-4 py-3 rounded-lg font-medium text-[14px] transition-all duration-200 text-left ${
              activeTab === 'messages'
                ? 'bg-[#0066ff]/15 text-[#0066ff] border-l-2 border-[#0066ff] shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                : 'text-[#bac9cc] hover:bg-white/5 hover:text-[#0066ff]'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <MessageSquare className="w-5 h-5" />
              <span>Mensajes del Estudio</span>
            </div>
            {unreadMessagesCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#ff24e4] text-white shadow-[0_0_8px_#ff24e4]">
                {unreadMessagesCount}
              </span>
            )}
          </button>

          <button
            id="nav-btn-admin"
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-3.5 px-4 py-3 rounded-lg font-medium text-[14px] transition-all duration-200 text-left ${
              activeTab === 'admin'
                ? 'bg-[#fface8]/15 text-[#fface8] border-l-2 border-[#fface8] shadow-[0_0_15px_rgba(255,172,232,0.25)]'
                : 'text-[#bac9cc] hover:bg-white/5 hover:text-[#fface8]'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Panel de Administración</span>
          </button>


        </div>

        {/* Secondary Nav / System Status */}
        <div className="mt-6 border-t border-white/5 pt-4 flex flex-col gap-1">
          <h3 className="px-4 py-1 text-[11px] font-bold text-[#849396] tracking-wider uppercase">
            Sistema de Transmisión
          </h3>
          <div className="flex items-center gap-3 px-4 py-2 text-[13px] text-[#bac9cc]">
            <RadioTower className="w-4 h-4 text-[#0066ff]" />
            <span>Dial: {station.frequency.toFixed(1)} MHz</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 text-[13px] text-[#bac9cc]">
            <Settings className="w-4 h-4 text-[#849396]" />
            <span>Master 320 kbps AAC</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 text-[13px] text-[#bac9cc]">
            <BarChart2 className="w-4 h-4 text-[#849396]" />
            <span>{station.listeners.toLocaleString()} Activos</span>
          </div>
        </div>

        {/* Bottom Station Tag and Logout */}
        <div className="mt-auto pt-4 border-t border-white/5 flex flex-col gap-3 px-2">
          <button
            onClick={() => {
              localStorage.removeItem('etherfm_admin');
              window.location.reload();
            }}
            className="flex items-center gap-2 text-[13px] text-[#ff24e4] hover:text-[#fface8] transition-colors px-2 py-1.5 rounded-md hover:bg-white/5 w-full text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
          
          <div className="flex items-center justify-between text-[12px] text-[#849396] px-2">
            <span>{station.radioName} v2.4</span>
            <span className="text-[#0066ff] font-semibold">EN LÍNEA</span>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav 
        id="mobile-bottom-nav"
        className="md:hidden flex justify-around items-center h-20 px-2 bg-[#131318]/90 backdrop-blur-xl fixed bottom-0 left-0 w-full z-50 shadow-[0_-10px_25px_rgba(0,0,0,0.8)] border-t border-white/5"
      >
        <button
          id="mobile-tab-radio"
          onClick={() => setActiveTab('radio')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all ${
            activeTab === 'radio'
              ? 'text-[#0066ff] drop-shadow-[0_0_8px_#0066ff] -translate-y-1'
              : 'text-[#849396] hover:text-[#fface8]'
          }`}
        >
          <Radio className="w-5 h-5" />
          <span className="text-[11px] font-semibold">Radio</span>
        </button>

        <button
          id="mobile-tab-messages"
          onClick={() => setActiveTab('messages')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 relative transition-all ${
            activeTab === 'messages'
              ? 'text-[#0066ff] drop-shadow-[0_0_8px_#0066ff] -translate-y-1'
              : 'text-[#849396] hover:text-[#fface8]'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[11px] font-semibold">Mensajes</span>
          {unreadMessagesCount > 0 && (
            <span className="absolute top-0 right-4 w-2 h-2 rounded-full bg-[#ff24e4] shadow-[0_0_6px_#ff24e4]"></span>
          )}
        </button>

        <button
          id="mobile-tab-admin"
          onClick={() => setActiveTab('admin')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all ${
            activeTab === 'admin'
              ? 'text-[#0066ff] drop-shadow-[0_0_8px_#0066ff] -translate-y-1'
              : 'text-[#849396] hover:text-[#fface8]'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[11px] font-semibold">Admin</span>
        </button>


      </nav>
    </>
  );
};
