const mongoose = require('mongoose');

const CricketMatchSchema = new mongoose.Schema(
  {
    teamA: { type: mongoose.Schema.Types.ObjectId, ref: 'CricketTeam', required: true },
    teamB: { type: mongoose.Schema.Types.ObjectId, ref: 'CricketTeam', required: true },
    date: { type: Date, required: true },
    venue: { type: String, trim: true, default: '' },
    matchType: {
      type: String,
      enum: ['T20', 'ODI', 'T10', 'Test', 'Custom'],
      default: 'T20'
    },
    overs: { type: Number, default: 20 },
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
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'SuperAdmin', required: false },
    // Ball-by-ball commentary
    commentary: [{
      ballNumber: { type: String, required: true }, // e.g., "19.6"
      over: { type: Number }, // e.g., 19
      ball: { type: Number }, // e.g., 6
      batsman: { type: String, required: true },
      bowler: { type: String, required: true },
      runs: { type: Number, required: true },
      extras: { type: Number, default: 0 },
      isWicket: { type: Boolean, default: false },
      wicketType: { type: String }, // e.g., "caught", "bowled", "lbw"
      overDetail: { type: String }, // Additional detail like "or yelaga chakka"
      commentary: { type: String }, // Full commentary text
      timestamp: { type: Date, default: Date.now }
    }],
    // Match data for live scoring (includes innings, deliveries, etc.)
    matchData: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  { timestamps: true }
);

CricketMatchSchema.index({ date: -1 });

module.exports = mongoose.models.CricketMatch || mongoose.model('CricketMatch', CricketMatchSchema);
