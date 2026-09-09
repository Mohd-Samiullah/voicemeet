// src/components/TopHeader.jsx
import { Search, Flame, Menu, Bell } from 'lucide-react';

export default function TopHeader({ 
  user, 
  searchQuery, 
  setSearchQuery, 
  onOpenProfile, 
  onOpenMobileSidebar,
  unreadCount = 0,
  onOpenNotifications
}) {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/40 backdrop-blur-xl px-4 md:px-6 flex items-center justify-between shrink-0 sticky top-0 z-30">
      
      {/* Mobile Hamburger */}
      <div className="flex items-center gap-3 md:hidden">
        <button 
          type="button"
          onClick={onOpenMobileSidebar}
          className="p-2.5 text-slate-200 hover:text-white bg-slate-800 border border-slate-700 rounded-xl cursor-pointer active:scale-95 transition flex items-center justify-center"
        >
          <Menu className="w-5 h-5 text-indigo-400" />
        </button>
        <span className="font-bold text-sm tracking-tight text-white">VoiceMeet</span>
      </div>

      {/* Desktop Search */}
      <div className="relative hidden sm:block w-72">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input 
          type="text"
          placeholder="Search peers by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-850 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500 transition"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 md:gap-4 ml-auto">
        <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-2.5 md:px-3 py-1 rounded-xl">
          <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
          {/* <span className="text-xs font-bold text-amber-300">{user.streak} Days</span> */}
        </div>

        {/* Real-time Notification Bell */}
        <button
          type="button"
          onClick={onOpenNotifications}
          className="relative p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:text-white hover:border-slate-600 transition cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-bounce shadow">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Profile preview */}
        <button 
          type="button"
          onClick={onOpenProfile} 
          className="flex items-center gap-2 border border-slate-800 bg-slate-850/60 px-2.5 md:px-3 py-1.5 rounded-xl cursor-pointer hover:border-slate-700 transition"
        >
          <img 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatarSeed}`} 
            alt="" 
            className="w-6 h-6 rounded-full" 
          />
          <span className="text-xs font-bold text-slate-200 hidden md:inline">{user.name}</span>
        </button>
      </div>
    </header>
  );
}