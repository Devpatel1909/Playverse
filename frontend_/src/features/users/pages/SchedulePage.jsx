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
        
        if (data && data.length > 0) {
          setUpcomingMatches(data);
        } else {
          // Fallback to mock data if no real data
          const mockUpcomingMatches = [
      {
        id: 'upcoming-1',
        sport: 'Cricket',
        team1: 'India',
        team2: 'Australia',
        date: 'SUN, NOV 10 2025',
        time: '6:15 PM LOCAL, 8:15 AM GMT',
        venue: 'Melbourne Cricket Ground',
        tournament: 'World Test Championship',
        series: 'India tour of Australia, 2025',
        matchType: 'Test Match - Day 1',
        team1Logo: '🏏',
        team2Logo: '🏏'
      },
      {
        id: 'upcoming-2',
        sport: 'Cricket',
        team1: 'England',
        team2: 'Pakistan',
        date: 'MON, NOV 11 2025',
        time: '7:00 PM LOCAL',
        venue: 'Lord\'s Cricket Ground',
        tournament: 'ICC World Cup 2025',
        series: 'England vs Pakistan',
        matchType: 'ODI Match',
        team1Logo: '🏏',
        team2Logo: '🏏'
      },
      {
        id: 'upcoming-3',
        sport: 'Cricket',
        team1: 'New Zealand',
        team2: 'West Indies',
        date: 'TUE, NOV 12 2025',
        time: '6:00 PM LOCAL',
        venue: 'Eden Park',
        tournament: 'T20 Series',
        series: 'New Zealand vs West Indies',
        matchType: 'T20I - 1st Match',
        team1Logo: '🏏',
        team2Logo: '🏏'
      },
      {
        id: 'upcoming-4',
        sport: 'Football',
        team1: 'Manchester City',
        team2: 'Arsenal',
        date: 'SAT, NOV 9 2025',
        time: '5:30 PM LOCAL',
        venue: 'Etihad Stadium',
        tournament: 'Premier League',
        series: 'Premier League 2025',
        matchType: 'League Match',
        team1Logo: '⚽',
        team2Logo: '⚽'
      },
      {
        id: 'upcoming-5',
        sport: 'Basketball',
        team1: 'Boston Celtics',
        team2: 'Miami Heat',
        date: 'FRI, NOV 8 2025',
        time: '7:30 PM EST',
        venue: 'TD Garden',
        tournament: 'NBA Regular Season',
        series: 'NBA 2025',
        matchType: 'Regular Season',
        team1Logo: '🏀',
        team2Logo: '🏀'
      },
      {
        id: 'upcoming-6',
        sport: 'Cricket',
        team1: 'South Africa',
        team2: 'Sri Lanka',
        date: 'WED, NOV 13 2025',
        time: '2:00 PM LOCAL',
        venue: 'Newlands, Cape Town',
        tournament: 'Test Series',
        series: 'South Africa vs Sri Lanka',
        matchType: 'Test Match - Day 1',
        team1Logo: '🏏',
        team2Logo: '🏏'
      },
      {
        id: 'upcoming-7',
        sport: 'Football',
        team1: 'Real Madrid',
        team2: 'Barcelona',
        date: 'SUN, NOV 10 2025',
        time: '9:00 PM LOCAL',
        venue: 'Santiago Bernabéu',
        tournament: 'La Liga',
        series: 'La Liga 2025',
        matchType: 'El Clásico',
        team1Logo: '⚽',
        team2Logo: '⚽'
      },
      {
        id: 'upcoming-8',
        sport: 'Football',
        team1: 'Liverpool',
        team2: 'Chelsea',
        date: 'MON, NOV 11 2025',
        time: '8:00 PM LOCAL',
        venue: 'Anfield',
        tournament: 'Premier League',
        series: 'Premier League 2025',
        matchType: 'League Match',
        team1Logo: '⚽',
        team2Logo: '⚽'
      },
      {
        id: 'upcoming-9',
        sport: 'Basketball',
        team1: 'Los Angeles Lakers',
        team2: 'Golden State Warriors',
        date: 'SUN, NOV 10 2025',
        time: '8:30 PM PST',
        venue: 'Crypto.com Arena',
        tournament: 'NBA Regular Season',
        series: 'NBA 2025',
        matchType: 'Regular Season',
        team1Logo: '🏀',
        team2Logo: '🏀'
      },
      {
        id: 'upcoming-10',
        sport: 'Basketball',
        team1: 'Brooklyn Nets',
        team2: 'Philadelphia 76ers',
        date: 'MON, NOV 11 2025',
        time: '7:00 PM EST',
        venue: 'Barclays Center',
        tournament: 'NBA Regular Season',
        series: 'NBA 2025',
        matchType: 'Regular Season',
        team1Logo: '🏀',
        team2Logo: '🏀'
      },
      {
        id: 'upcoming-11',
        sport: 'Tennis',
        team1: 'Novak Djokovic',
        team2: 'Carlos Alcaraz',
        date: 'SAT, NOV 9 2025',
        time: '2:00 PM LOCAL',
        venue: 'Centre Court',
        tournament: 'ATP Finals',
        series: 'ATP Finals 2025',
        matchType: 'Semi-Final',
        team1Logo: '🎾',
        team2Logo: '🎾'
      },
      {
        id: 'upcoming-12',
        sport: 'Tennis',
        team1: 'Iga Swiatek',
        team2: 'Aryna Sabalenka',
        date: 'SUN, NOV 10 2025',
        time: '3:00 PM LOCAL',
        venue: 'Rod Laver Arena',
        tournament: 'WTA Finals',
        series: 'WTA Finals 2025',
        matchType: 'Final',
        team1Logo: '🎾',
        team2Logo: '🎾'
      },
      {
        id: 'upcoming-13',
        sport: 'Hockey',
        team1: 'Toronto Maple Leafs',
        team2: 'Montreal Canadiens',
        date: 'SAT, NOV 9 2025',
        time: '7:00 PM EST',
        venue: 'Scotiabank Arena',
        tournament: 'NHL Regular Season',
        series: 'NHL 2025',
        matchType: 'Regular Season',
        team1Logo: '🏒',
        team2Logo: '🏒'
      },
      {
        id: 'upcoming-14',
        sport: 'Hockey',
        team1: 'Boston Bruins',
        team2: 'New York Rangers',
        date: 'SUN, NOV 10 2025',
        time: '8:00 PM EST',
        venue: 'TD Garden',
        tournament: 'NHL Regular Season',
        series: 'NHL 2025',
        matchType: 'Regular Season',
        team1Logo: '🏒',
        team2Logo: '🏒'
      },
      {
        id: 'upcoming-15',
        sport: 'Hockey',
        team1: 'Edmonton Oilers',
        team2: 'Calgary Flames',
        date: 'MON, NOV 11 2025',
        time: '9:00 PM MST',
        venue: 'Rogers Place',
        tournament: 'NHL Regular Season',
        series: 'NHL 2025',
        matchType: 'Battle of Alberta',
        team1Logo: '🏒',
        team2Logo: '🏒'
      }
          ];
          setUpcomingMatches(mockUpcomingMatches);
        }
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
