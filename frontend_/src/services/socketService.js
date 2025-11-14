import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.listeners = new Map();
  }

  // Initialize socket connection
  connect() {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return this.socket;
    }

    const serverURL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001';
    
    this.socket = io(serverURL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    this.socket.on('connect', () => {
      console.log('Socket.IO connected:', this.socket.id);
      this.connected = true;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket.IO disconnected:', reason);
      this.connected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
    });

    return this.socket;
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
      this.listeners.clear();
    }
  }

  // Join a specific match room for real-time updates
  joinMatch(matchId) {
    if (!this.socket) this.connect();
    this.socket.emit('join-match', matchId);
    console.log(`Joined match room: ${matchId}`);
  }

  // Leave a match room
  leaveMatch(matchId) {
    if (this.socket) {
      this.socket.emit('leave-match', matchId);
      console.log(`Left match room: ${matchId}`);
    }
  }

  // Join a sport room for live matches
  joinSport(sport) {
    if (!this.socket) this.connect();
    this.socket.emit('join-sport', sport);
    console.log(`Joined sport room: ${sport}`);
  }

  // Leave a sport room
  leaveSport(sport) {
    if (this.socket) {
      this.socket.emit('leave-sport', sport);
      console.log(`Left sport room: ${sport}`);
    }
  }

  // Join live matches room
  joinLiveMatches() {
    if (!this.socket) this.connect();
    this.socket.emit('join-live-matches');
    console.log('Joined live matches room');
  }

  // Subscribe to match updates
  onMatchUpdate(callback) {
    if (!this.socket) this.connect();
    this.socket.on('match-update', callback);
    this.listeners.set('match-update', callback);
  }

  // Subscribe to live matches updates
  onLiveMatchesUpdate(callback) {
    if (!this.socket) this.connect();
    this.socket.on('live-matches-update', callback);
    this.listeners.set('live-matches-update', callback);
  }

  // Subscribe to sport updates
  onSportUpdate(callback) {
    if (!this.socket) this.connect();
    this.socket.on('sport-update', callback);
    this.listeners.set('sport-update', callback);
  }

  // Remove specific event listener
  off(event) {
    if (this.socket && this.listeners.has(event)) {
      const callback = this.listeners.get(event);
      this.socket.off(event, callback);
      this.listeners.delete(event);
    }
  }

  // Remove all listeners
  removeAllListeners() {
    if (this.socket) {
      this.listeners.forEach((callback, event) => {
        this.socket.off(event, callback);
      });
      this.listeners.clear();
    }
  }

  // Check if socket is connected
  isConnected() {
    return this.connected && this.socket?.connected;
  }

  // Get socket instance
  getSocket() {
    return this.socket;
  }
}

// Export singleton instance
const socketService = new SocketService();
export default socketService;
