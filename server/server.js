require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Production-এ আপনার React frontend URL বসাতে পারেন
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'resq_super_secret_key_2026';

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🍃 MongoDB Atlas Connected Successfully!'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Schemas
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  disaster_type: { type: String, required: true },
  location_address: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'In Progress', 'Resolved'], default: 'Pending' },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const EmergencyReport = mongoose.model('EmergencyReport', reportSchema);

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ detail: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ detail: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// Socket.io Connection Logic
io.on('connection', (socket) => {
  console.log('⚡ Client Connected to Socket:', socket.id);

  socket.on('disconnect', () => {
    console.log('❌ Client Disconnected:', socket.id);
  });
});

// Routes
app.post('/api/register', async (req, res) => {
  try {
    const { fullName, email, phone, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ detail: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fullName, email, phone, password: hashedPassword, role: role || 'user' });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ detail: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ detail: 'Invalid credentials' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ detail: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role, name: user.fullName },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ access_token: token });
  } catch (error) {
    res.status(500).json({ detail: 'Server error' });
  }
});

app.get('/api/reports', authenticateToken, async (req, res) => {
  try {
    const reports = await EmergencyReport.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ detail: 'Error fetching reports' });
  }
});

app.post('/api/reports', authenticateToken, async (req, res) => {
  try {
    const { title, disasterType, locationAddress, description } = req.body;

    const newReport = new EmergencyReport({
      title,
      disaster_type: disasterType,
      location_address: locationAddress,
      description,
      status: 'Pending',
      latitude: 22.3569 + (Math.random() - 0.5) * 0.05,
      longitude: 91.7832 + (Math.random() - 0.5) * 0.05
    });

    await newReport.save();

    // 📢 Real-time event emit to all connected clients!
    io.emit('new_report', newReport);

    res.status(201).json(newReport);
  } catch (error) {
    res.status(500).json({ detail: 'Error creating report' });
  }
});

app.patch('/api/reports/:id/status', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ detail: 'Only admins can update status' });
    }

    const { id } = req.params;
    const { status } = req.body;

    const updatedReport = await EmergencyReport.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedReport) return res.status(404).json({ detail: 'Report not found' });

    // 📢 Emit status update event
    io.emit('status_updated', updatedReport);

    res.json({ message: 'Status updated successfully', report: updatedReport });
  } catch (error) {
    res.status(500).json({ detail: 'Error updating status' });
  }
});

// Start Server with HTTP Instance
server.listen(PORT, () => {
  console.log(`🚀 ResQ Server with Socket.io running on http://localhost:${PORT}`);
});