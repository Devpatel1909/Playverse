const express = require('express');
const router = express.Router();
const { getDashboardStats, getCricketStats, getSystemMetrics } = require('../controllers/sportsOverviewController');
const { authMiddleware, optionalAuthMiddleware } = require('../middleware/auth');

// GET /api/sports-overview/dashboard - Get dashboard statistics
router.get('/dashboard', optionalAuthMiddleware, getDashboardStats);

// GET /api/sports-overview/cricket-stats - Get cricket statistics
router.get('/cricket-stats', optionalAuthMiddleware, getCricketStats);

// GET /api/sports-overview/system-metrics - Get system metrics (protected)
router.get('/system-metrics', authMiddleware, getSystemMetrics);

module.exports = router;
