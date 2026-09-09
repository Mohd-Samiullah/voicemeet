import { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, Phone, MoreVertical, Trash2, UserMinus } from 'lucide-react';
import { saveStoredChats } from '../utils/storage';

export default function FriendChat({ 
  currentUser, 
  targetFriend, 
  onBack, 
  onStartCall, 
  socket, 
  chatSessions, 
  onSaveMessage,
  onUnfriend 
}) {
  const [textInput, setTextInput] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [isUnfriending, setIsUnfriending] = useState(false);
  const messagesEndRef = useRef(null);

  const chatKey = [String(currentUser._id), String(targetFriend._id)].sort().join('_');
  const messages = chatSessions[chatKey] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    const cleanText = textInput.trim();
    if (!cleanText || !socket || !currentUser?._id || !targetFriend?._id) return;

    const tempId = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const newMsg = {
      id: tempId,
      senderId: String(currentUser._id),
      friendUserId: String(targetFriend._id),
      senderName: currentUser.name,
      text: cleanText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestampMs: Date.now()
    };

    onSaveMessage(chatKey, newMsg);

    socket.emit('send-message', {
      myUserId: currentUser._id,
      friendUserId: targetFriend._id,
      senderName: currentUser.name,
      text: cleanText
    });

    setTextInput('');
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear this conversation?')) {
      const updatedSessions = { ...chatSessions, [chatKey]: [] };
      saveStoredChats(currentUser._id, updatedSessions);
      window.location.reload();
    }
    setShowMenu(false);
  };

  const handleUnfriendClick = async () => {
    if (window.confirm(`Are you sure you want to unfriend ${targetFriend.name}?`)) {
      setIsUnfriending(true);
      await onUnfriend(targetFriend._id);
      setIsUnfriending(false);
      setShowMenu(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-3 md:mt-0 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl md:rounded-3xl shadow-2xl flex flex-col h-[calc(100dvh-125px)] md:h-[650px] overflow-hidden relative">
      
      {/* Header */}
      <div className="px-3 py-2.5 md:p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60 shrink-0">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <button 
            type="button"
            onClick={onBack} 
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white cursor-pointer transition shrink-0"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <img 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${targetFriend.avatarSeed || targetFriend.name}`} 
            alt="" 
            className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-slate-800 border border-indigo-500/30 shrink-0" 
          />
          <div className="truncate">
            <h3 className="text-xs md:text-sm font-bold text-white flex items-center gap-1.5 truncate">
              <span className="truncate">{targetFriend.name}</span>
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            </h3>
            <span className="text-[9px] md:text-[10px] text-slate-400 block truncate leading-tight">{targetFriend.email}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 md:gap-2 relative shrink-0">
          <button 
            type="button"
            onClick={() => onStartCall(targetFriend)}
            className="px-2.5 py-1 md:px-3.5 md:py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg md:rounded-xl text-[11px] md:text-xs font-bold flex items-center gap-1 transition cursor-pointer shadow-lg active:scale-95"
          >
            <Phone className="w-3 h-3 md:w-3.5 md:h-3.5" /> 
            <span>Call</span>
          </button>

          <button 
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute top-9 md:top-12 right-0 bg-slate-850 border border-slate-700 rounded-xl md:rounded-2xl shadow-2xl p-1.5 w-44 z-30 animate-in fade-in zoom-in-95">
              <button
                type="button"
                onClick={handleClearChat}
                className="w-full flex items-center gap-2 px-2.5 py-2 text-[11px] md:text-xs font-semibold text-slate-300 hover:bg-slate-800 rounded-lg transition cursor-pointer text-left"
              >
                <Trash2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Clear Conversation</span>
              </button>

              <button
                type="button"
                disabled={isUnfriending}
                onClick={handleUnfriendClick}
                className="w-full flex items-center gap-2 px-2.5 py-2 text-[11px] md:text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-lg transition cursor-pointer text-left mt-0.5"
              >
                <UserMinus className="w-3.5 h-3.5 text-rose-400" />
                <span>{isUnfriending ? 'Unfriending...' : 'Unfriend'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-3 md:p-4 overflow-y-auto space-y-2.5 md:space-y-3">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 space-y-1.5 md:space-y-2">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-slate-800/80 flex items-center justify-center text-lg md:text-xl">
              💬
            </div>
            <p className="text-[11px] md:text-xs font-medium">No messages yet in this session.</p>
            <p className="text-[10px] md:text-[11px] text-slate-600">Say Hi to {targetFriend.name}!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = String(msg.senderId) === String(currentUser._id);
            return (
              <div 
                key={msg.id} 
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div 
                  className={`max-w-[82%] sm:max-w-xs md:max-w-md px-3 py-2 md:px-4 md:py-2.5 rounded-xl md:rounded-2xl text-[11px] md:text-xs leading-relaxed shadow-md ${
                    isMe 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
                  }`}
                >
                  <p className="break-words">{msg.text}</p>
                </div>
                <span className="text-[8px] md:text-[9px] text-slate-500 mt-0.5 px-1">
                  {msg.timestamp}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="p-2 md:p-3 bg-slate-900/90 border-t border-slate-800 flex gap-1.5 md:gap-2 shrink-0">
        <input 
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder={`Message ${targetFriend.name}...`}
          className="flex-1 bg-slate-850 border border-slate-700/80 rounded-xl md:rounded-2xl px-3 py-2 md:px-4 md:py-3 text-[11px] md:text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500 transition"
        />
        <button 
          type="submit" 
          className="px-3.5 py-2 md:px-5 md:py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 text-white rounded-xl md:rounded-2xl font-bold text-xs flex items-center justify-center cursor-pointer transition active:scale-95 shrink-0"
        >
          <Send className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </button>
      </form>
    </div>
  );
}