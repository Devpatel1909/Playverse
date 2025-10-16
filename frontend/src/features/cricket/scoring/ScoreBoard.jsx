import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../UI/card';
import cricketScoringAPIService from '../../../services/cricketScoringAPI';

const ScoreBoard = ({ matchId, match, onMatchUpdate }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (matchId) {
      loadStats();
      setupWebSocket();
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [matchId, loadStats, setupWebSocket, socket]);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      const statsData = await cricketScoringAPIService.getMatchStats(matchId);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load match stats:', error);
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  const setupWebSocket = useCallback(() => {
    // WebSocket connection for real-time updates
    try {
      const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:5000';
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log('WebSocket connected for match:', matchId);
        // Join match room
        ws.send(JSON.stringify({
          type: 'join_match',
          matchId: matchId
        }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'score_update' && data.matchId === matchId) {
            // Update match data
            if (onMatchUpdate) {
              onMatchUpdate(data.match);
            }
            // Reload stats
            loadStats();
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        // Attempt to reconnect after 3 seconds
        setTimeout(() => {
          if (matchId) {
            setupWebSocket();
          }
        }, 3000);
      };

      setSocket(ws);
    } catch (error) {
      console.error('Failed to setup WebSocket:', error);
    }
  }, [matchId, loadStats, onMatchUpdate]);

  const getCurrentInnings = () => {
    if (!match || !match.innings || match.innings.length === 0) {
      return null;
    }
    return match.innings[match.currentInnings - 1];
  };

  const getPreviousInnings = () => {
    if (!match || !match.innings || match.innings.length < 2 || match.currentInnings === 1) {
      return null;
    }
    return match.innings[0];
  };

  const calculateRunRate = (runs, overs, balls) => {
    const totalOvers = overs + (balls / 6);
    return totalOvers > 0 ? (runs / totalOvers).toFixed(2) : '0.00';
  };

  const calculateRequiredRunRate = (target, remainingOvers, remainingBalls) => {
    const totalRemainingOvers = remainingOvers + (remainingBalls / 6);
    return totalRemainingOvers > 0 ? ((target + 1) / totalRemainingOvers).toFixed(2) : '0.00';
  };

  const formatOvers = (overs, balls) => {
    return `${overs}.${balls}`;
  };

  const getRecentBalls = () => {
    // This would come from the match data or stats
    return stats?.recentBalls || [];
  };

  const getPartnership = () => {
    return stats?.currentPartnership || { runs: 0, balls: 0 };
  };

  if (loading && !stats) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading scoreboard...</div>
        </CardContent>
      </Card>
    );
  }

  if (!match) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">No match data available</div>
        </CardContent>
      </Card>
    );
  }

  const currentInnings = getCurrentInnings();
  const previousInnings = getPreviousInnings();
  const partnership = getPartnership();
  const recentBalls = getRecentBalls();

  return (
    <div className="space-y-4">
      
      {/* Main Score Display */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            {match.teams?.team1?.name || 'Team 1'} vs {match.teams?.team2?.name || 'Team 2'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            
            {/* Current Innings Score */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="text-4xl font-bold text-blue-900">
                {currentInnings?.score?.runs || 0}/{currentInnings?.score?.wickets || 0}
              </div>
              <div className="text-lg text-blue-700 mt-2">
                {formatOvers(currentInnings?.score?.overs || 0, currentInnings?.score?.balls || 0)} overs
              </div>
              <div className="text-sm text-blue-600 mt-1">
                Run Rate: {calculateRunRate(
                  currentInnings?.score?.runs || 0,
                  currentInnings?.score?.overs || 0,
                  currentInnings?.score?.balls || 0
                )}
              </div>
            </div>

            {/* Previous Innings (if exists) */}
            {previousInnings && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-lg font-semibold">
                  {match.currentInnings === 2 ? 
                    `${match.teams?.team1?.name || 'Team 1'}` : 
                    `${match.teams?.team2?.name || 'Team 2'}`
                  }: {previousInnings.score?.runs || 0}/{previousInnings.score?.wickets || 0}
                </div>
                <div className="text-sm text-gray-600">
                  ({formatOvers(previousInnings.score?.overs || 0, previousInnings.score?.balls || 0)} overs)
                </div>
              </div>
            )}

            {/* Target Information */}
            {match.currentInnings === 2 && previousInnings && (
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-lg font-semibold text-green-800">
                  Target: {(previousInnings.score?.runs || 0) + 1}
                </div>
                <div className="text-sm text-green-600">
                  Need {Math.max(0, (previousInnings.score?.runs || 0) + 1 - (currentInnings?.score?.runs || 0))} runs 
                  from {Math.max(0, (match.overs || 20) - (currentInnings?.score?.overs || 0))} overs
                </div>
                <div className="text-sm text-green-600">
                  Required Run Rate: {calculateRequiredRunRate(
                    (previousInnings.score?.runs || 0) - (currentInnings?.score?.runs || 0),
                    (match.overs || 20) - (currentInnings?.score?.overs || 0),
                    6 - (currentInnings?.score?.balls || 0)
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Batsmen and Bowler Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Batsmen */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Batsmen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {match.currentBatsmen?.striker && (
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <div className="font-semibold">
                      {match.currentBatsmen.striker.name} *
                    </div>
                    <div className="text-sm text-gray-600">Striker</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      {stats?.batsmen?.[match.currentBatsmen.striker._id]?.runs || 0}
                      ({stats?.batsmen?.[match.currentBatsmen.striker._id]?.ballsFaced || 0})
                    </div>
                    <div className="text-sm text-gray-600">
                      SR: {stats?.batsmen?.[match.currentBatsmen.striker._id]?.strikeRate?.toFixed(2) || '0.00'}
                    </div>
                  </div>
                </div>
              )}
              
              {match.currentBatsmen?.nonStriker && (
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold">
                      {match.currentBatsmen.nonStriker.name}
                    </div>
                    <div className="text-sm text-gray-600">Non-Striker</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      {stats?.batsmen?.[match.currentBatsmen.nonStriker._id]?.runs || 0}
                      ({stats?.batsmen?.[match.currentBatsmen.nonStriker._id]?.ballsFaced || 0})
                    </div>
                    <div className="text-sm text-gray-600">
                      SR: {stats?.batsmen?.[match.currentBatsmen.nonStriker._id]?.strikeRate?.toFixed(2) || '0.00'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bowler */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Current Bowler</CardTitle>
          </CardHeader>
          <CardContent>
            {match.currentBowler ? (
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="font-semibold text-lg">
                  {match.currentBowler.name}
                </div>
                <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                  <div>
                    <div className="text-gray-600">Overs</div>
                    <div className="font-semibold">
                      {formatOvers(
                        stats?.bowlers?.[match.currentBowler._id]?.overs || 0,
                        stats?.bowlers?.[match.currentBowler._id]?.balls || 0
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Runs</div>
                    <div className="font-semibold">
                      {stats?.bowlers?.[match.currentBowler._id]?.runs || 0}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Wickets</div>
                    <div className="font-semibold">
                      {stats?.bowlers?.[match.currentBowler._id]?.wickets || 0}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Economy</div>
                    <div className="font-semibold">
                      {stats?.bowlers?.[match.currentBowler._id]?.economy?.toFixed(2) || '0.00'}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                No bowler selected
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Partnership and Recent Balls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Current Partnership */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Current Partnership</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-purple-600">
                {partnership.runs} runs
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {partnership.balls} balls
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Balls */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Balls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {recentBalls.slice(-12).map((ball, index) => (
                <div
                  key={index}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    ball.isWicket
                      ? 'bg-red-500 text-white'
                      : ball.runs === 4
                      ? 'bg-green-500 text-white'
                      : ball.runs === 6
                      ? 'bg-blue-500 text-white'
                      : ball.ballType === 'wide' || ball.ballType === 'noball'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {ball.isWicket ? 'W' : ball.ballType === 'wide' ? 'Wd' : ball.ballType === 'noball' ? 'NB' : ball.runs}
                </div>
              ))}
            </div>
            {recentBalls.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                No balls recorded yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Match Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                match.status === 'live' ? 'bg-green-500' : 
                match.status === 'completed' ? 'bg-gray-500' : 'bg-yellow-500'
              }`}></div>
              <span className="font-medium capitalize">{match.status || 'Live'}</span>
            </div>
            <div className="text-sm text-gray-600">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScoreBoard;