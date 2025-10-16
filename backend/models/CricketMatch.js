const mongoose = require('mongoose');

const CricketMatchSchema = new mongoose.Schema(
  {
    teamA: { type: mongoose.Schema.Types.ObjectId, ref: 'CricketTeam', required: true },
    teamB: { type: mongoose.Schema.Types.ObjectId, ref: 'CricketTeam', required: true },
    date: { type: Date, required: true },
    venue: { type: String, trim: true, default: '' },
    status: {
      type: String,
      enum: ['scheduled', 'live', 'completed', 'cancelled'],
      default: 'scheduled'
    },
    score: {
      teamA: {
        runs: { type: Number, default: 0 },
        wickets: { type: Number, default: 0 }
      },
      teamB: {
        runs: { type: Number, default: 0 },
        wickets: { type: Number, default: 0 }
      },
      overs: { type: String, default: '0.0' }
    },
    result: { type: String, trim: true, default: '' },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'SuperAdmin', required: false }
  },
  { timestamps: true }
);

CricketMatchSchema.index({ date: -1 });

module.exports = mongoose.models.CricketMatch || mongoose.model('CricketMatch', CricketMatchSchema);
