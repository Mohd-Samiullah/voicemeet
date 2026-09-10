import { useState } from 'react';
import { 
  Globe2, 
  Sparkles, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  X,
  Languages,
  ShieldCheck,
  HeartHandshake
} from 'lucide-react';

export default function AuthModal({ onLogin, loading }) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      onLogin(email, name);
    }
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white relative overflow-hidden font-sans">
      
      {/* Background Atmosphere Lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[400px] bg-gradient-to-tr from-indigo-600/20 via-cyan-500/15 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <header className="w-full border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-40 bg-[#070a12]/80">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center text-xl shadow-lg shadow-indigo-500/20">
              🎙️
            </div>
            <span className="text-lg font-black tracking-tight text-white">VoiceMeet</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="text-xs font-bold text-slate-300 hover:text-white px-4 py-2 transition cursor-pointer"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="text-xs font-bold px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-lg shadow-indigo-600/20 transition cursor-pointer"
            >
              Start Dialing →
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-14 lg:py-20 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Real Human Connections • No Judgments</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15]">
              Connect with the World. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-teal-300">
                Speak in Any Language.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              Zero judgment, authentic human conversations across cities, states, and borders. Dial instantly to exchange fresh thoughts, regional cultures, and casual stories anonymously over crystal-clear, high-fidelity voice.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-600/25 flex items-center gap-2 cursor-pointer transition"
              >
                <span>Dial Instantly Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 font-bold text-xs sm:text-sm border border-slate-800 transition cursor-pointer"
              >
                Login / Register
              </button>
            </div>

            <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
              <span className="text-emerald-400 font-bold">● 100% Anonymous</span>
              <span>• No Phone Required • Zero Friction Setup</span>
            </div>
          </div>

          {/* Right Highlights Showcase */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900/70 border border-slate-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
              <div className="space-y-4">
                
                <div className="flex items-start gap-4 p-3 rounded-2xl bg-slate-850/50 border border-slate-800/60">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Zero Judgment Zone</h4>
                    <p className="text-xs text-slate-400">Talk openly without fear of being judged. Practice dialects, improve fluency, or just unwind.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-2xl bg-slate-850/50 border border-slate-800/60">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Globe2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Cross-Border Cultural Exchange</h4>
                    <p className="text-xs text-slate-400">Discover local lifestyles, state traditions, and ideas directly from diverse native speakers.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-2xl bg-slate-850/50 border border-slate-800/60">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                    <Languages className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Express in Any Language</h4>
                    <p className="text-xs text-slate-400">English, Hindi, or regional languages—find speaking partners who share your vibe.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-2xl bg-slate-850/50 border border-slate-800/60">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Purely Anonymous & Private</h4>
                    <p className="text-xs text-slate-400">Direct high-fidelity voice transmission. No personal phone numbers or profile exposure.</p>
                  </div>
                </div>

              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> High-Fidelity Audio
                </span>
                <span className="font-mono text-slate-400">Instant Dialing</span>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Login & Register Popup Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-7 sm:p-8 shadow-2xl space-y-6 relative">
            
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-full p-2 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-2 pt-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center text-2xl mx-auto shadow-lg shadow-indigo-600/30">
                🎙️
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">Enter VoiceMeet</h2>
              <p className="text-xs text-slate-400">Enter your name & email to save connection requests and friends.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Your Name / Alias</label>
                <input 
                  type="text" 
                  placeholder="e.g. Sam, Aman, Alex"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-850 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="you@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-850 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-indigo-500 transition"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/25 transition cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Dialing into Network...' : 'Start Connecting →'}
              </button>
            </form>

            <p className="text-[11px] text-center text-slate-400">
              Safe community: Respect culture, exchange thoughts, and talk politely.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}