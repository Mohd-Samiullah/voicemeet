// src/components/AboutView.jsx
import { 
  Globe, Shield, Zap, Sparkles, Award, Radio, Heart, Cpu, Code2
} from 'lucide-react';

export default function AboutView() {
  const highlights = [
    {
      icon: Radio,
      title: "Real-Time Mesh P2P",
      desc: "Built on WebRTC audio pipelines where voice streams directly between peers with sub-100ms latency."
    },
    {
      icon: Shield,
      title: "Zero Database Footprint",
      desc: "Ephemeral messaging & connection logs run strictly on-device with zero centralized audio interception."
    },
    {
      icon: Globe,
      title: "Open Regional Grid",
      desc: "Connecting users across diverse states, dialects, and languages without linguistic barriers."
    },
    {
      icon: Zap,
      title: "Lightweight & Scalable",
      desc: "Optimized Node.js socket signalling with low memory consumption and TURN relay fallback."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10 text-slate-100 animate-in fade-in duration-300">
      
      {/* 1. Hero Showcase Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/60 to-[#090d16] border border-indigo-500/30 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Behind the Technology</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Democratizing Human Connection through <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-indigo-500">
              Zero-Friction Voice Communication.
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            VoiceMeet is an open real-time platform designed to let individuals communicate effortlessly across dialects, cultures, and regions—without barriers, subscriptions, or invasive tracking.
          </p>
        </div>
      </div>

      {/* 2. Founder Profile Spotlight Card */}
      <div className="rounded-3xl bg-slate-900/70 border border-slate-800 p-6 sm:p-8 backdrop-blur-md shadow-xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Pure Marshmello Icon / Logo Column */}
          <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left space-y-4">
            <div className="relative">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-cyan-400 via-indigo-600 to-fuchsia-500 p-1 shadow-2xl shadow-indigo-500/30 flex items-center justify-center">
                <div className="w-full h-full rounded-[22px] bg-slate-950 flex items-center justify-center p-3 border border-white/10">
                  {/* Clean SVG Marshmello Helmet Vector */}
                  <svg 
                    viewBox="0 0 100 100" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="w-full h-full drop-shadow-[0_0_12px_rgba(255,255,255,0.7)]"
                  >
                    {/* Helmet Body */}
                    <rect x="18" y="14" width="64" height="72" rx="16" fill="white" />
                    
                    {/* Left Cross Eye (X) */}
                    <path d="M30 38L42 50M42 38L30 50" stroke="#090d16" strokeWidth="5.5" strokeLinecap="round" />
                    
                    {/* Right Cross Eye (X) */}
                    <path d="M58 38L70 50M70 38L58 50" stroke="#090d16" strokeWidth="5.5" strokeLinecap="round" />
                    
                    {/* Iconic Marshmello Smile */}
                    <path d="M32 64C38 72 62 72 68 64" stroke="#090d16" strokeWidth="5.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
              <span className="absolute -bottom-2 -right-2 bg-gradient-to-r from-emerald-500 to-cyan-500 border-2 border-slate-900 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-lg">
                Lead Architect
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-black text-white">Mohd Samiullah</h2>
              <p className="text-xs font-semibold text-indigo-400 mt-0.5">Founder & Lead Engineer, VoiceMeet</p>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-2 justify-center sm:justify-start">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Full-Stack & WebRTC Systems</span>
              </div>
            </div>
          </div>

          {/* Vision & Architectural Statement */}
          <div className="lg:col-span-8 space-y-5 border-t lg:border-t-0 lg:border-l border-slate-800 pt-6 lg:pt-0 lg:pl-8">
            <div className="space-y-2">
              <h3 className="text-sm uppercase tracking-wider font-bold text-slate-400">Founder&apos;s Vision</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                &ldquo;Voice is the most natural medium of empathy and understanding. I engineered VoiceMeet with a clear objective: build an ultra-fast, database-free P2P platform where anyone in India or across the globe can connect and speak freely without friction, unwanted exposure, or central surveillance.&rdquo;
              </p>
            </div>

            {/* Architecture Badges */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <span className="px-3 py-1.5 bg-slate-850 border border-slate-700/80 rounded-xl text-xs font-semibold text-slate-300 flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>Decentralized Signaling</span>
              </span>

              <span className="px-3 py-1.5 bg-slate-850 border border-slate-700/80 rounded-xl text-xs font-semibold text-slate-300 flex items-center gap-2">
                <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Zero-Retention Pipeline</span>
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Core Architectural Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {highlights.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div 
              key={idx}
              className="bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-5 space-y-2.5 shadow-lg transition"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Icon className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white">{item.title}</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          );
        })}
      </div>

      {/* 4. Footer Signature */}
      <div className="text-center pt-2 text-[11px] text-slate-500 flex items-center justify-center gap-1">
        <span>Engineered with passion by</span>
        <span className="font-bold text-slate-300">Mohd Samiullah</span>
        <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
      </div>

    </div>
  );
}