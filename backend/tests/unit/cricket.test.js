const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../index');
const CricketTeam = require('../../models/CricketTeam');

describe('Cricket API Endpoints', () => {
  let testTeamId;
  let testPlayerId;
  
  beforeAll(async () => {
    // Connect to test database
    const mongoUri = process.env.MONGO_TEST_URI || 'mongodb://localhost:27017/cricket_test';
    await mongoose.connect(mongoUri);
  });

  beforeEach(async () => {
    // Clean up database before each test
    await CricketTeam.deleteMany({});
    
    // Create a test team
    const testTeam = new CricketTeam({
      name: 'Test Team',
      shortName: 'TT',
      captain: 'Test Captain',
      coach: 'Test Coach',
      established: '2020',
      homeGround: 'Test Ground',
      contactEmail: 'test@example.com',
      contactPhone: '+1234567890'
    });
    
    const savedTeam = await testTeam.save();
    testTeamId = savedTeam._id;
  });

  afterAll(async () => {
    // Clean up and close connection
    await CricketTeam.deleteMany({});
    await mongoose.connection.close();
  });

  describe('Team Management', () => {
    it('should create a new cricket team', async () => {
      const teamData = {
        name: 'New Test Team',
        shortName: 'NTT',
        captain: 'New Captain',
        coach: 'New Coach',
        established: '2021',
        homeGround: 'New Ground',
        contactEmail: 'new@example.com',
        contactPhone: '+1234567891'
      };

      const response = await request(app)
        .post('/api/cricket/teams')
        .send(teamData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(teamData.name);
      expect(response.body.data.players).toHaveLength(0);
    });

    it('should get all cricket teams', async () => {
      const response = await request(app)
        .get('/api/cricket/teams')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.teams).toHaveLength(1);
      expect(response.body.data.teams[0].name).toBe('Test Team');
    });

    it('should get a specific team by ID', async () => {
      const response = await request(app)
        .get(`/api/cricket/teams/${testTeamId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Test Team');
    });

    it('should update a team', async () => {
      const updateData = {
        name: 'Updated Test Team',
        captain: 'Updated Captain'
      };

      const response = await request(app)
        .put(`/api/cricket/teams/${testTeamId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Updated Test Team');
      expect(response.body.data.captain).toBe('Updated Captain');
    });

    it('should delete a team', async () => {
      const response = await request(app)
        .delete(`/api/cricket/teams/${testTeamId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('deleted successfully');
    });

    it('should return 404 for non-existent team', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .get(`/api/cricket/teams/${nonExistentId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });
  });

  describe('Player Management', () => {
    beforeEach(async () => {
      // Add a test player to the team
      const team = await CricketTeam.findById(testTeamId);
      team.players.push({
        name: 'Test Player',
        role: 'Batsman',
        age: 25,
        jerseyNumber: 10,
        experience: '2 years'
      });
      await team.save();
      testPlayerId = team.players[0]._id;
    });

    it('should add a player to a team', async () => {
      const playerData = {
        name: 'New Player',
        role: 'Bowler',
        age: 28,
        jerseyNumber: 11,
        experience: '3 years'
      };

      const response = await request(app)
        .post(`/api/cricket/teams/${testTeamId}/players`)
        .send(playerData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('New Player');
      expect(response.body.data.jerseyNumber).toBe(11);
    });

    it('should get all players of a team', async () => {
      const response = await request(app)
        .get(`/api/cricket/teams/${testTeamId}/players`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.players).toHaveLength(1);
      expect(response.body.data.players[0].name).toBe('Test Player');
    });

    it('should get a specific player', async () => {
      const response = await request(app)
        .get(`/api/cricket/teams/${testTeamId}/players/${testPlayerId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Test Player');
    });

    it('should update a player', async () => {
      const updateData = {
        name: 'Updated Player',
        runs: 500,
        wickets: 5
      };

      const response = await request(app)
        .put(`/api/cricket/teams/${testTeamId}/players/${testPlayerId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Updated Player');
      expect(response.body.data.runs).toBe(500);
    });

    it('should delete a player', async () => {
      const response = await request(app)
        .delete(`/api/cricket/teams/${testTeamId}/players/${testPlayerId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('deleted successfully');
    });

    it('should not allow more than 15 players per team', async () => {
      const team = await CricketTeam.findById(testTeamId);
      
      // Add 14 more players (1 already exists)
      for (let i = 2; i <= 15; i++) {
        team.players.push({
          name: `Player ${i}`,
          role: 'Batsman',
          age: 25,
          jerseyNumber: i,
          experience: '1 year'
        });
      }
      await team.save();

      // Try to add 16th player
      const playerData = {
        name: 'Extra Player',
        role: 'Bowler',
        age: 26,
        jerseyNumber: 16,
        experience: '2 years'
      };

      const response = await request(app)
        .post(`/api/cricket/teams/${testTeamId}/players`)
        .send(playerData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Maximum 15 players');
    });

    it('should not allow duplicate jersey numbers', async () => {
      const playerData = {
        name: 'Duplicate Jersey Player',
        role: 'All-rounder',
        age: 24,
        jerseyNumber: 10, // Same as existing player
        experience: '1 year'
      };

      const response = await request(app)
        .post(`/api/cricket/teams/${testTeamId}/players`)
        .send(playerData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Jersey number already exists');
    });
  });

  describe('Statistics', () => {
    it('should get team statistics', async () => {
      const response = await request(app)
        .get(`/api/cricket/teams/${testTeamId}/statistics`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('teamInfo');
      expect(response.body.data).toHaveProperty('playerStats');
      expect(response.body.data).toHaveProperty('topPerformers');
    });

    it('should get overall statistics', async () => {
      const response = await request(app)
        .get('/api/cricket/statistics')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('overallStats');
      expect(response.body.data).toHaveProperty('teamStats');
      expect(response.body.data.overallStats.totalTeams).toBe(1);
    });
  });
});
