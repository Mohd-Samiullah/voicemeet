import { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { ArrowLeft, PhoneOff } from 'lucide-react';

import AuthModal from './components/AuthModal';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import PracticeArena from './components/PracticeArena';
import FriendsDirectory from './components/FriendsDirectory';
import ProfileView from './components/ProfileView';
import FriendChat from './components/FriendChat';
import VoiceChat from './components/VoiceChat';
import NotificationPanel from './components/NotificationPanel';
import AboutView from './components/AboutView'; // <-- AboutView import ho gaya

import { getStoredData, appendStoredData, getStoredChats, saveStoredChats } from './utils/storage';

const API_BASE = 'http://localhost:5000/api';
const SOCKET_SERVER = 'http://localhost:5000';

export default function App() {
  const [activeTab, setActiveTab] = useState('practice');
  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChatFriend, setActiveChatFriend] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  const [chatSessions, setChatSessions] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [outgoingCallTarget, setOutgoingCallTarget] = useState(null);
  const [incomingCallData, setIncomingCallData] = useState(null);
  const [incomingTimer, setIncomingTimer] = useState(60);
  const [activeDirectCallSession, setActiveDirectCallSession] = useState(null);

  const socketRef = useRef(null);
  const callTimerRef = useRef(null);

  useEffect(() => {
    if (user?._id) {
      const storedNotifs = getStoredData(`vm_notifs_${user._id}`);
      setNotifications(storedNotifs);

      const storedChats = getStoredChats(user._id);
      setChatSessions(storedChats || {});
    }
  }, [user?._id]);

  const pushNotification = useCallback((notif) => {
    if (!user?._id) return;
    const item = {
      id: `${Date.now()}_${Math.random().toString(36).substring(7)}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestampMs: Date.now(),
      ...notif
    };
    const updated = appendStoredData(`vm_notifs_${user._id}`, item);
    setNotifications(updated);
    setUnreadCount((c) => c + 1);
  }, [user?._id]);

  const updateChatSessions = useCallback((chatKey, newMsg) => {
    setChatSessions((prev) => {
      const currentList = prev[chatKey] || [];
      if (currentList.some((m) => m.id === newMsg.id)) return prev;
      const updated = {
        ...prev,
        [chatKey]: [...currentList, newMsg]
      };
      if (user?._id) {
        saveStoredChats(user._id, updated);
      }
      return updated;
    });
  }, [user?._id]);

  useEffect(() => {
    if (!user?._id) return;

    const socket = io(SOCKET_SERVER, { 
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('register-user', { userId: user._id });
    });

    socket.on('incoming-direct-call', ({ caller, roomId }) => {
      setIncomingCallData({ caller, roomId });
      setIncomingTimer(60);

      if (callTimerRef.current) clearInterval(callTimerRef.current);
      callTimerRef.current = setInterval(() => {
        setIncomingTimer((prev) => {
          if (prev <= 1) {
            clearInterval(callTimerRef.current);
            setIncomingCallData(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    });

    socket.on('direct-call-accepted', ({ partner, roomId, initiator }) => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
      setOutgoingCallTarget(null);
      setIncomingCallData(null);

      setActiveDirectCallSession({ partner, roomId, initiator });
      setActiveTab('call');
    });

    socket.on('direct-call-rejected', () => {
      alert('The call was declined.');
      setOutgoingCallTarget(null);
    });

    socket.on('direct-call-cancelled', () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
      setIncomingCallData(null);
    });

    socket.on('incoming-friend-request', ({ requester }) => {
      pushNotification({
        type: 'friend_request',
        title: 'New Friend Request',
        description: `${requester.name} wants to connect with you.`,
        requester
      });
    });

    socket.on('friend-request-accepted', ({ friend }) => {
      pushNotification({
        type: 'friend_accepted',
        title: 'Friend Request Accepted',
        description: `${friend?.name || 'Peer'} accepted your connection request.`
      });
      reloadUserData();
    });

    socket.on('new-message', (msg) => {
      const chatKey = [String(msg.senderId), String(msg.friendUserId)].sort().join('_');
      updateChatSessions(chatKey, msg);
    });

    return () => {
      socket.disconnect();
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    };
  }, [user?._id, pushNotification, updateChatSessions]);

  useEffect(() => {
    const savedEmail = localStorage.getItem('voicemeet_user_email');
    if (savedEmail) {
      handleLogin(savedEmail);
    }
  }, []);

  const handleLogin = async (emailToLogin, name) => {
    setAuthLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login-or-register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToLogin, name })
      });
      const data = await res.json();
      if (data?._id) {
        setUser(data);
        setFriends(data.friends || []);
        localStorage.setItem('voicemeet_user_email', data.email);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('voicemeet_user_email');
    setUser(null);
    setFriends([]);
    setActiveChatFriend(null);
    setIsMobileSidebarOpen(false);
  };

  const reloadUserData = async () => {
    if (!user?._id) return;
    try {
      const res = await fetch(`${API_BASE}/user/${user._id}`);
      const data = await res.json();
      if (data?._id) {
        setUser(data);
        setFriends(data.friends || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUnfriend = async (targetFriendId) => {
    if (!user?._id || !targetFriendId) return;
    try {
      const res = await fetch(`${API_BASE}/user/remove-friend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentUserId: user._id,
          targetUserId: targetFriendId
        })
      });
      const data = await res.json();
      if (data.success) {
        setFriends((prev) => prev.filter((f) => String(f._id) !== String(targetFriendId)));
        if (activeChatFriend && String(activeChatFriend._id) === String(targetFriendId)) {
          setActiveChatFriend(null);
        }
        await reloadUserData();
      }
    } catch (err) {
      console.error('Error unfriending:', err);
    }
  };

  const startDirectCall = (targetFriend) => {
    if (!targetFriend?._id || !user?._id || !socketRef.current) return;
    setOutgoingCallTarget(targetFriend);

    socketRef.current.emit('initiate-direct-call', {
      caller: user,
      receiverId: targetFriend._id
    });
  };

  const cancelOutgoingCall = () => {
    if (outgoingCallTarget && socketRef.current) {
      socketRef.current.emit('cancel-direct-call', { receiverId: outgoingCallTarget._id });
      setOutgoingCallTarget(null);
    }
  };

  const acceptIncomingCall = () => {
    if (!incomingCallData || !socketRef.current) return;
    if (callTimerRef.current) clearInterval(callTimerRef.current);

    socketRef.current.emit('accept-direct-call', {
      callerId: incomingCallData.caller._id,
      caller: incomingCallData.caller,
      receiver: user,
      roomId: incomingCallData.roomId
    });
  };

  const rejectIncomingCall = () => {
    if (!incomingCallData || !socketRef.current) return;
    if (callTimerRef.current) clearInterval(callTimerRef.current);

    socketRef.current.emit('reject-direct-call', {
      callerId: incomingCallData.caller._id
    });
    setIncomingCallData(null);
  };

  const handleAcceptFriendRequestFromPanel = async (notifItem) => {
    if (!notifItem?.requester?._id || !user) return;
    try {
      const res = await fetch(`${API_BASE}/user/accept-friend-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentUserId: user._id,
          requesterId: notifItem.requester._id
        })
      });
      const data = await res.json();
      if (data.success) {
        if (socketRef.current) {
          socketRef.current.emit('accept-friend-request-socket', {
            requesterId: notifItem.requester._id,
            receiver: user
          });
        }

        const updated = notifications.map((n) => 
          n.id === notifItem.id ? { ...n, status: 'accepted' } : n
        );
        setNotifications(updated);
        localStorage.setItem(`vm_notifs_${user._id}`, JSON.stringify(updated));

        reloadUserData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRejectFriendRequestFromPanel = (notifItem) => {
    if (!notifItem?.requester?._id) return;
    if (socketRef.current) {
      socketRef.current.emit('reject-friend-request-socket', {
        requesterId: notifItem.requester._id
      });
    }

    const updated = notifications.filter((n) => n.id !== notifItem.id);
    setNotifications(updated);
    localStorage.setItem(`vm_notifs_${user._id}`, JSON.stringify(updated));
  };

  if (!user) {
    return <AuthModal onLogin={handleLogin} loading={authLoading} />;
  }

  const filteredFriends = friends.filter(f => 
    f.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex font-sans antialiased relative">
      <NotificationPanel 
        isOpen={isNotifOpen}
        onClose={() => {
          setIsNotifOpen(false);
          setUnreadCount(0);
        }}
        notifications={notifications}
        onAcceptFriendRequest={handleAcceptFriendRequestFromPanel}
        onRejectFriendRequest={handleRejectFriendRequestFromPanel}
        onClearAll={() => {
          localStorage.removeItem(`vm_notifs_${user._id}`);
          setNotifications([]);
          setUnreadCount(0);
        }}
      />

      {outgoingCallTarget && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-[200]">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl space-y-6">
            <div className="relative mx-auto w-24 h-24">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-500 animate-ping opacity-75" />
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${outgoingCallTarget.avatarSeed || outgoingCallTarget.name}`} 
                alt="" 
                className="w-full h-full rounded-full border-2 border-indigo-400 bg-slate-800" 
              />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Calling {outgoingCallTarget.name}...</h3>
              <p className="text-xs text-slate-400 mt-1">Waiting for partner to answer...</p>
            </div>
            <button 
              type="button"
              onClick={cancelOutgoingCall}
              className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition shadow-lg shadow-rose-600/20"
            >
              <PhoneOff className="w-4 h-4" /> Cancel Call
            </button>
          </div>
        </div>
      )}

      {incomingCallData && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-[200]">
          <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl space-y-6">
            <div className="relative mx-auto w-24 h-24">
              <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full z-10 shadow">
                {incomingTimer}s
              </span>
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${incomingCallData.caller.avatarSeed || incomingCallData.caller.name}`} 
                alt="" 
                className="w-full h-full rounded-full border-2 border-emerald-400 bg-slate-800 animate-pulse" 
              />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">{incomingCallData.caller.name} is calling...</h3>
              <p className="text-xs text-slate-400 mt-1">Direct 1:1 Voice Call Request</p>
            </div>

            <div className="flex gap-3">
              <button 
                type="button"
                onClick={rejectIncomingCall}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <PhoneOff className="w-4 h-4" /> Decline
              </button>

              <button 
                type="button"
                onClick={acceptIncomingCall}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition shadow-lg shadow-emerald-600/30"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}

      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => { setActiveTab(tab); setActiveChatFriend(null); }} 
        user={user} 
        friendsCount={friends.length} 
        onLogout={handleLogout}
        isOpenMobile={isMobileSidebarOpen}
        setIsOpenMobile={setIsMobileSidebarOpen}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader 
          user={user} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          onOpenProfile={() => { setActiveTab('profile'); setActiveChatFriend(null); }}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          unreadCount={unreadCount}
          onOpenNotifications={() => {
            setIsNotifOpen(true);
            setUnreadCount(0);
          }}
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'practice' && (
            <PracticeArena 
              user={user} 
              onStartCall={() => {
                setActiveDirectCallSession(null);
                setActiveTab('call');
              }} 
            />
          )}

          {activeTab === 'messages' && (
            activeChatFriend ? (
              <FriendChat 
                currentUser={user}
                targetFriend={activeChatFriend}
                socket={socketRef.current}
                chatSessions={chatSessions}
                onSaveMessage={updateChatSessions}
                onUnfriend={handleUnfriend}
                onBack={() => setActiveChatFriend(null)}
                onStartCall={(friend) => startDirectCall(friend)}
              />
            ) : (
              <FriendsDirectory 
                friends={filteredFriends}
                onStartChat={(friend) => setActiveChatFriend(friend)}
                onStartCall={(friend) => startDirectCall(friend)}
                onUnfriend={handleUnfriend}
                onFindNewPeer={() => {
                  setActiveDirectCallSession(null);
                  setActiveTab('call');
                }}
              />
            )
          )}

          {activeTab === 'profile' && (
            <ProfileView 
              user={user} 
              friendsCount={friends.length} 
            />
          )}

          {/* About Us & Founder Section */}
          {activeTab === 'about' && (
            <AboutView />
          )}

          {activeTab === 'call' && (
            <div className="max-w-5xl mx-auto space-y-4">
              <button 
                type="button"
                onClick={() => {
                  setActiveTab('practice');
                  setActiveDirectCallSession(null);
                  reloadUserData();
                }} 
                className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl cursor-pointer transition"
              >
                <ArrowLeft className="w-4 h-4" /> Exit Call
              </button>

              <VoiceChat 
                key={activeDirectCallSession ? activeDirectCallSession.roomId : 'random_match_room'}
                currentUser={user} 
                directCallData={activeDirectCallSession}
                onCallEnd={() => {
                  setActiveDirectCallSession(null);
                  reloadUserData();
                }} 
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}