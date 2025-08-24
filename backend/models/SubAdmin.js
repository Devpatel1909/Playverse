// models/SubAdmin.js
const mongoose = require('mongoose');

const SubAdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters']
  },
  phone: {
    type: String,
    trim: true,
    maxlength: [20, 'Phone number cannot exceed 20 characters']
  },
  specialization: {
    type: String,
    enum: [
      'Team Management',
      'Player Development', 
      'Match Analytics',
      'Performance Analysis',
      'Tournament Management',
      'Youth Development',
      'Technical Analysis',
      'General Management'
    ],
    default: 'General Management'
  },
  sport: {
    type: String,
    required: true,
    enum: ['cricket', 'football', 'basketball', 'tennis'],
    default: 'cricket'
  },
  permissions: {
    manageTeams: { type: Boolean, default: false },
    managePlayers: { type: Boolean, default: false },
    viewReports: { type: Boolean, default: false },
    manageMatches: { type: Boolean, default: false }
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Suspended'],
    default: 'Active'
  },
  createdBy: {
    type: String,
    required: true,
    default: 'Dsp2810'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: String
  },
  joinedDate: {
    type: String,
    required: true
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for better performance
SubAdminSchema.index({ email: 1, sport: 1 });
SubAdminSchema.index({ sport: 1, status: 1 });

// Reuse existing model if already compiled (avoids OverwriteModelError in dev hot-reload)
module.exports = mongoose.models.SubAdmin || mongoose.model('SubAdmin', SubAdminSchema);