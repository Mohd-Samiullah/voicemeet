import { MessageCircle, Phone, UserPlus } from 'lucide-react';

export default function FriendsDirectory({ friends = [], onStartChat, onStartCall, onFindNewPeer }) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-5 px-1 sm:px-0">
      
      {/* Header - Fully Responsive Layout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div className="space-y-1 min-w-0">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Friends Directory</h2>
          <p className="text-xs text-slate-400 leading-relaxed max-w-md">
            Mutual peers you connected with. Live 1:1 chat is ephemeral and private.
          </p>
        </div>

        <button 
          type="button"
          onClick={onFindNewPeer} 
          className="self-start sm:self-auto shrink-0 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer active:scale-95"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Match New Peer</span>
        </button>
      </div>

      {/* Friends Card List */}
      <div className="bg-slate-900/60 border border-slate-800/90 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
        {friends.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-xl mx-auto text-slate-400">
              👥
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-200">No Friends Connected Yet</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Match with peers in Practice Arena and tap "Add Friend" post-call to grow your circle.
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {friends.map((friend) => (
              <div 
                key={friend._id} 
                className="p-3.5 sm:p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/30 transition"
              >
                {/* User Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${friend.avatarSeed || friend.name}`} 
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-slate-800 border border-slate-700/60 shrink-0" 
                    alt="" 
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs sm:text-sm font-bold text-white truncate">{friend.name}</h4>
                    <p className="text-[11px] text-slate-400 truncate max-w-[200px] sm:max-w-xs">{friend.email}</p>
                  </div>
                </div>

                {/* Actions (Chat & Call Buttons) */}
                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 w-full sm:w-auto">
                  <button 
                    type="button"
                    onClick={() => onStartChat(friend)}
                    className="flex-1 sm:flex-none justify-center px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-indigo-600/20 active:scale-95"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> 
                    <span>Chat</span>
                  </button>

                  <button 
                    type="button"
                    onClick={() => onStartCall(friend)} 
                    className="flex-1 sm:flex-none justify-center px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl border border-slate-700/80 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer active:scale-95"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" /> 
                    <span>Call</span>
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