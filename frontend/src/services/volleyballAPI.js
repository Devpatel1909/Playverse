// Volleyball API Service for Frontend
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api';

class VolleyballAPIService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/volleyball`;
  }

  // Helper method to get auth token
  getAuthToken() {
    return localStorage.getItem('superadmin_token');
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

    return headers;
  }

  // Helper method to handle API responses
  async handleResponse(response) {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  }

  // Team Management APIs
  async getAllTeams() {
    const url = `${this.baseURL}/teams`;
    try {
      if (import.meta.env.DEV) console.debug('[VolleyballAPI] GET', url);
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
      const response = await fetch(`${this.baseURL}/teams/${teamId}/players`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(playerData)
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Failed to add player:', error);
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
    const requiredFields = ['name', 'role', 'age', 'experience'];
    const missingFields = requiredFields.filter(field => !playerData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Age validation
    if (playerData.age < 14 || playerData.age > 40) {
      throw new Error('Player age must be between 14 and 40');
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

  async createSubadmin(teamId, creds) {
    try {
      const res = await fetch(`${this.baseUrl}/volleyball/teams/${teamId}/subadmins`, {
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
const volleyballAPIService = new VolleyballAPIService();
export default volleyballAPIService;
