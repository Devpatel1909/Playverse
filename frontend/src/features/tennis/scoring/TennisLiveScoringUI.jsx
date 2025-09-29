import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../UI/card';
import { Badge } from '../UI/badge';
import { Clock, MapPin, Users, Target, TrendingUp, Activity, Timer } from 'lucide-react';
import Navigation from '../../../components/Navigation';
import tennisAPIService from '../../../services/tennisAPI';

const TennisLiveScoringUI = () => {
  const [liveMatches, setLiveMatches] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTennisScores = async () => {
      try {
        const [live, recent, upcoming] = await Promise.all([
          tennisAPIService.getLiveMatches(),
          tennisAPIService.getRecentMatches(),
          tennisAPIService.getUpcomingMatches(),
        ]);

        setLiveMatches(live.data || []);
        setRecentMatches(recent.data || []);
        setUpcomingMatches(upcoming.data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tennis scores:', error);
        setLoading(false);
      }
    };

    fetchTennisScores();
  }, []);

  const LiveMatchCard = ({ match }) => (
    <Card className="mb-4 border-l-4 border-l-pink-500">
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
          <span className="text-sm font-medium text-pink-600">{match.round}</span>
          <span className="text-sm text-gray-600">{match.surface} Court</span>
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
                    index === match.currentSet - 1 ? 'bg-pink-100 border-2 border-pink-500' : 'bg-gray-100'
                  }`}>
                    <span className="font-bold text-sm">{set}</span>
                  </div>
                ))}
                <div className="w-8 h-8 flex items-center justify-center rounded bg-pink-500 text-white">
                  <span className="font-bold text-sm">{match.games1}</span>
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
                    index === match.currentSet - 1 ? 'bg-pink-100 border-2 border-pink-500' : 'bg-gray-100'
                  }`}>
                    <span className="font-bold text-sm">{set}</span>
                  </div>
                ))}
                <div className="w-8 h-8 flex items-center justify-center rounded bg-pink-500 text-white">
                  <span className="font-bold text-sm">{match.games2}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Match Stats */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm mb-3">
              <div className="text-center">
                <div className="font-semibold">{match.aces1}</div>
                <div className="text-gray-600">Aces</div>
                <div className="font-semibold">{match.aces2}</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">{match.doubleFaults1}</div>
                <div className="text-gray-600">Double Faults</div>
                <div className="font-semibold">{match.doubleFaults2}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm pt-3 border-t">
              <div className="text-center">
                <div className="font-semibold">{match.firstServe1}</div>
                <div className="text-gray-600">1st Serve %</div>
                <div className="font-semibold">{match.firstServe2}</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">{match.breakPoints1}</div>
                <div className="text-gray-600">Break Points</div>
                <div className="font-semibold">{match.breakPoints2}</div>
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
          <span className="text-sm font-medium text-blue-600">{match.round}</span>
          <span className="text-sm text-gray-600">{match.surface} • {match.duration}</span>
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
          <div className="bg-pink-50 p-2 rounded text-center">
            <span className="text-pink-700 font-semibold">{match.result}</span>
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
            <div className="text-sm text-gray-600 mt-1">{match.round}</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{match.player1Logo}</span>
              <span className="font-semibold">{match.player1}</span>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">vs</div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="font-semibold">{match.player2}</span>
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
              <span>{match.venue} • {match.surface}</span>
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading Tennis Scores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      {/* Header */}
      <div className="bg-pink-600 text-white py-6">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold flex items-center">
            <span className="text-4xl mr-3">🎾</span>
            Tennis Scores
          </h1>
          <p className="text-pink-100 mt-2">Live matches, results, and upcoming tournaments</p>
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

export default TennisLiveScoringUI;
