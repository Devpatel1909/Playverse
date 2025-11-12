import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { MapPin, Clock, Users, Trophy } from 'lucide-react';
import publicScoreAPI from '../services/publicScoreAPI';

const MatchDetailsModal = ({ open, onOpenChange, matchId, match }) => {
  const [matchDetails, setMatchDetails] = useState(match || null);
  const [commentary, setCommentary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    if (open && matchId && !match) {
      fetchMatchDetails();
    }
    if (open && match) {
      setMatchDetails(match);
      if (match.sport === 'Cricket' && match.status === 'live') {
        fetchCommentary();
      }
    }
  }, [open, matchId, match]);

  const fetchMatchDetails = async () => {
    setLoading(true);
    try {
      const response = await publicScoreAPI.getMatchDetails(matchId);
      setMatchDetails(response.data);
      
      if (response.data.sport === 'Cricket' && response.data.status === 'live') {
        fetchCommentary();
      }
    } catch (error) {
      console.error('Error fetching match details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCommentary = async () => {
    try {
      const response = await publicScoreAPI.getCricketCommentary(matchId);
      setCommentary(response.data || []);
    } catch (error) {
      console.error('Error fetching commentary:', error);
    }
  };

  // Info Tab - Match Information
  const renderInfo = () => {
    if (!matchDetails) return null;

    return (
      <div className="space-y-4">
        <Card>
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-base font-bold text-gray-900">MATCH INFO</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              <div className="flex justify-between p-4">
                <span className="font-semibold text-gray-700">Match</span>
                <span className="text-gray-900 text-right">{matchDetails.team1} vs {matchDetails.team2}</span>
              </div>
              {matchDetails.tournament && (
                <div className="flex justify-between p-4">
                  <span className="font-semibold text-gray-700">Series</span>
                  <span className="text-gray-900">{matchDetails.tournament}</span>
                </div>
              )}
              <div className="flex justify-between p-4">
                <span className="font-semibold text-gray-700">Date</span>
                <span className="text-gray-900">{matchDetails.date || 'Today'}</span>
              </div>
              <div className="flex justify-between p-4">
                <span className="font-semibold text-gray-700">Time</span>
                <span className="text-gray-900">{matchDetails.time || 'Live'}</span>
              </div>
              {matchDetails.toss && (
                <div className="flex justify-between p-4">
                  <span className="font-semibold text-gray-700">Toss</span>
                  <span className="text-gray-900 text-right">{matchDetails.toss}</span>
                </div>
              )}
              <div className="flex justify-between p-4">
                <span className="font-semibold text-gray-700">Venue</span>
                <span className="text-gray-900 text-right">{matchDetails.venue}</span>
              </div>
              {matchDetails.umpires && (
                <div className="flex justify-between p-4">
                  <span className="font-semibold text-gray-700">Umpires</span>
                  <span className="text-gray-900 text-right">{matchDetails.umpires}</span>
                </div>
              )}
              {matchDetails.referee && (
                <div className="flex justify-between p-4">
                  <span className="font-semibold text-gray-700">Referee</span>
                  <span className="text-gray-900">{matchDetails.referee}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Venue Guide */}
        <Card>
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-base font-bold text-gray-900">VENUE GUIDE</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              <div className="flex justify-between p-4">
                <span className="font-semibold text-gray-700">Stadium</span>
                <span className="text-gray-900">{matchDetails.stadium || matchDetails.venue}</span>
              </div>
              <div className="flex justify-between p-4">
                <span className="font-semibold text-gray-700">City</span>
                <span className="text-gray-900">{matchDetails.city || 'N/A'}</span>
              </div>
              <div className="flex justify-between p-4">
                <span className="font-semibold text-gray-700">Capacity</span>
                <span className="text-gray-900">{matchDetails.capacity || 'N/A'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Live Tab - Live Updates
  const renderLive = () => {
    if (!matchDetails) return null;

    return (
      <div className="space-y-4">
        <Card>
          <CardHeader className="bg-green-50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-gray-900">
                {matchDetails.team1} vs {matchDetails.team2}
              </CardTitle>
              <Badge variant="destructive" className="animate-pulse">LIVE</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-green-600 text-white rounded">
                <div className="flex justify-between items-center">
                  <span className="font-bold">{matchDetails.team1}</span>
                  <span className="text-2xl font-bold">{matchDetails.score1}</span>
                </div>
                {matchDetails.overs1 && (
                  <div className="text-sm opacity-90">({matchDetails.overs1} Ov)</div>
                )}
              </div>

              {matchDetails.currentBatsman && (
                <div className="p-4 bg-blue-50 rounded">
                  <div className="text-sm font-semibold text-gray-700 mb-2">Current Partnership</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="font-bold text-gray-900">{matchDetails.currentBatsman.striker}</div>
                      <div className="text-2xl font-bold text-green-600">{matchDetails.currentBatsman.strikerRuns}*</div>
                      <div className="text-xs text-gray-600">Striker</div>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{matchDetails.currentBatsman.nonStriker}</div>
                      <div className="text-2xl font-bold text-blue-600">{matchDetails.currentBatsman.nonStrikerRuns}</div>
                      <div className="text-xs text-gray-600">Non-Striker</div>
                    </div>
                  </div>
                </div>
              )}

              {matchDetails.currentBowler && (
                <div className="p-4 bg-orange-50 rounded">
                  <div className="text-sm font-semibold text-gray-700 mb-2">Current Bowler</div>
                  <div className="font-bold text-gray-900">{matchDetails.currentBowler.name}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {matchDetails.currentBowler.overs} Ov • {matchDetails.currentBowler.runs} R • {matchDetails.currentBowler.wickets} W
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Squads Tab - Team Lineups
  const renderSquads = () => {
    if (!matchDetails) return null;

    // Mock squad data - in real app, this would come from API
    const team1Squad = matchDetails.team1Squad || [
      { name: 'Player 1', role: 'Batting Allrounder', captain: true },
      { name: 'Player 2', role: 'Batter' },
      { name: 'Player 3', role: 'WK-Batter', wicketkeeper: true },
      { name: 'Player 4', role: 'Batter' },
      { name: 'Player 5', role: 'Bowling Allrounder' },
    ];

    const team2Squad = matchDetails.team2Squad || [
      { name: 'Player A', role: 'Batting Allrounder', captain: true },
      { name: 'Player B', role: 'Batter' },
      { name: 'Player C', role: 'WK-Batter', wicketkeeper: true },
      { name: 'Player D', role: 'Batter' },
      { name: 'Player E', role: 'Bowler' },
    ];

    return (
      <div className="space-y-4">
        <Card>
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-base font-bold text-gray-900">Playing XI</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Team 1 */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">{matchDetails.team1}</h3>
                <div className="space-y-3">
                  {team1Squad.map((player, index) => (
                    <div key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">
                          {player.name}
                          {player.captain && <span className="ml-2 text-xs text-blue-600">(C)</span>}
                          {player.wicketkeeper && <span className="ml-2 text-xs text-green-600">(WK)</span>}
                        </div>
                        <div className="text-xs text-gray-600">{player.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team 2 */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">{matchDetails.team2}</h3>
                <div className="space-y-3">
                  {team2Squad.map((player, index) => (
                    <div key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">
                          {player.name}
                          {player.captain && <span className="ml-2 text-xs text-blue-600">(C)</span>}
                          {player.wicketkeeper && <span className="ml-2 text-xs text-green-600">(WK)</span>}
                        </div>
                        <div className="text-xs text-gray-600">{player.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Overs Tab - Ball by Ball
  const renderOvers = () => {
    if (!matchDetails) return null;

    // Mock overs data
    const overs = [
      {
        over: 'Ov 5',
        runs: '5 runs',
        score: '52-0',
        bowler: 'Xavier Bartlett',
        batsmen: 'Gill & Abhishek Sharma',
        balls: [
          { runs: 1, type: 'run' },
          { runs: 1, type: 'run' },
          { runs: 0, type: 'dot' },
          { runs: 1, type: 'run' },
          { runs: 2, type: 'run' },
        ]
      },
      {
        over: 'Ov 4',
        runs: '12 runs',
        score: '47-0',
        bowler: 'Nathan Ellis',
        batsmen: 'Gill & Abhishek Sharma',
        balls: [
          { runs: 2, type: 'run' },
          { runs: 0, type: 'dot' },
          { runs: 2, type: 'run' },
          { runs: 1, type: 'run' },
          { runs: 1, type: 'run' },
          { runs: 6, type: 'six' },
        ]
      },
    ];

    return (
      <div className="space-y-4">
        {overs.map((over, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-bold text-gray-900">{over.over}</div>
                  <div className="text-sm text-gray-600">{over.runs}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">{matchDetails.team1}</div>
                  <div className="text-sm text-gray-600">{over.score}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-3">
                <div className="text-sm text-gray-700">{over.bowler} to {over.batsmen}</div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {over.balls.map((ball, ballIndex) => (
                  <div
                    key={ballIndex}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                      ball.type === 'six' ? 'bg-purple-600' :
                      ball.type === 'four' ? 'bg-blue-600' :
                      ball.type === 'wicket' ? 'bg-red-600' :
                      ball.type === 'run' ? 'bg-green-600' :
                      'bg-gray-400'
                    }`}
                  >
                    {ball.runs}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderCricketScorecard = () => {
    if (!matchDetails) return null;

    return (
      <div className="space-y-6">
        {/* Current Score */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Current Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                <div className="flex items-center space-x-3">
                  <span className="font-semibold">{matchDetails.team1}</span>
                  {matchDetails.team1Logo && (
                    <img src={matchDetails.team1Logo} alt={matchDetails.team1} className="w-8 h-8 rounded" />
                  )}
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold">{matchDetails.score1}</div>
                  {matchDetails.overs1 && (
                    <div className="text-sm text-gray-600">({matchDetails.overs1} overs)</div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div className="flex items-center space-x-3">
                  <span className="font-semibold">{matchDetails.team2}</span>
                  {matchDetails.team2Logo && (
                    <img src={matchDetails.team2Logo} alt={matchDetails.team2} className="w-8 h-8 rounded" />
                  )}
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold">{matchDetails.score2}</div>
                  {matchDetails.overs2 && (
                    <div className="text-sm text-gray-600">({matchDetails.overs2} overs)</div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Players (if live) */}
        {matchDetails.status === 'live' && matchDetails.currentBatsman && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current Partnership</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-green-50 rounded">
                  <div className="font-semibold">{matchDetails.currentBatsman.striker}</div>
                  <div className="text-2xl font-bold text-green-600">{matchDetails.currentBatsman.strikerRuns}*</div>
                  <div className="text-sm text-gray-600">Striker</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded">
                  <div className="font-semibold">{matchDetails.currentBatsman.nonStriker}</div>
                  <div className="text-2xl font-bold text-blue-600">{matchDetails.currentBatsman.nonStrikerRuns}</div>
                  <div className="text-sm text-gray-600">Non-Striker</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Bowler (if live) */}
        {matchDetails.status === 'live' && matchDetails.currentBowler && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current Bowler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-3 bg-orange-50 rounded">
                <div className="font-semibold text-lg">{matchDetails.currentBowler.name}</div>
                <div className="text-sm text-gray-600 mt-2">
                  {matchDetails.currentBowler.overs} overs • {matchDetails.currentBowler.maidens} maidens • {matchDetails.currentBowler.runs} runs • {matchDetails.currentBowler.wickets} wickets
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderOtherSportScorecard = () => {
    if (!matchDetails) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Match Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-blue-50 rounded">
              <div className="flex items-center space-x-3">
                <span className="font-semibold text-lg">{matchDetails.team1}</span>
                {matchDetails.team1Logo && (
                  <img src={matchDetails.team1Logo} alt={matchDetails.team1} className="w-8 h-8 rounded" />
                )}
              </div>
              <div className="text-3xl font-bold">{matchDetails.score1}</div>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
              <div className="flex items-center space-x-3">
                <span className="font-semibold text-lg">{matchDetails.team2}</span>
                {matchDetails.team2Logo && (
                  <img src={matchDetails.team2Logo} alt={matchDetails.team2} className="w-8 h-8 rounded" />
                )}
              </div>
              <div className="text-3xl font-bold">{matchDetails.score2}</div>
            </div>

            {matchDetails.time && matchDetails.status === 'live' && (
              <div className="text-center p-2 bg-red-50 rounded">
                <Badge variant="destructive">{matchDetails.time}</Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderCommentary = () => {
    if (commentary.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No commentary available
        </div>
      );
    }

    return (
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {commentary.map((comment, index) => (
          <div key={index} className="p-3 bg-gray-50 rounded">
            <div className="flex justify-between items-start mb-2">
              <span className="font-semibold text-sm">{comment.over}</span>
              <span className="text-xs text-gray-500">{comment.time}</span>
            </div>
            <p className="text-sm">{comment.text}</p>
            {comment.runs && (
              <div className="mt-2">
                <Badge variant="outline" className="text-xs">
                  {comment.runs} runs
                </Badge>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderMatchInfo = () => {
    if (!matchDetails) return null;

    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Match Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Venue:</span>
              <span className="font-medium">{matchDetails.venue}</span>
            </div>
            {matchDetails.tournament && (
              <div className="flex justify-between">
                <span className="text-gray-600">Tournament:</span>
                <span className="font-medium">{matchDetails.tournament}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <Badge variant={matchDetails.status === 'live' ? 'destructive' : 'secondary'}>
                {matchDetails.status}
              </Badge>
            </div>
            {matchDetails.result && (
              <div className="flex justify-between">
                <span className="text-gray-600">Result:</span>
                <span className="font-medium text-green-600">{matchDetails.result}</span>
              </div>
            )}
            {matchDetails.startTime && (
              <div className="flex justify-between">
                <span className="text-gray-600">Start Time:</span>
                <span className="font-medium">{new Date(matchDetails.startTime).toLocaleString()}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3">Loading match details...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!matchDetails) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <div className="text-center py-8 text-gray-500">
            Match details not available
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{matchDetails.team1} vs {matchDetails.team2}</span>
            <Badge variant="outline">{matchDetails.sport}</Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 bg-green-600">
            <TabsTrigger value="info" className="data-[state=active]:bg-white data-[state=active]:text-green-600 text-white">Info</TabsTrigger>
            <TabsTrigger value="live" className="data-[state=active]:bg-white data-[state=active]:text-green-600 text-white">Live</TabsTrigger>
            <TabsTrigger value="scorecard" className="data-[state=active]:bg-white data-[state=active]:text-green-600 text-white">Scorecard</TabsTrigger>
            <TabsTrigger value="squads" className="data-[state=active]:bg-white data-[state=active]:text-green-600 text-white">Squads</TabsTrigger>
            <TabsTrigger value="overs" className="data-[state=active]:bg-white data-[state=active]:text-green-600 text-white">Overs</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-4">
            {renderInfo()}
          </TabsContent>

          <TabsContent value="live" className="mt-4">
            {renderLive()}
          </TabsContent>

          <TabsContent value="scorecard" className="mt-4">
            {matchDetails.sport === 'Cricket' 
              ? renderCricketScorecard() 
              : renderOtherSportScorecard()
            }
          </TabsContent>

          <TabsContent value="squads" className="mt-4">
            {renderSquads()}
          </TabsContent>

          <TabsContent value="overs" className="mt-4">
            {renderOvers()}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default MatchDetailsModal;
