import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../cricket/UI/card';
import { Badge } from '../../cricket/UI/badge';
import { Clock, MapPin, Users, Target, TrendingUp, Activity, Timer, Zap } from 'lucide-react';
import Navigation from '../../../components/Navigation';

const HockeyScoreView = () => {
  const [liveMatches, setLiveMatches] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHockeyScores = async () => {
      try {
        // Mock data for hockey matches
        const mockLiveMatches = [
          {
            id: 1,
            team1: 'Boston Bruins',
            team2: 'New York Rangers',
            score1: '2',
            score2: '1',
            status: 'live',
            period: '2nd',
            timeRemaining: '12:45',
            venue: 'TD Garden',
            team1Logo: '🏒',
            team2Logo: '🏒',
            shots1: '18',
            shots2: '14',
            powerPlay1: '1/3',
            powerPlay2: '0/2',
            faceoffs1: '52%',
            faceoffs2: '48%',
            hits1: '15',
            hits2: '12',
            blocks1: '8',
            blocks2: '6',
            penalties1: '2',
            penalties2: '3'
          },
          {
            id: 2,
            team1: 'Toronto Maple Leafs',
            team2: 'Montreal Canadiens',
            score1: '1',
            score2: '3',
            status: 'live',
            period: '3rd',
            timeRemaining: '5:23',
            venue: 'Scotiabank Arena',
            team1Logo: '🏒',
            team2Logo: '🏒',
            shots1: '25',
            shots2: '19',
            powerPlay1: '0/4',
            powerPlay2: '2/3',
            faceoffs1: '45%',
            faceoffs2: '55%',
            hits1: '22',
            hits2: '18',
            blocks1: '12',
            blocks2: '15',
            penalties1: '4',
            penalties2: '3'
          }
        ];

        const mockRecentMatches = [
          {
            id: 3,
            team1: 'Tampa Bay Lightning',
            team2: 'Florida Panthers',
            score1: '4',
            score2: '2',
            status: 'completed',
            result: 'Tampa Bay Lightning won 4-2',
            venue: 'Amalie Arena',
            team1Logo: '🏒',
            team2Logo: '🏒',
            playerOfMatch: 'Nikita Kucherov',
            finalPeriod: 'Final',
            overtime: false,
            shootout: false
          },
          {
            id: 4,
            team1: 'Colorado Avalanche',
            team2: 'Vegas Golden Knights',
            score1: '3',
            score2: '2',
            status: 'completed',
            result: 'Colorado Avalanche won 3-2 (OT)',
            venue: 'Ball Arena',
            team1Logo: '🏒',
            team2Logo: '🏒',
            playerOfMatch: 'Nathan MacKinnon',
            finalPeriod: 'Overtime',
            overtime: true,
            shootout: false
          }
        ];

        const mockUpcomingMatches = [
          {
            id: 5,
            team1: 'Pittsburgh Penguins',
            team2: 'Philadelphia Flyers',
            date: '2024-08-25',
            time: '19:00',
            venue: 'PPG Paints Arena',
            team1Logo: '🏒',
            team2Logo: '🏒',
            competition: 'NHL Regular Season'
          },
          {
            id: 6,
            team1: 'Edmonton Oilers',
            team2: 'Calgary Flames',
            date: '2024-08-25',
            time: '22:00',
            venue: 'Rogers Place',
            team1Logo: '🏒',
            team2Logo: '🏒',
            competition: 'NHL Regular Season'
          }
        ];

        setLiveMatches(mockLiveMatches);
        setRecentMatches(mockRecentMatches);
        setUpcomingMatches(mockUpcomingMatches);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching hockey scores:', error);
        setLoading(false);
      }
    };

    fetchHockeyScores();
  }, []);

  const LiveMatchCard = ({ match }) => (
    <Card className="mb-4 border-l-4 border-l-cyan-500">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <Badge variant="destructive" className="animate-pulse">
            <Activity className="w-3 h-3 mr-1" />
            LIVE
          </Badge>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm font-semibold text-cyan-600">
              <Timer className="w-4 h-4 mr-1" />
              {match.period} - {match.timeRemaining}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              {match.venue}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Teams and Scores */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{match.team1Logo}</span>
                <span className="font-semibold text-lg">{match.team1}</span>
              </div>
              <div className="text-3xl font-bold">{match.score1}</div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{match.team2Logo}</span>
                <span className="font-semibold text-lg">{match.team2}</span>
              </div>
              <div className="text-3xl font-bold">{match.score2}</div>
            </div>
          </div>

          {/* Match Stats */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="grid grid-cols-3 gap-4 text-sm mb-3">
              <div className="text-center">
                <div className="font-semibold">{match.shots1}</div>
                <div className="text-gray-600">Shots</div>
                <div className="font-semibold">{match.shots2}</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">{match.powerPlay1}</div>
                <div className="text-gray-600">Power Play</div>
                <div className="font-semibold">{match.powerPlay2}</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">{match.faceoffs1}</div>
                <div className="text-gray-600">Faceoffs</div>
                <div className="font-semibold">{match.faceoffs2}</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm pt-3 border-t">
              <div className="text-center">
                <div className="font-semibold">{match.hits1}</div>
                <div className="text-gray-600">Hits</div>
                <div className="font-semibold">{match.hits2}</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">{match.blocks1}</div>
                <div className="text-gray-600">Blocks</div>
                <div className="font-semibold">{match.blocks2}</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">{match.penalties1}</div>
                <div className="text-gray-600">Penalties</div>
                <div className="font-semibold">{match.penalties2}</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const RecentMatchCard = ({ match }) => (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">FINAL</Badge>
            {match.overtime && (
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                <Zap className="w-3 h-3 mr-1" />
                OT
              </Badge>
            )}
            {match.shootout && (
              <Badge variant="outline" className="text-purple-600 border-purple-600">
                SO
              </Badge>
            )}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-1" />
            {match.venue}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{match.team1Logo}</span>
              <span className="font-semibold">{match.team1}</span>
            </div>
            <span className="text-2xl font-bold">{match.score1}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{match.team2Logo}</span>
              <span className="font-semibold">{match.team2}</span>
            </div>
            <span className="text-2xl font-bold">{match.score2}</span>
          </div>
          <div className="bg-cyan-50 p-2 rounded text-center">
            <span className="text-cyan-700 font-semibold">{match.result}</span>
          </div>
          {match.playerOfMatch && (
            <div className="text-sm text-center">
              <span className="text-gray-600">Player of the Game: </span>
              <span className="font-semibold">{match.playerOfMatch}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const UpcomingMatchCard = ({ match }) => (
    <Card className="mb-4 border-l-4 border-l-blue-500">
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div className="text-center">
            <Badge variant="outline">{match.competition}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{match.team1Logo}</span>
              <span className="font-semibold">{match.team1}</span>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">vs</div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="font-semibold">{match.team2}</span>
              <span className="text-2xl">{match.team2Logo}</span>
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{match.date} at {match.time}</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mt-1">
              <MapPin className="w-4 h-4" />
              <span>{match.venue}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading Hockey Scores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      {/* Header */}
      <div className="bg-cyan-600 text-white py-6">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold flex items-center">
            <span className="text-4xl mr-3">🏒</span>
            Hockey Scores
          </h1>
          <p className="text-cyan-100 mt-2">Live games, results, and upcoming matchups</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live Matches */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Activity className="w-6 h-6 mr-2 text-green-600" />
                Live Games
              </h2>
              {liveMatches.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No live games at the moment</p>
                  </CardContent>
                </Card>
              ) : (
                liveMatches.map(match => (
                  <LiveMatchCard key={match.id} match={match} />
                ))
              )}
            </div>

            {/* Recent Results */}
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
                Recent Results
              </h2>
              {recentMatches.map(match => (
                <RecentMatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Target className="w-6 h-6 mr-2 text-orange-600" />
              Upcoming Games
            </h2>
            {upcomingMatches.map(match => (
              <UpcomingMatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HockeyScoreView;