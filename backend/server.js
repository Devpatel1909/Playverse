
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const superadminRoutes = require('./routes/superadmin');

const app = express();

require('dotenv').config();
// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || '*',
}));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'backend', time: new Date().toISOString() });
});

// Routes
app.use('/api/superadmin', superadminRoutes);

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
