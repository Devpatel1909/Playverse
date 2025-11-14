import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Calendar, Clock, MapPin, Search } from 'lucide-react';
import Navigation from '../../../components/Navigation';
import { useLiveMatchesSocket } from '../../../hooks/useSocket';

const ArchivesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [archivedMatches, setArchivedMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState(searchParams.get('sport') || 'all');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [searchQuery, setSearchQuery] = useState('');

  // Real-time updates via Socket.IO
  const { liveMatches } = useLiveMatchesSocket();

  // Update selected sport when URL parameter changes
  useEffect(() => {
    setSelectedSport(searchParams.get('sport') || 'all');
  }, [searchParams]);

  // Refresh data when live matches update (in case a live match just completed)
  useEffect(() => {
    if (liveMatches && liveMatches.length > 0) {
      // Refetch archived matches to include newly completed matches
      const refetchMatches = async () => {
        try {
          const publicScoreAPI = (await import('../../../services/publicScoreAPI')).default;
          const data = await publicScoreAPI.getRecentMatches(selectedSport === 'all' ? null : selectedSport, 20);
          setArchivedMatches(data || []);
        } catch (error) {
          console.error('Error refetching archived matches:', error);
        }
      };
      refetchMatches();
    }
  }, [liveMatches, selectedSport]);

  useEffect(() => {
    const fetchArchivedMatches = async () => {
      try {
        setLoading(true);
        // Fetch from real API
        const publicScoreAPI = (await import('../../../services/publicScoreAPI')).default;
        const data = await publicScoreAPI.getRecentMatches(selectedSport === 'all' ? null : selectedSport, 20);
        
        setArchivedMatches(data || []);
      } catch (error) {
        console.error('Error fetching archived matches:', error);
        setArchivedMatches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArchivedMatches();
  }, [selectedSport]);

  const sports = ['all', 'Cricket', 'Football', 'Basketball', 'Tennis', 'Hockey'];
  const years = ['2025', '2024', '2023', '2022', '2021'];

  const filteredMatches = archivedMatches
    .filter(match => selectedSport === 'all' || match.sport === selectedSport)
    .filter(match => {
      if (!match.endTime && !match.date) return true;
      const matchDate = match.endTime || match.date;
      const year = new Date(matchDate).getFullYear().toString();
      return year === selectedYear;
    })
    .filter(match => 
      searchQuery === '' || 
      match.team1?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.team2?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.tournament?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.series?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Group matches by date
  const groupedMatches = filteredMatches.reduce((groups, match) => {
    const matchDate = match.endTime || match.date || new Date().toISOString();
    const dateObj = new Date(matchDate);
    const formattedDate = dateObj.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    }).toUpperCase();
    
    if (!groups[formattedDate]) {
      groups[formattedDate] = [];
    }
    groups[formattedDate].push(match);
    return groups;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto border-b-2 border-red-600 rounded-full animate-spin"></div>
          <p className="mt-4 font-medium text-gray-600">Loading archives...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Match Archives</h1>
          <p className="mt-2 text-gray-600">Browse past matches and results</p>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="px-4 mx-auto max-w-7xl">
          {/* Sports Filter */}
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
                    ? 'bg-red-600 text-white'
                    : 'text-gray-900 bg-gray-50 hover:bg-gray-200 hover:text-black border border-gray-300'
                }`}
              >
                {sport === 'all' ? 'All Sports' : sport}
              </button>
            ))}
          </div>

          {/* Search and Year Filter */}
          <div className="flex flex-col gap-3 py-3 border-t md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <input
                type="text"
                placeholder="Search teams or tournaments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Year:</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Archives Content */}
      <div className="px-4 py-6 mx-auto max-w-7xl">
        {Object.keys(groupedMatches).length === 0 ? (
          <div className="py-12 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-xl text-gray-600">No archived matches found</p>
            <p className="mt-2 text-sm text-gray-500">Try adjusting your filters</p>
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
                                <Badge className="bg-green-100 text-green-800 text-xs">COMPLETED</Badge>
                              </div>

                              {/* Teams and Scores */}
                              <div className="space-y-3 mb-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <span className="text-2xl">{match.team1Logo}</span>
                                    <span className="text-lg font-bold text-gray-900">{match.team1}</span>
                                  </div>
                                  <span className="text-2xl font-bold text-gray-900">{match.score1}</span>
                                </div>
                                {match.overs1 && (
                                  <div className="text-sm text-gray-600 text-right">({match.overs1} Ov)</div>
                                )}
                                
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <span className="text-2xl">{match.team2Logo}</span>
                                    <span className="text-lg font-bold text-gray-900">{match.team2}</span>
                                  </div>
                                  <span className="text-2xl font-bold text-gray-900">{match.score2}</span>
                                </div>
                                {match.overs2 && (
                                  <div className="text-sm text-gray-600 text-right">({match.overs2} Ov)</div>
                                )}
                              </div>

                              {/* Result */}
                              <div className="p-3 mb-3 text-sm font-medium text-green-800 rounded bg-green-50">
                                {match.result}
                              </div>

                              {/* Tournament */}
                              {(match.series || match.tournament || match.matchType) && (
                                <div className="text-sm text-gray-600">
                                  {match.series || match.tournament || 'Match'}
                                  {match.matchType && ` • ${match.matchType}`}
                                </div>
                              )}
                            </div>

                            {/* Right Section - Venue */}
                            <div className="p-6 bg-gray-50 md:w-64 border-t md:border-t-0 md:border-l">
                              <div className="space-y-3">
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

export default ArchivesPage;
