import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../cricket/UI/card';
import { Badge } from '../../cricket/UI/badge';
import { Clock, MapPin, Users, Target, TrendingUp, Activity, Timer } from 'lucide-react';
import Navigation from '../../../components/Navigation';

const BasketballScoreView = () => {
  const [liveMatches, setLiveMatches] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBasketballScores = async () => {
      try {
        // Mock data for basketball matches
        const mockLiveMatches = [
          {
            id: 1,
            team1: 'Los Angeles Lakers',
            team2: 'Golden State Warriors',
            score1: '98',
            score2: '102',
            status: 'live',
            quarter: '4th',
            timeRemaining: '2:45',
            venue: 'Crypto.com Arena',
            team1Logo: '🏀',
            team2Logo: '🏀',
            fouls1: '8',
            fouls2: '6',
            timeouts1: '2',
            timeouts2: '1',
            fieldGoals1: '38/82',
            fieldGoals2: '41/79',
            threePointers1: '12/35',
            threePointers2: '15/38',
            freeThrows1: '10/12',
            freeThrows2: '5/8'
          },
          {
            id: 2,
            team1: 'Boston Celtics',
            team2: 'Miami Heat',
            score1: '67',
            score2: '71',
            status: 'live',
            quarter: '3rd',
            timeRemaining: '8:23',
            venue: 'TD Garden',
            team1Logo: '🏀',
            team2Logo: '🏀',
            fouls1: '5',
            fouls2: '7',
            timeouts1: '3',
            timeouts2: '2',
            fieldGoals1: '26/58',
            fieldGoals2: '28/61',
            threePointers1: '8/22',
            threePointers2: '9/25',
            freeThrows1: '7/9',
            freeThrows2: '6/8'
          }
        ];

        const mockRecentMatches = [
          {
            id: 3,
            team1: 'Milwaukee Bucks',
            team2: 'Philadelphia 76ers',
            score1: '118',
            score2: '109',
            status: 'completed',
            result: 'Milwaukee Bucks won 118-109',
            venue: 'Fiserv Forum',
            team1Logo: '🏀',
            team2Logo: '🏀',
            playerOfMatch: 'Giannis Antetokounmpo',
            finalQuarter: 'Final',
            topScorer1: 'Giannis - 35 pts',
            topScorer2: 'Embiid - 28 pts'
          },
          {
            id: 4,
            team1: 'Denver Nuggets',
            team2: 'Phoenix Suns',
            score1: '124',
            score2: '111',
            status: 'completed',
            result: 'Denver Nuggets won 124-111',
            venue: 'Ball Arena',
            team1Logo: '🏀',
            team2Logo: '🏀',
            playerOfMatch: 'Nikola Jokić',
            finalQuarter: 'Final',
            topScorer1: 'Jokić - 32 pts',
            topScorer2: 'Booker - 26 pts'
          }
        ];

        const mockUpcomingMatches = [
          {
            id: 5,
            team1: 'Chicago Bulls',
            team2: 'Detroit Pistons',
            date: '2024-08-25',
            time: '20:00',
            venue: 'United Center',
            team1Logo: '🏀',
            team2Logo: '🏀',
            competition: 'NBA Regular Season'
          },
          {
            id: 6,
            team1: 'Dallas Mavericks',
            team2: 'San Antonio Spurs',
            date: '2024-08-25',
            time: '21:30',
            venue: 'American Airlines Center',
            team1Logo: '🏀',
            team2Logo: '🏀',
            competition: 'NBA Regular Season'
          }
        ];

        setLiveMatches(mockLiveMatches);
        setRecentMatches(mockRecentMatches);
        setUpcomingMatches(mockUpcomingMatches);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching basketball scores:', error);
        setLoading(false);
      }
    };

    fetchBasketballScores();
  }, []);

  const LiveMatchCard = ({ match }) => (
    <Card className="mb-4 border-l-4 border-l-orange-500">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <Badge variant="destructive" className="animate-pulse">
            <Activity className="w-3 h-3 mr-1" />
            LIVE
          </Badge>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm font-semibold text-orange-600">
              <Timer className="w-4 h-4 mr-1" />
              {match.quarter} - {match.timeRemaining}
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
            <div className="grid grid-cols-2 gap-4 text-sm mb-3">
              <div className="text-center">
                <div className="font-semibold">{match.fieldGoals1}</div>
                <div className="text-gray-600">Field Goals</div>
                <div className="font-semibold">{match.fieldGoals2}</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">{match.threePointers1}</div>
                <div className="text-gray-600">3-Pointers</div>
                <div className="font-semibold">{match.threePointers2}</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm pt-3 border-t">
              <div className="text-center">
                <div className="font-semibold">{match.freeThrows1}</div>
                <div className="text-gray-600">Free Throws</div>
                <div className="font-semibold">{match.freeThrows2}</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">{match.fouls1}</div>
                <div className="text-gray-600">Fouls</div>
                <div className="font-semibold">{match.fouls2}</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">{match.timeouts1}</div>
                <div className="text-gray-600">Timeouts</div>
                <div className="font-semibold">{match.timeouts2}</div>
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
              <div>
                <div className="font-semibold">{match.team1}</div>
                <div className="text-sm text-gray-600">{match.topScorer1}</div>
              </div>
            </div>
            <span className="text-2xl font-bold">{match.score1}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{match.team2Logo}</span>
              <div>
                <div className="font-semibold">{match.team2}</div>
                <div className="text-sm text-gray-600">{match.topScorer2}</div>
              </div>
            </div>
            <span className="text-2xl font-bold">{match.score2}</span>
          </div>
          <div className="bg-orange-50 p-2 rounded text-center">
            <span className="text-orange-700 font-semibold">{match.result}</span>
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading Basketball Scores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      {/* Header */}
      <div className="bg-orange-600 text-white py-6">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold flex items-center">
            <span className="text-4xl mr-3">🏀</span>
            Basketball Scores
          </h1>
          <p className="text-orange-100 mt-2">Live games, results, and upcoming matchups</p>
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

export default BasketballScoreView;