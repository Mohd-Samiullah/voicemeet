// models.js
import mongoose from 'mongoose';

// 1. User Schema (Profile, Stats, Streaks, Elite Membership)
const userSchema = new mongoose.Schema({
  name: { type: String, default: 'Peer User' },
  avatarSeed: { type: String, default: () => Math.random().toString(36).substring(7) },
  score: { type: Number, default: 1000 },
  streak: { type: Number, default: 1 },
  lastCallDate: { type: Date, default: Date.now },
  isElite: { type: Boolean, default: false },
  eliteExpiry: { type: Date, default: null },
  
  // Real Call Stats
  totalCalls: { type: Number, default: 0 },
  totalMinutes: { type: Number, default: 0 },
  
  // Profile Meta Info
  about: { type: String, default: 'Practicing English & Networking' },
  profession: { type: String, default: 'College Student' },
  interests: { type: String, default: 'Tech, Travel, Movies' },
  englishLevel: { type: String, default: 'Beginner' },
  location: { type: String, default: 'Delhi, India' },
  
  // Friends List (Connected Users)
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

// 2. Report Schema (Jab user report kare)
const reportSchema = new mongoose.Schema({
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reportedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reason: { type: String, required: true },
  details: { type: String, required: true },
  status: { type: String, default: 'pending' }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
export const Report = mongoose.model('Report', reportSchema);