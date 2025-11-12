import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Calendar, Clock, MapPin, Search } from 'lucide-react';
import Navigation from '../../../components/Navigation';

const ArchivesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [archivedMatches, setArchivedMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState(searchParams.get('sport') || 'all');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [searchQuery, setSearchQuery] = useState('');

  // Update selected sport when URL parameter changes
  useEffect(() => {
    setSelectedSport(searchParams.get('sport') || 'all');
  }, [searchParams]);

  useEffect(() => {
    // Mock data for archived matches
    const mockArchivedMatches = [
      {
        id: 'archive-1',
        sport: 'Cricket',
        team1: 'India',
        team2: 'South Africa',
        score1: '295/8',
        score2: '287/10',
        overs1: '50.0',
        overs2: '49.3',
        result: 'India won by 8 runs',
        date: 'WED, NOV 6 2025',
        venue: 'Melbourne Cricket Ground',
        tournament: 'ICC World Cup 2025',
        series: 'ICC World Cup 2025',
        matchType: 'Semi-Final',
        team1Logo: '🏏',
        team2Logo: '🏏'
      },
      {
        id: 'archive-2',
        sport: 'Cricket',
        team1: 'New Zealand',
        team2: 'West Indies',
        score1: '178/9',
        score2: '175/10',
        overs1: '20.0',
        overs2: '19.5',
        result: 'New Zealand won by 3 runs',
        date: 'TUE, NOV 5 2025',
        venue: 'Eden Park',
        tournament: 'T20 Series',
        series: 'New Zealand vs West Indies',
        matchType: 'T20I - 3rd Match',
        team1Logo: '🏏',
        team2Logo: '🏏'
      },
      {
        id: 'archive-3',
        sport: 'Football',
        team1: 'Barcelona',
        team2: 'Real Madrid',
        score1: '3',
        score2: '2',
        result: 'Barcelona won',
        date: 'SUN, NOV 3 2025',
        venue: 'Camp Nou',
        tournament: 'La Liga',
        series: 'La Liga 2025',
        matchType: 'El Clásico',
        team1Logo: '⚽',
        team2Logo: '⚽'
      },
      {
        id: 'archive-4',
        sport: 'Basketball',
        team1: 'Lakers',
        team2: 'Celtics',
        score1: '112',
        score2: '108',
        result: 'Lakers won',
        date: 'SAT, NOV 2 2025',
        venue: 'Crypto.com Arena',
        tournament: 'NBA Regular Season',
        series: 'NBA 2025',
        matchType: 'Regular Season',
        team1Logo: '🏀',
        team2Logo: '🏀'
      },
      {
        id: 'archive-5',
        sport: 'Cricket',
        team1: 'England',
        team2: 'Australia',
        score1: '267/9',
        score2: '265/10',
        overs1: '50.0',
        overs2: '49.4',
        result: 'England won by 2 runs',
        date: 'FRI, NOV 1 2025',
        venue: 'Lord\'s Cricket Ground',
        tournament: 'ODI Series',
        series: 'England vs Australia',
        matchType: 'ODI - 5th Match',
        team1Logo: '🏏',
        team2Logo: '🏏'
      },
      {
        id: 'archive-6',
        sport: 'Tennis',
        team1: 'Rafael Nadal',
        team2: 'Roger Federer',
        score1: '3',
        score2: '2',
        result: 'Nadal won (6-4, 3-6, 7-6, 4-6, 6-3)',
        date: 'THU, OCT 31 2025',
        venue: 'Centre Court',
        tournament: 'ATP Finals',
        series: 'ATP Finals 2025',
        matchType: 'Quarter-Final',
        team1Logo: '🎾',
        team2Logo: '🎾'
      },
      {
        id: 'archive-7',
        sport: 'Hockey',
        team1: 'Canada',
        team2: 'USA',
        score1: '4',
        score2: '3',
        result: 'Canada won (OT)',
        date: 'WED, OCT 30 2025',
        venue: 'Bell Centre',
        tournament: 'NHL Regular Season',
        series: 'NHL 2025',
        matchType: 'Regular Season',
        team1Logo: '🏒',
        team2Logo: '🏒'
      },
      {
        id: 'archive-8',
        sport: 'Football',
        team1: 'Manchester United',
        team2: 'Liverpool',
        score1: '2',
        score2: '2',
        result: 'Draw',
        date: 'TUE, OCT 29 2025',
        venue: 'Old Trafford',
        tournament: 'Premier League',
        series: 'Premier League 2025',
        matchType: 'League Match',
        team1Logo: '⚽',
        team2Logo: '⚽'
      },
      {
        id: 'archive-9',
        sport: 'Basketball',
        team1: 'Warriors',
        team2: 'Nets',
        score1: '125',
        score2: '118',
        result: 'Warriors won',
        date: 'MON, OCT 28 2025',
        venue: 'Chase Center',
        tournament: 'NBA Regular Season',
        series: 'NBA 2025',
        matchType: 'Regular Season',
        team1Logo: '🏀',
        team2Logo: '🏀'
      },
      {
        id: 'archive-10',
        sport: 'Cricket',
        team1: 'Pakistan',
        team2: 'Sri Lanka',
        score1: '342/6',
        score2: '338/9',
        overs1: '50.0',
        overs2: '50.0',
        result: 'Pakistan won by 4 runs',
        date: 'SUN, OCT 27 2025',
        venue: 'National Stadium',
        tournament: 'Asia Cup',
        series: 'Asia Cup 2025',
        matchType: 'Final',
        team1Logo: '🏏',
        team2Logo: '🏏'
      },
      {
        id: 'archive-11',
        sport: 'Football',
        team1: 'Bayern Munich',
        team2: 'Borussia Dortmund',
        score1: '3',
        score2: '1',
        result: 'Bayern Munich won',
        date: 'SAT, OCT 26 2025',
        venue: 'Allianz Arena',
        tournament: 'Bundesliga',
        series: 'Bundesliga 2025',
        matchType: 'Der Klassiker',
        team1Logo: '⚽',
        team2Logo: '⚽'
      },
      {
        id: 'archive-12',
        sport: 'Tennis',
        team1: 'Jannik Sinner',
        team2: 'Daniil Medvedev',
        score1: '2',
        score2: '1',
        result: 'Sinner won (7-6, 4-6, 6-3)',
        date: 'FRI, OCT 25 2025',
        venue: 'O2 Arena',
        tournament: 'ATP Finals',
        series: 'ATP Finals 2025',
        matchType: 'Round Robin',
        team1Logo: '🎾',
        team2Logo: '🎾'
      },
      {
        id: 'archive-13',
        sport: 'Hockey',
        team1: 'Pittsburgh Penguins',
        team2: 'Washington Capitals',
        score1: '4',
        score2: '5',
        result: 'Capitals won (SO)',
        date: 'THU, OCT 24 2025',
        venue: 'PPG Paints Arena',
        tournament: 'NHL Regular Season',
        series: 'NHL 2025',
        matchType: 'Regular Season',
        team1Logo: '🏒',
        team2Logo: '🏒'
      },
      {
        id: 'archive-14',
        sport: 'Basketball',
        team1: 'Milwaukee Bucks',
        team2: 'Phoenix Suns',
        score1: '128',
        score2: '122',
        result: 'Bucks won',
        date: 'WED, OCT 23 2025',
        venue: 'Fiserv Forum',
        tournament: 'NBA Regular Season',
        series: 'NBA 2025',
        matchType: 'Regular Season',
        team1Logo: '🏀',
        team2Logo: '🏀'
      },
      {
        id: 'archive-15',
        sport: 'Football',
        team1: 'PSG',
        team2: 'Marseille',
        score1: '2',
        score2: '0',
        result: 'PSG won',
        date: 'TUE, OCT 22 2025',
        venue: 'Parc des Princes',
        tournament: 'Ligue 1',
        series: 'Ligue 1 2025',
        matchType: 'Le Classique',
        team1Logo: '⚽',
        team2Logo: '⚽'
      }
    ];

    setArchivedMatches(mockArchivedMatches);
    setLoading(false);
  }, []);

  const sports = ['all', 'Cricket', 'Football', 'Basketball', 'Tennis', 'Hockey'];
  const years = ['2025', '2024', '2023', '2022', '2021'];

  const filteredMatches = archivedMatches
    .filter(match => selectedSport === 'all' || match.sport === selectedSport)
    .filter(match => match.date.includes(selectedYear))
    .filter(match => 
      searchQuery === '' || 
      match.team1.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.team2.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.tournament.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                              <div className="text-sm text-gray-600">
                                {match.series} • {match.matchType}
                              </div>
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
