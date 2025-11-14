import { useEffect, useRef, useState } from 'react';
import socketService from '../services/socketService';

/**
 * Custom hook for Socket.IO integration
 * @param {string} matchId - Optional match ID to join specific match room
 * @param {string} sport - Optional sport to join sport-specific room
 * @param {boolean} joinLive - Whether to join live matches room
 */
export const useSocket = ({ matchId, sport, joinLive = false } = {}) => {
  const [connected, setConnected] = useState(false);
  const [matchData, setMatchData] = useState(null);
  const [liveMatches, setLiveMatches] = useState([]);
  const [sportData, setSportData] = useState(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    // Connect to socket
    socketService.connect();
    setConnected(socketService.isConnected());

    // Join rooms based on parameters
    if (matchId) {
      socketService.joinMatch(matchId);
    }

    if (sport) {
      socketService.joinSport(sport);
    }

    if (joinLive) {
      socketService.joinLiveMatches();
    }

    // Set up event listeners
    if (matchId) {
      socketService.onMatchUpdate((data) => {
        if (mountedRef.current) {
          setMatchData(data);
        }
      });
    }

    if (joinLive) {
      socketService.onLiveMatchesUpdate((data) => {
        if (mountedRef.current) {
          setLiveMatches(data);
        }
      });
    }

    if (sport) {
      socketService.onSportUpdate((data) => {
        if (mountedRef.current) {
          setSportData(data);
        }
      });
    }

    // Cleanup on unmount
    return () => {
      mountedRef.current = false;

      if (matchId) {
        socketService.leaveMatch(matchId);
        socketService.off('match-update');
      }

      if (sport) {
        socketService.leaveSport(sport);
        socketService.off('sport-update');
      }

      if (joinLive) {
        socketService.off('live-matches-update');
      }
    };
  }, [matchId, sport, joinLive]);

  return {
    connected,
    matchData,
    liveMatches,
    sportData,
    socket: socketService.getSocket()
  };
};

/**
 * Hook for match-specific real-time updates
 */
export const useMatchSocket = (matchId) => {
  return useSocket({ matchId });
};

/**
 * Hook for live matches updates
 */
export const useLiveMatchesSocket = () => {
  return useSocket({ joinLive: true });
};

/**
 * Hook for sport-specific updates
 */
export const useSportSocket = (sport) => {
  return useSocket({ sport });
};
