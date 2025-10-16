// Cricket Scoring API Service
// Handles real-time cricket match scoring operations

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class CricketScoringAPIService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/cricket/scoring`;
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Helper method to handle API responses
  async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }
    return response.json();
  }

  // Get match data for scoring
  async getMatch(matchId) {
    try {
      const response = await fetch(`${this.baseURL}/matches/${matchId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching match:', error);
      throw error;
    }
  }

  // Get detailed match statistics
  async getMatchStats(matchId) {
    try {
      const response = await fetch(`${this.baseURL}/matches/${matchId}/stats`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching match stats:', error);
      throw error;
    }
  }

  // Record a ball (the main scoring function)
  async recordBall(matchId, ballData) {
    try {
      const response = await fetch(`${this.baseURL}/matches/${matchId}/ball`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(ballData)
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error recording ball:', error);
      throw error;
    }
  }

  // Update batsmen (switch or change batsman)
  async updateBatsmen(matchId, batsmenUpdate) {
    try {
      const response = await fetch(`${this.baseURL}/matches/${matchId}/batsmen`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(batsmenUpdate)
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error updating batsmen:', error);
      throw error;
    }
  }

  // Update bowler
  async updateBowler(matchId, bowlerUpdate) {
    try {
      const response = await fetch(`${this.baseURL}/matches/${matchId}/bowler`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(bowlerUpdate)
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error updating bowler:', error);
      throw error;
    }
  }

  // Complete an over
  async completeOver(matchId) {
    try {
      const response = await fetch(`${this.baseURL}/matches/${matchId}/complete-over`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error completing over:', error);
      throw error;
    }
  }

  // End innings
  async endInnings(matchId) {
    try {
      const response = await fetch(`${this.baseURL}/matches/${matchId}/end-innings`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error ending innings:', error);
      throw error;
    }
  }

  // End match
  async endMatch(matchId, result) {
    try {
      const response = await fetch(`${this.baseURL}/matches/${matchId}/end-match`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(result)
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error ending match:', error);
      throw error;
    }
  }

  // Undo last ball (error recovery)
  async undoLastBall(matchId) {
    try {
      const response = await fetch(`${this.baseURL}/matches/${matchId}/undo`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error undoing last ball:', error);
      throw error;
    }
  }

  // Update match details
  async updateMatchDetails(matchId, updates) {
    try {
      const response = await fetch(`${this.baseURL}/matches/${matchId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updates)
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error updating match details:', error);
      throw error;
    }
  }

  // Get ball-by-ball commentary
  async getCommentary(matchId, limit = 50) {
    try {
      const response = await fetch(`${this.baseURL}/matches/${matchId}/commentary?limit=${limit}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching commentary:', error);
      throw error;
    }
  }

  // Get innings scorecard
  async getInningsScorecard(matchId, inningsNumber) {
    try {
      const response = await fetch(`${this.baseURL}/matches/${matchId}/innings/${inningsNumber}/scorecard`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching innings scorecard:', error);
      throw error;
    }
  }

  // Start match (initialize scoring)
  async startMatch(matchId, startData) {
    try {
      const response = await fetch(`${this.baseURL}/matches/${matchId}/start`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(startData)
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error starting match:', error);
      throw error;
    }
  }

  // Pause/Resume match
  async pauseMatch(matchId) {
    try {
      const response = await fetch(`${this.baseURL}/matches/${matchId}/pause`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error pausing match:', error);
      throw error;
    }
  }

  async resumeMatch(matchId) {
    try {
      const response = await fetch(`${this.baseURL}/matches/${matchId}/resume`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error resuming match:', error);
      throw error;
    }
  }

  // Get live matches
  async getLiveMatches() {
    try {
      const response = await fetch(`${this.baseURL}/matches/live`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching live matches:', error);
      throw error;
    }
  }

  // Get match summary
  async getMatchSummary(matchId) {
    try {
      const response = await fetch(`${this.baseURL}/matches/${matchId}/summary`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching match summary:', error);
      throw error;
    }
  }

  // Record extras without a delivery (e.g., penalty runs)
  async recordExtras(matchId, extrasData) {
    try {
      const response = await fetch(`${this.baseURL}/matches/${matchId}/extras`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(extrasData)
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error recording extras:', error);
      throw error;
    }
  }

  // Update player statistics manually (for corrections)
  async updatePlayerStats(matchId, playerId, statsUpdate) {
    try {
      const response = await fetch(`${this.baseURL}/matches/${matchId}/players/${playerId}/stats`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(statsUpdate)
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error updating player stats:', error);
      throw error;
    }
  }

  // Undo the last ball recorded
  async undoBall(matchId, ballIndex = null) {
    try {
      const response = await fetch(`${this.baseURL}/matches/${matchId}/undo`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ ballIndex })
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error undoing ball:', error);
      throw error;
    }
  }

  // Get ball-by-ball data for a match
  async getBallByBallData(matchId) {
    try {
      const response = await fetch(`${this.baseURL}/matches/${matchId}/balls`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching ball-by-ball data:', error);
      throw error;
    }
  }

  // Get live commentary for a match
  async getLiveCommentary(matchId) {
    try {
      const response = await fetch(`${this.baseURL}/matches/${matchId}/commentary`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching commentary:', error);
      throw error;
    }
  }

  // Add manual commentary
  async addCommentary(matchId, comment) {
    try {
      const response = await fetch(`${this.baseURL}/matches/${matchId}/commentary`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ 
          comment, 
          timestamp: new Date().toISOString(),
          type: 'manual'
        })
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error adding commentary:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const cricketScoringAPIService = new CricketScoringAPIService();
export default cricketScoringAPIService;