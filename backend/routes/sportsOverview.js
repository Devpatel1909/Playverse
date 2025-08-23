const express = require('express');
const router = express.Router();
const { getSportsOverview } = require('../controllers/sportsOverviewController');

// GET /api/sports-overview
router.get('/', getSportsOverview);

module.exports = router;
