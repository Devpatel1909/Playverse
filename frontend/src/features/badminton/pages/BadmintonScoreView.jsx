import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../cricket/UI/card';
import { Badge } from '../../cricket/UI/badge';
import { Clock, MapPin, Users, Target, TrendingUp, Activity, Timer } from 'lucide-react';
import Navigation from '../../../components/Navigation';

const BadmintonScoreView = () => {
  const [liveMatches, setLiveMatches] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadmintonScores = async () => {
      try {
        // Mock data for badminton matches
        const mockLiveMatches = [
          {
            id: 1,
            player1: 'Viktor Axelsen',
            player2: 'Kento Momota',
            sets1: [21, 18],
            sets2: [19, 21],
            currentSet: 3,
            points1: 15,
            points2: 12,
            status: 'live',
            serving: 'player1',
            venue: 'Istora Senayan',
            player1Logo: '🏸',
            player2Logo: '🏸',
            tournament: 'Indonesia Open',
            round: 'Final',
            category: 'Men\'s Singles'
          },
          {
            id: 2,
            player1: 'Chen Yufei',
            player2: 'Carolina Marin',
            sets1: [21],
            sets2: [16],
            currentSet: 2,
            points1: 8,
            points2: 11,
            status: 'live',
            serving: 'player2',
            venue: 'Olympic Sports Center',
            player1Logo: '🏸',
            player2Logo: '🏸',
            tournament: 'World Championships',
            round: 'Semi-Final',
            category: 'Women\'s Singles'
          }
        ];

        const mockRecentMatches = [
          {
            id: 3,
            player1: 'Marcus Fernaldi Gideon / Kevin Sanjaya',
            player2: 'Mohammad Ahsan / Hendra Setiawan',
            sets1: [21, 21],
            sets2: [18, 15],
            status: 'completed',
            result: 'Marcus/Kevin won 2-0',
            venue: 'Axiata Arena',
            player1Logo: '🏸',
            player2Logo: '🏸',
            tournament: 'Malaysia Open',
            round: 'Final',
            category: 'Men\'s Doubles',
            duration: '42 min'
          },
          {
            id: 4,
            player1: 'Greysia Polii / Apriyani Rahayu',
            player2: 'Chen Qingchen / Jia Yifan',
            sets1: [21, 19, 21],
            sets2: [17, 21, 18],
            status: 'completed',
            result: 'Greysia/Apriyani won 2-1',
            venue: 'Tokyo Metropolitan Gym',
            player1Logo: '🏸',
            player2Logo: '🏸',
            tournament: 'Olympics',
            round: 'Gold Medal Match',
            category: 'Women\'s Doubles',
            duration: '58 min'
          }
        ];

        const mockUpcomingMatches = [
          {
            id: 5,
            player1: 'Lee Zii Jia',
            player2: 'Anthony Ginting',
            date: '2024-08-25',
            time: '16:00',
            venue: 'Singapore Indoor Stadium',
            player1Logo: '🏸',
            player2Logo: '🏸',
            tournament: 'Singapore Open',
            round: 'Quarter-Final',
            category: 'Men\'s Singles'
          },
          {
            id: 6,
            player1: 'Tai Tzu-ying',
            player2: 'An Se-young',
            date: '2024-08-25',
            time: '18:30',
            venue: 'Impact Arena',
            player1Logo: '🏸',
            player2Logo: '🏸',
            tournament: 'Thailand Open',
            round: 'Semi-Final',
            category: 'Women\'s Singles'
          }
        ];

        setLiveMatches(mockLiveMatches);
        setRecentMatches(mockRecentMatches);
        setUpcomingMatches(mockUpcomingMatches);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching badminton scores:', error);
        setLoading(false);
      }
    };

    fetchBadmintonScores();
  }, []);

  const LiveMatchCard = ({ match }) => (
    <Card className="mb-4 border-l-4 border-l-yellow-500">
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
          <span className="text-sm font-medium text-yellow-600">{match.round}</span>
          <span className="text-sm text-gray-600">{match.category}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Players and Sets */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{match.player1Logo}</span>
                <div>
                  <div className="font-semibold text-lg">{match.player1}</div>
                  {match.serving === 'player1' && (
                    <div className="text-xs text-green-600 font-medium">● Serving</div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {match.sets1.map((set, index) => (
                  <div key={index} className={`w-8 h-8 flex items-center justify-center rounded ${
                    index === match.currentSet - 1 ? 'bg-yellow-100 border-2 border-yellow-500' : 'bg-gray-100'
                  }`}>
                    <span className="font-bold text-sm">{set}</span>
                  </div>
                ))}
                <div className="w-8 h-8 flex items-center justify-center rounded bg-yellow-500 text-white">
                  <span className="font-bold text-sm">{match.points1}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{match.player2Logo}</span>
                <div>
                  <div className="font-semibold text-lg">{match.player2}</div>
                  {match.serving === 'player2' && (
                    <div className="text-xs text-green-600 font-medium">● Serving</div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {match.sets2.map((set, index) => (
                  <div key={index} className={`w-8 h-8 flex items-center justify-center rounded ${
                    index === match.currentSet - 1 ? 'bg-yellow-100 border-2 border-yellow-500' : 'bg-gray-100'
                  }`}>
                    <span className="font-bold text-sm">{set}</span>
                  </div>
                ))}
                <div className="w-8 h-8 flex items-center justify-center rounded bg-yellow-500 text-white">
                  <span className="font-bold text-sm">{match.points2}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Current Set Info */}
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <div className="text-sm text-gray-600">
              Set {match.currentSet} - First to 21 points
            </div>
            <div className="text-lg font-semibold mt-1">
              {match.points1} - {match.points2}
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
          <span className="text-sm font-medium text-blue-600">{match.round}</span>
          <span className="text-sm text-gray-600">{match.category} • {match.duration}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{match.player1Logo}</span>
              <span className="font-semibold">{match.player1}</span>
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
              <span className="text-2xl">{match.player2Logo}</span>
              <span className="font-semibold">{match.player2}</span>
            </div>
            <div className="flex items-center space-x-2">
              {match.sets2.map((set, index) => (
                <div key={index} className="w-8 h-8 flex items-center justify-center rounded bg-gray-100">
                  <span className="font-bold text-sm">{set}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-yellow-50 p-2 rounded text-center">
            <span className="text-yellow-700 font-semibold">{match.result}</span>
          </div>
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
              <span className="text-2xl">{match.player1Logo}</span>
              <span className="font-semibold text-sm">{match.player1}</span>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">vs</div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="font-semibold text-sm">{match.player2}</span>
              <span className="text-2xl">{match.player2Logo}</span>
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading Badminton Scores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      {/* Header */}
      <div className="bg-yellow-600 text-white py-6">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold flex items-center">
            <span className="text-4xl mr-3">🏸</span>
            Badminton Scores
          </h1>
          <p className="text-yellow-100 mt-2">Live matches, results, and upcoming tournaments</p>
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

export default BadmintonScoreView;