import React, { useState, useEffect } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '../../cricket/UI/card';
// import { Badge } from '../../cricket/UI/badge';
// import { Calendar, Clock, MapPin, Filter, ChevronLeft, ChevronRight, Search } from 'lucide-react';
// import Navigation from '../../components/Navigation';

const SchedulePage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSport, setSelectedSport] = useState('all');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const sports = ['all', 'Cricket', 'Football', 'Basketball', 'Tennis', 'Hockey', 'Table Tennis', 'Badminton', 'Volleyball'];

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        // Mock schedule data
        const mockMatches = [
          {
            id: 1,
            sport: 'Cricket',
            team1: 'Mumbai Indians',
            team2: 'Chennai Super Kings',
            date: '2024-08-24',
            time: '19:30',
            venue: 'Wankhede Stadium',
            tournament: 'IPL 2024',
            status: 'scheduled',
            icon: '🏏',
            color: 'from-green-500 to-emerald-600'
          },
          {
            id: 2,
            sport: 'Football',
            team1: 'Manchester United',
            team2: 'Liverpool',
            date: '2024-08-24',
            time: '17:00',
            venue: 'Old Trafford',
            tournament: 'Premier League',
            status: 'scheduled',
            icon: '⚽',
            color: 'from-blue-500 to-cyan-600'
          },
          {
            id: 3,
            sport: 'Basketball',
            team1: 'Los Angeles Lakers',
            team2: 'Golden State Warriors',
            date: '2024-08-25',
            time: '20:00',
            venue: 'Crypto.com Arena',
            tournament: 'NBA Regular Season',
            status: 'scheduled',
            icon: '🏀',
            color: 'from-orange-500 to-red-600'
          },
          {
            id: 4,
            sport: 'Tennis',
            team1: 'Novak Djokovic',
            team2: 'Rafael Nadal',
            date: '2024-08-25',
            time: '14:00',
            venue: 'Centre Court',
            tournament: 'Wimbledon',
            status: 'scheduled',
            icon: '🎾',
            color: 'from-pink-500 to-rose-600'
          },
          {
            id: 5,
            sport: 'Hockey',
            team1: 'Boston Bruins',
            team2: 'New York Rangers',
            date: '2024-08-26',
            time: '19:00',
            venue: 'TD Garden',
            tournament: 'NHL Regular Season',
            status: 'scheduled',
            icon: '🏒',
            color: 'from-cyan-500 to-blue-600'
          },
          {
            id: 6,
            sport: 'Table Tennis',
            team1: 'Ma Long',
            team2: 'Fan Zhendong',
            date: '2024-08-26',
            time: '15:30',
            venue: 'Olympic Arena',
            tournament: 'World Championships',
            status: 'scheduled',
            icon: '🏓',
            color: 'from-indigo-500 to-purple-600'
          },
          {
            id: 7,
            sport: 'Badminton',
            team1: 'Viktor Axelsen',
            team2: 'Kento Momota',
            date: '2024-08-27',
            time: '16:00',
            venue: 'Istora Senayan',
            tournament: 'Indonesia Open',
            status: 'scheduled',
            icon: '🏸',
            color: 'from-yellow-500 to-orange-600'
          },
          {
            id: 8,
            sport: 'Volleyball',
            team1: 'Brazil',
            team2: 'Italy',
            date: '2024-08-27',
            time: '18:30',
            venue: 'Ariake Arena',
            tournament: 'FIVB World Championship',
            status: 'scheduled',
            icon: '🏐',
            color: 'from-purple-500 to-pink-600'
          }
        ];

        setMatches(mockMatches);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching schedule:', error);
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [selectedDate, selectedSport]);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDateString = (date) => {
    return date.toISOString().split('T')[0];
  };

  const navigateDate = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + direction);
    setSelectedDate(newDate);
  };

  const filteredMatches = matches.filter(match => {
    const matchesDate = match.date === getDateString(selectedDate);
    const matchesSport = selectedSport === 'all' || match.sport === selectedSport;
    const matchesSearch = searchQuery === '' || 
      match.team1.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.team2.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.tournament.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesDate && matchesSport && matchesSearch;
  });

  const groupedMatches = filteredMatches.reduce((groups, match) => {
    const time = match.time;
    if (!groups[time]) {
      groups[time] = [];
    }
    groups[time].push(match);
    return groups;
  }, {});

  const MatchCard = ({ match }) => (
    <Card className="mb-4 transition-shadow hover:shadow-lg">
      <div className={`h-1 bg-gradient-to-r ${match.color}`}></div>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{match.icon}</span>
            <Badge variant="outline">{match.sport}</Badge>
          </div>
          <Badge variant="secondary">{match.status.toUpperCase()}</Badge>
        </div>
        
        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">{match.team1}</span>
            <span className="text-sm text-gray-500">vs</span>
            <span className="text-lg font-semibold">{match.team2}</span>
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{match.tournament}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            <span>{match.time}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{match.venue}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto border-b-2 border-red-600 rounded-full animate-spin"></div>
          <p className="mt-4 font-medium text-gray-600">Loading Schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      {/* Header */}
      <div className="py-6 text-white bg-red-600">
        <div className="px-4 mx-auto max-w-7xl">
          <h1 className="flex items-center text-3xl font-bold">
            <Calendar className="w-8 h-8 mr-3" />
            Match Schedule
          </h1>
          <p className="mt-2 text-red-100">Plan your sports viewing experience</p>
        </div>
      </div>

      <div className="px-4 py-6 mx-auto max-w-7xl">
        {/* Date Navigation */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigateDate(-1)}
                className="flex items-center px-4 py-2 space-x-2 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Day</span>
              </button>
              
              <div className="text-center">
                <h2 className="text-2xl font-bold">{formatDate(selectedDate)}</h2>
                <p className="text-gray-600">
                  {filteredMatches.length} match{filteredMatches.length !== 1 ? 'es' : ''} scheduled
                </p>
              </div>
              
              <button
                onClick={() => navigateDate(1)}
                className="flex items-center px-4 py-2 space-x-2 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <span>Next Day</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <input
                    type="text"
                    placeholder="Search teams, tournaments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full py-2 pl-10 pr-4 text-gray-900 placeholder-gray-600 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Sport Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-600" />
                <select
                  value={selectedSport}
                  onChange={(e) => setSelectedSport(e.target.value)}
                  className="px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {sports.map(sport => (
                    <option key={sport} value={sport}>
                      {sport === 'all' ? 'All Sports' : sport}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Matches */}
        {Object.keys(groupedMatches).length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="mb-2 text-xl font-semibold text-gray-600">No matches scheduled</h3>
              <p className="text-gray-500">
                No matches found for {formatDate(selectedDate)}
                {selectedSport !== 'all' && ` in ${selectedSport}`}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedMatches)
              .sort(([timeA], [timeB]) => timeA.localeCompare(timeB))
              .map(([time, timeMatches]) => (
                <div key={time}>
                  <div className="flex items-center mb-4">
                    <Clock className="w-5 h-5 mr-2 text-red-600" />
                    <h3 className="text-xl font-bold">{time}</h3>
                    <div className="flex-1 h-px ml-4 bg-gray-300"></div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {timeMatches.map(match => (
                      <MatchCard key={match.id} match={match} />
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