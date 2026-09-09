// src/components/NotificationPanel.jsx
import { X, Bell, PhoneIncoming, UserPlus, MessageSquare, Trash2, Check } from 'lucide-react';

export default function NotificationPanel({ 
  isOpen, 
  onClose, 
  notifications, 
  onClearAll, 
  onNotificationClick,
  onAcceptFriendRequest,
  onRejectFriendRequest
}) {
  if (!isOpen) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'missed_call':
      case 'call':
        return <PhoneIncoming className="w-4 h-4 text-rose-400" />;
      case 'friend_request':
      case 'friend_accepted':
        return <UserPlus className="w-4 h-4 text-emerald-400" />;
      case 'message':
        return <MessageSquare className="w-4 h-4 text-indigo-400" />;
      default:
        return <Bell className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex justify-end">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity" 
      />

      {/* Slide-in Panel */}
      <div className="relative w-full max-w-sm bg-slate-900 border-l border-slate-800 h-full shadow-2xl z-10 flex flex-col animate-in slide-in-from-right duration-300 text-slate-100">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Notifications</h3>
              <p className="text-[10px] text-slate-400">Auto-expires after 30 days (0 DB)</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {notifications.length > 0 && (
              <button 
                type="button"
                onClick={onClearAll}
                title="Clear all"
                className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button 
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notification Stream */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {notifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-slate-800/60 flex items-center justify-center">
                <Bell className="w-5 h-5 text-slate-500" />
              </div>
              <p className="text-xs font-semibold text-slate-400">No new notifications</p>
              <p className="text-[11px] text-slate-600">Calls, friend requests, and alerts will appear here in real-time.</p>
            </div>
          ) : (
            notifications.map((n) => {
              const isFriendReq = n.type === 'friend_request';

              return (
                <div 
                  key={n.id}
                  className={`p-3 rounded-2xl border transition flex flex-col gap-2 ${
                    isFriendReq 
                      ? 'bg-indigo-950/20 border-indigo-500/30' 
                      : 'bg-slate-850/60 border-slate-800/80 hover:bg-slate-800/50'
                  }`}
                >
                  <div 
                    onClick={() => !isFriendReq && onNotificationClick && onNotificationClick(n)}
                    className="flex items-start gap-3 cursor-pointer"
                  >
                    {isFriendReq && n.requester?.avatarSeed ? (
                      <img 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${n.requester.avatarSeed || n.requester.name}`}
                        alt=""
                        className="w-8 h-8 rounded-xl bg-slate-800 border border-indigo-500/40 shrink-0 mt-0.5"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center shrink-0 mt-0.5">
                        {getIcon(n.type)}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white truncate">{n.title}</h4>
                        <span className="text-[9px] text-slate-500">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 break-words">{n.description}</p>
                    </div>
                  </div>

                  {/* Accept / Reject Actions inside the panel card */}
                  {isFriendReq && (
                    <div className="flex items-center gap-2 pt-1 border-t border-slate-800/60">
                      {n.status === 'accepted' ? (
                        <span className="text-[10px] font-bold text-emerald-400 px-2 py-1 bg-emerald-500/10 rounded-lg flex items-center gap-1">
                          <Check className="w-3 h-3" /> Friends Connected
                        </span>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => onAcceptFriendRequest(n)}
                            className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition shadow-md"
                          >
                            <Check className="w-3.5 h-3.5" /> Accept
                          </button>
                          <button
                            type="button"
                            onClick={() => onRejectFriendRequest(n)}
                            className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-rose-400 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition border border-slate-700"
                          >
                            <X className="w-3.5 h-3.5" /> Reject
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-800 text-[10px] text-slate-500 text-center bg-slate-900/60">
          Encrypted & retained locally for 30 days without database logging.
        </div>
      </div>
    </div>
  );
}