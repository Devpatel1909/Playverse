import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../cricket/UI/card';
import { Badge } from '../../cricket/UI/badge';
import { Clock, MapPin, Users, Target, TrendingUp, Activity, Timer } from 'lucide-react';
import Navigation from '../../../components/Navigation';

const VolleyballScoreView = () => {
  const [liveMatches, setLiveMatches] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVolleyballScores = async () => {
      try {
        // Mock data for volleyball matches
        const mockLiveMatches = [
          {
            id: 1,
            team1: 'Brazil',
            team2: 'Italy',
            sets1: [25, 22, 18],
            sets2: [23, 25, 25],
            currentSet: 4,
            points1: 12,
            points2: 15,
            status: 'live',
            serving: 'team2',
            venue: 'Ariake Arena',
            team1Logo: '🏐',
            team2Logo: '🏐',
            tournament: 'FIVB World Championship',
            round: 'Final',
            category: 'Men\'s',
            aces1: 8,
            aces2: 6,
            blocks1: 12,
            blocks2: 9,
            attacks1: 45,
            attacks2: 42
          },
          {
            id: 2,
            team1: 'USA',
            team2: 'Serbia',
            sets1: [25, 20],
            sets2: [22, 25],
            currentSet: 3,
            points1: 8,
            points2: 11,
            status: 'live',
            serving: 'team1',
            venue: 'Olympic Volleyball Arena',
            team1Logo: '🏐',
            team2Logo: '🏐',
            tournament: 'Olympics',
            round: 'Semi-Final',
            category: 'Women\'s',
            aces1: 4,
            aces2: 7,
            blocks1: 8,
            blocks2: 11,
            attacks1: 38,
            attacks2: 41
          }
        ];

        const mockRecentMatches = [
          {
            id: 3,
            team1: 'Poland',
            team2: 'France',
            sets1: [25, 25, 22, 25],
            sets2: [21, 23, 25, 19],
            status: 'completed',
            result: 'Poland won 3-1',
            venue: 'Spodek Arena',
            team1Logo: '🏐',
            team2Logo: '🏐',
            tournament: 'European Championship',
            round: 'Final',
            category: 'Men\'s',
            duration: '1h 58m',
            mvp: 'Bartosz Kurek'
          },
          {
            id: 4,
            team1: 'China',
            team2: 'Japan',
            sets1: [25, 25, 25],
            sets2: [18, 20, 22],
            status: 'completed',
            result: 'China won 3-0',
            venue: 'Tokyo Metropolitan Gym',
            team1Logo: '🏐',
            team2Logo: '🏐',
            tournament: 'Asian Championship',
            round: 'Final',
            category: 'Women\'s',
            duration: '1h 32m',
            mvp: 'Zhu Ting'
          }
        ];

        const mockUpcomingMatches = [
          {
            id: 5,
            team1: 'Russia',
            team2: 'Argentina',
            date: '2024-08-25',
            time: '19:00',
            venue: 'VTB Arena',
            team1Logo: '🏐',
            team2Logo: '🏐',
            tournament: 'FIVB Nations League',
            round: 'Quarter-Final',
            category: 'Men\'s'
          },
          {
            id: 6,
            team1: 'Turkey',
            team2: 'Netherlands',
            date: '2024-08-25',
            time: '21:30',
            venue: 'Burhan Felek Arena',
            team1Logo: '🏐',
            team2Logo: '🏐',
            tournament: 'European Championship',
            round: 'Semi-Final',
            category: 'Women\'s'
          }
        ];

        setLiveMatches(mockLiveMatches);
        setRecentMatches(mockRecentMatches);
        setUpcomingMatches(mockUpcomingMatches);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching volleyball scores:', error);
        setLoading(false);
      }
    };

    fetchVolleyballScores();
  }, []);

  const LiveMatchCard = ({ match }) => (
    <Card className="mb-4 border-l-4 border-l-purple-500">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <Badge variant="destructive" className="animate-pulse">
            <Activity className="w-3 h-3 mr-1" />
            LIVE
          </Badge>
          <div className="flex items-center space-x-4">
            <Badge variant="outline">{match.tournament}</Badge>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              {match.venue}
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm font-medium text-purple-600">{match.round}</span>
          <span className="text-sm text-gray-600">{match.category}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Teams and Sets */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{match.team1Logo}</span>
                <div>
                  <div className="font-semibold text-lg">{match.team1}</div>
                  {match.serving === 'team1' && (
                    <div className="text-xs text-green-600 font-medium">● Serving</div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {match.sets1.map((set, index) => (
                  <div key={index} className={`w-8 h-8 flex items-center justify-center rounded ${
                    index === match.currentSet - 1 ? 'bg-purple-100 border-2 border-purple-500' : 'bg-gray-100'
                  }`}>
                    <span className="font-bold text-sm">{set}</span>
                  </div>
                ))}
                <div className="w-8 h-8 flex items-center justify-center rounded bg-purple-500 text-white">
                  <span className="font-bold text-sm">{match.points1}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{match.team2Logo}</span>
                <div>
                  <div className="font-semibold text-lg">{match.team2}</div>
                  {match.serving === 'team2' && (
                    <div className="text-xs text-green-600 font-medium">● Serving</div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {match.sets2.map((set, index) => (
                  <div key={index} className={`w-8 h-8 flex items-center justify-center rounded ${
                    index === match.currentSet - 1 ? 'bg-purple-100 border-2 border-purple-500' : 'bg-gray-100'
                  }`}>
                    <span className="font-bold text-sm">{set}</span>
                  </div>
                ))}
                <div className="w-8 h-8 flex items-center justify-center rounded bg-purple-500 text-white">
                  <span className="font-bold text-sm">{match.points2}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Match Stats */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold">{match.aces1}</div>
                <div className="text-gray-600">Aces</div>
                <div className="font-semibold">{match.aces2}</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">{match.blocks1}</div>
                <div className="text-gray-600">Blocks</div>
                <div className="font-semibold">{match.blocks2}</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">{match.attacks1}</div>
                <div className="text-gray-600">Attacks</div>
                <div className="font-semibold">{match.attacks2}</div>
              </div>
            </div>
            <div className="text-center mt-3 pt-3 border-t">
              <div className="text-sm text-gray-600">
                Set {match.currentSet} - First to 25 points
              </div>
              <div className="text-lg font-semibold mt-1">
                {match.points1} - {match.points2}
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
          <Badge variant="secondary">FINAL</Badge>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{match.tournament}</Badge>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              {match.venue}
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm font-medium text-blue-600">{match.round} • {match.category}</span>
          <span className="text-sm text-gray-600">{match.duration}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{match.team1Logo}</span>
              <span className="font-semibold">{match.team1}</span>
            </div>
            <div className="flex items-center space-x-2">
              {match.sets1.map((set, index) => (
                <div key={index} className="w-8 h-8 flex items-center justify-center rounded bg-green-100">
                  <span className="font-bold text-sm">{set}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{match.team2Logo}</span>
              <span className="font-semibold">{match.team2}</span>
            </div>
            <div className="flex items-center space-x-2">
              {match.sets2.map((set, index) => (
                <div key={index} className="w-8 h-8 flex items-center justify-center rounded bg-gray-100">
                  <span className="font-bold text-sm">{set}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-purple-50 p-2 rounded text-center">
            <span className="text-purple-700 font-semibold">{match.result}</span>
          </div>
          {match.mvp && (
            <div className="text-sm text-center">
              <span className="text-gray-600">MVP: </span>
              <span className="font-semibold">{match.mvp}</span>
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
            <Badge variant="outline">{match.tournament}</Badge>
            <div className="text-sm text-gray-600 mt-1">{match.round} • {match.category}</div>
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading Volleyball Scores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      {/* Header */}
      <div className="bg-purple-600 text-white py-6">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold flex items-center">
            <span className="text-4xl mr-3">🏐</span>
            Volleyball Scores
          </h1>
          <p className="text-purple-100 mt-2">Live matches, results, and upcoming tournaments</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live Matches */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Activity className="w-6 h-6 mr-2 text-green-600" />
                Live Matches
              </h2>
              {liveMatches.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No live matches at the moment</p>
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
              Upcoming Matches
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

export default VolleyballScoreView;