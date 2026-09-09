import { MessageCircle, Phone } from 'lucide-react';

export default function FriendsDirectory({ friends, onStartChat, onStartCall, onFindNewPeer }) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Friends Directory</h2>
          <p className="text-xs text-slate-400">Mutual peers you connected with. Live 1:1 chat is ephemeral and private.</p>
        </div>
        <button 
          onClick={onFindNewPeer} 
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold cursor-pointer"
        >
          + Match New Peer
        </button>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        {friends.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-2">
            <p className="text-sm font-bold text-slate-300">No Friends Connected Yet</p>
            <p className="text-xs text-slate-500">Match with peers in Practice Arena and tap "Add Friend" post-call.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {friends.map((friend) => (
              <div key={friend._id} className="p-4 flex items-center justify-between hover:bg-slate-800/40 transition">
                <div className="flex items-center gap-3">
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${friend.avatarSeed || friend.name}`} 
                    className="w-10 h-10 rounded-xl bg-slate-800" 
                    alt="" 
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">{friend.name}</h4>
                    <p className="text-[11px] text-slate-400">{friend.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => onStartChat(friend)}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> Chat
                  </button>

                  <button 
                    onClick={() => onStartCall(friend)} 
                    className="px-3 py-1.5 bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}