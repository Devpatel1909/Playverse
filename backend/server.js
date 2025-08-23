
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const superadminRoutes = require('./routes/superadmin');
const cricketRoutes = require('./routes/cricket');
const sportsOverviewRoutes = require('./routes/sportsOverview');

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

// API Routes
app.use('/api/superadmin', superadminRoutes);
app.use('/api/cricket', cricketRoutes);
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
const PORT = process.env.PORT || 5000;
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
      await mongoose.connect(MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
      });
      console.log('Connected to MongoDB');
    } else {
      console.log('Skipping MongoDB connection due to missing MONGO_URI');
    }

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
