
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const superadminRoutes = require('./routes/superadmin');
const cricketRoutes = require('./routes/cricket');
const subadminRoutes = require('./routes/subadminRoutes');
const sportsOverviewRoutes = require('./routes/sportsOverview');
const publicRoutes = require('./routes/public');
// Models for diagnostics endpoint
// NOTE: Keep the casing consistent with actual filename 'SubAdmin.js' to avoid issues on case-sensitive systems
const SubAdmin = require('./models/SubAdmin');
const CricketTeam = require('./models/CricketTeam');
const SuperAdmin = require('./models/SuperAdmin');

const app = express();
const server = http.createServer(app);

require('dotenv').config();

// Socket.IO setup with CORS
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:4173',
      process.env.FRONTEND_ORIGIN
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST']
  }
});

// Make io accessible to routes
app.set('io', io);

// Middleware
app.use(express.json({ limit: '10mb' })); // Increased limit for image uploads
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration for frontend-backend connection
app.use(cors({
  origin: [
    'http://localhost:3000', // React dev server
    'http://localhost:5173', // Vite dev server
    'http://localhost:5174', // Vite dev server (alternate port)
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

// Development helper: return admin credentials for a given sport
// WARNING: This endpoint is intended for local development only and will
// only return plaintext passwords when ALLOW_DEV_CREDENTIALS=true or
// when NODE_ENV is not 'production'. Do NOT enable in production.
app.get('/api/credentials', (req, res) => {
  const sport = (req.query.sport || '').toString().toLowerCase();
  const allowDev = process.env.ALLOW_DEV_CREDENTIALS === 'true' || process.env.NODE_ENV !== 'production';

  const DEV_CREDENTIALS = {
    cricket: { email: 'cricket.admin@sports.com', password: 'cricket123' },
    football: { email: 'football.admin@sports.com', password: 'football123' },
    basketball: { email: 'basketball.admin@sports.com', password: 'basketball123' },
    tennis: { email: 'tennis.admin@sports.com', password: 'tennis123' },
    temp: { email: 'tempadmin@mail.com', password: 'temppass123' }
  };

  if (!sport || !DEV_CREDENTIALS[sport]) {
    return res.status(404).json({ success: false, message: 'Route not found' });
  }

  const result = { email: DEV_CREDENTIALS[sport].email };
  if (allowDev) result.password = DEV_CREDENTIALS[sport].password;

  return res.json({ success: true, data: result });
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
// Public routes (no authentication required)
app.use('/api/public', publicRoutes);

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

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Join match room for real-time updates
  socket.on('join-match', (matchId) => {
    socket.join(`match-${matchId}`);
    console.log(`Client ${socket.id} joined match room: match-${matchId}`);
  });

  // Leave match room
  socket.on('leave-match', (matchId) => {
    socket.leave(`match-${matchId}`);
    console.log(`Client ${socket.id} left match room: match-${matchId}`);
  });

  // Join sport room for live matches
  socket.on('join-sport', (sport) => {
    socket.join(`sport-${sport}`);
    console.log(`Client ${socket.id} joined sport room: sport-${sport}`);
  });

  // Leave sport room
  socket.on('leave-sport', (sport) => {
    socket.leave(`sport-${sport}`);
    console.log(`Client ${socket.id} left sport room: sport-${sport}`);
  });

  // Join all live matches room
  socket.on('join-live-matches', () => {
    socket.join('live-matches');
    console.log(`Client ${socket.id} joined live-matches room`);
  });

  // Disconnect handler
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Helper function to emit match updates
global.emitMatchUpdate = (matchId, data) => {
  io.to(`match-${matchId}`).emit('match-update', data);
};

// Helper function to emit live matches updates
global.emitLiveMatchesUpdate = (data) => {
  io.to('live-matches').emit('live-matches-update', data);
};

// Helper function to emit sport-specific updates
global.emitSportUpdate = (sport, data) => {
  io.to(`sport-${sport}`).emit('sport-update', data);
};

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
      server.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
        console.log(`Socket.IO server ready on ws://localhost:${port}`);
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
