// Cricket API Service for Frontend
// Normalize base URL so whether user sets http://localhost:5000 or http://localhost:5000/api it works.
const RAW_API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_BASE_URL = /\/api\/?$/.test(RAW_API_BASE)
  ? RAW_API_BASE.replace(/\/$/, '')
  : RAW_API_BASE.replace(/\/$/, '') + '/api';

console.log('[CricketAPI] Configuration:', {
  RAW_API_BASE,
  API_BASE_URL,
  VITE_API_URL: import.meta.env.VITE_API_URL
});

class CricketAPIService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/cricket`;
    console.log('[CricketAPI] Base URL:', this.baseURL);
  }

  // Helper method to get auth token
  getAuthToken() {
    // Try both token keys - authToken (used by admin login) and superadmin_token (used by superadmin)
    return localStorage.getItem('authToken') || localStorage.getItem('superadmin_token');
  }

  // Helper method to create headers
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    const token = this.getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    console.log('[CricketAPI] Headers:', { 
      ...headers, 
      Authorization: token ? `Bearer ${token.substring(0, 20)}...` : 'No token' 
    });

    return headers;
  }

  // Helper method to handle API responses
  async handleResponse(response) {
    let data;
    const contentType = response.headers.get('content-type');
    
    // Clone response to avoid consuming it
    const clonedResponse = response.clone();
    
    if (contentType && contentType.includes('application/json')) {
      try {
        data = await clonedResponse.json();
      } catch (e) {
        console.error('[CricketAPI] Failed to parse JSON:', e);
        const text = await response.text();
        console.error('[CricketAPI] Response text:', text);
        data = { message: text || 'Failed to parse response' };
      }
    } else {
      // If response is not JSON, get text content
      const text = await clonedResponse.text();
      console.error('[CricketAPI] Non-JSON response:', { status: response.status, text });
      data = { message: text || 'Unknown error' };
    }
    
    if (!response.ok) {
      console.error('[CricketAPI] API Error Details:', { 
        status: response.status, 
        statusText: response.statusText,
        url: response.url,
        data,
        fullResponse: data
      });
      
      // More detailed error message
      const errorMessage = data?.message || data?.error || response.statusText || 'Unknown error';
      throw new Error(errorMessage);
    }
    
    return data;
  }

  // Team Management APIs
  async getAllTeams() {
    const url = `${this.baseURL}/teams`;
    try {
      if (import.meta.env.DEV) console.debug('[CricketAPI] GET', url);
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Failed to fetch teams:', error, 'URL:', url);
      throw error;
    }
  }

  async getTeamById(teamId) {
    try {
      const response = await fetch(`${this.baseURL}/teams/${teamId}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Failed to fetch team:', error);
      throw error;
    }
  }

  async createTeam(teamData) {
    try {
      const response = await fetch(`${this.baseURL}/teams`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(teamData)
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Failed to create team:', error);
      throw error;
    }
  }

  async updateTeam(teamId, teamData) {
    try {
      const response = await fetch(`${this.baseURL}/teams/${teamId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(teamData)
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Failed to update team:', error);
      throw error;
    }
  }

  async deleteTeam(teamId) {
    try {
      const response = await fetch(`${this.baseURL}/teams/${teamId}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Failed to delete team:', error);
      throw error;
    }
  }

  async uploadTeamLogo(teamId, logoData) {
    try {
      const response = await fetch(`${this.baseURL}/teams/${teamId}/logo`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify({ logo: logoData })
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Failed to upload team logo:', error);
      throw error;
    }
  }

  // Player Management APIs
  async addPlayer(teamId, playerData) {
    try {
      console.log('[CricketAPI] Adding player to team:', teamId);
      console.log('[CricketAPI] Player data:', playerData);
      
      const url = `${this.baseURL}/teams/${teamId}/players`;
      console.log('[CricketAPI] POST URL:', url);
      
      const headers = this.getHeaders();
      console.log('[CricketAPI] Request headers:', headers);
      
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(playerData)
      });
      
      console.log('[CricketAPI] Response status:', response.status);
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('[CricketAPI] Failed to add player:', error);
      throw error;
    }
  }

  async updatePlayer(teamId, playerId, playerData) {
    try {
      const response = await fetch(`${this.baseURL}/teams/${teamId}/players/${playerId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(playerData)
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Failed to update player:', error);
      throw error;
    }
  }

  async deletePlayer(teamId, playerId) {
    try {
      const response = await fetch(`${this.baseURL}/teams/${teamId}/players/${playerId}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Failed to delete player:', error);
      throw error;
    }
  }

  async uploadPlayerPhoto(teamId, playerId, photoData) {
    try {
      const response = await fetch(`${this.baseURL}/teams/${teamId}/players/${playerId}/photo`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify({ photo: photoData })
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Failed to upload player photo:', error);
      throw error;
    }
  }

  // Statistics APIs
  async getTeamStats() {
    try {
      const response = await fetch(`${this.baseURL}/teams/stats`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Failed to fetch team stats:', error);
      throw error;
    }
  }

  // Match Management APIs
  async getAllMatches() {
    try {
      console.log('[CricketAPI] Fetching all matches...');
      const response = await fetch(`${this.baseURL}/matches`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      const result = await this.handleResponse(response);
      console.log('[CricketAPI] Matches fetched successfully:', result);
      return result;
    } catch (error) {
      console.error('Failed to fetch matches:', error);
      throw error;
    }
  }

  async createMatch(matchData) {
    try {
      console.log('[CricketAPI] Creating match with data:', matchData);
      
      // Validate match data before sending
      this.validateMatchData(matchData);
      
      // Ensure required fields are present
      const payload = {
        teamA: matchData.teamA,
        teamB: matchData.teamB,
        date: matchData.date,
        venue: matchData.venue,
        matchType: matchData.matchType || 'T20',
        overs: matchData.overs || 20,
        status: 'scheduled',
        ...matchData // Include any additional fields
      };
      
      const url = `${this.baseURL}/matches`;
      const headers = this.getHeaders();
      
      console.log('[CricketAPI] POST Request:', {
        url,
        headers,
        payload
      });
      
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });
      
      console.log('[CricketAPI] Response status:', response.status);
      console.log('[CricketAPI] Response headers:', [...response.headers.entries()]);
      
      // Log response text before parsing to see what backend returns
      const responseText = await response.text();
      console.log('[CricketAPI] Raw response:', responseText);
      
      // Create a new Response object since we already consumed the original
      const newResponse = new Response(responseText, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      });
      
      const result = await this.handleResponse(newResponse);
      console.log('[CricketAPI] Match created successfully:', result);
      return result;
    } catch (error) {
      console.error('Failed to create match:', error);
      throw error;
    }
  }

  async getMatchById(matchId) {
    try {
      console.log('[CricketAPI] Fetching match by ID:', matchId);
      const response = await fetch(`${this.baseURL}/matches/${matchId}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      const result = await this.handleResponse(response);
      console.log('[CricketAPI] Match fetched successfully:', result);
      return result;
    } catch (error) {
      console.error('Failed to fetch match:', error);
      throw error;
    }
  }

  async updateMatch(matchId, updateData) {
    try {
      console.log('[CricketAPI] Updating match:', matchId, updateData);
      const response = await fetch(`${this.baseURL}/matches/${matchId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(updateData)
      });
      const result = await this.handleResponse(response);
      console.log('[CricketAPI] Match updated successfully:', result);
      return result;
    } catch (error) {
      console.error('Failed to update match:', error);
      throw error;
    }
  }

  async deleteMatch(matchId) {
    try {
      console.log('[CricketAPI] Deleting match:', matchId);
      const response = await fetch(`${this.baseURL}/matches/${matchId}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      const result = await this.handleResponse(response);
      console.log('[CricketAPI] Match deleted successfully:', result);
      return result;
    } catch (error) {
      console.error('Failed to delete match:', error);
      throw error;
    }
  }

  async updateMatchScore(matchId, scoreData) {
    try {
      const response = await fetch(`${this.baseURL}/matches/${matchId}/score`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(scoreData)
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Failed to update match score:', error);
      throw error;
    }
  }

  async updatePlayerStats(matchId, playerStats) {
    try {
      const response = await fetch(`${this.baseURL}/matches/${matchId}/players/stats`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify({ playerStats })
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Failed to update player stats:', error);
      throw error;
    }
  }

  // Utility method to convert file to base64
  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  // Validation helpers
  validateTeamData(teamData) {
    const requiredFields = ['name', 'shortName', 'captain', 'coach', 'established', 'homeGround', 'contactEmail', 'contactPhone'];
    const missingFields = requiredFields.filter(field => !teamData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(teamData.contactEmail)) {
      throw new Error('Invalid email format');
    }

    // Short name length validation
    if (teamData.shortName.length > 10) {
      throw new Error('Short name must be 10 characters or less');
    }

    return true;
  }

  validatePlayerData(playerData) {
    const requiredFields = ['name', 'role', 'age', 'jerseyNumber', 'experience'];
    const missingFields = requiredFields.filter(field => !playerData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Age validation
    if (playerData.age < 16 || playerData.age > 45) {
      throw new Error('Player age must be between 16 and 45');
    }

    // Jersey number validation
    if (playerData.jerseyNumber < 1 || playerData.jerseyNumber > 99) {
      throw new Error('Jersey number must be between 1 and 99');
    }

    // Email validation if provided
    if (playerData.contactEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(playerData.contactEmail)) {
        throw new Error('Invalid email format');
      }
    }

    return true;
  }

  validateSubadminData(data) {
    if (!data || !data.username || !data.password) {
      throw new Error('Subadmin username & password required');
    }
    if (data.password.length < 6) throw new Error('Password min 6 chars');
    return true;
  }

  validateMatchData(matchData) {
    const requiredFields = ['teamA', 'teamB', 'date', 'venue'];
    const missingFields = requiredFields.filter(field => !matchData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Date validation
    const matchDate = new Date(matchData.date);
    if (isNaN(matchDate.getTime())) {
      throw new Error('Invalid date format');
    }

    // Check if match date is in the past
    if (matchDate < new Date().setHours(0, 0, 0, 0)) {
      throw new Error('Match date cannot be in the past');
    }

    // Team validation
    if (matchData.teamA === matchData.teamB) {
      throw new Error('Teams cannot be the same');
    }

    // Overs validation for limited overs matches
    if (matchData.matchType && matchData.matchType !== 'Test') {
      if (!matchData.overs || matchData.overs < 1 || matchData.overs > 50) {
        throw new Error('Overs must be between 1 and 50 for limited overs matches');
      }
    }

    return true;
  }

  async createSubadmin(teamId, creds) {
    try {
      const res = await fetch(`${this.baseUrl}/cricket/teams/${teamId}/subadmins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(this.authHeader||{}) },
        body: JSON.stringify(creds)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data;
    } catch (e) {
      console.warn('Subadmin API failed, fallback local:', e.message);
      return { success: false, error: e.message };
    }
  }
}

// Create and export a singleton instance
const cricketAPIService = new CricketAPIService();
export default cricketAPIService;
