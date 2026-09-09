// src/components/Sidebar.jsx
import { Activity, MessageCircle, BarChart2, Info, LogOut, X } from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  user, 
  friendsCount, 
  onLogout,
  isOpenMobile,
  setIsOpenMobile 
}) {
  const navItems = [
    { id: 'practice', label: 'Practice Arena', icon: Activity },
    { id: 'messages', label: 'Friends Directory', icon: MessageCircle, count: friendsCount },
    { id: 'profile', label: 'Profile & Stats', icon: BarChart2 },
    { id: 'about', label: 'About & Founder', icon: Info },
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    if (setIsOpenMobile) {
      setIsOpenMobile(false);
    }
  };

  const renderNavContent = () => (
    <div className="flex flex-col justify-between h-full p-5 bg-slate-900 border-r border-slate-800">
      <div className="space-y-6">
        {/* Header Branding & Mobile Close Button */}
        <div className="flex items-center justify-between px-2 py-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center text-xl shadow-lg">
              🎙️
            </div>
            <div>
              <span className="text-base font-black text-white block leading-none">VoiceMeet</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">Web Platform</span>
            </div>
          </div>

          {/* Close Icon for Mobile Drawer */}
          <button 
            type="button"
            onClick={() => setIsOpenMobile(false)}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real-time Status Card */}
        <div className="bg-slate-800/60 border border-slate-800 rounded-2xl p-3 flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <div>
            <p className="text-xs font-bold text-slate-200">10,480 Active</p>
            <p className="text-[10px] text-slate-400">Zero Wait Queue</p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <nav className="space-y-1.5 pt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition cursor-pointer ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.count > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px]">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Info & Logout Button */}
      <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5 truncate">
          <img 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatarSeed}`} 
            alt="" 
            className="w-8 h-8 rounded-full bg-slate-800 border border-indigo-500/40" 
          />
          <div className="truncate">
            <h4 className="text-xs font-bold text-slate-200 truncate">{user.name}</h4>
            <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
          </div>
        </div>
        <button 
          type="button"
          onClick={onLogout} 
          title="Logout" 
          className="p-1.5 text-slate-400 hover:text-rose-400 cursor-pointer transition hover:bg-slate-800 rounded-lg"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Normal Desktop Sidebar */}
      <aside className="w-64 hidden md:flex flex-col shrink-0 h-screen sticky top-0">
        {renderNavContent()}
      </aside>

      {/* 2. Mobile Slide Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Background Overlay */}
          <div 
            onClick={() => setIsOpenMobile(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300" 
          />

          {/* Drawer Element */}
          <div className="fixed inset-y-0 left-0 w-72 h-full z-[101] shadow-2xl animate-in slide-in-from-left duration-300">
            {renderNavContent()}
          </div>
        </div>
      )}
    </>
  );
}