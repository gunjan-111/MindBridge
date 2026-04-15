// MindBridge — Express Backend (server.js)
// Run: npm install && node server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// ── MongoDB Connection ──
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mindbridge')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// ── SCHEMAS ──

// User Schema
const userSchema = new mongoose.Schema({
  firstName:   String,
  lastName:    String,
  email:       { type: String, unique: true, required: true },
  password:    { type: String, required: true },
  goals:       [String],           // anxiety, depression, etc.
  supportType: String,
  createdAt:   { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

// Mood Log Schema
const moodSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  mood:      { type: Number, min: 1, max: 5, required: true },  // 1=awful, 5=great
  intensity: { type: Number, min: 1, max: 10 },
  tags:      [String],
  note:      String,
  date:      { type: Date, default: Date.now }
});
const MoodLog = mongoose.model('MoodLog', moodSchema);

// Chat Message Schema
const chatSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  role:      { type: String, enum: ['user', 'ai'] },
  message:   String,
  timestamp: { type: Date, default: Date.now }
});
const ChatMessage = mongoose.model('ChatMessage', chatSchema);

// Booking Schema
const bookingSchema = new mongoose.Schema({
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  counselorId:  String,
  counselorName:String,
  sessionType:  String,   // video, text, phone
  date:         Date,
  time:         String,
  topic:        String,
  status:       { type: String, default: 'confirmed' },
  createdAt:    { type: Date, default: Date.now }
});
const Booking = mongoose.model('Booking', bookingSchema);

// Journal Entry Schema
const journalSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  prompt:    String,
  entry:     String,
  createdAt: { type: Date, default: Date.now }
});
const JournalEntry = mongoose.model('JournalEntry', journalSchema);

// ── MIDDLEWARE: Auth ──
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mindbridge_secret');
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// ── ROUTES ──

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'MindBridge API running 💙', version: '1.0.0' });
});

// ── AUTH ROUTES ──

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, goals, supportType } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ firstName, lastName, email, password: hashed, goals, supportType });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'mindbridge_secret', { expiresIn: '30d' });
    res.status(201).json({ token, user: { id: user._id, firstName, lastName, email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'mindbridge_secret', { expiresIn: '30d' });
    res.json({ token, user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── MOOD ROUTES ──

// POST /api/mood — Log a mood entry
app.post('/api/mood', authMiddleware, async (req, res) => {
  try {
    const { mood, intensity, tags, note } = req.body;
    const entry = new MoodLog({ userId: req.userId, mood, intensity, tags, note });
    await entry.save();
    res.status(201).json({ message: 'Mood logged', entry });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/mood — Get mood history
app.get('/api/mood', authMiddleware, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const since = new Date();
    since.setDate(since.getDate() - days);
    const entries = await MoodLog.find({ userId: req.userId, date: { $gte: since } }).sort({ date: -1 });
    
    // Calculate stats
    const avg = entries.length ? (entries.reduce((sum, e) => sum + e.mood, 0) / entries.length).toFixed(1) : 0;
    const streak = calculateStreak(entries);
    
    res.json({ entries, stats: { avg, streak, total: entries.length } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/mood/chart — Weekly chart data
app.get('/api/mood/chart', authMiddleware, async (req, res) => {
  try {
    const days = 7;
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const start = new Date(d.setHours(0,0,0,0));
      const end = new Date(d.setHours(23,59,59,999));
      const entries = await MoodLog.find({ userId: req.userId, date: { $gte: start, $lte: end } });
      const avg = entries.length ? (entries.reduce((s,e) => s+e.mood,0)/entries.length) : null;
      data.push({ date: start.toLocaleDateString('en-IN',{weekday:'short'}), mood: avg });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Helper: streak calculation
function calculateStreak(entries) {
  if (!entries.length) return 0;
  let streak = 1;
  const today = new Date().setHours(0,0,0,0);
  const sorted = entries.sort((a,b) => b.date - a.date);
  let prev = new Date(sorted[0].date).setHours(0,0,0,0);
  if (prev < today - 86400000) return 0;
  for (let i=1; i<sorted.length; i++) {
    const curr = new Date(sorted[i].date).setHours(0,0,0,0);
    if (prev - curr === 86400000) { streak++; prev = curr; }
    else break;
  }
  return streak;
}

// ── CHAT ROUTES ──

// POST /api/chat — Save a chat message
app.post('/api/chat', authMiddleware, async (req, res) => {
  try {
    const { role, message } = req.body;
    const msg = new ChatMessage({ userId: req.userId, role, message });
    await msg.save();
    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/chat — Get chat history
app.get('/api/chat', authMiddleware, async (req, res) => {
  try {
    const messages = await ChatMessage.find({ userId: req.userId }).sort({ timestamp: 1 }).limit(100);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── BOOKING ROUTES ──

// POST /api/booking — Create booking
app.post('/api/booking', authMiddleware, async (req, res) => {
  try {
    const { counselorName, counselorId, sessionType, date, time, topic } = req.body;
    const booking = new Booking({ userId: req.userId, counselorName, counselorId, sessionType, date: new Date(date), time, topic });
    await booking.save();
    res.status(201).json({ message: 'Booking confirmed', booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/booking — Get user bookings
app.get('/api/booking', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.userId }).sort({ date: 1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── JOURNAL ROUTES ──

// POST /api/journal — Save journal entry
app.post('/api/journal', authMiddleware, async (req, res) => {
  try {
    const { prompt, entry } = req.body;
    const journal = new JournalEntry({ userId: req.userId, prompt, entry });
    await journal.save();
    res.status(201).json({ message: 'Entry saved', journal });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/journal — Get journal entries
app.get('/api/journal', authMiddleware, async (req, res) => {
  try {
    const entries = await JournalEntry.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── DASHBOARD ROUTE ──
app.get('/api/dashboard', authMiddleware, async (req, res) => {
  try {
    const [moodEntries, chatCount, bookings, journals] = await Promise.all([
      MoodLog.find({ userId: req.userId }).sort({ date: -1 }).limit(7),
      ChatMessage.countDocuments({ userId: req.userId }),
      Booking.find({ userId: req.userId, date: { $gte: new Date() } }).limit(3),
      JournalEntry.countDocuments({ userId: req.userId })
    ]);
    const avgMood = moodEntries.length
      ? (moodEntries.reduce((s,e) => s+e.mood,0)/moodEntries.length).toFixed(1)
      : null;
    res.json({ avgMood, chatMessages: chatCount, upcomingBookings: bookings, journalEntries: journals });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 MindBridge server running on port ${PORT}`));
