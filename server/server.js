import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import mongoose from 'mongoose';
import crypto from 'crypto';

const app = express();

// Allowed Origins for Localhost and Netlify
const allowedOrigins = [
  'https://voicemeets.netlify.app',
  'http://localhost:5173',
  'http://localhost:3000'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.netlify.app')) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// MongoDB connection (Supports Atlas on Render & Localhost fallback)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/voicemeet';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected to VoiceMeet Database'))
  .catch(err => console.error('MongoDB Error:', err));

// ================= SCHEMAS =================
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  mobileNumber: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  // Hidden backend-only admin credentials
  adminGmail: { type: String, default: 'samiullah.xcrino@gmail.com' },
  adminPassword: { type: String, required: true },
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

// 1. REGISTRATION API
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, name, email, mobileNumber, password, confirmPassword } = req.body;

    if (!username || !name || !email || !mobileNumber || !password || !confirmPassword) {
      return res.status(400).json({ error: 'Sabhi fields bharna zaroori hai' });
    }

    const cleanUsername = username.toLowerCase().trim();
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(cleanUsername)) {
      return res.status(400).json({ error: 'Username 3-20 characters ka hona chahiye (letters, numbers, underscore only)' });
    }

    const cleanEmail = email.toLowerCase().trim();
    if (!cleanEmail.endsWith('@gmail.com')) {
      return res.status(400).json({ error: 'Sirf valid @gmail.com address hi allow hai' });
    }

    const cleanMobile = mobileNumber.trim();
    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      return res.status(400).json({ error: 'Kripya 10-digit valid Indian mobile number enter karein' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Password aur Confirm Password match nahi ho rahe' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password kam se kam 6 characters ka hona chahiye' });
    }

    const existing = await User.findOne({
      $or: [{ email: cleanEmail }, { username: cleanUsername }]
    });

    if (existing) {
      if (existing.username === cleanUsername) {
        return res.status(400).json({ error: 'Yeh username pehle se taken hai. Kripya doosra chunein.' });
      }
      return res.status(400).json({ error: 'Yeh Gmail pehle se registered hai. Seedha Login karein.' });
    }

    // Har registered user ke liye automatic randomized admin password hash generate hoga
    const randomSalt = crypto.randomBytes(8).toString('hex');
    const autoAdminHash = crypto.createHash('sha256').update(`admin_${cleanEmail}_${randomSalt}_${Date.now()}`).digest('hex');

    const newUser = await User.create({
      username: cleanUsername,
      name: name.trim(),
      email: cleanEmail,
      mobileNumber: cleanMobile,
      password: password,
      adminGmail: 'samiullah.xcrino@gmail.com',
      adminPassword: autoAdminHash,
      avatarSeed: cleanUsername
    });

    console.log(`[User Registered] User: ${newUser.username} | Email: ${newUser.email}`);

    // Frontend response se sensitive fields sanitize
    const userResponse = newUser.toObject();
    delete userResponse.password;
    delete userResponse.adminGmail;
    delete userResponse.adminPassword;

    res.json(userResponse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. LOGIN API (Username ya Gmail + Password)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ error: 'Username/Gmail aur Password dono required hain' });
    }

    const cleanId = identifier.toLowerCase().trim();
    const user = await User.findOne({
      $or: [{ email: cleanId }, { username: cleanId }]
    }).populate('friends', 'name username email avatarSeed profession');

    if (!user) {
      return res.status(404).json({ error: 'Is credential ke sath koi account nahi mila' });
    }

    if (user.password !== password) {
      return res.status(400).json({ error: 'Galat password dala hai' });
    }

    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.adminGmail;
    delete userResponse.adminPassword;

    res.json(userResponse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Backward compatibility helper
app.post('/api/auth/login-or-register', async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    let user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      const generatedUsername = email.split('@')[0] + Math.floor(100 + Math.random() * 900);
      const autoAdminHash = crypto.createHash('sha256').update(`admin_${email}_${Date.now()}`).digest('hex');
      user = await User.create({
        username: generatedUsername,
        name: name || email.split('@')[0],
        email: email.toLowerCase().trim(),
        mobileNumber: '9999999999',
        password: 'defaultPassword123',
        adminGmail: 'samiullah.xcrino@gmail.com',
        adminPassword: autoAdminHash,
        avatarSeed: email.split('@')[0]
      });
      console.log(`[User Registered Legacy] ${user.email}`);
    }

    const populatedUser = await User.findById(user._id)
      .select('-password -adminGmail -adminPassword')
      .populate('friends', 'name username email avatarSeed profession');
    res.json(populatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -adminGmail -adminPassword')
      .populate('friends', 'name username email avatarSeed profession');
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
  cors: corsOptions,
  pingTimeout: 60000,
  pingInterval: 25000
});

let waitingQueue = [];
const activeSessions = new Map();
const socketRooms = new Map();

io.on('connection', (socket) => {
  console.log(`[Socket Connected] ID: ${socket.id}`);

  // Heartbeat ping listener to stop Render idle termination
  socket.on('keep-alive-ping', () => {
    socket.emit('keep-alive-pong');
  });

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
    socketRooms.set(socket.id, roomId);
    console.log(`[Room Joined] Socket ${socket.id} joined ${roomId}`);
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
      socketRooms.set(socket.id, roomId);
      socketRooms.set(partner.socketId, roomId);

      const currentDbUser = userId ? await User.findById(userId).select('-password -adminGmail -adminPassword').catch(() => null) : null;
      const partnerDbUser = partner.userId ? await User.findById(partner.userId).select('-password -adminGmail -adminPassword').catch(() => null) : null;

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
    const roomId = socketRooms.get(sockId);
    const session = activeSessions.get(sockId);

    if (roomId) {
      io.to(roomId).emit('call-ended');
      socket.to(roomId).emit('call-ended');
    }

    if (session) {
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
      activeSessions.delete(session.partnerSocketId);
      activeSessions.delete(sockId);
    }

    socket.emit('call-ended');
    socketRooms.delete(sockId);
  };

  socket.on('end-call', () => finishCall(socket.id));

  socket.on('initiate-direct-call', ({ caller, receiverId }) => {
    if (!caller?._id || !receiverId) return;
    const roomId = `direct_room_${caller._id}_${receiverId}_${Date.now()}`;
    socket.join(roomId);
    socketRooms.set(socket.id, roomId);

    io.to(`user_${receiverId}`).emit('incoming-direct-call', {
      caller,
      roomId
    });
  });

  socket.on('accept-direct-call', ({ callerId, receiver, caller, roomId }) => {
    socket.join(roomId);
    socketRooms.set(socket.id, roomId);

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

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));