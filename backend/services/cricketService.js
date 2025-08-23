const CricketTeam = require('../models/CricketTeam');
const { uploadTeamLogo, uploadPlayerPhoto, deleteFile } = require('../utils/fileUpload');

class CricketService {
  // Team Services
  async createTeam(teamData) {
    // Check if team with same name exists
    const existingTeam = await CricketTeam.findOne({ name: teamData.name });
    if (existingTeam) {
      throw new Error('Team with this name already exists');
    }

    // Check if team with same short name exists
    const existingShortName = await CricketTeam.findOne({ shortName: teamData.shortName });
    if (existingShortName) {
      throw new Error('Team with this short name already exists');
    }

    // Handle logo upload if provided
    if (teamData.logo) {
      const logoPath = await uploadTeamLogo(teamData.logo, teamData.name);
      teamData.logo = logoPath;
    }

    const team = new CricketTeam(teamData);
    return await team.save();
  }

  async getAllTeams(page = 1, limit = 10, search = '') {
    const skip = (page - 1) * limit;
    let query = {};

    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { shortName: { $regex: search, $options: 'i' } },
          { captain: { $regex: search, $options: 'i' } },
          { coach: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const teams = await CricketTeam.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await CricketTeam.countDocuments(query);

    return {
      teams,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalTeams: total
    };
  }

  async getTeamById(teamId) {
    const team = await CricketTeam.findById(teamId);
    if (!team) {
      throw new Error('Team not found');
    }
    return team;
  }

  async updateTeam(teamId, updateData) {
    const team = await this.getTeamById(teamId);

    // Check for duplicate names if updating name or shortName
    if (updateData.name && updateData.name !== team.name) {
      const existingTeam = await CricketTeam.findOne({ 
        name: updateData.name, 
        _id: { $ne: teamId } 
      });
      if (existingTeam) {
        throw new Error('Team with this name already exists');
      }
    }

    if (updateData.shortName && updateData.shortName !== team.shortName) {
      const existingShortName = await CricketTeam.findOne({ 
        shortName: updateData.shortName, 
        _id: { $ne: teamId } 
      });
      if (existingShortName) {
        throw new Error('Team with this short name already exists');
      }
    }

    // Handle logo upload if provided
    if (updateData.logo) {
      // Delete old logo if exists
      if (team.logo) {
        await deleteFile(team.logo);
      }
      const logoPath = await uploadTeamLogo(updateData.logo, updateData.name || team.name);
      updateData.logo = logoPath;
    }

    Object.assign(team, updateData);
    return await team.save();
  }

  async deleteTeam(teamId) {
    const team = await this.getTeamById(teamId);
    
    // Delete team logo if exists
    if (team.logo) {
      await deleteFile(team.logo);
    }

    // Delete all player photos
    for (const player of team.players) {
      if (player.photo) {
        await deleteFile(player.photo);
      }
    }

    await CricketTeam.findByIdAndDelete(teamId);
    return { message: 'Team deleted successfully' };
  }

  // Player Services
  async addPlayer(teamId, playerData) {
    const team = await this.getTeamById(teamId);

    // Check if team already has 15 players
    if (team.players.length >= 15) {
      throw new Error('Cannot add more players. Maximum 15 players allowed per team.');
    }

    // Check for duplicate jersey number
    const existingJersey = team.players.find(p => p.jerseyNumber === playerData.jerseyNumber);
    if (existingJersey) {
      throw new Error('Jersey number already exists in this team');
    }

    // Handle photo upload if provided
    if (playerData.photo) {
      const photoPath = await uploadPlayerPhoto(playerData.photo, team.name, playerData.name);
      playerData.photo = photoPath;
    }

    team.players.push(playerData);
    const savedTeam = await team.save();
    
    // Return the newly added player
    return savedTeam.players[savedTeam.players.length - 1];
  }

  async getPlayer(teamId, playerId) {
    const team = await this.getTeamById(teamId);
    const player = team.players.id(playerId);
    
    if (!player) {
      throw new Error('Player not found');
    }
    
    return player;
  }

  async updatePlayer(teamId, playerId, updateData) {
    const team = await this.getTeamById(teamId);
    const player = team.players.id(playerId);
    
    if (!player) {
      throw new Error('Player not found');
    }

    // Check for duplicate jersey number if updating
    if (updateData.jerseyNumber && updateData.jerseyNumber !== player.jerseyNumber) {
      const existingJersey = team.players.find(p => 
        p.jerseyNumber === updateData.jerseyNumber && p._id.toString() !== playerId
      );
      if (existingJersey) {
        throw new Error('Jersey number already exists in this team');
      }
    }

    // Handle photo upload if provided
    if (updateData.photo) {
      // Delete old photo if exists
      if (player.photo) {
        await deleteFile(player.photo);
      }
      const photoPath = await uploadPlayerPhoto(
        updateData.photo, 
        team.name, 
        updateData.name || player.name
      );
      updateData.photo = photoPath;
    }

    // Update player data
    Object.assign(player, updateData);
    await team.save();
    
    return player;
  }

  async deletePlayer(teamId, playerId) {
    const team = await this.getTeamById(teamId);
    const player = team.players.id(playerId);
    
    if (!player) {
      throw new Error('Player not found');
    }

    // Delete player photo if exists
    if (player.photo) {
      await deleteFile(player.photo);
    }

    player.deleteOne();
    await team.save();
    
    return { message: 'Player deleted successfully' };
  }

  async getTeamPlayers(teamId, page = 1, limit = 15) {
    const team = await this.getTeamById(teamId);
    const skip = (page - 1) * limit;
    
    const players = team.players.slice(skip, skip + limit);
    const totalPlayers = team.players.length;
    
    return {
      players,
      totalPages: Math.ceil(totalPlayers / limit),
      currentPage: page,
      totalPlayers,
      teamName: team.name
    };
  }

  // Statistics Services
  async getTeamStatistics(teamId) {
    const team = await this.getTeamById(teamId);
    
    const stats = {
      teamInfo: {
        name: team.name,
        shortName: team.shortName,
        captain: team.captain,
        coach: team.coach,
        totalPlayers: team.players.length
      },
      playerStats: {
        totalRuns: team.players.reduce((sum, player) => sum + (player.runs || 0), 0),
        totalWickets: team.players.reduce((sum, player) => sum + (player.wickets || 0), 0),
        totalMatches: team.players.reduce((sum, player) => sum + (player.matches || 0), 0),
        totalCatches: team.players.reduce((sum, player) => sum + (player.catches || 0), 0),
        totalStumps: team.players.reduce((sum, player) => sum + (player.stumps || 0), 0)
      },
      topPerformers: {
        highestScorer: team.players.reduce((max, player) => 
          (player.runs || 0) > (max.runs || 0) ? player : max, team.players[0] || {}),
        highestWicketTaker: team.players.reduce((max, player) => 
          (player.wickets || 0) > (max.wickets || 0) ? player : max, team.players[0] || {}),
        bestAverage: team.players.reduce((max, player) => 
          (player.average || 0) > (max.average || 0) ? player : max, team.players[0] || {})
      }
    };
    
    return stats;
  }

  async getAllTeamsStatistics() {
    const teams = await CricketTeam.find({}, 'name shortName players');
    
    const overallStats = {
      totalTeams: teams.length,
      totalPlayers: teams.reduce((sum, team) => sum + team.players.length, 0),
      totalRuns: 0,
      totalWickets: 0,
      totalMatches: 0
    };
    
    const teamStats = teams.map(team => {
      const teamTotalRuns = team.players.reduce((sum, player) => sum + (player.runs || 0), 0);
      const teamTotalWickets = team.players.reduce((sum, player) => sum + (player.wickets || 0), 0);
      const teamTotalMatches = team.players.reduce((sum, player) => sum + (player.matches || 0), 0);
      
      overallStats.totalRuns += teamTotalRuns;
      overallStats.totalWickets += teamTotalWickets;
      overallStats.totalMatches += teamTotalMatches;
      
      return {
        teamId: team._id,
        name: team.name,
        shortName: team.shortName,
        playersCount: team.players.length,
        totalRuns: teamTotalRuns,
        totalWickets: teamTotalWickets,
        totalMatches: teamTotalMatches
      };
    });
    
    return {
      overallStats,
      teamStats
    };
  }
}

module.exports = new CricketService();
