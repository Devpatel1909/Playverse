// Public Score API Service - No authentication required
class PublicScoreAPIService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  }

  // Helper method to handle API responses
  async handleResponse(response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Get all live matches across all sports
  async getLiveMatches(sport = null) {
    try {
      const url = sport 
        ? `${this.baseURL}/public/live-matches?sport=${encodeURIComponent(sport)}`
        : `${this.baseURL}/public/live-matches`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching live matches:', error);
      throw error;
    }
  }

  // Get recent completed matches
  async getRecentMatches(sport = null, limit = 10) {
    try {
      const params = new URLSearchParams();
      if (sport) params.append('sport', sport);
      params.append('limit', limit.toString());
      
      const response = await fetch(`${this.baseURL}/public/recent-matches?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching recent matches:', error);
      throw error;
    }
  }

  // Get upcoming matches
  async getUpcomingMatches(sport = null, limit = 10) {
    try {
      const params = new URLSearchParams();
      if (sport) params.append('sport', sport);
      params.append('limit', limit.toString());
      
      const response = await fetch(`${this.baseURL}/public/upcoming-matches?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching upcoming matches:', error);
      throw error;
    }
  }

  // Get specific match details by ID
  async getMatchDetails(matchId) {
    try {
      const response = await fetch(`${this.baseURL}/public/match/${matchId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching match details:', error);
      throw error;
    }
  }

  // Get live cricket match ball-by-ball commentary
  async getCricketCommentary(matchId) {
    try {
      const response = await fetch(`${this.baseURL}/public/cricket/commentary/${matchId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching cricket commentary:', error);
      throw error;
    }
  }

  // Get team standings/rankings
  async getTeamStandings(sport) {
    try {
      const response = await fetch(`${this.baseURL}/public/standings/${sport}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching team standings:', error);
      throw error;
    }
  }

  // Get sports statistics
  async getSportsStatistics() {
    try {
      const response = await fetch(`${this.baseURL}/public/statistics`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching sports statistics:', error);
      throw error;
    }
  }

  // Search matches by team name or tournament
  async searchMatches(query, sport = null) {
    try {
      const params = new URLSearchParams();
      params.append('q', query);
      if (sport) params.append('sport', sport);
      
      const response = await fetch(`${this.baseURL}/public/search?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error searching matches:', error);
      throw error;
    }
  }

  // Get available sports list
  async getAvailableSports() {
    try {
      const response = await fetch(`${this.baseURL}/public/sports`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching available sports:', error);
      throw error;
    }
  }

  // Subscribe to live score updates (WebSocket)
  subscribeToLiveUpdates(matchId, onUpdate, onError) {
    try {
      const wsUrl = `${this.baseURL.replace('http', 'ws')}/public/live-updates/${matchId}`;
      const ws = new WebSocket(wsUrl);
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onUpdate(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
          onError(error);
        }
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        onError(error);
      };
      
      ws.onclose = () => {
        console.log('WebSocket connection closed');
      };
      
      return ws;
    } catch (error) {
      console.error('Error setting up WebSocket:', error);
      onError(error);
      return null;
    }
  }

  // Utility method to format match time
  formatMatchTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    
    return date.toLocaleDateString();
  }

  // Utility method to get match status color
  getMatchStatusColor(status) {
    const statusColors = {
      'live': 'red',
      'completed': 'green',
      'upcoming': 'blue',
      'postponed': 'yellow',
      'cancelled': 'gray'
    };
    
    return statusColors[status.toLowerCase()] || 'gray';
  }

  // Mock data generator for development/testing
  generateMockLiveMatches() {
    return [
      {
        id: 1,
        sport: 'Cricket',
        team1: 'Mumbai Indians',
        team2: 'Chennai Super Kings',
        score1: '185/4',
        score2: '120/3',
        overs1: '20.0',
        overs2: '15.2',
        status: 'live',
        venue: 'Wankhede Stadium',
        tournament: 'IPL 2024',
        currentBatsman: {
          striker: 'MS Dhoni',
          strikerRuns: 45,
          nonStriker: 'Ravindra Jadeja',
          nonStrikerRuns: 23
        },
        currentBowler: {
          name: 'Jasprit Bumrah',
          overs: '3.2',
          maidens: 0,
          runs: 28,
          wickets: 1
        }
      },
      {
        id: 2,
        sport: 'Football',
        team1: 'Barcelona',
        team2: 'Real Madrid',
        score1: '2',
        score2: '1',
        status: 'live',
        time: '78\'',
        venue: 'Camp Nou',
        tournament: 'La Liga'
      }
    ];
  }

  generateMockRecentMatches() {
    return [
      {
        id: 3,
        sport: 'Cricket',
        team1: 'India',
        team2: 'Australia',
        score1: '295/8',
        score2: '287/10',
        overs1: '50.0',
        overs2: '49.3',
        status: 'completed',
        result: 'India won by 8 runs',
        venue: 'MCG',
        tournament: 'ODI Series'
      },
      {
        id: 4,
        sport: 'Basketball',
        team1: 'Lakers',
        team2: 'Warriors',
        score1: '108',
        score2: '112',
        status: 'completed',
        result: 'Warriors won',
        venue: 'Staples Center',
        tournament: 'NBA Regular Season'
      }
    ];
  }
}

// Export singleton instance
const publicScoreAPI = new PublicScoreAPIService();
export default publicScoreAPI;