import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import socketService from '../services/socketService';
import { Wifi, WifiOff, Activity } from 'lucide-react';

/**
 * Socket.IO Connection Test Component
 * Use this to verify Socket.IO is working correctly
 */
const SocketConnectionTest = () => {
  const [connected, setConnected] = useState(false);
  const [socketId, setSocketId] = useState(null);
  const [events, setEvents] = useState([]);
  const [joinedRooms, setJoinedRooms] = useState([]);

  useEffect(() => {
    // Connect to socket
    const socket = socketService.connect();

    // Update connection status
    const updateStatus = () => {
      setConnected(socketService.isConnected());
      setSocketId(socket?.id || null);
    };

    socket.on('connect', () => {
      updateStatus();
      addEvent('Connected to server', 'success');
    });

    socket.on('disconnect', () => {
      updateStatus();
      addEvent('Disconnected from server', 'error');
    });

    socket.on('connect_error', (error) => {
      addEvent(`Connection error: ${error.message}`, 'error');
    });

    // Listen for all socket events
    socket.onAny((eventName, ...args) => {
      addEvent(`Received: ${eventName}`, 'info', args);
    });

    updateStatus();

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.offAny();
    };
  }, []);

  const addEvent = (message, type = 'info', data = null) => {
    const event = {
      id: Date.now(),
      message,
      type,
      data,
      timestamp: new Date().toLocaleTimeString()
    };
    setEvents(prev => [event, ...prev].slice(0, 20)); // Keep last 20 events
  };

  const handleJoinRoom = (roomType) => {
    switch (roomType) {
      case 'live-matches':
        socketService.joinLiveMatches();
        addEvent('Joined live-matches room', 'success');
        setJoinedRooms(prev => [...prev, 'live-matches']);
        break;
      case 'cricket':
        socketService.joinSport('Cricket');
        addEvent('Joined sport-Cricket room', 'success');
        setJoinedRooms(prev => [...prev, 'sport-Cricket']);
        break;
      case 'test-match':
        socketService.joinMatch('test-match-123');
        addEvent('Joined match-test-match-123 room', 'success');
        setJoinedRooms(prev => [...prev, 'match-test-match-123']);
        break;
      default:
        break;
    }
  };

  const handleDisconnect = () => {
    socketService.disconnect();
    setJoinedRooms([]);
    addEvent('Manually disconnected', 'info');
  };

  const handleReconnect = () => {
    socketService.connect();
    addEvent('Attempting to reconnect...', 'info');
  };

  const getEventColor = (type) => {
    switch (type) {
      case 'success':
        return 'text-green-600 bg-green-50';
      case 'error':
        return 'text-red-600 bg-red-50';
      case 'info':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Socket.IO Connection Test</span>
            {connected ? (
              <Badge className="bg-green-600">
                <Wifi className="w-4 h-4 mr-1" />
                Connected
              </Badge>
            ) : (
              <Badge variant="destructive">
                <WifiOff className="w-4 h-4 mr-1" />
                Disconnected
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Connection Info */}
          <div className="p-4 border rounded-lg bg-gray-50">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <p className="text-lg font-bold">
                  {connected ? 'Connected' : 'Disconnected'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Socket ID</p>
                <p className="text-sm font-mono">
                  {socketId || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Actions</p>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => handleJoinRoom('live-matches')}
                disabled={!connected}
                size="sm"
              >
                Join Live Matches
              </Button>
              <Button
                onClick={() => handleJoinRoom('cricket')}
                disabled={!connected}
                size="sm"
              >
                Join Cricket Room
              </Button>
              <Button
                onClick={() => handleJoinRoom('test-match')}
                disabled={!connected}
                size="sm"
              >
                Join Test Match
              </Button>
              <Button
                onClick={handleDisconnect}
                disabled={!connected}
                variant="destructive"
                size="sm"
              >
                Disconnect
              </Button>
              <Button
                onClick={handleReconnect}
                disabled={connected}
                variant="outline"
                size="sm"
              >
                Reconnect
              </Button>
            </div>
          </div>

          {/* Joined Rooms */}
          {joinedRooms.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Joined Rooms</p>
              <div className="flex flex-wrap gap-2">
                {joinedRooms.map((room, index) => (
                  <Badge key={index} variant="outline">
                    {room}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Event Log */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">Event Log</p>
              <Activity className="w-4 h-4 text-gray-400" />
            </div>
            <div className="h-64 p-3 space-y-2 overflow-y-auto border rounded-lg bg-gray-50">
              {events.length === 0 ? (
                <p className="text-sm text-center text-gray-400">
                  No events yet. Try connecting or joining rooms.
                </p>
              ) : (
                events.map((event) => (
                  <div
                    key={event.id}
                    className={`p-2 rounded text-sm ${getEventColor(event.type)}`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-medium">{event.message}</span>
                      <span className="text-xs opacity-75">{event.timestamp}</span>
                    </div>
                    {event.data && (
                      <pre className="mt-1 text-xs overflow-x-auto">
                        {JSON.stringify(event.data, null, 2)}
                      </pre>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-600">
          <ol className="space-y-2 list-decimal list-inside">
            <li>Ensure the backend server is running on port 5001</li>
            <li>Check the connection status above (should show "Connected")</li>
            <li>Click "Join Live Matches" to subscribe to live match updates</li>
            <li>Open another browser tab and trigger a match update from the admin panel</li>
            <li>Watch the event log for incoming Socket.IO events</li>
            <li>Try disconnecting and reconnecting to test reconnection logic</li>
          </ol>
          <div className="p-3 mt-4 border-l-4 border-blue-500 bg-blue-50">
            <p className="font-medium text-blue-900">Tip:</p>
            <p className="text-blue-800">
              Open the browser console to see detailed Socket.IO logs
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocketConnectionTest;
