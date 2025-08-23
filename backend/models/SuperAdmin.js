const mongoose = require('mongoose');

const SuperAdminSchema = new mongoose.Schema(
  {
    superadminName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

SuperAdminSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('SuperAdmin', SuperAdminSchema);
