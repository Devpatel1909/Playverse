
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const superadminRoutes = require('./routes/superadmin');
const cricketRoutes = require('./routes/cricket');
const subadminRoutes = require('./routes/subadminRoutes');
const sportsOverviewRoutes = require('./routes/sportsOverview');
// Models for diagnostics endpoint
// NOTE: Keep the casing consistent with actual filename 'SubAdmin.js' to avoid issues on case-sensitive systems
const SubAdmin = require('./models/SubAdmin');
const CricketTeam = require('./models/CricketTeam');
const SuperAdmin = require('./models/SuperAdmin');

const app = express();

require('dotenv').config();
// Middleware
app.use(express.json({ limit: '10mb' })); // Increased limit for image uploads
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration for frontend-backend connection
app.use(cors({
  origin: [
    'http://localhost:3000', // React dev server
    'http://localhost:5173', // Vite dev server  
    'http://localhost:4173', // Vite preview
    process.env.FRONTEND_ORIGIN
  ].filter(Boolean), // Remove any undefined values
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'backend', time: new Date().toISOString() });
});

// Database diagnostics health check (verifies MongoDB connectivity & basic counts)
app.get('/health/db', async (req, res) => {
  try {
    const state = mongoose.connection.readyState; // 0=disconnected,1=connected,2=connecting,3=disconnecting
    const stateMap = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
    let details = {};
    if (state === 1) {
      // Only attempt counts if connected
      const [subAdminCount, teamCount, superAdminCount] = await Promise.all([
        SubAdmin.countDocuments(),
        CricketTeam.countDocuments(),
        SuperAdmin.countDocuments()
      ]);
      details = { subAdmins: subAdminCount, cricketTeams: teamCount, superAdmins: superAdminCount };
    }
    res.json({
      success: true,
      mongo: {
        state: stateMap[state] || 'unknown',
        readyState: state,
        host: mongoose.connection.host,
        name: mongoose.connection.name,
        ...details
      },
      time: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Diagnostics failed', message: err.message });
  }
});

// API Routes
app.use('/api/superadmin', superadminRoutes);
app.use('/api/cricket', cricketRoutes);
// Mount sub-admin routes (cricket specific)
app.use('/api/cricket/sub-admins', subadminRoutes);
app.use('/api/sports-overview', sportsOverviewRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// MongoDB connection
// Default port (override with PORT env var). Set to 5001 per user request.
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || '';

async function start() {
  try {
    if (!MONGO_URI) {
      console.warn('MONGO_URI is not set. Please configure it in .env');
    }
    if (!process.env.JWT_SECRET) {
      console.warn('JWT_SECRET is not set. Please configure it in .env');
    }

    console.log('SUPERADMIN_CODE:', process.env.SUPERADMIN_CODE);

    if (MONGO_URI) {
      // Connection event listeners for better visibility
      mongoose.connection.on('connected', () => console.log('MongoDB connected')); 
      mongoose.connection.on('error', (e) => console.error('MongoDB connection error:', e.message));
      mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected'));
      mongoose.connection.on('reconnected', () => console.log('MongoDB reconnected'));

      await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 });
      console.log('Connected to MongoDB');
    } else {
      console.log('Skipping MongoDB connection due to missing MONGO_URI');
    }

    // Start server with automatic port fallback if in use
    const initialPort = parseInt(PORT, 10);
    const maxAttempts = 10;

    const startServer = (port, attempt = 1) => {
      const server = app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
        if (port !== initialPort) {
          console.log(`(Port fallback: original ${initialPort} was busy)`);
        }
      });

      server.on('error', (err) => {
        if (err.code === 'EADDRINUSE' && attempt < maxAttempts) {
          console.warn(`Port ${port} in use, trying ${port + 1} (attempt ${attempt + 1}/${maxAttempts})`);
          startServer(port + 1, attempt + 1);
        } else {
          console.error('Failed to start server:', err);
          process.exit(1);
        }
      });
    };

    startServer(initialPort);
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
