import { useState } from 'react';

export default function AuthModal({ onLogin, loading }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      onLogin(email, name);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] flex items-center justify-center p-4 text-slate-100">
      <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center text-2xl mx-auto shadow-lg">
            🎙️
          </div>
          <h2 className="text-2xl font-black text-white">Join VoiceMeet</h2>
          <p className="text-xs text-slate-400">Sign in with your Gmail to connect & preserve your friends list.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">Your Name</label>
            <input 
              type="text" 
              placeholder="e.g. Sam"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-850 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">Gmail / Email Address</label>
            <input 
              type="email" 
              required
              placeholder="you@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-850 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-indigo-500"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition cursor-pointer"
          >
            {loading ? 'Authenticating...' : 'Enter Web Platform →'}
          </button>
        </form>
      </div>
    </div>
  );
}