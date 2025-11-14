/**
 * Socket.IO Emitter Middleware
 * Provides helper functions to emit real-time updates
 */

// Emit match update to all clients watching this match
const emitMatchUpdate = (req, matchId, matchData) => {
  const io = req.app.get('io');
  if (io) {
    io.to(`match-${matchId}`).emit('match-update', {
      matchId,
      data: matchData,
      timestamp: new Date().toISOString()
    });
    console.log(`Emitted match update for match-${matchId}`);
  }
};

// Emit live matches update to all clients
const emitLiveMatchesUpdate = (req, matchesData) => {
  const io = req.app.get('io');
  if (io) {
    io.to('live-matches').emit('live-matches-update', {
      matches: matchesData,
      timestamp: new Date().toISOString()
    });
    console.log('Emitted live matches update');
  }
};

// Emit sport-specific update
const emitSportUpdate = (req, sport, data) => {
  const io = req.app.get('io');
  if (io) {
    io.to(`sport-${sport}`).emit('sport-update', {
      sport,
      data,
      timestamp: new Date().toISOString()
    });
    console.log(`Emitted sport update for ${sport}`);
  }
};

// Emit score update (combines match and live matches updates)
const emitScoreUpdate = (req, matchId, matchData) => {
  // Emit to specific match room
  emitMatchUpdate(req, matchId, matchData);
  
  // If match is live, also emit to live matches room
  if (matchData.status === 'live' || matchData.status === 'in-progress') {
    const io = req.app.get('io');
    if (io) {
      // Emit to live matches room
      io.to('live-matches').emit('score-update', {
        matchId,
        data: matchData,
        timestamp: new Date().toISOString()
      });
      
      // Emit to sport-specific room
      if (matchData.sport) {
        io.to(`sport-${matchData.sport}`).emit('score-update', {
          matchId,
          data: matchData,
          timestamp: new Date().toISOString()
        });
      }
    }
  }
};

// Emit commentary update
const emitCommentaryUpdate = (req, matchId, commentary) => {
  const io = req.app.get('io');
  if (io) {
    io.to(`match-${matchId}`).emit('commentary-update', {
      matchId,
      commentary,
      timestamp: new Date().toISOString()
    });
    console.log(`Emitted commentary update for match-${matchId}`);
  }
};

// Emit match status change (started, paused, completed, etc.)
const emitMatchStatusChange = (req, matchId, status, data = {}) => {
  const io = req.app.get('io');
  if (io) {
    io.to(`match-${matchId}`).emit('match-status-change', {
      matchId,
      status,
      data,
      timestamp: new Date().toISOString()
    });
    console.log(`Emitted match status change for match-${matchId}: ${status}`);
  }
};

module.exports = {
  emitMatchUpdate,
  emitLiveMatchesUpdate,
  emitSportUpdate,
  emitScoreUpdate,
  emitCommentaryUpdate,
  emitMatchStatusChange
};
