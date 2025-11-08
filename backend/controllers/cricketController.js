const CricketTeam = require('../models/CricketTeam');
const CricketMatch = require('../models/CricketMatch');
const mongoose = require('mongoose');

// Get all cricket teams
const getAllTeams = async (req, res) => {
  try {
    const teams = await CricketTeam.find({ isActive: true })
      .sort({ createdAt: -1 })
      .select('-__v');

    res.status(200).json({
      success: true,
      count: teams.length,
      data: teams
    });
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch teams',
      error: error.message
    });
  }
};

// Get single team by ID
const getTeamById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid team ID format'
      });
    }

    const team = await CricketTeam.findOne({ 
      _id: id, 
      isActive: true 
    }).select('-__v');

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    res.status(200).json({
      success: true,
      data: team
    });
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch team',
      error: error.message
    });
  }
};

// Create new cricket team
const createTeam = async (req, res) => {
  try {
    const {
      name,
      shortName,
      captain,
      coach,
      established,
      homeGround,
      contactEmail,
      contactPhone,
      logo
    } = req.body;

    // Validation
    if (!name || !shortName || !captain || !coach || !established || !homeGround || !contactEmail || !contactPhone) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    // Check if team with same name or shortName already exists
    const existingTeam = await CricketTeam.findOne({
      $or: [
        { name: name.trim() },
        { shortName: shortName.trim().toUpperCase() }
      ],
      isActive: true
    });

    if (existingTeam) {
      return res.status(409).json({
        success: false,
        message: 'Team with this name or short name already exists'
      });
    }

    // Get superadmin ID from request (should be set by auth middleware)
    const createdBy = req.superadmin?.id || new mongoose.Types.ObjectId();

    const newTeam = new CricketTeam({
      name: name.trim(),
      shortName: shortName.trim().toUpperCase(),
      captain: captain.trim(),
      coach: coach.trim(),
      established,
      homeGround: homeGround.trim(),
      contactEmail: contactEmail.trim().toLowerCase(),
      contactPhone: contactPhone.trim(),
      logo: logo || null,
      createdBy,
      players: [] // Start with empty players array
    });

    const savedTeam = await newTeam.save();

    res.status(201).json({
      success: true,
      message: 'Team created successfully',
      data: savedTeam
    });
  } catch (error) {
    console.error('Error creating team:', error);
    
    if (error.code === 11000) {
      // MongoDB duplicate key error
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        success: false,
        message: `Team with this ${field} already exists`
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create team',
      error: error.message
    });
  }
};

// Update team
const updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid team ID format'
      });
    }

    // Remove fields that shouldn't be updated directly
    delete updateData.players;
    delete updateData.createdBy;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const team = await CricketTeam.findOneAndUpdate(
      { _id: id, isActive: true },
      updateData,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Team updated successfully',
      data: team
    });
  } catch (error) {
    console.error('Error updating team:', error);
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        success: false,
        message: `Team with this ${field} already exists`
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update team',
      error: error.message
    });
  }
};

// Delete team (soft delete)
const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid team ID format'
      });
    }

    const team = await CricketTeam.findOneAndUpdate(
      { _id: id, isActive: true },
      { isActive: false },
      { new: true }
    );

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Team deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting team:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete team',
      error: error.message
    });
  }
};

// Add player to team
const addPlayer = async (req, res) => {
  try {
    const { teamId } = req.params;
    const playerData = req.body;

    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid team ID format'
      });
    }

    // Validation
    const requiredFields = ['name', 'role', 'age', 'jerseyNumber', 'experience'];
    for (const field of requiredFields) {
      if (!playerData[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`
        });
      }
    }

    const team = await CricketTeam.findOne({ _id: teamId, isActive: true });

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Check team size limit
    if (team.players.length >= 15) {
      return res.status(400).json({
        success: false,
        message: 'Team cannot have more than 15 players'
      });
    }

    // Check if jersey number is already taken
    const existingJersey = team.players.find(p => p.jerseyNumber === parseInt(playerData.jerseyNumber));
    if (existingJersey) {
      return res.status(409).json({
        success: false,
        message: `Jersey number ${playerData.jerseyNumber} is already taken`
      });
    }

    // Prepare player data
    const newPlayer = {
      name: playerData.name.trim(),
      role: playerData.role,
      age: parseInt(playerData.age),
      jerseyNumber: parseInt(playerData.jerseyNumber),
      contactPhone: playerData.contactPhone?.trim() || '',
      contactEmail: playerData.contactEmail?.trim().toLowerCase() || '',
      experience: playerData.experience.trim(),
      matches: playerData.matches || 0,
      runs: playerData.runs || 0,
      wickets: playerData.wickets || 0,
      catches: playerData.catches || 0,
      stumps: playerData.stumps || 0,
      average: playerData.average || 0,
      strikeRate: playerData.strikeRate || 0,
      economy: playerData.economy || 0,
      photo: playerData.photo || null
    };

    team.players.push(newPlayer);
    const savedTeam = await team.save();

    // Get the newly added player
    const addedPlayer = savedTeam.players[savedTeam.players.length - 1];

    res.status(201).json({
      success: true,
      message: 'Player added successfully',
      data: {
        team: savedTeam,
        player: addedPlayer
      }
    });
  } catch (error) {
    console.error('Error adding player:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add player',
      error: error.message
    });
  }
};

// Update player
const updatePlayer = async (req, res) => {
  try {
    const { teamId, playerId } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid team ID format'
      });
    }

    const team = await CricketTeam.findOne({ _id: teamId, isActive: true });

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    const playerIndex = team.players.findIndex(p => p._id.toString() === playerId);

    if (playerIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Player not found'
      });
    }

    // If updating jersey number, check if it's unique
    if (updateData.jerseyNumber && updateData.jerseyNumber !== team.players[playerIndex].jerseyNumber) {
      const existingJersey = team.players.find((p, index) => 
        index !== playerIndex && p.jerseyNumber === parseInt(updateData.jerseyNumber)
      );
      if (existingJersey) {
        return res.status(409).json({
          success: false,
          message: `Jersey number ${updateData.jerseyNumber} is already taken`
        });
      }
    }

    // Update player data
    const allowedFields = [
      'name', 'role', 'age', 'jerseyNumber', 'contactPhone', 'contactEmail', 
      'experience', 'matches', 'runs', 'wickets', 'catches', 'stumps', 
      'average', 'strikeRate', 'economy', 'photo', 'isActive'
    ];

    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        if (field === 'age' || field === 'jerseyNumber' || field === 'matches' || 
            field === 'runs' || field === 'wickets' || field === 'catches' || 
            field === 'stumps') {
          team.players[playerIndex][field] = parseInt(updateData[field]) || 0;
        } else if (field === 'average' || field === 'strikeRate' || field === 'economy') {
          team.players[playerIndex][field] = parseFloat(updateData[field]) || 0;
        } else if (field === 'contactEmail') {
          team.players[playerIndex][field] = updateData[field]?.trim().toLowerCase() || '';
        } else if (typeof updateData[field] === 'string') {
          team.players[playerIndex][field] = updateData[field].trim();
        } else {
          team.players[playerIndex][field] = updateData[field];
        }
      }
    });

    const savedTeam = await team.save();

    res.status(200).json({
      success: true,
      message: 'Player updated successfully',
      data: {
        team: savedTeam,
        player: savedTeam.players[playerIndex]
      }
    });
  } catch (error) {
    console.error('Error updating player:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update player',
      error: error.message
    });
  }
};

// Delete player
const deletePlayer = async (req, res) => {
  try {
    const { teamId, playerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid team ID format'
      });
    }

    const team = await CricketTeam.findOne({ _id: teamId, isActive: true });

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    const playerIndex = team.players.findIndex(p => p._id.toString() === playerId);

    if (playerIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Player not found'
      });
    }

    // Remove player
    team.players.splice(playerIndex, 1);
    const savedTeam = await team.save();

    res.status(200).json({
      success: true,
      message: 'Player deleted successfully',
      data: savedTeam
    });
  } catch (error) {
    console.error('Error deleting player:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete player',
      error: error.message
    });
  }
};

// Upload team logo
const uploadTeamLogo = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { logo } = req.body;

    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid team ID format'
      });
    }

    if (!logo) {
      return res.status(400).json({
        success: false,
        message: 'Logo data is required'
      });
    }

    const team = await CricketTeam.findOneAndUpdate(
      { _id: teamId, isActive: true },
      { logo },
      { new: true }
    ).select('-__v');

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Team logo uploaded successfully',
      data: team
    });
  } catch (error) {
    console.error('Error uploading team logo:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload team logo',
      error: error.message
    });
  }
};

// Upload player photo
const uploadPlayerPhoto = async (req, res) => {
  try {
    const { teamId, playerId } = req.params;
    const { photo } = req.body;

    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid team ID format'
      });
    }

    if (!photo) {
      return res.status(400).json({
        success: false,
        message: 'Photo data is required'
      });
    }

    const team = await CricketTeam.findOne({ _id: teamId, isActive: true });

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    const playerIndex = team.players.findIndex(p => p._id.toString() === playerId);

    if (playerIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Player not found'
      });
    }

    // Update player photo
    team.players[playerIndex].photo = photo;
    const savedTeam = await team.save();

    res.status(200).json({
      success: true,
      message: 'Player photo uploaded successfully',
      data: {
        team: savedTeam,
        player: savedTeam.players[playerIndex]
      }
    });
  } catch (error) {
    console.error('Error uploading player photo:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload player photo',
      error: error.message
    });
  }
};

// Get team statistics
const getTeamStats = async (req, res) => {
  try {
    const totalTeams = await CricketTeam.countDocuments({ isActive: true });
    const totalPlayers = await CricketTeam.aggregate([
      { $match: { isActive: true } },
      { $project: { playerCount: { $size: '$players' } } },
      { $group: { _id: null, total: { $sum: '$playerCount' } } }
    ]);

    const stats = {
      totalTeams,
      totalPlayers: totalPlayers[0]?.total || 0,
      averagePlayersPerTeam: totalTeams > 0 ? Math.round((totalPlayers[0]?.total || 0) / totalTeams) : 0
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching team stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch team statistics',
      error: error.message
    });
  }
};

module.exports = {
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
  // Matches
  getAllMatches: async (req, res) => {
    try {
      const matches = await CricketMatch.find({ isActive: true })
        .sort({ date: -1, createdAt: -1 })
        .populate('teamA', 'name shortName')
        .populate('teamB', 'name shortName')
        .select('-__v');

      res.status(200).json({ success: true, count: matches.length, data: matches });
    } catch (error) {
      console.error('Error fetching matches:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch matches', error: error.message });
    }
  },
  getMatchById: async (req, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid match ID format' });
      }

      const match = await CricketMatch.findOne({ _id: id, isActive: true })
        .populate('teamA', 'name shortName players')
        .populate('teamB', 'name shortName players')
        .select('-__v');

      if (!match) {
        return res.status(404).json({ success: false, message: 'Match not found' });
      }

      res.status(200).json({ success: true, data: match });
    } catch (error) {
      console.error('Error fetching match:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch match', error: error.message });
    }
  },
  createMatch: async (req, res) => {
    try {
      const { teamA, teamB, date, venue, matchType, overs } = req.body;

      if (!teamA || !teamB || !date) {
        return res.status(400).json({ success: false, message: 'teamA, teamB and date are required' });
      }
      if (!mongoose.Types.ObjectId.isValid(teamA) || !mongoose.Types.ObjectId.isValid(teamB)) {
        return res.status(400).json({ success: false, message: 'Invalid team id(s)' });
      }
      if (teamA === teamB) {
        return res.status(400).json({ success: false, message: 'Teams must be different' });
      }

      const [tA, tB] = await Promise.all([
        CricketTeam.findById(teamA).select('_id'),
        CricketTeam.findById(teamB).select('_id')
      ]);
      if (!tA || !tB) return res.status(404).json({ success: false, message: 'One or both teams not found' });

      const createdBy = req.superadmin?.id || undefined;
      
      const matchData = { 
        teamA, 
        teamB, 
        date: new Date(date), 
        venue: venue?.trim() || '', 
        status: 'scheduled', 
        createdBy 
      };
      
      // Add matchType and overs if provided
      if (matchType) matchData.matchType = matchType;
      if (overs) matchData.overs = overs;
      
      const match = await CricketMatch.create(matchData);

      const populated = await CricketMatch.findById(match._id)
        .populate('teamA', 'name shortName')
        .populate('teamB', 'name shortName');

      res.status(201).json({ success: true, message: 'Match scheduled', data: populated });
    } catch (error) {
      console.error('Error creating match:', error);
      res.status(500).json({ success: false, message: 'Failed to create match', error: error.message });
    }
  },
  updateMatchScore: async (req, res) => {
    try {
      const { id } = req.params;
      const { teamA, teamB, overs, status, result } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid match id' });
      }

      const match = await CricketMatch.findById(id);
      if (!match || !match.isActive) {
        return res.status(404).json({ success: false, message: 'Match not found' });
      }

      // Merge score parts safely
      if (teamA && typeof teamA === 'object') {
        match.score.teamA = { ...match.score.teamA, ...teamA };
      }
      if (teamB && typeof teamB === 'object') {
        match.score.teamB = { ...match.score.teamB, ...teamB };
      }
      if (overs !== undefined) {
        match.score.overs = String(overs);
      }
      if (status) match.status = status;
      if (result !== undefined) match.result = result;

      await match.save();
      
      // Re-fetch the match with populated fields
      const populated = await CricketMatch.findById(match._id)
        .populate('teamA', 'name shortName')
        .populate('teamB', 'name shortName');

      res.status(200).json({ success: true, message: 'Score updated', data: populated });
    } catch (error) {
      console.error('Error updating score:', error);
      res.status(500).json({ success: false, message: 'Failed to update match score', error: error.message });
    }
  },
  updateMatch: async (req, res) => {
    try {
      const { id } = req.params;
      const { teamA, teamB, date, venue, matchType, overs, status } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid match ID format' });
      }

      const match = await CricketMatch.findOne({ _id: id, isActive: true });
      if (!match) {
        return res.status(404).json({ success: false, message: 'Match not found' });
      }

      // Validate teams if being updated
      if (teamA && teamB && teamA === teamB) {
        return res.status(400).json({ success: false, message: 'Teams must be different' });
      }

      // Update fields
      if (teamA) {
        if (!mongoose.Types.ObjectId.isValid(teamA)) {
          return res.status(400).json({ success: false, message: 'Invalid team A ID' });
        }
        const tA = await CricketTeam.findById(teamA);
        if (!tA) return res.status(404).json({ success: false, message: 'Team A not found' });
        match.teamA = teamA;
      }

      if (teamB) {
        if (!mongoose.Types.ObjectId.isValid(teamB)) {
          return res.status(400).json({ success: false, message: 'Invalid team B ID' });
        }
        const tB = await CricketTeam.findById(teamB);
        if (!tB) return res.status(404).json({ success: false, message: 'Team B not found' });
        match.teamB = teamB;
      }

      if (date) match.date = new Date(date);
      if (venue !== undefined) match.venue = venue.trim();
      if (matchType) match.matchType = matchType;
      if (overs) match.overs = overs;
      if (status) match.status = status;

      match.updatedAt = new Date();
      await match.save();

      const populated = await CricketMatch.findById(match._id)
        .populate('teamA', 'name shortName')
        .populate('teamB', 'name shortName');

      res.status(200).json({ 
        success: true, 
        message: 'Match updated successfully', 
        data: populated 
      });
    } catch (error) {
      console.error('Error updating match:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to update match', 
        error: error.message 
      });
    }
  },
  deleteMatch: async (req, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid match ID format' });
      }

      const match = await CricketMatch.findOne({ _id: id, isActive: true });
      if (!match) {
        return res.status(404).json({ success: false, message: 'Match not found' });
      }

      // Soft delete
      match.isActive = false;
      match.updatedAt = new Date();
      await match.save();

      res.status(200).json({ 
        success: true, 
        message: 'Match deleted successfully' 
      });
    } catch (error) {
      console.error('Error deleting match:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to delete match', 
        error: error.message 
      });
    }
  }
};
