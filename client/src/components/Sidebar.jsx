import { 
  PhoneCall, 
  Flame, 
  Users, 
  User, 
  Info, 
  LogOut, 
  X,
  Radio
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  user, 
  friendsCount = 0, 
  onLogout,
  isOpenMobile,
  setIsOpenMobile 
}) {
  const navItems = [
    { id: 'practice', label: 'Practice Arena', icon: Flame },
    { id: 'call', label: 'Voice Dial', icon: PhoneCall, badge: 'LIVE' },
    { id: 'messages', label: 'Friends Directory', icon: Users, count: friendsCount },
    { id: 'profile', label: 'Profile & Stats', icon: User },
    { id: 'about', label: 'About & Founder', icon: Info },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={() => setIsOpenMobile(false)} 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Main Sidebar */}
      <aside className={`
        fixed lg:static top-0 bottom-0 left-0 z-50
        w-64 bg-[#090e1a] border-r border-slate-800/80 p-5 flex flex-col justify-between
        transform transition-transform duration-300 ease-in-out
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="space-y-6">
          
          {/* Brand Logo Header */}
          <div className="flex items-center justify-between pb-2">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-xl shadow-lg shadow-indigo-600/30">
                🎙️
              </div>
              <div>
                <h1 className="text-base font-black tracking-tight text-white leading-tight">VoiceMeet</h1>
                <span className="text-[10px] font-bold tracking-wider text-indigo-400 uppercase">Web Platform</span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button 
              type="button"
              onClick={() => setIsOpenMobile(false)}
              className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Speakers Counter Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex items-center gap-3 shadow-inner">
            <div className="relative flex items-center justify-center w-3 h-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-white tracking-wide">10,480 Active</p>
              <p className="text-[10px] text-slate-400">Zero Wait Queue</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    if (setIsOpenMobile) setIsOpenMobile(false);
                  }}
                  className={`
                    w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer group
                    ${isActive 
                      ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg shadow-indigo-600/25' 
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-850/60'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="flex items-center gap-1 text-[9px] font-black px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
                      <Radio className="w-2.5 h-2.5 text-rose-400" /> {item.badge}
                    </span>
                  )}

                  {item.count > 0 && !item.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'}`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Footer Profile & Logout */}
        {user && (
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <div 
              onClick={() => {
                setActiveTab('profile');
                if (setIsOpenMobile) setIsOpenMobile(false);
              }}
              className="flex items-center gap-2.5 min-w-0 cursor-pointer group flex-1"
            >
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatarSeed || user.name}`} 
                className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700/60 shrink-0 group-hover:border-indigo-400 transition" 
                alt="" 
              />
              <div className="min-w-0 pr-1">
                <h4 className="text-xs font-bold text-white truncate group-hover:text-indigo-300 transition">{user.name}</h4>
                <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onLogout}
              title="Log out"
              className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 p-2 rounded-xl transition cursor-pointer shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </aside>
    </>
  );
}