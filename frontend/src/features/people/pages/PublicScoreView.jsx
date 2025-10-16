/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../cricket/UI/card';
import { Badge } from '../../cricket/UI/badge';
import { Separator } from '../../cricket/UI/separator';
import { Search, Menu, Bell, User, ChevronDown, Play, Clock, Calendar, TrendingUp, Star } from 'lucide-react';
import Navigation from '../../../components/Navigation';

const PublicScoreView = () => {
  const [liveMatches, setLiveMatches] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState('all');
  const [featuredNews, setFeaturedNews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchScores = async () => {
      try {
        // Fetch live matches
        const liveResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/public/live-matches${selectedSport !== 'all' ? `?sport=${selectedSport}` : ''}`);
        const liveData = await liveResponse.json();
        
        // Fetch recent matches
        const recentResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/public/recent-matches${selectedSport !== 'all' ? `?sport=${selectedSport}` : ''}`);
        const recentData = await recentResponse.json();
        
        if (liveData.success) {
          setLiveMatches(liveData.data || []);
        }
        
        if (recentData.success) {
          setRecentMatches(recentData.data || []);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching scores:', error);
        // Fallback to mock data if API fails
        setLiveMatches([
          {
            id: 1,
            sport: 'Cricket',
            team1: 'Mumbai Indians',
            team2: 'Chennai Super Kings',
            score1: '185/4',
            score2: '120/3',
            overs1: '20.0',
            overs2: '15.2',
            status: 'live',
            venue: 'Wankhede Stadium',
            team1Logo: '🏏',
            team2Logo: '🏏'
          },
          {
            id: 2,
            sport: 'Football',
            team1: 'Barcelona',
            team2: 'Real Madrid',
            score1: '2',
            score2: '1',
            status: 'live',
            time: '78\'',
            venue: 'Camp Nou',
            team1Logo: '⚽',
            team2Logo: '⚽'
          }
        ]);
        setRecentMatches([
          {
            id: 3,
            sport: 'Cricket',
            team1: 'India',
            team2: 'Australia',
            score1: '295/8',
            score2: '287/10',
            overs1: '50.0',
            overs2: '49.3',
            status: 'completed',
            result: 'India won by 8 runs',
            venue: 'MCG',
            team1Logo: '🏏',
            team2Logo: '🏏'
          }
        ]);
        
        // Mock news data
        setFeaturedNews([
          {
            id: 1,
            title: 'Mumbai Indians Dominate in IPL Thriller',
            summary: 'Rohit Sharma leads from the front as MI posts commanding total',
            image: '🏏',
            category: 'Cricket',
            time: '2 hours ago',
            featured: true
          },
          {
            id: 2,
            title: 'El Clasico Delivers Another Classic',
            summary: 'Barcelona edges Real Madrid in a thrilling encounter at Camp Nou',
            image: '⚽',
            category: 'Football',
            time: '4 hours ago',
            featured: false
          },
          {
            id: 3,
            title: 'Tennis Championship Reaches Semifinals',
            summary: 'Top seeds advance to the final four in dramatic fashion',
            image: '🎾',
            category: 'Tennis',
            time: '6 hours ago',
            featured: false
          }
        ]);
        
        setLoading(false);
      }
    };

    fetchScores();
    
    // Set up auto-refresh for live scores
    const interval = setInterval(fetchScores, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, [selectedSport]);

  const sports = ['all', 'Cricket', 'Football', 'Basketball', 'Tennis', 'Hockey'];

  const filteredLiveMatches = selectedSport === 'all' 
    ? liveMatches 
    : liveMatches.filter(match => match.sport === selectedSport);

  const filteredRecentMatches = selectedSport === 'all' 
    ? recentMatches 
    : recentMatches.filter(match => match.sport === selectedSport);


  const renderOtherSportScore = (match) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="pr-2 text-sm font-semibold truncate sm:text-base">{match.team1}</span>
        <span className="flex-shrink-0 text-base font-bold sm:text-lg">{match.score1}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="pr-2 text-sm font-semibold truncate sm:text-base">{match.team2}</span>
        <span className="flex-shrink-0 text-base font-bold sm:text-lg">{match.score2}</span>
      </div>
      {match.time && (
        <div className="mt-2 text-xs text-center text-gray-600 sm:text-sm">
          <Badge variant="outline" className="text-xs">{match.time}</Badge>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto border-b-2 border-red-600 rounded-full animate-spin"></div>
          <p className="mt-4 font-medium text-gray-600">Loading PlayVerse Sports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      {/* PlayVerse-style Header */}
      <header className="text-white bg-red-600">
        <div className="mx-auto max-w-7xl">
          {/* Top Bar */}
          <div className="flex items-center justify-between px-4 py-2 text-sm border-b border-red-700">
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold">PlayVerse</span>
              <span className="hidden md:block">Sports Center</span>
            </div>
            <div className="flex items-center space-x-4">
              <Bell className="w-4 h-4 cursor-pointer hover:text-red-200" />
              <User className="w-4 h-4 cursor-pointer hover:text-red-200" />
            </div>
          </div>
          
          {/* Main Navigation */}
          <nav className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <button className="flex items-center space-x-1 hover:text-red-200">
                  <Menu className="w-4 h-4" />
                  <span className="hidden sm:block">Menu</span>
                </button>
                <div className="items-center hidden space-x-6 text-sm font-medium md:flex">
                  <a href="#" className="pb-1 border-b-2 border-white hover:text-red-200">Home</a>
                  <a href="#" className="hover:text-red-200">Scores</a>
                  <a href="#" className="hover:text-red-200">Schedule</a>
                  <a href="#" className="hover:text-red-200">Standings</a>
                  <a href="#" className="hover:text-red-200">News</a>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative hidden sm:block">
                  <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <input
                    type="text"
                    placeholder="Search sports, teams, players..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 py-2 pl-10 pr-4 text-sm text-gray-900 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-300"
                  />
                </div>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Sports Navigation Bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="px-4 mx-auto max-w-7xl">
          <div className="flex items-center py-3 space-x-1 overflow-x-auto">
            {sports.map((sport) => (
              <button
                key={sport}
                onClick={() => setSelectedSport(sport)}
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
        </div>
      </div>

      <div className="px-4 py-6 mx-auto max-w-7xl">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - Featured Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Featured News Hero */}
            {featuredNews.length > 0 && (
              <div className="overflow-hidden bg-white rounded-lg shadow-sm">
                <div className="relative">
                  <div className="flex items-center justify-center h-64 bg-gradient-to-r from-red-500 to-red-600">
                    <div className="text-6xl">{featuredNews[0].image}</div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                    <span className="inline-block px-2 py-1 mb-2 text-xs font-bold text-white bg-red-600 rounded">
                      {featuredNews[0].category}
                    </span>
                    <h1 className="mb-2 text-2xl font-bold text-white">{featuredNews[0].title}</h1>
                    <p className="text-sm text-gray-200">{featuredNews[0].summary}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Live Scores Section */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="flex items-center text-xl font-bold text-gray-900">
                    <div className="w-3 h-3 mr-2 bg-red-500 rounded-full animate-pulse"></div>
                    Live Scores
                  </h2>
                  <span className="text-sm font-medium text-red-600">LIVE</span>
                </div>
              </div>
              
              <div className="p-6">
                {filteredLiveMatches.length === 0 ? (
                  <div className="py-8 text-center">
                    <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">No live matches at the moment</p>
                    <p className="mt-1 text-sm text-gray-400">Check back soon for live action!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredLiveMatches.map((match) => (
                      <div key={match.id} className="p-4 transition-shadow border border-gray-200 rounded-lg hover:shadow-md">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-1 text-xs font-bold text-red-800 bg-red-100 rounded">
                              LIVE
                            </span>
                            <span className="text-sm text-gray-600">{match.sport}</span>
                          </div>
                          {match.time && (
                            <span className="text-sm font-medium text-gray-900">{match.time}</span>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{match.team1Logo}</span>
                              <span className="font-semibold text-gray-900">{match.team1}</span>
                            </div>
                            <span className="text-xl font-bold">{match.score1}</span>
                          </div>
                          {match.overs1 && (
                            <div className="text-xs text-gray-500 ml-11">({match.overs1} overs)</div>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{match.team2Logo}</span>
                              <span className="font-semibold text-gray-900">{match.team2}</span>
                            </div>
                            <span className="text-xl font-bold">{match.score2}</span>
                          </div>
                          {match.overs2 && (
                            <div className="text-xs text-gray-500 ml-11">({match.overs2} overs)</div>
                          )}
                        </div>
                        
                        <div className="pt-3 mt-3 border-t border-gray-100">
                          <p className="text-sm text-gray-600">{match.venue}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Results */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Recent Results</h2>
              </div>
              
              <div className="p-6">
                {filteredRecentMatches.length === 0 ? (
                  <div className="py-8 text-center">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">No recent results found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredRecentMatches.map((match) => (
                      <div key={match.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <span className="px-2 py-1 text-xs font-bold text-green-800 bg-green-100 rounded">
                            FINAL
                          </span>
                          <span className="text-sm text-gray-600">{match.sport}</span>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{match.team1Logo}</span>
                              <span className="font-semibold text-gray-900">{match.team1}</span>
                            </div>
                            <span className="text-xl font-bold">{match.score1}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{match.team2Logo}</span>
                              <span className="font-semibold text-gray-900">{match.team2}</span>
                            </div>
                            <span className="text-xl font-bold">{match.score2}</span>
                          </div>
                        </div>
                        
                        {match.result && (
                          <div className="p-2 mt-3 text-sm font-medium text-green-800 rounded bg-green-50">
                            {match.result}
                          </div>
                        )}
                        
                        <div className="pt-3 mt-3 border-t border-gray-100">
                          <p className="text-sm text-gray-600">{match.venue}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Trending News */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="flex items-center text-lg font-bold text-gray-900">
                  <TrendingUp className="w-5 h-5 mr-2 text-red-600" />
                  Trending
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {featuredNews.slice(1).map((news, index) => (
                    <div key={news.id} className="flex p-2 space-x-3 rounded cursor-pointer hover:bg-gray-50">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-16 h-16 text-2xl bg-gray-200 rounded">
                          {news.image}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">
                          {news.title}
                        </p>
                        <div className="flex items-center mt-1 space-x-2">
                          <span className="text-xs font-medium text-red-600">{news.category}</span>
                          <span className="text-xs text-gray-500">{news.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">Quick Stats</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Live Matches</span>
                    <span className="font-bold text-red-600">{filteredLiveMatches.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Completed Today</span>
                    <span className="font-bold text-green-600">{filteredRecentMatches.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Sports Covered</span>
                    <span className="font-bold text-blue-600">{sports.length - 1}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PlayVerse-style Footer */}
      <footer className="mt-12 text-white bg-gray-900">
        <div className="px-4 py-8 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <h4 className="mb-4 text-lg font-bold">PlayVerse Sports</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white">Home</a></li>
                <li><a href="#" className="hover:text-white">Scores</a></li>
                <li><a href="#" className="hover:text-white">Schedule</a></li>
                <li><a href="#" className="hover:text-white">Standings</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-lg font-bold">Sports</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white">Cricket</a></li>
                <li><a href="#" className="hover:text-white">Football</a></li>
                <li><a href="#" className="hover:text-white">Basketball</a></li>
                <li><a href="#" className="hover:text-white">Tennis</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-lg font-bold">More PlayVerse</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white">Fantasy</a></li>
                <li><a href="#" className="hover:text-white">Watch</a></li>
                <li><a href="#" className="hover:text-white">Listen</a></li>
                <li><a href="#" className="hover:text-white">Shop</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-lg font-bold">Follow PlayVerse</h4>
              <div className="flex mb-4 space-x-4">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded cursor-pointer hover:bg-blue-700">
                  <span className="text-xs font-bold">f</span>
                </div>
                <div className="flex items-center justify-center w-8 h-8 bg-blue-400 rounded cursor-pointer hover:bg-blue-500">
                  <span className="text-xs font-bold">t</span>
                </div>
                <div className="flex items-center justify-center w-8 h-8 bg-red-600 rounded cursor-pointer hover:bg-red-700">
                  <span className="text-xs font-bold">y</span>
                </div>
              </div>
              <p className="text-xs text-gray-400">
                Scores update automatically every 30 seconds
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-between pt-8 mt-8 border-t border-gray-700 md:flex-row">
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>© 2024 PlayVerse Sports Management</span>
              <a href="#" className="hover:text-white">Terms of Use</a>
              <a href="#" className="hover:text-white">Privacy Policy</a>
            </div>
            <div className="mt-4 md:mt-0">
              <span className="text-sm text-gray-400">Powered by Sports API</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicScoreView;