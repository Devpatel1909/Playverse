/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Separator } from '../../../components/ui/separator';
import { Clock, Calendar, MapPin, Wifi, WifiOff } from 'lucide-react';
import Navigation from '../../../components/Navigation';
import { useLiveMatchesSocket } from '../../../hooks/useSocket';

const PublicScoreView = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [liveMatches, setLiveMatches] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState(searchParams.get('sport') || 'all');
  const [featuredNews, setFeaturedNews] = useState([]);
  
  // Socket.IO integration for real-time updates
  const { connected, liveMatches: socketLiveMatches } = useLiveMatchesSocket();

  // Update selected sport when URL parameter changes
  useEffect(() => {
    setSelectedSport(searchParams.get('sport') || 'all');
  }, [searchParams]);

  // Update live matches from Socket.IO
  useEffect(() => {
    if (socketLiveMatches && socketLiveMatches.length > 0) {
      setLiveMatches(socketLiveMatches);
    }
  }, [socketLiveMatches]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        // Try to fetch from real API first
        const publicScoreAPI = (await import('../../../services/publicScoreAPI')).default;
        const liveData = await publicScoreAPI.getLiveMatches(selectedSport === 'all' ? null : selectedSport);
        const recentData = await publicScoreAPI.getRecentMatches(selectedSport === 'all' ? null : selectedSport, 10);
        
        // If we have real data, use it
        if (liveData && liveData.length > 0) {
          setLiveMatches(liveData);
        } else {
          // Fallback to mock data for demo
          setLiveMatches([
          {
            id: 1,
            sport: 'Cricket',
            team1: 'Australia',
            team2: 'India',
            score1: '185/4',
            score2: '120/3',
            overs1: '20.0',
            overs2: '15.2',
            status: 'live',
            venue: 'The Gabba, Brisbane',
            tournament: 'India tour of Australia, 2025',
            time: 'Live',
            team1Logo: '🏏',
            team2Logo: '🏏',
            toss: 'Australia won the toss and opt to Bowl',
            umpires: 'Rod Tucker, Shawn Craig',
            referee: 'Jeff Crowe',
            stadium: 'The Gabba',
            city: 'Brisbane, Australia',
            capacity: '42000 (approx)',
            currentBatsman: {
              striker: 'Abhishek Sharma',
              strikerRuns: 23,
              nonStriker: 'Shubman Gill',
              nonStrikerRuns: 29
            },
            currentBowler: {
              name: 'Ben Dwarshuis',
              overs: '3.2',
              runs: 27,
              wickets: 0,
              maidens: 0
            }
          },
          {
            id: 2,
            sport: 'Cricket',
            team1: 'England',
            team2: 'Pakistan',
            score1: '245/6',
            score2: '198/8',
            overs1: '50.0',
            overs2: '45.3',
            status: 'live',
            venue: 'Lord\'s Cricket Ground',
            tournament: 'ICC World Cup 2025',
            time: 'Live',
            team1Logo: '🏏',
            team2Logo: '🏏',
            toss: 'England won the toss and opt to Bat',
            umpires: 'Kumar Dharmasena, Marais Erasmus',
            referee: 'Ranjan Madugalle',
            stadium: 'Lord\'s',
            city: 'London, England',
            capacity: '30000 (approx)'
          },
          {
            id: 3,
            sport: 'Football',
            team1: 'Manchester United',
            team2: 'Liverpool',
            score1: '2',
            score2: '1',
            status: 'live',
            time: '67\' - 2nd Half',
            venue: 'Old Trafford',
            tournament: 'Premier League',
            team1Logo: '⚽',
            team2Logo: '⚽'
          },
          {
            id: 4,
            sport: 'Basketball',
            team1: 'LA Lakers',
            team2: 'Golden State Warriors',
            score1: '98',
            score2: '102',
            status: 'live',
            time: 'Q4 - 2:45',
            venue: 'Crypto.com Arena',
            tournament: 'NBA Regular Season',
            team1Logo: '🏀',
            team2Logo: '🏀'
          },
          {
            id: 5,
            sport: 'Tennis',
            team1: 'Carlos Alcaraz',
            team2: 'Novak Djokovic',
            score1: '6-4, 3-6, 5-4',
            score2: '',
            status: 'live',
            time: 'Set 3 - In Progress',
            venue: 'Centre Court',
            tournament: 'ATP Finals',
            team1Logo: '🎾',
            team2Logo: '🎾'
          },
          {
            id: 6,
            sport: 'Hockey',
            team1: 'Toronto Maple Leafs',
            team2: 'Montreal Canadiens',
            score1: '3',
            score2: '2',
            status: 'live',
            time: 'P2 - 8:23',
            venue: 'Scotiabank Arena',
            tournament: 'NHL Regular Season',
            team1Logo: '🏒',
            team2Logo: '🏒'
          }
        ]);
        }
        
        if (recentData && recentData.length > 0) {
          setRecentMatches(recentData);
        } else {
          setRecentMatches([
          {
            id: 'recent-1',
            sport: 'Cricket',
            team1: 'India',
            team2: 'South Africa',
            score1: '295/8',
            score2: '287/10',
            overs1: '50.0',
            overs2: '49.3',
            status: 'completed',
            result: 'India won by 8 runs',
            venue: 'Melbourne Cricket Ground',
            team1Logo: '🏏',
            team2Logo: '🏏'
          },
          {
            id: 'recent-2',
            sport: 'Cricket',
            team1: 'New Zealand',
            team2: 'West Indies',
            score1: '178/9',
            score2: '175/10',
            overs1: '20.0',
            overs2: '19.5',
            status: 'completed',
            result: 'New Zealand won by 3 runs',
            venue: 'Eden Park',
            team1Logo: '🏏',
            team2Logo: '🏏'
          },
          {
            id: 'recent-3',
            sport: 'Football',
            team1: 'Barcelona',
            team2: 'Real Madrid',
            score1: '3',
            score2: '2',
            status: 'completed',
            result: 'Barcelona won',
            venue: 'Camp Nou',
            team1Logo: '⚽',
            team2Logo: '⚽'
          },
          {
            id: 'recent-4',
            sport: 'Football',
            team1: 'Manchester City',
            team2: 'Arsenal',
            score1: '2',
            score2: '2',
            status: 'completed',
            result: 'Draw',
            venue: 'Etihad Stadium',
            team1Logo: '⚽',
            team2Logo: '⚽'
          },
          {
            id: 'recent-5',
            sport: 'Basketball',
            team1: 'Boston Celtics',
            team2: 'Miami Heat',
            score1: '118',
            score2: '112',
            status: 'completed',
            result: 'Celtics won',
            venue: 'TD Garden',
            team1Logo: '🏀',
            team2Logo: '🏀'
          },
          {
            id: 'recent-6',
            sport: 'Basketball',
            team1: 'Brooklyn Nets',
            team2: 'Philadelphia 76ers',
            score1: '105',
            score2: '110',
            status: 'completed',
            result: '76ers won',
            venue: 'Barclays Center',
            team1Logo: '🏀',
            team2Logo: '🏀'
          },
          {
            id: 'recent-7',
            sport: 'Tennis',
            team1: 'Iga Swiatek',
            team2: 'Aryna Sabalenka',
            score1: '6-4, 7-5',
            score2: '',
            status: 'completed',
            result: 'Swiatek won in straight sets',
            venue: 'Rod Laver Arena',
            team1Logo: '🎾',
            team2Logo: '🎾'
          },
          {
            id: 'recent-8',
            sport: 'Hockey',
            team1: 'Edmonton Oilers',
            team2: 'Calgary Flames',
            score1: '5',
            score2: '3',
            status: 'completed',
            result: 'Oilers won',
            venue: 'Rogers Place',
            team1Logo: '🏒',
            team2Logo: '🏒'
          }
        ]);
        }
        
        // Mock news data
        setFeaturedNews([
          {
            id: 1,
            title: 'India Clinches Thriller Against Australia',
            summary: 'Sharma and Gill power India to commanding position in T20 series',
            image: '🏏',
            category: 'Cricket',
            time: '1 hour ago',
            featured: true
          },
          {
            id: 2,
            title: 'Lakers-Warriors Rivalry Heats Up',
            summary: 'Warriors edge Lakers in overtime thriller at Crypto.com Arena',
            image: '🏀',
            category: 'Basketball',
            time: '3 hours ago',
            featured: false
          },
          {
            id: 3,
            title: 'Alcaraz vs Djokovic: Battle of Generations',
            summary: 'ATP Finals semifinal showcases tennis at its finest',
            image: '🎾',
            category: 'Tennis',
            time: '5 hours ago',
            featured: false
          }
        ]);
        
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
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
    <div className="min-h-screen bg-gray-100 overflow-x-hidden w-full">
      <Navigation />

      {/* Sports Navigation Bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="px-4 mx-auto max-w-7xl">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-1 overflow-x-auto">
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
            
            {/* Real-time connection status */}
            <div className="flex items-center ml-4 space-x-2">
              {connected ? (
                <>
                  <Wifi className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-medium text-green-600">Live</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-medium text-gray-400">Offline</span>
                </>
              )}
            </div>
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
                      <Link 
                        key={match.id} 
                        to={`/match/${match.id}`}
                        state={{ fromSport: selectedSport }}
                        className="block"
                      >
                        <div className="overflow-hidden border border-gray-200 rounded-lg hover:shadow-lg transition-shadow cursor-pointer bg-white">
                          {/* Green top bar */}
                          <div className="h-2 bg-green-600"></div>
                          
                          {/* Match Header */}
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <span className="text-2xl">{match.team1Logo}</span>
                                <Badge variant="outline" className="text-xs">{match.sport}</Badge>
                              </div>
                              <Badge variant="destructive" className="animate-pulse">LIVE</Badge>
                            </div>

                            {/* Team Scores */}
                            {match.sport === 'Cricket' ? (
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-lg font-bold text-gray-900">{match.team1}</span>
                                  <span className="text-3xl font-bold text-gray-900">{match.score1}</span>
                                </div>
                                {match.overs1 && (
                                  <div className="text-sm text-gray-600 text-right">({match.overs1} Ov)</div>
                                )}
                                
                                <div className="flex items-center justify-between">
                                  <span className="text-lg font-bold text-gray-900">{match.team2}</span>
                                  <span className="text-3xl font-bold text-gray-900">{match.score2}</span>
                                </div>
                                {match.overs2 && (
                                  <div className="text-sm text-gray-600 text-right">({match.overs2} Ov)</div>
                                )}
                              </div>
                            ) : match.sport === 'Tennis' ? (
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-lg font-bold text-gray-900">{match.team1}</span>
                                  <span className="text-2xl font-bold text-gray-900">{match.score1}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-lg font-bold text-gray-900">{match.team2}</span>
                                  <span className="text-2xl font-bold text-gray-900">{match.score2 || '0-0, 0-0'}</span>
                                </div>
                              </div>
                            ) : (
                              <div className="grid grid-cols-2 gap-6">
                                <div className="text-center">
                                  <div className="text-sm text-gray-600 mb-2">{match.team1}</div>
                                  <div className="text-5xl font-bold text-gray-900">{match.score1}</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-sm text-gray-600 mb-2">{match.team2}</div>
                                  <div className="text-5xl font-bold text-gray-900">{match.score2}</div>
                                </div>
                              </div>
                            )}

                            {/* Venue and Time */}
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                              <div className="flex items-center text-sm text-gray-600">
                                <MapPin className="w-4 h-4 mr-1" />
                                {match.venue}
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <Clock className="w-4 h-4 mr-1" />
                                {match.time || 'Live'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
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
                        
                        {match.sport === 'Cricket' ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <span className="text-2xl">{match.team1Logo}</span>
                                <span className="font-semibold text-gray-900">{match.team1}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-xl font-bold">{match.score1}</span>
                                {match.overs1 && <div className="text-xs text-gray-600">({match.overs1} Ov)</div>}
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <span className="text-2xl">{match.team2Logo}</span>
                                <span className="font-semibold text-gray-900">{match.team2}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-xl font-bold">{match.score2}</span>
                                {match.overs2 && <div className="text-xs text-gray-600">({match.overs2} Ov)</div>}
                              </div>
                            </div>
                          </div>
                        ) : match.sport === 'Tennis' ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <span className="text-2xl">{match.team1Logo}</span>
                                <span className="font-semibold text-gray-900">{match.team1}</span>
                              </div>
                              <span className="text-lg font-bold">{match.score1}</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <span className="text-2xl">{match.team2Logo}</span>
                                <span className="font-semibold text-gray-900">{match.team2}</span>
                              </div>
                              <span className="text-lg font-bold">{match.score2 || '-'}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-6 py-4">
                            <div className="text-center">
                              <div className="flex items-center justify-center space-x-2 mb-2">
                                <span className="text-2xl">{match.team1Logo}</span>
                                <span className="font-semibold text-gray-900">{match.team1}</span>
                              </div>
                              <span className="text-4xl font-bold text-gray-900">{match.score1}</span>
                            </div>
                            
                            <div className="text-center">
                              <div className="flex items-center justify-center space-x-2 mb-2">
                                <span className="text-2xl">{match.team2Logo}</span>
                                <span className="font-semibold text-gray-900">{match.team2}</span>
                              </div>
                              <span className="text-4xl font-bold text-gray-900">{match.score2}</span>
                            </div>
                          </div>
                        )}
                        
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
