/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Activity, Target, Clock, MapPin, ChevronRight } from 'lucide-react';
import Navigation from '../components/Navigation';

const HomePage = () => {
  const [featuredMatches, setFeaturedMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // Mock data for homepage
        const mockFeaturedMatches = [
          {
            id: 1,
            sport: 'Cricket',
            team1: 'Mumbai Indians',
            team2: 'Chennai Super Kings',
            score1: '185/4',
            score2: '120/3',
            status: 'live',
            venue: 'Wankhede Stadium',
            time: 'Live',
            icon: '🏏',
            color: 'from-green-500 to-emerald-600'
          },
          {
            id: 2,
            sport: 'Football',
            team1: 'Manchester United',
            team2: 'Liverpool',
            score1: '2',
            score2: '1',
            status: 'live',
            venue: 'Old Trafford',
            time: '67\'',
            icon: '⚽',
            color: 'from-blue-500 to-cyan-600'
          },
          {
            id: 3,
            sport: 'Basketball',
            team1: 'Lakers',
            team2: 'Warriors',
            score1: '98',
            score2: '102',
            status: 'live',
            venue: 'Crypto.com Arena',
            time: '4th - 2:45',
            icon: '🏀',
            color: 'from-orange-500 to-red-600'
          }
        ];

        setFeaturedMatches(mockFeaturedMatches);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching home data:', error);
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const FeaturedMatchCard = ({ match }) => (
    <Card className="overflow-hidden h-full bg-white">
      <div className={`h-2 bg-gradient-to-r ${match.color}`}></div>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-xl md:text-2xl">{match.icon}</span>
            <Badge variant="outline" className="text-xs">{match.sport}</Badge>
          </div>
          <Badge variant="destructive" className="animate-pulse text-xs">
            <Activity className="w-3 h-3 mr-1" />
            {match.status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm md:text-base font-semibold text-gray-900 truncate pr-2">{match.team1}</span>
            <span className="text-xl md:text-2xl font-bold text-gray-900 flex-shrink-0">{match.score1}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm md:text-base font-semibold text-gray-900 truncate pr-2">{match.team2}</span>
            <span className="text-xl md:text-2xl font-bold text-gray-900 flex-shrink-0">{match.score2}</span>
          </div>
          <div className="flex items-center justify-between text-xs md:text-sm text-gray-800 flex-wrap gap-2">
            <div className="flex items-center text-gray-800">
              <MapPin className="w-3 h-3 md:w-4 md:h-4 mr-1 flex-shrink-0" />
              <span className="truncate">{match.venue}</span>
            </div>
            <div className="flex items-center text-gray-800 flex-shrink-0">
              <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1" />
              {match.time}
            </div>
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
          <p className="mt-4 font-medium text-gray-600">Loading PlayVerse...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 overflow-x-hidden w-full">
      <Navigation />
      {/* Hero Section */}
      <div className="py-12 text-white bg-gradient-to-r from-red-600 to-red-700 w-full">
        <div className="px-4 mx-auto max-w-7xl w-full">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold md:text-6xl">
              Welcome to PlayVerse
            </h1>
            <p className="text-xl text-red-100 md:text-2xl">
              Your Ultimate Sports Experience Hub
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-8 mx-auto max-w-7xl w-full">
        {/* Featured Live Matches */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="flex items-center text-xl md:text-2xl font-bold text-gray-900">
              <Activity className="w-5 h-5 md:w-6 md:h-6 mr-2 text-red-600" />
              <span className="text-gray-900">Live Matches</span>
            </h2>
            <Link to="/scores" className="flex items-center text-sm md:text-base font-medium text-red-600 hover:text-red-700">
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredMatches.map(match => (
              <FeaturedMatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>

        {/* Sports Categories */}
        <div className="mt-12">
          <h2 className="flex items-center mb-6 text-2xl font-bold text-gray-900">
            <Target className="w-6 h-6 mr-2 text-green-600" />
            Explore Sports
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4">
            {[
              { name: 'Cricket', icon: '🏏', color: 'from-green-500 to-emerald-600' },
              { name: 'Football', icon: '⚽', color: 'from-blue-500 to-cyan-600' },
              { name: 'Basketball', icon: '🏀', color: 'from-orange-500 to-red-600' },
              { name: 'Tennis', icon: '🎾', color: 'from-pink-500 to-rose-600' },
              { name: 'Hockey', icon: '🏒', color: 'from-cyan-500 to-blue-600' },
              { name: 'Table Tennis', icon: '🏓', color: 'from-indigo-500 to-purple-600' },
              { name: 'Badminton', icon: '🏸', color: 'from-yellow-500 to-orange-600' },
              { name: 'Volleyball', icon: '🏐', color: 'from-purple-500 to-pink-600' }
            ].map((sport, index) => {
              const sportPath = sport.name.toLowerCase().replace(' ', '').replace('table tennis', 'tabletennis');
              return (
                <Link key={index} to={`/scores/${sportPath}`}>
                  <Card className="text-center transition-shadow cursor-pointer hover:shadow-lg h-full bg-white">
                    <CardContent className="pt-4 pb-4 md:pt-6 md:pb-6">
                      <div className={`inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-r ${sport.color} mb-2 md:mb-3`}>
                        <span className="text-xl md:text-2xl">{sport.icon}</span>
                      </div>
                      <div className="text-xs md:text-sm font-semibold text-gray-900">{sport.name}</div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
