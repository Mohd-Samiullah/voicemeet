import { useState } from 'react';
import { 
  Globe2, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  X,
  Languages,
  ShieldCheck,
  HeartHandshake,
  User,
  Mail,
  Phone,
  Lock,
  AlertCircle
} from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://voicemeet-ymfi.onrender.com';

export default function AuthModal({ onLogin, onLoginSuccess, loading: propLoading }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Form input states
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isRegisterMode) {
      if (!username.trim() || !name.trim()) {
        return setError('Username aur Name bharna zaroori hai');
      }
      if (!email.toLowerCase().endsWith('@gmail.com')) {
        return setError('Sirf valid @gmail.com address allow hai');
      }
      if (!/^[6-9]\d{9}$/.test(mobileNumber.trim())) {
        return setError('10-digit ka valid mobile number enter karein');
      }
      if (password !== confirmPassword) {
        return setError('Password aur Confirm Password match nahi ho rahe');
      }
      if (password.length < 6) {
        return setError('Password kam se kam 6 akshar ka hona chahiye');
      }
    } else {
      if (!email.trim() || !password.trim()) {
        return setError('Username/Gmail aur Password bharna zaroori hai');
      }
    }

    setLoading(true);

    const endpoint = isRegisterMode 
      ? `${BACKEND_URL}/api/auth/register`
      : `${BACKEND_URL}/api/auth/login`;

    const payload = isRegisterMode 
      ? { username: username.trim(), name: name.trim(), email: email.trim(), mobileNumber: mobileNumber.trim(), password, confirmPassword }
      : { identifier: email.trim(), password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication error');

      if (onLoginSuccess) {
        onLoginSuccess(data);
      } else if (onLogin) {
        onLogin(data.email || email, data.name || name);
      }

      setIsOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isSubmitting = loading || propLoading;

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
              onClick={() => { setIsRegisterMode(false); setError(''); setIsOpen(true); }}
              className="text-xs font-bold text-slate-300 hover:text-white px-4 py-2 transition cursor-pointer"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsRegisterMode(true); setError(''); setIsOpen(true); }}
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
                onClick={() => { setIsRegisterMode(true); setError(''); setIsOpen(true); }}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-600/25 flex items-center gap-2 cursor-pointer transition"
              >
                <span>Dial Instantly Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => { setIsRegisterMode(false); setError(''); setIsOpen(true); }}
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

      {/* No-Scrollbar Compact Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 z-50 animate-in fade-in duration-150">
          <div className={`w-full ${isRegisterMode ? 'max-w-lg' : 'max-w-md'} bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden transition-all`}>
            
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-full p-1.5 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="text-center space-y-1 pb-1">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center text-xl mx-auto shadow-md shadow-indigo-600/30">
                🎙️
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {isRegisterMode ? 'Join VoiceMeet' : 'Enter VoiceMeet'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {isRegisterMode 
                  ? 'Create account to start voice calls & keep friends' 
                  : 'Enter your credentials to save connection requests.'}
              </p>
            </div>

            {error && (
              <div className="p-2.5 my-2 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form with 2-column layout for Registration */}
            <form onSubmit={handleSubmit} className="space-y-2.5 mt-2">
              {isRegisterMode ? (
                <>
                  {/* Row 1: Username & Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-0.5">Unique Username</label>
                      <div className="relative">
                        <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                        <input 
                          type="text" 
                          required
                          placeholder="sam_99"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full bg-slate-850 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white outline-none focus:border-indigo-500 transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-0.5">Full Name</label>
                      <div className="relative">
                        <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                        <input 
                          type="text" 
                          required
                          placeholder="Sam Alex"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-slate-850 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white outline-none focus:border-indigo-500 transition"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Gmail & Mobile */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-0.5">Gmail (@gmail.com)</label>
                      <div className="relative">
                        <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                        <input 
                          type="email" 
                          required
                          placeholder="you@gmail.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-slate-850 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white outline-none focus:border-indigo-500 transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-0.5">Phone (10 Digits)</label>
                      <div className="relative">
                        <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                        <input 
                          type="tel" 
                          required
                          maxLength={10}
                          placeholder="9876543210"
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                          className="w-full bg-slate-850 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white outline-none focus:border-indigo-500 transition"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 3: Password & Confirm Password */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-0.5">Password</label>
                      <div className="relative">
                        <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                        <input 
                          type="password" 
                          required
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-slate-850 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white outline-none focus:border-indigo-500 transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-0.5">Confirm Password</label>
                      <div className="relative">
                        <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                        <input 
                          type="password" 
                          required
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full bg-slate-850 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white outline-none focus:border-indigo-500 transition"
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* Login Single Column */
                <div className="space-y-2.5">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-0.5">Username or Gmail</label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                      <input 
                        type="text" 
                        required
                        placeholder="you@gmail.com or username"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-850 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white outline-none focus:border-indigo-500 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-0.5">Password</label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                      <input 
                        type="password" 
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-850 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white outline-none focus:border-indigo-500 transition"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition cursor-pointer disabled:opacity-50 mt-2 active:scale-98"
              >
                {isSubmitting 
                  ? 'Connecting...' 
                  : (isRegisterMode ? 'Complete Registration →' : 'Sign In →')}
              </button>
            </form>

            {/* Switch Mode & Footer */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => { setIsRegisterMode(!isRegisterMode); setError(''); }}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer transition"
              >
                {isRegisterMode ? 'Already have an account? Sign In' : "Don't have an account? Register"}
              </button>
            </div>

            <p className="text-[10px] text-center text-slate-500 pt-2 border-t border-slate-800/80">
              Safe community: Respect culture, exchange thoughts, and talk politely.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}