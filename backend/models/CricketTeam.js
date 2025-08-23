const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    enum: [
      'Captain/Batsman', 
      'Captain/Bowler', 
      'Captain/All-rounder', 
      'Captain/Wicket Keeper',
      'Batsman', 
      'Fast Bowler', 
      'Spin Bowler', 
      'All-rounder', 
      'Wicket Keeper',
      'Opening Batsman',
      'Middle Order Batsman',
      'Finisher'
    ]
  },
  age: {
    type: Number,
    required: true,
    min: 16,
    max: 45
  },
  jerseyNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 99
  },
  contactPhone: {
    type: String,
    trim: true
  },
  contactEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  experience: {
    type: String,
    required: true
  },
  // Performance Statistics
  matches: {
    type: Number,
    default: 0
  },
  runs: {
    type: Number,
    default: 0
  },
  wickets: {
    type: Number,
    default: 0
  },
  catches: {
    type: Number,
    default: 0
  },
  stumps: {
    type: Number,
    default: 0
  },
  average: {
    type: Number,
    default: 0
  },
  strikeRate: {
    type: Number,
    default: 0
  },
  economy: {
    type: Number,
    default: 0
  },
  photo: {
    type: String, // URL or base64
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const cricketTeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  shortName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 10
  },
  captain: {
    type: String,
    required: true,
    trim: true
  },
  coach: {
    type: String,
    required: true,
    trim: true
  },
  established: {
    type: String,
    required: true
  },
  homeGround: {
    type: String,
    required: true,
    trim: true
  },
  contactEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  contactPhone: {
    type: String,
    required: true,
    trim: true
  },
  logo: {
    type: String, // URL or base64
    default: null
  },
  players: {
    type: [playerSchema],
    validate: [arrayLimit, 'Team cannot have more than 15 players']
  },
  totalMatches: {
    type: Number,
    default: 0
  },
  matchesWon: {
    type: Number,
    default: 0
  },
  matchesLost: {
    type: Number,
    default: 0
  },
  matchesDrawn: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SuperAdmin',
    required: true
  }
}, {
  timestamps: true
});

// Validation function for maximum 15 players
function arrayLimit(val) {
  return val.length <= 15;
}

// Index for better performance (name and shortName already have unique indexes)
cricketTeamSchema.index({ isActive: 1 });

// Virtual for win percentage
cricketTeamSchema.virtual('winPercentage').get(function() {
  if (this.totalMatches === 0) return 0;
  return ((this.matchesWon / this.totalMatches) * 100).toFixed(1);
});

// Ensure virtual fields are serialized
cricketTeamSchema.set('toJSON', { virtuals: true });
cricketTeamSchema.set('toObject', { virtuals: true });

// Pre-save middleware to ensure jersey numbers are unique within a team
cricketTeamSchema.pre('save', function(next) {
  const jerseyNumbers = this.players.map(player => player.jerseyNumber);
  const uniqueNumbers = [...new Set(jerseyNumbers)];
  
  if (jerseyNumbers.length !== uniqueNumbers.length) {
    const error = new Error('Jersey numbers must be unique within a team');
    return next(error);
  }
  next();
});

// Method to add player with validation
cricketTeamSchema.methods.addPlayer = function(playerData) {
  if (this.players.length >= 15) {
    throw new Error('Team cannot have more than 15 players');
  }
  
  // Check if jersey number is already taken
  const existingJersey = this.players.find(p => p.jerseyNumber === playerData.jerseyNumber);
  if (existingJersey) {
    throw new Error(`Jersey number ${playerData.jerseyNumber} is already taken`);
  }
  
  this.players.push(playerData);
  return this.save();
};

// Method to remove player
cricketTeamSchema.methods.removePlayer = function(playerId) {
  this.players = this.players.filter(player => player._id.toString() !== playerId);
  return this.save();
};

// Method to update player
cricketTeamSchema.methods.updatePlayer = function(playerId, updateData) {
  const playerIndex = this.players.findIndex(player => player._id.toString() === playerId);
  if (playerIndex === -1) {
    throw new Error('Player not found');
  }
  
  // If updating jersey number, check if it's unique
  if (updateData.jerseyNumber && updateData.jerseyNumber !== this.players[playerIndex].jerseyNumber) {
    const existingJersey = this.players.find((p, index) => 
      index !== playerIndex && p.jerseyNumber === updateData.jerseyNumber
    );
    if (existingJersey) {
      throw new Error(`Jersey number ${updateData.jerseyNumber} is already taken`);
    }
  }
  
  // Update player data
  Object.keys(updateData).forEach(key => {
    this.players[playerIndex][key] = updateData[key];
  });
  
  return this.save();
};

module.exports = mongoose.model('CricketTeam', cricketTeamSchema);
