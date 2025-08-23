const mongoose = require('mongoose');

const SuperAdminSchema = new mongoose.Schema(
  {
    superadminName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

// Email already has unique index from schema definition

module.exports = mongoose.model('SuperAdmin', SuperAdminSchema);
