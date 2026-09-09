// src/components/VoiceChat.jsx
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_SERVER = 'http://localhost:5000';

const rtcConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' }
  ]
};

export default function VoiceChat({ currentUser, directCallData, onCallEnd }) {
  const [status, setStatus] = useState('idle'); // idle | searching | connected | ended
  const [isMuted, setIsMuted] = useState(false);
  const [genderFilter, setGenderFilter] = useState('any');
  const [showPaywall, setShowPaywall] = useState(false);
  const [searchSeconds, setSearchSeconds] = useState(0);

  const [currentPartner, setCurrentPartner] = useState(null);
  const [friendRequestSent, setFriendRequestSent] = useState(false);
  const [reportReason, setReportReason] = useState('Abusive behavior');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const socketRef = useRef(null);
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const currentRoomRef = useRef(null);
  const timerRef = useRef(null);

  const cleanupWebRTC = () => {
    if (pcRef.current) {
      pcRef.current.onicecandidate = null;
      pcRef.current.ontrack = null;
      pcRef.current.onconnectionstatechange = null;
      pcRef.current.close();
      pcRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = null;
    }
  };

  const handleCallTermination = () => {
    cleanupWebRTC();
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setStatus('ended');
    if (onCallEnd) onCallEnd();
  };

  useEffect(() => {
    const socket = io(SOCKET_SERVER);
    socketRef.current = socket;

    socket.on('matched', async ({ roomId, initiator, partner }) => {
      if (timerRef.current) clearInterval(timerRef.current);
      setStatus('connected');
      setIsMuted(false);
      setFriendRequestSent(false);
      setReportSubmitted(false);
      setReportDetails('');
      if (partner) setCurrentPartner(partner);
      currentRoomRef.current = roomId;
      await setupWebRTC(roomId, initiator);
    });

    socket.on('signal', async (data) => {
      const pc = pcRef.current;
      if (!pc) return;

      if (data.sdp) {
        await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
        if (data.sdp.type === 'offer') {
          const answer = await pc.createAnswer({ offerToReceiveAudio: true });
          await pc.setLocalDescription(answer);
          socketRef.current.emit('signal', {
            roomId: currentRoomRef.current,
            signalData: { sdp: pc.localDescription }
          });
        }
      } else if (data.candidate) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (e) {
          console.error('ICE Candidate error', e);
        }
      }
    });

    socket.on('call-ended', () => {
      handleCallTermination();
    });

    socket.on('report-success', () => {
      setReportSubmitted(true);
    });

    return () => {
      socket.disconnect();
      cleanupWebRTC();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Direct Call Initialization
  useEffect(() => {
    if (directCallData && directCallData.roomId && socketRef.current) {
      setStatus('connected');
      setIsMuted(false);
      setFriendRequestSent(false);
      if (directCallData.partner) {
        setCurrentPartner(directCallData.partner);
      }
      currentRoomRef.current = directCallData.roomId;

      socketRef.current.emit('join-call-room', { roomId: directCallData.roomId });
      setupWebRTC(directCallData.roomId, directCallData.initiator);
    }
  }, [directCallData]);

  const setupWebRTC = async (roomId, initiator) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
        video: false
      });
      localStreamRef.current = stream;

      const pc = new RTCPeerConnection(rtcConfig);
      pcRef.current = pc;

      stream.getAudioTracks().forEach((track) => {
        track.enabled = true;
        pc.addTrack(track, stream);
      });

      pc.ontrack = (event) => {
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = event.streams[0];
          remoteAudioRef.current.volume = 1.0;
          remoteAudioRef.current.play().catch((err) => {
            console.warn('Audio play gesture required:', err);
          });
        }
      };

      pc.onicecandidate = (event) => {
        if (event.candidate && socketRef.current) {
          socketRef.current.emit('signal', {
            roomId,
            signalData: { candidate: event.candidate }
          });
        }
      };

      pc.onconnectionstatechange = () => {
        if (['disconnected', 'failed', 'closed'].includes(pc.connectionState)) {
          handleCallTermination();
        }
      };

      socketRef.current.emit('join-call-room', { roomId });

      if (initiator) {
        setTimeout(async () => {
          if (!pcRef.current) return;
          const offer = await pcRef.current.createOffer({ offerToReceiveAudio: true });
          await pcRef.current.setLocalDescription(offer);
          socketRef.current.emit('signal', {
            roomId,
            signalData: { sdp: pcRef.current.localDescription }
          });
        }, 400);
      }
    } catch (err) {
      console.error('Microphone error:', err);
      setStatus('idle');
      alert('Microphone permission required for voice calls!');
    }
  };

  const startMatch = () => {
    cleanupWebRTC();
    setStatus('searching');
    setSearchSeconds(0);
    timerRef.current = setInterval(() => {
      setSearchSeconds((prev) => prev + 1);
    }, 1000);

    socketRef.current.emit('find-match', { userId: currentUser?._id || null });
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const tracks = localStreamRef.current.getAudioTracks();
      if (tracks.length > 0) {
        const nextState = !isMuted;
        tracks.forEach((t) => (t.enabled = !nextState));
        setIsMuted(nextState);
      }
    }
  };

  const endCall = () => {
    if (socketRef.current) {
      socketRef.current.emit('end-call');
    }
    handleCallTermination();
  };

  // Trigger real-time Friend Request to partner
  const handleAddFriend = () => {
    if (!currentUser?._id || !currentPartner?._id || !socketRef.current) return;

    socketRef.current.emit('send-friend-request', {
      requester: currentUser,
      targetUserId: currentPartner._id
    });

    setFriendRequestSent(true);
  };

  const submitReport = (e) => {
    e.preventDefault();
    if (!reportDetails.trim()) return;
    socketRef.current.emit('submit-report', {
      reporterId: currentUser?._id,
      reportedId: currentPartner?._id || null,
      reason: reportReason,
      details: reportDetails
    });
  };

  const formatTimer = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-4 text-slate-100">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <section className="lg:col-span-8 bg-slate-900/60 backdrop-blur-2xl border border-slate-800 rounded-3xl p-8 shadow-2xl flex flex-col items-center justify-between min-h-[540px] relative overflow-hidden">
          <div className="w-full flex items-center justify-between border-b border-slate-800 pb-4 z-10">
            <span className="text-xs uppercase font-bold tracking-widest text-slate-400">Audio Session</span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
              status === 'connected' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
              status === 'searching' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' :
              status === 'ended' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
              'bg-slate-800 text-slate-400'
            }`}>
              {status.toUpperCase()}
            </span>
          </div>

          {status !== 'ended' ? (
            <div className="relative flex flex-col items-center justify-center my-auto py-10 z-10 w-full">
              {status === 'searching' && (
                <>
                  <div className="absolute w-52 h-52 rounded-full border border-cyan-500/20 animate-ping pointer-events-none" />
                  <div className="absolute w-64 h-64 rounded-full border border-indigo-500/15 animate-pulse pointer-events-none" />
                </>
              )}

              <div className={`w-40 h-40 rounded-full flex items-center justify-center border-4 transition-all duration-500 shadow-2xl ${
                status === 'connected'
                  ? isMuted ? 'border-amber-500 bg-amber-950/30' : 'border-emerald-500 bg-emerald-950/30 ring-8 ring-emerald-500/10'
                  : status === 'searching' ? 'border-cyan-400 bg-slate-800/80 ring-8 ring-cyan-500/10'
                  : 'border-slate-700 bg-slate-800/40'
              }`}>
                {status === 'searching' ? (
                  <div className="flex flex-col items-center">
                    <svg className="w-10 h-10 text-cyan-400 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span className="text-sm font-mono text-cyan-300 mt-2 font-bold">{formatTimer(searchSeconds)}</span>
                  </div>
                ) : (
                  <span className="text-5xl select-none">{status === 'connected' ? (isMuted ? '🔇' : '🎙️') : '🎧'}</span>
                )}
              </div>

              {status === 'connected' && !isMuted && (
                <div className="flex items-center gap-1.5 mt-6 h-6">
                  {[40, 70, 30, 90, 60, 100, 50, 80, 45].map((h, i) => (
                    <span key={i} className="w-1 bg-emerald-400 rounded-full animate-pulse" style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
              )}

              <div className="text-center mt-6">
                <h3 className="text-lg font-bold text-slate-100">
                  {status === 'idle' && 'Ready to Connect with a Peer'}
                  {status === 'searching' && 'Scanning for Active Speakers...'}
                  {status === 'connected' && (isMuted ? 'Microphone is MUTED' : `Talking with ${currentPartner?.name || 'Peer'}`)}
                </h3>
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-4 my-auto py-4 z-10">
              <div className="text-center">
                <h3 className="text-xl font-bold text-slate-100">Call Ended</h3>
                <p className="text-xs text-slate-400">Connection closed cleanly.</p>
              </div>

              {currentPartner && (
                <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentPartner.avatarSeed || currentPartner.name}`} className="w-10 h-10 rounded-xl" alt="" />
                    <div>
                      <h4 className="text-sm font-bold text-white">{currentPartner.name}</h4>
                      <p className="text-xs text-slate-400">{currentPartner.email}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddFriend}
                    disabled={friendRequestSent}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      friendRequestSent 
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    }`}
                  >
                    {friendRequestSent ? 'Request Pending ⏳' : 'Add to Friends 🤝'}
                  </button>
                </div>
              )}

              <form onSubmit={submitReport} className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-2xl flex flex-col gap-3">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Report Misconduct ⚠️</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-xs rounded-xl p-2.5 text-slate-300 outline-none"
                  >
                    <option value="Abusive Language">Abusive Language</option>
                    <option value="Harassment">Harassment</option>
                    <option value="Spam / Noise">Spam / Noise</option>
                  </select>
                  <input
                    type="text"
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="Describe issue..."
                    className="bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 outline-none"
                  />
                </div>
                <button type="submit" disabled={reportSubmitted} className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition cursor-pointer">
                  {reportSubmitted ? 'Report Submitted ✓' : 'Submit Report'}
                </button>
              </form>

              <button onClick={() => setStatus('idle')} className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl border border-slate-700 transition cursor-pointer">
                Find Another Match 🔁
              </button>
            </div>
          )}

          <div className="w-full border-t border-slate-800 pt-5 z-10">
            {status === 'idle' && (
              <button onClick={startMatch} className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 text-white font-bold text-sm rounded-2xl shadow-xl transition cursor-pointer">
                Find Random Peer ⚡
              </button>
            )}

            {status === 'searching' && (
              <button onClick={endCall} className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-2xl transition cursor-pointer">
                Cancel Search
              </button>
            )}

            {status === 'connected' && (
              <div className="grid grid-cols-2 gap-3 w-full">
                <button onClick={toggleMute} className={`py-3 rounded-2xl border font-bold text-xs transition cursor-pointer ${isMuted ? 'bg-rose-500 text-white border-rose-500' : 'bg-slate-800 border-slate-700 text-slate-200'}`}>
                  {isMuted ? '🔇 Unmute Mic' : '🎙️ Mute Mic'}
                </button>
                <button onClick={endCall} className="py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-2xl transition cursor-pointer shadow-lg">
                  Disconnect ✕
                </button>
              </div>
            )}
          </div>
        </section>

        {/* <aside className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white">Target Filters</h3>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => setGenderFilter('any')} className={`py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${genderFilter === 'any' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-850 text-slate-400 border-slate-700'}`}>
                All
              </button>
              <button onClick={() => setShowPaywall(true)} className="py-2 text-xs font-bold rounded-xl border bg-slate-850/50 border-slate-700/60 text-slate-400 hover:text-amber-400 cursor-pointer">
                Female 👑
              </button>
              <button onClick={() => setShowPaywall(true)} className="py-2 text-xs font-bold rounded-xl border bg-slate-850/50 border-slate-700/60 text-slate-400 hover:text-amber-400 cursor-pointer">
                Male 👑
              </button>
            </div>
          </div>
        </aside> */}
      </div>

      {showPaywall && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl">
            <h3 className="text-lg font-bold text-white">Unlock Pro Filters 👑</h3>
            <p className="text-xs text-slate-400 mt-2">Filter exclusively by gender and eliminate queue wait times.</p>
            <div className="my-5 p-3 rounded-2xl bg-slate-800/60 border border-slate-700">
              <span className="text-2xl font-black text-amber-400">₹49</span>
              <span className="text-xs text-slate-400"> / 24 Hours</span>
            </div>
            <button onClick={() => setShowPaywall(false)} className="w-full py-2 mt-2 text-xs text-slate-400 hover:text-slate-200 cursor-pointer">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Plays remote audio directly */}
      <audio ref={remoteAudioRef} autoPlay playsInline />
    </div>
  );
}