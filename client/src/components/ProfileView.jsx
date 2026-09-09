// src/components/ProfileView.jsx
import { 
  Crown, Flame, PhoneCall, Clock, Users, Award, MapPin, 
  Briefcase, Sparkles, ShieldCheck, Languages, Share2, Copy 
} from 'lucide-react';
import { useState } from 'react';

export default function ProfileView({ user, friendsCount }) {
  const [copied, setCopied] = useState(false);

  const level = Math.max(1, Math.floor((user.totalCalls || 0) / 5) + 1);
  const nextLevelXp = level * 100;
  const currentXp = (user.score || 1000) % 100;
  const progressPercent = Math.min(100, Math.round((currentXp / 100) * 100));

  const handleShare = () => {
    navigator.clipboard.writeText(`Connect with ${user.name} on VoiceMeet! Email: ${user.email}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const badges = [
    { title: 'Consistent Peer', icon: '🔥', desc: `${user.streak || 1} Days Active`, unlocked: (user.streak || 1) >= 3 },
    { title: 'Centurion Speaker', icon: '🎙️', desc: `${user.totalCalls || 0}/50 Calls`, unlocked: (user.totalCalls || 0) >= 10 },
    { title: 'Global Netizen', icon: '🌐', desc: `${friendsCount || 0} Network Peers`, unlocked: (friendsCount || 0) >= 5 },
    { title: 'High Fidelity', icon: '⚡', desc: 'HD WebRTC Audio', unlocked: true },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Banner & Profile Header */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-2xl">
        <div className="h-28 bg-gradient-to-r from-indigo-900 via-indigo-600 to-cyan-500 relative">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="px-3 py-1.5 bg-slate-900/60 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 backdrop-blur-md border border-white/10 transition cursor-pointer"
            >
              {/* {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />} */}
              {/* <span>{copied ? 'Copied' : 'Share Card'}</span> */}
            </button>
          </div>
        </div>

        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 gap-4">
            <div className="flex items-end gap-4">
              <div className="relative">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatarSeed || user.name}`} 
                  className="w-24 h-24 rounded-2xl border-4 border-slate-900 bg-slate-800 shadow-2xl object-cover" 
                  alt={user.name} 
                />
                <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900 ring-2 ring-emerald-500/20 animate-pulse" />
              </div>

              <div className="space-y-1 mb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black text-white">{user.name}</h2>
                  <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                    user.isElite 
                      ? 'bg-amber-500/15 border-amber-500/30 text-amber-300' 
                      : 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300'
                  }`}>
                    <Crown className="w-3 h-3" /> {user.isElite ? 'Elite Member' : 'Tier 1 Standard'}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/25 px-3 py-1.5 rounded-xl">
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                {/* <span className="text-xs font-bold text-amber-300">{user.streak || 1} Day Streak</span> */}
              </div>
              <div className="flex items-center gap-1 bg-indigo-500/10 border border-indigo-500/25 px-3 py-1.5 rounded-xl text-indigo-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Level {level}</span>
              </div>
            </div>
          </div>

          {/* XP Progression Bar */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-semibold">Tier Progression to Level {level + 1}</span>
              <span className="text-indigo-400 font-mono font-bold">{user.score || 1000} Total XP</span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800/90 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-lg">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-2">
            <PhoneCall className="w-4 h-4" />
          </div>
          <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Voice Calls</span>
          <p className="text-2xl font-black text-white mt-0.5">{user.totalCalls || 0}</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/90 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-lg">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-2">
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Talk Minutes</span>
          <p className="text-2xl font-black text-cyan-400 mt-0.5">{user.totalMinutes || 0}m</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/90 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-lg">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
            <Users className="w-4 h-4" />
          </div>
          <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Connected Peers</span>
          <p className="text-2xl font-black text-white mt-0.5">{friendsCount || 0}</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/90 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-lg">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2">
            <Award className="w-4 h-4" />
          </div>
          <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Call Rating</span>
          <p className="text-2xl font-black text-amber-300 mt-0.5">4.9 ★</p>
        </div>
      </div>

      {/* Meta Identity & Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* About / Bio */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-3">
          <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-indigo-400" /> Bio & Background
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-850/60 border border-slate-800 p-3.5 rounded-2xl">
            {user.about || "Open to discussions, exchanging perspectives, and casual networking with peers nationwide."}
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="text-[11px] font-semibold text-slate-300 bg-slate-800 px-3 py-1 rounded-xl border border-slate-700/60 flex items-center gap-1.5">
              <Briefcase className="w-3 h-3 text-cyan-400" /> {user.profession || "College Student"}
            </span>
            <span className="text-[11px] font-semibold text-slate-300 bg-slate-800 px-3 py-1 rounded-xl border border-slate-700/60 flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-rose-400" /> {user.location || "Delhi, India"}
            </span>
          </div>
        </div>

        {/* Language & Network Security */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1.5 mb-2">
              <Languages className="w-3.5 h-3.5 text-cyan-400" /> Preferred Dialects
            </h3>
            <div className="flex flex-wrap gap-2">
              {['Hindi', 'English', 'Urdu', 'Punjabi'].map((lang) => (
                <span key={lang} className="text-xs px-2.5 py-1 rounded-xl bg-indigo-950/40 text-indigo-300 border border-indigo-500/20 font-semibold">
                  {lang}
                </span>
              ))}
            </div>
          </div>

          <div className="p-3 bg-slate-800/40 border border-slate-700/50 rounded-2xl flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-white leading-tight">Peer-to-Peer Encryption</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Voice data does not transit central servers; Direct WebRTC signaling.</p>
            </div>
          </div>
        </div>

      </div>

      {/* Gamification Badges Carousel */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
        <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400">
          Achievement Badges
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {badges.map((b) => (
            <div 
              key={b.title}
              className={`p-3.5 rounded-2xl border flex flex-col items-center text-center space-y-1 transition ${
                b.unlocked 
                  ? 'bg-slate-850/80 border-slate-700' 
                  : 'bg-slate-900/40 border-slate-800/50 opacity-40'
              }`}
            >
              <span className="text-2xl select-none mb-1">{b.icon}</span>
              <h4 className="text-xs font-bold text-white">{b.title}</h4>
              <p className="text-[10px] text-slate-400">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}