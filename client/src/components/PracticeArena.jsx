// src/components/PracticeArena.jsx
import { Phone, Globe2, Sparkles, ShieldCheck, Radio, Users, Languages, Zap } from 'lucide-react';

export default function PracticeArena({ user, onStartCall }) {
  const languageTags = [
    { label: 'Hindi', code: 'हिन्दी' },
    { label: 'English', code: 'EN' },
    { label: 'Bhojpuri', code: 'भोजपुरी' },
    { label: 'Bengali', code: 'বাংলা' },
    { label: 'Marathi', code: 'मराठी' },
    { label: 'Tamil', code: 'தமிழ்' },
    { label: 'Telugu', code: 'తెలుగు' },
    { label: 'Punjabi', code: 'ਪੰਜਾਬੀ' },
    { label: 'Gujarati', code: 'ગુજરાતી' },
    { label: 'Urdu', code: 'اردو' }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* 1. Main Global Voice Radar Stage */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/60 to-[#070b14] border border-indigo-500/25 p-7 sm:p-10 shadow-2xl backdrop-blur-xl">
        
        {/* Subtle Ambient Radial Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Left Column: Call-to-Action */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-full text-[11px] font-bold tracking-wide">
                <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                Live Pan-India Voice Grid
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-full text-[11px] font-medium">
                <Globe2 className="w-3 h-3 text-indigo-400" /> Open Languages
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
                Connect with the World. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-indigo-500">
                  Speak in Any Language.
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300/90 max-w-lg leading-relaxed pt-1">
                Zero judgment, real human connections across cities and states. Dial instantly to exchange thoughts, regional culture, and casual talks anonymously over high-fidelity P2P voice.
              </p>
            </div>

            {/* Language Availability Pill Grid */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                <Languages className="w-3.5 h-3.5 text-cyan-400" />
                <span>Frequently active voices in:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {languageTags.map((lang) => (
                  <span 
                    key={lang.label}
                    className="px-2.5 py-0.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-[10px] font-medium text-slate-300 shadow-sm"
                  >
                    {lang.label} <span className="text-indigo-400 ml-0.5">{lang.code}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <button
                type="button"
                onClick={onStartCall}
                className="px-7 py-4 bg-gradient-to-r from-cyan-500 via-indigo-600 to-indigo-700 hover:from-cyan-400 hover:to-indigo-600 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2.5 cursor-pointer transition active:scale-95 group"
              >
                <Phone className="w-4 h-4 fill-white group-hover:rotate-12 transition-transform duration-300" />
                <span>Connect Live Peer Now</span>
              </button>

              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[11px] text-slate-400 px-2 py-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Encrypted & Anonymous</span>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Live Matchmaking Radar */}
          <div className="lg:col-span-5 flex justify-center py-4">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border border-indigo-500/20 bg-slate-900/40 backdrop-blur-md flex items-center justify-center shadow-2xl">
              
              {/* Concentric Signal Rings */}
              <div className="absolute inset-4 rounded-full border border-indigo-500/15 animate-pulse" />
              <div className="absolute inset-12 rounded-full border border-cyan-500/20" />
              <div className="absolute inset-20 rounded-full border border-indigo-500/25 border-dashed animate-[spin_30s_linear_infinite]" />

              {/* Floating Active Peers with State/Region Pins */}
              <div className="absolute top-4 left-6 flex items-center gap-1.5 bg-slate-800/90 border border-slate-700/80 px-2.5 py-1 rounded-xl shadow-lg backdrop-blur-md">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aman" className="w-5 h-5 rounded-full" alt="" />
                <span className="text-[10px] font-bold text-slate-200">Delhi 🇮🇳</span>
              </div>

              <div className="absolute bottom-5 left-5 flex items-center gap-1.5 bg-slate-800/90 border border-slate-700/80 px-2.5 py-1 rounded-xl shadow-lg backdrop-blur-md">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Pooja" className="w-5 h-5 rounded-full" alt="" />
                <span className="text-[10px] font-bold text-slate-200">Mumbai 🇮🇳</span>
              </div>

              <div className="absolute top-10 right-4 flex items-center gap-1.5 bg-slate-800/90 border border-slate-700/80 px-2.5 py-1 rounded-xl shadow-lg backdrop-blur-md">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan" className="w-5 h-5 rounded-full" alt="" />
                <span className="text-[10px] font-bold text-slate-200">Bengaluru 🇮🇳</span>
              </div>

              {/* Center User Avatar Pulse */}
              <div className="relative">
                <div className="w-24 h-24 rounded-3xl bg-indigo-600/30 border-2 border-indigo-400 p-1.5 shadow-2xl flex items-center justify-center">
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatarSeed || user.name}`} 
                    className="w-full h-full rounded-2xl bg-slate-800" 
                    alt="You" 
                  />
                </div>
                <span className="absolute -bottom-2 -right-2 w-7 h-7 rounded-xl bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-white text-[10px] font-black shadow">
                  ✓
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* 2. Professional Telemetry & AI Discussion Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Discussion AI Facilitator */}
        <div className="md:col-span-2 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-lg font-bold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                AI Icebreaker Engine
              </span>
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Optional</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">Need a topic to kickstart the conversation?</h3>
            <p className="text-xs text-slate-300/80 leading-relaxed">
              Generate open discussion starters about cinema, college life, startups, regional cuisines, or current trends before jumping on call.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-medium text-slate-400 px-3 py-1.5 bg-slate-800/80 border border-slate-700/60 rounded-xl">
              🎬 Indian Cinema & OTT
            </span>
            <span className="text-[11px] font-medium text-slate-400 px-3 py-1.5 bg-slate-800/80 border border-slate-700/60 rounded-xl">
              🏏 Cricket & Sports
            </span>
            <span className="text-[11px] font-medium text-slate-400 px-3 py-1.5 bg-slate-800/80 border border-slate-700/60 rounded-xl">
              💼 Career & College Life
            </span>
          </div>
        </div>

        {/* User Total Contribution Stats */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Your Activity
            </span>
            <span className="text-[10px] text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded-full">
              Level {Math.max(1, Math.floor((user.totalCalls || 0) / 5) + 1)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-800/40 border border-slate-700/50 p-3 rounded-2xl">
              <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                <Users className="w-3 h-3" /> Peers Met
              </span>
              <p className="text-2xl font-black text-white mt-1">{user.totalCalls || 0}</p>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/50 p-3 rounded-2xl">
              <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                <Radio className="w-3 h-3 text-cyan-400" /> Talk Time
              </span>
              <p className="text-2xl font-black text-cyan-400 mt-1">{user.totalMinutes || 0}m</p>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 text-center">
            Zero limits. Free unlimited audio interactions anytime.
          </p>
        </div>

      </div>

    </div>
  );
}