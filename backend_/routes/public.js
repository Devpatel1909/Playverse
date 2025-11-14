const express = require('express');
const router = express.Router();
const CricketMatch = require('../models/CricketMatch');
const Match = require('../models/Match');

// Get all live matches across all sports
router.get('/live-matches', async (req, res) => {
  try {
    const { sport } = req.query;
    
    const query = { status: 'live' };
    
    if (sport && sport.toLowerCase() !== 'all' && sport.toLowerCase() !== 'cricket') {
      // No matches for other sports yet
      return res.json({
        success: true,
        count: 0,
        data: []
      });
    }

    const cricketMatches = await CricketMatch.find(query)
      .populate('teamA teamB', 'name shortName logo')
      .sort({ date: -1 })
      .limit(20);

    // Transform to consistent format
    const matches = cricketMatches.map(match => ({
      id: match._id,
      sport: 'Cricket',
      team1: match.teamA?.name || 'TBD',
      team2: match.teamB?.name || 'TBD',
      team1Logo: match.teamA?.logo || '🏏',
      team2Logo: match.teamB?.logo || '🏏',
      score1: `${match.score?.teamA?.runs || 0}/${match.score?.teamA?.wickets || 0}`,
      score2: `${match.score?.teamB?.runs || 0}/${match.score?.teamB?.wickets || 0}`,
      overs1: match.matchType === 'T20' ? `${match.overs}.0` : match.score?.overs || '0.0',
      overs2: match.score?.overs || '0.0',
      status: match.status,
      venue: match.venue || 'TBD',
      tournament: 'IPL 2025',
      time: 'Live',
      startTime: match.date
    }));

    res.json({
      success: true,
      count: matches.length,
      data: matches
    });
  } catch (error) {
    console.error('Error fetching live matches:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch live matches',
      error: error.message
    });
  }
});

// Get recent completed matches
router.get('/recent-matches', async (req, res) => {
  try {
    const { sport, limit = 10 } = req.query;
    
    const query = { status: 'completed' };
    
    if (sport && sport.toLowerCase() !== 'all' && sport.toLowerCase() !== 'cricket') {
      return res.json({
        success: true,
        count: 0,
        data: []
      });
    }

    const cricketMatches = await CricketMatch.find(query)
      .populate('teamA teamB', 'name shortName logo')
      .sort({ date: -1 })
      .limit(parseInt(limit));

    const matches = cricketMatches.map(match => ({
      id: match._id,
      sport: 'Cricket',
      team1: match.teamA?.name || 'TBD',
      team2: match.teamB?.name || 'TBD',
      team1Logo: match.teamA?.logo || '🏏',
      team2Logo: match.teamB?.logo || '🏏',
      score1: `${match.score?.teamA?.runs || 0}/${match.score?.teamA?.wickets || 0}`,
      score2: `${match.score?.teamB?.runs || 0}/${match.score?.teamB?.wickets || 0}`,
      overs1: match.matchType === 'T20' ? `${match.overs}.0` : match.score?.overs || '0.0',
      overs2: match.score?.overs || '0.0',
      status: match.status,
      result: match.result || 'Match completed',
      venue: match.venue || 'TBD',
      endTime: match.date
    }));

    res.json({
      success: true,
      count: matches.length,
      data: matches
    });
  } catch (error) {
    console.error('Error fetching recent matches:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent matches',
      error: error.message
    });
  }
});

// Get upcoming matches
router.get('/upcoming-matches', async (req, res) => {
  try {
    const { sport, limit = 10 } = req.query;
    
    const query = { 
      status: 'scheduled',
      date: { $gt: new Date() }
    };
    
    if (sport && sport.toLowerCase() !== 'all' && sport.toLowerCase() !== 'cricket') {
      return res.json({
        success: true,
        count: 0,
        data: []
      });
    }

    const cricketMatches = await CricketMatch.find(query)
      .populate('teamA teamB', 'name shortName logo')
      .sort({ date: 1 })
      .limit(parseInt(limit));

    const matches = cricketMatches.map(match => ({
      id: match._id,
      sport: 'Cricket',
      team1: match.teamA?.name || 'TBD',
      team2: match.teamB?.name || 'TBD',
      team1Logo: match.teamA?.logo || '🏏',
      team2Logo: match.teamB?.logo || '🏏',
      status: match.status,
      venue: match.venue || 'TBD',
      tournament: 'IPL 2025',
      startTime: match.date
    }));

    res.json({
      success: true,
      count: matches.length,
      data: matches
    });
  } catch (error) {
    console.error('Error fetching upcoming matches:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch upcoming matches',
      error: error.message
    });
  }
});

// Get specific match details
router.get('/match/:matchId', async (req, res) => {
  try {
    const { matchId } = req.params;

    const match = await CricketMatch.findById(matchId)
      .populate('teamA teamB');

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    // Transform to consistent format
    const matchData = {
      id: match._id,
      sport: 'Cricket',
      team1: match.teamA?.name || 'TBD',
      team2: match.teamB?.name || 'TBD',
      team1Logo: match.teamA?.logo || '🏏',
      team2Logo: match.teamB?.logo || '🏏',
      score1: `${match.score?.teamA?.runs || 0}/${match.score?.teamA?.wickets || 0}`,
      score2: `${match.score?.teamB?.runs || 0}/${match.score?.teamB?.wickets || 0}`,
      overs1: match.matchType === 'T20' ? `${match.overs}.0` : match.score?.overs || '0.0',
      overs2: match.score?.overs || '0.0',
      status: match.status,
      venue: match.venue || 'TBD',
      tournament: 'IPL 2025',
      time: match.status === 'live' ? 'Live' : match.status === 'completed' ? 'Completed' : 'Scheduled',
      startTime: match.date,
      result: match.result || '',
      toss: 'Toss information not available',
      umpires: 'Umpires to be announced',
      referee: 'Match referee to be announced',
      stadium: match.venue || 'TBD',
      city: match.venue ? match.venue.split(',')[1]?.trim() || 'India' : 'India',
      capacity: '50000 (approx)',
      matchType: match.matchType || 'T20',
      series: 'IPL 2025',
      // Include team players for scorecard
      team1Players: match.teamA?.players || [],
      team2Players: match.teamB?.players || [],
      // Include commentary (sorted by most recent first)
      commentary: match.commentary ? match.commentary.sort((a, b) => {
        const aNum = parseFloat(a.ballNumber);
        const bNum = parseFloat(b.ballNumber);
        return bNum - aNum; // Descending order
      }) : []
    };

    res.json({
      success: true,
      data: matchData
    });
  } catch (error) {
    console.error('Error fetching match details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch match details',
      error: error.message
    });
  }
});

// Get cricket match commentary
router.get('/cricket/commentary/:matchId', async (req, res) => {
  try {
    const { matchId } = req.params;

    const match = await CricketMatch.findById(matchId).select('commentary');

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    // Sort commentary by ball number (most recent first)
    const sortedCommentary = match.commentary ? match.commentary.sort((a, b) => {
      const aNum = parseFloat(a.ballNumber);
      const bNum = parseFloat(b.ballNumber);
      return bNum - aNum;
    }) : [];

    res.json({
      success: true,
      count: sortedCommentary.length,
      data: sortedCommentary
    });
  } catch (error) {
    console.error('Error fetching commentary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch commentary',
      error: error.message
    });
  }
});

// Get available sports
router.get('/sports', async (req, res) => {
  try {
    const sports = [
      { id: 'cricket', name: 'Cricket', icon: '🏏' },
      { id: 'football', name: 'Football', icon: '⚽' },
      { id: 'basketball', name: 'Basketball', icon: '🏀' },
      { id: 'tennis', name: 'Tennis', icon: '🎾' },
      { id: 'hockey', name: 'Hockey', icon: '🏒' }
    ];

    res.json({
      success: true,
      data: sports
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sports',
      error: error.message
    });
  }
});

module.exports = router;
