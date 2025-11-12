// db.js - MongoDB connection utility
const mongoose = require('mongoose');

const connectDB = async (MONGO_URI) => {
  if (!MONGO_URI) {
    throw new Error('MONGO_URI is not set. Please configure it in .env');
  }
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
};

module.exports = connectDB;
