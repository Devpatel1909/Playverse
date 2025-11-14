import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Calendar, Clock, MapPin } from 'lucide-react';
import Navigation from '../../../components/Navigation';

const SchedulePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState(searchParams.get('sport') || 'all');

  // Update selected sport when URL parameter changes
  useEffect(() => {
    setSelectedSport(searchParams.get('sport') || 'all');
  }, [searchParams]);

  useEffect(() => {
    const fetchUpcomingMatches = async () => {
      try {
        setLoading(true);
        // Fetch from real API
        const publicScoreAPI = (await import('../../../services/publicScoreAPI')).default;
        const data = await publicScoreAPI.getUpcomingMatches(selectedSport === 'all' ? null : selectedSport, 20);
        
        setUpcomingMatches(data || []);
      } catch (error) {
        console.error('Error fetching upcoming matches:', error);
        setUpcomingMatches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingMatches();
  }, [selectedSport]);

  const sports = ['all', 'Cricket', 'Football', 'Basketball', 'Tennis', 'Hockey'];

  const filteredMatches = selectedSport === 'all' 
    ? upcomingMatches 
    : upcomingMatches.filter(match => match.sport === selectedSport);

  // Group matches by date
  const groupedMatches = filteredMatches.reduce((groups, match) => {
    const date = match.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(match);
    return groups;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto border-b-2 border-green-600 rounded-full animate-spin"></div>
          <p className="mt-4 font-medium text-gray-600">Loading schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 overflow-x-hidden w-full">
      <Navigation />

      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-4 py-6 mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-gray-900">Schedule</h1>
          <p className="mt-2 text-gray-600">Upcoming matches across all sports</p>
        </div>
      </div>

      {/* Sports Filter */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="px-4 mx-auto max-w-7xl">
          <div className="flex items-center py-3 space-x-1 overflow-x-auto">
            {sports.map((sport) => (
              <button
                key={sport}
                onClick={() => {
                  setSelectedSport(sport);
                  setSearchParams(sport === 'all' ? {} : { sport });
                }}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap rounded-md transition-colors ${
                  selectedSport === sport
                    ? 'bg-green-600 text-white'
                    : 'text-gray-900 bg-gray-50 hover:bg-gray-200 hover:text-black border border-gray-300'
                }`}
              >
                {sport === 'all' ? 'All Sports' : sport}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Schedule Content */}
      <div className="px-4 py-6 mx-auto max-w-7xl">
        {Object.keys(groupedMatches).length === 0 ? (
          <div className="py-12 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-xl text-gray-600">No upcoming matches found</p>
            <p className="mt-2 text-sm text-gray-500">Check back later for scheduled matches</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedMatches).map(([date, matches]) => (
              <div key={date}>
                {/* Date Header */}
                <div className="flex items-center mb-4">
                  <div className="px-4 py-2 bg-gray-200 rounded-md">
                    <span className="font-bold text-gray-900">{date}</span>
                  </div>
                </div>

                {/* Matches for this date */}
                <div className="space-y-4">
                  {matches.map((match) => (
                    <Link 
                      key={match.id} 
                      to={`/match/${match.id}`}
                      state={{ fromSport: selectedSport }}
                    >
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row">
                            {/* Left Section - Match Info */}
                            <div className="flex-1 p-6">
                              <div className="flex items-center justify-between mb-4">
                                <Badge variant="outline" className="text-xs">{match.sport}</Badge>
                                <Badge className="bg-blue-100 text-blue-800 text-xs">{match.matchType}</Badge>
                              </div>

                              {/* Teams */}
                              <div className="space-y-3 mb-4">
                                <div className="flex items-center space-x-3">
                                  <span className="text-2xl">{match.team1Logo}</span>
                                  <span className="text-lg font-bold text-gray-900">{match.team1}</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <span className="text-2xl">{match.team2Logo}</span>
                                  <span className="text-lg font-bold text-gray-900">{match.team2}</span>
                                </div>
                              </div>

                              {/* Tournament */}
                              <div className="text-sm text-gray-600 mb-2">
                                {match.series}
                              </div>
                            </div>

                            {/* Right Section - Time & Venue */}
                            <div className="p-6 bg-gray-50 md:w-80 border-t md:border-t-0 md:border-l">
                              <div className="space-y-3">
                                <div className="flex items-start space-x-2">
                                  <Clock className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                                  <div>
                                    <div className="text-sm font-semibold text-gray-900">{match.time}</div>
                                  </div>
                                </div>
                                <div className="flex items-start space-x-2">
                                  <MapPin className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                                  <div>
                                    <div className="text-sm text-gray-900">{match.venue}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SchedulePage;
