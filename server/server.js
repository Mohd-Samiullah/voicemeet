import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();

// Full CORS enable for Netlify & Localhost
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// MongoDB connection (Supports Atlas on Render & Localhost fallback)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/voicemeet';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected to VoiceMeet Database'))
  .catch(err => console.error('MongoDB Error:', err));

// ================= SCHEMAS =================
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, default: 'Voice User' },
  avatarSeed: { type: String, default: () => Math.random().toString(36).substring(7) },
  score: { type: Number, default: 1000 },
  streak: { type: Number, default: 1 },
  lastCallDate: { type: Date, default: Date.now },
  isElite: { type: Boolean, default: false },
  totalCalls: { type: Number, default: 0 },
  totalMinutes: { type: Number, default: 0 },
  about: { type: String, default: 'Practicing English & Networking on VoiceMeet' },
  profession: { type: String, default: 'College Student' },
  interests: { type: String, default: 'Tech, Networking, Languages' },
  englishLevel: { type: String, default: 'Intermediate' },
  location: { type: String, default: 'India' },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

const reportSchema = new mongoose.Schema({
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reportedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reason: { type: String, required: true },
  details: { type: String, required: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Report = mongoose.model('Report', reportSchema);

// ================= REST APIS =================
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'VoiceMeet Engine is active' });
});

// TURN & STUN Relay Servers for Strict Wi-Fi / College Networks
app.get('/api/ice-servers', (req, res) => {
  const iceServers = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    {
      urls: 'turn:openrelay.metered.ca:80',
      username: 'openrelayproject',
      credential: 'openrelayproject'
    },
    {
      urls: 'turn:openrelay.metered.ca:443',
      username: 'openrelayproject',
      credential: 'openrelayproject'
    },
    {
      urls: 'turn:openrelay.metered.ca:443?transport=tcp',
      username: 'openrelayproject',
      credential: 'openrelayproject'
    }
  ];
  res.json({ iceServers });
});

app.post('/api/auth/login-or-register', async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    let user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      user = await User.create({
        email: email.toLowerCase().trim(),
        name: name || email.split('@')[0],
        avatarSeed: email.split('@')[0]
      });
      console.log(`[User Registered] ${user.email}`);
    }

    const populatedUser = await User.findById(user._id).populate('friends', 'name email avatarSeed profession');
    res.json(populatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('friends', 'name email avatarSeed profession');
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/user/accept-friend-request', async (req, res) => {
  try {
    const { currentUserId, requesterId } = req.body;
    if (!currentUserId || !requesterId) return res.status(400).json({ error: 'Invalid IDs' });

    await User.findByIdAndUpdate(currentUserId, { $addToSet: { friends: requesterId } });
    await User.findByIdAndUpdate(requesterId, { $addToSet: { friends: currentUserId } });

    console.log(`[Friend Added] ${currentUserId} <===> ${requesterId}`);
    res.json({ success: true, message: 'Friend added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/user/remove-friend', async (req, res) => {
  try {
    const { currentUserId, targetUserId } = req.body;
    if (!currentUserId || !targetUserId) {
      return res.status(400).json({ error: 'Both User IDs are required' });
    }

    await User.findByIdAndUpdate(currentUserId, { $pull: { friends: targetUserId } });
    await User.findByIdAndUpdate(targetUserId, { $pull: { friends: currentUserId } });

    console.log(`[Friend Removed] ${currentUserId} <-x-> ${targetUserId}`);
    res.json({ success: true, message: 'Unfriended successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= SOCKET.IO ENGINE =================
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
  pingTimeout: 10000,
  pingInterval: 10000
});

let waitingQueue = [];
const activeSessions = new Map();

io.on('connection', (socket) => {
  console.log(`[Socket Connected] ID: ${socket.id}`);

  socket.on('register-user', ({ userId }) => {
    if (!userId) return;
    const uid = String(userId);
    socket.userId = uid;
    socket.join(`user_${uid}`);
    console.log(`[Registered] User ${uid} bound to socket ${socket.id}`);
  });

  socket.on('join-call-room', ({ roomId }) => {
    if (!roomId) return;
    socket.join(roomId);
  });

  socket.on('find-match', async (data = {}) => {
    const userId = data?.userId || null;
    waitingQueue = waitingQueue.filter(item => item.socketId !== socket.id);

    if (waitingQueue.length > 0) {
      const partner = waitingQueue.shift();
      const roomId = `room_${socket.id}_${partner.socketId}`;
      const now = Date.now();

      activeSessions.set(socket.id, { userId, partnerSocketId: partner.socketId, partnerUserId: partner.userId, startTime: now, roomId });
      activeSessions.set(partner.socketId, { userId: partner.userId, partnerSocketId: socket.id, partnerUserId: userId, startTime: now, roomId });

      socket.join(roomId);
      io.sockets.sockets.get(partner.socketId)?.join(roomId);

      const currentDbUser = userId ? await User.findById(userId).catch(() => null) : null;
      const partnerDbUser = partner.userId ? await User.findById(partner.userId).catch(() => null) : null;

      socket.emit('matched', { roomId, initiator: true, partner: partnerDbUser });
      partner.socket.emit('matched', { roomId, initiator: false, partner: currentDbUser });
    } else {
      waitingQueue.push({ socketId: socket.id, socket, userId });
      socket.emit('waiting');
    }
  });

  socket.on('signal', ({ roomId, signalData }) => {
    socket.to(roomId).emit('signal', signalData);
  });

  const finishCall = async (sockId) => {
    const session = activeSessions.get(sockId);
    if (!session) return;

    const durationSeconds = Math.round((Date.now() - session.startTime) / 1000);
    const durationMinutes = Math.max(1, Math.round(durationSeconds / 60));

    try {
      if (session.userId) {
        await User.findByIdAndUpdate(session.userId, {
          $inc: { totalCalls: 1, totalMinutes: durationMinutes, score: 25 }
        });
      }
      if (session.partnerUserId) {
        await User.findByIdAndUpdate(session.partnerUserId, {
          $inc: { totalCalls: 1, totalMinutes: durationMinutes, score: 25 }
        });
      }
    } catch (e) {
      console.error(e);
    }

    io.to(session.partnerSocketId).emit('call-ended', { durationMinutes, lastPartnerUserId: session.userId });
    socket.emit('call-ended', { durationMinutes, lastPartnerUserId: session.partnerUserId });

    activeSessions.delete(session.partnerSocketId);
    activeSessions.delete(sockId);
  };

  socket.on('end-call', () => finishCall(socket.id));

  socket.on('send-message', ({ myUserId, friendUserId, text, senderName }) => {
    if (!myUserId || !friendUserId || !text?.trim()) return;

    const messagePayload = {
      id: `${Date.now()}_${Math.random().toString(36).substring(7)}`,
      senderId: String(myUserId),
      friendUserId: String(friendUserId),
      senderName: senderName || 'Peer',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    io.to(`user_${String(friendUserId)}`).emit('new-message', messagePayload);
    socket.emit('message-sent-ack', messagePayload);
  });

  socket.on('send-friend-request', ({ requester, targetUserId }) => {
    if (!requester?._id || !targetUserId) return;
    io.to(`user_${String(targetUserId)}`).emit('incoming-friend-request', { requester });
  });

  socket.on('accept-friend-request-socket', ({ requesterId, receiver }) => {
    io.to(`user_${String(requesterId)}`).emit('friend-request-accepted', { friend: receiver });
  });

  socket.on('reject-friend-request-socket', ({ requesterId }) => {
    io.to(`user_${String(requesterId)}`).emit('friend-request-rejected');
  });

  socket.on('initiate-direct-call', ({ caller, receiverId }) => {
    if (!caller?._id || !receiverId) return;
    const roomId = `direct_room_${caller._id}_${receiverId}_${Date.now()}`;
    socket.join(roomId);

    io.to(`user_${receiverId}`).emit('incoming-direct-call', {
      caller,
      roomId
    });
  });

  socket.on('accept-direct-call', ({ callerId, receiver, caller, roomId }) => {
    socket.join(roomId);

    io.to(`user_${callerId}`).emit('direct-call-accepted', {
      partner: receiver,
      roomId,
      initiator: true
    });

    socket.emit('direct-call-accepted', {
      partner: caller,
      roomId,
      initiator: false
    });
  });

  socket.on('reject-direct-call', ({ callerId }) => {
    io.to(`user_${callerId}`).emit('direct-call-rejected');
  });

  socket.on('cancel-direct-call', ({ receiverId }) => {
    io.to(`user_${receiverId}`).emit('direct-call-cancelled');
  });

  socket.on('submit-report', async ({ reporterId, reportedId, reason, details }) => {
    if (reporterId) {
      await Report.create({
        reporter: reporterId,
        reportedUser: reportedId || null,
        reason,
        details
      });
      socket.emit('report-success');
    }
  });

  socket.on('disconnect', () => {
    waitingQueue = waitingQueue.filter(item => item.socketId !== socket.id);
    finishCall(socket.id);
  });
});

// Render dynamic PORT binding
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));