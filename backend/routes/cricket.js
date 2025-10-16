const express = require('express');
const router = express.Router();
const {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  addPlayer,
  updatePlayer,
  deletePlayer,
  uploadTeamLogo,
  uploadPlayerPhoto,
  getTeamStats,
  getAllMatches,
  getMatchById,
  createMatch,
  updateMatchScore
} = require('../controllers/cricketController');

// Import auth middleware
const { authMiddleware, optionalAuthMiddleware } = require('../middleware/auth');

// Team routes (public read, auth required for write)
router.get('/teams', getAllTeams);
router.get('/teams/stats', getTeamStats);
router.get('/teams/:id', getTeamById);
router.post('/teams', optionalAuthMiddleware, createTeam);
router.put('/teams/:id', optionalAuthMiddleware, updateTeam);
router.delete('/teams/:id', optionalAuthMiddleware, deleteTeam);

// Team logo routes
router.put('/teams/:teamId/logo', optionalAuthMiddleware, uploadTeamLogo);

// Player routes
router.post('/teams/:teamId/players', optionalAuthMiddleware, addPlayer);
router.put('/teams/:teamId/players/:playerId', optionalAuthMiddleware, updatePlayer);
router.delete('/teams/:teamId/players/:playerId', optionalAuthMiddleware, deletePlayer);

// Player photo routes
router.put('/teams/:teamId/players/:playerId/photo', optionalAuthMiddleware, uploadPlayerPhoto);

// Match routes (public read, auth optional for write)
router.get('/matches', getAllMatches);
router.get('/matches/:id', getMatchById);
router.post('/matches', optionalAuthMiddleware, createMatch);
router.put('/matches/:id/score', optionalAuthMiddleware, updateMatchScore);

module.exports = router;
