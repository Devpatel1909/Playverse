/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Users, Calendar, CheckCircle2, TrendingUp, Activity, Target, Award, Globe, Cpu, Database, BarChart3, Crown, Sparkles, Menu, X, Search, Filter, Bell, Settings, LogOut, Home, ChevronRight, Play, Pause, RotateCcw, Eye, Upload, ImageIcon, Edit3, Trash2, Save, Camera } from 'lucide-react';
import superAdminAPIService from '../../../services/superAdminAPI';
import cricketAPIService from '../../../services/cricketAPI';

const SportsDashboard = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedSport, setSelectedSport] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoManager, setShowLogoManager] = useState(false);
  const [selectedTeamForLogo, setSelectedTeamForLogo] = useState(null);
  const [teamLogos, setTeamLogos] = useState({});
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    totalPlayers: 0,
    totalSports: 0,
    totalTeams: 0,
    matchesCompleted: 0,
    activeMatches: 0,
    upcomingMatches: 0
  });
  const [cricketTeams, setCricketTeams] = useState([]);
  // Get cricket data from localStorage or use default
  const getCricketData = () => {
    try {
      const storedTeams = localStorage.getItem('cricketTeams');
      if (storedTeams) {
        const teams = JSON.parse(storedTeams);
        const totalPlayers = teams.reduce((total, team) => total + (team.players?.length || 0), 0);
        return {
          teams: teams.length,
          players: totalPlayers,
          teamList: teams.map(team => ({
            id: team.id,
            name: team.name,
            shortName: team.shortName,
            logo: team.logo,
            playerCount: team.players?.length || 0
          }))
        };
      }
    } catch (error) {
      console.warn('Error loading cricket data from localStorage:', error);
    }
    return { teams: 3, players: 9, teamList: [] };
  };

  const [sportsData, setSportsData] = useState([
    {
      id: 1,
      name: 'Cricket',
      icon: '🏏',
      players: getCricketData().players,
      teams: getCricketData().teams,
      matches: 25,
      status: 'active',
      progress: 65,
      description: 'Premier cricket tournament with international standards',
      nextMatch: 'Finals - Team A vs Team B',
      color: 'from-emerald-500 to-green-600',
      teamList: getCricketData().teamList
    },
    {
      id: 2,
      name: 'Football',
      icon: '⚽',
      players: 280,
      teams: 35,
      matches: 18,
      status: 'active',
      progress: 45,
      description: 'International football championship',
      nextMatch: 'Semi-finals - Lions vs Eagles',
      color: 'from-blue-500 to-cyan-600',
      teamList: [
        { id: 5, name: 'FC Ahmedabad', shortName: 'FCA', logo: null },
        { id: 6, name: 'Gujarat United', shortName: 'GU', logo: null },
        { id: 7, name: 'Surat Strikers', shortName: 'SS', logo: null }
      ]
    },
    {
      id: 3,
      name: 'Basketball',
      icon: '🏀',
      players: 180,
      teams: 15,
      matches: 12,
      status: 'active',
      progress: 80,
      description: 'Professional basketball league',
      nextMatch: 'Championship - Warriors vs Kings',
      color: 'from-orange-500 to-red-600',
      teamList: [
        { id: 8, name: 'Ahmedabad Ballers', shortName: 'AB', logo: null },
        { id: 9, name: 'Vadodara Hoops', shortName: 'VH', logo: null }
      ]
    },
    {
      id: 4,
      name: 'Badminton',
      icon: '🏸',
      players: 128,
      teams: 32,
      matches: 16,
      status: 'completed',
      progress: 100,
      description: 'Singles and doubles badminton championship',
      nextMatch: 'Tournament completed',
      color: 'from-purple-500 to-violet-600',
      teamList: [
        { id: 10, name: 'Shuttlers Club', shortName: 'SC', logo: null },
        { id: 11, name: 'Racket Masters', shortName: 'RM', logo: null }
      ]
    },
    {
      id: 5,
      name: 'Volleyball',
      icon: '🏐',
      players: 144,
      teams: 18,
      matches: 9,
      status: 'upcoming',
      progress: 0,
      description: 'Beach and indoor volleyball tournament',
      nextMatch: 'Opening ceremony - March 15',
      color: 'from-yellow-500 to-orange-600',
      teamList: [
        { id: 12, name: 'Beach Volley', shortName: 'BV', logo: null },
        { id: 13, name: 'Net Warriors', shortName: 'NW', logo: null }
      ]
    },
    {
      id: 6,
      name: 'Tennis',
      icon: '🎾',
      players: 96,
      teams: 24,
      matches: 14,
      status: 'active',
      progress: 55,
      description: 'Singles tennis championship',
      nextMatch: 'Quarter-finals ongoing',
      color: 'from-pink-500 to-rose-600',
      teamList: [
        { id: 14, name: 'Ace Players', shortName: 'AP', logo: null },
        { id: 15, name: 'Court Kings', shortName: 'CK', logo: null }
      ]
    },
    {
      id: 7,
      name: 'Table Tennis',
      icon: '🏓',
      players: 64,
      teams: 16,
      matches: 8,
      status: 'active',
      progress: 25,
      description: 'Fast-paced table tennis tournament',
      nextMatch: 'Round of 16 - Tomorrow',
      color: 'from-indigo-500 to-blue-600',
      teamList: [
        { id: 16, name: 'Paddle Masters', shortName: 'PM', logo: null },
        { id: 17, name: 'Spin Doctors', shortName: 'SD', logo: null }
      ]
    },
    {
      id: 8,
      name: 'Hockey',
      icon: '🏒',
      players: 110,
      teams: 10,
      matches: 6,
      status: 'upcoming',
      progress: 0,
      description: 'Ice hockey championship',
      nextMatch: 'Season starts April 1',
      color: 'from-teal-500 to-cyan-600',
      teamList: [
        { id: 18, name: 'Ice Breakers', shortName: 'IB', logo: null },
        { id: 19, name: 'Stick Warriors', shortName: 'SW', logo: null }
      ]
    }
  ]);
  const containerRef = useRef(null);

  // Refresh cricket data from localStorage
  const refreshCricketData = useCallback(() => {
    const cricketData = getCricketData();
    setSportsData(prevData => 
      prevData.map(sport => 
        sport.name === 'Cricket' 
          ? { 
              ...sport, 
              teams: cricketData.teams,
              players: cricketData.players,
              teamList: cricketData.teamList
            }
          : sport
      )
    );
    
    // Update dashboard stats with current cricket data
    setDashboardStats(prevStats => {
      const currentCricketData = prevStats.totalPlayers ? getCricketData() : { players: 0, teams: 0 };
      return {
        ...prevStats,
        totalPlayers: Math.max(prevStats.totalPlayers + cricketData.players - (currentCricketData.players || 0), cricketData.players),
        totalTeams: Math.max(prevStats.totalTeams + cricketData.teams - (currentCricketData.teams || 0), cricketData.teams)
      };
    });
  }, []);

  // Load dashboard data from API
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        console.log('Loading dashboard data...');

        // Refresh cricket data from localStorage
        refreshCricketData();

        // Use static data for dashboard stats (since we removed backend integration)
        const cricketData = getCricketData();
        setDashboardStats({
          totalPlayers: cricketData.players + 743, // Add other sports' static players
          totalSports: 8,
          totalTeams: cricketData.teams + 131, // Add other sports' static teams
          matchesCompleted: 82,
          activeMatches: 12,
          upcomingMatches: 28
        });

      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [refreshCricketData]);

  // Listen for storage changes (when data is updated in cricket management)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'cricketTeams') {
        refreshCricketData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events when localStorage is updated in the same tab
    const handleCricketUpdate = () => {
      refreshCricketData();
    };
    
    window.addEventListener('cricketTeamsUpdated', handleCricketUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cricketTeamsUpdated', handleCricketUpdate);
    };
  }, [refreshCricketData]);

  // Mouse tracking effect
  useEffect(() => {
    let animationFrameId;
    const handleMouseMove = (e) => {
      if (window.innerWidth >= 768) {
        const container = containerRef.current;
        if (container) {
          const rect = container.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          
          animationFrameId = requestAnimationFrame(() => {
            setMousePosition({ x, y });
          });
        }
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Filter sports based on search and filter
  const filteredSports = sportsData.filter(sport => {
    const matchesSearch = sport.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterActive === 'all' || sport.status === filterActive;
    return matchesSearch && matchesFilter;
  });

  // Logo management functions
  const handleLogoUpload = (teamId, file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTeamLogos(prev => ({
          ...prev,
          [teamId]: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = (teamId) => {
    setTeamLogos(prev => {
      const newLogos = { ...prev };
      delete newLogos[teamId];
      return newLogos;
    });
  };

  const openLogoManager = (sport) => {
    setSelectedTeamForLogo(sport);
    setShowLogoManager(true);
  };

  // Logout function
  const handleLogout = async () => {
    try {
      await superAdminAPIService.logout();
      navigate('/superadmin/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, navigate to login
      navigate('/superadmin/login');
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color, trend }) => (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 via-violet-500/20 to-emerald-500/20 rounded-2xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 p-4 md:p-6 hover:border-white/20 transition-all duration-300 hover:scale-[1.02]">
        <div className="flex items-start justify-between mb-3">
          <div className={`p-2 md:p-3 rounded-xl bg-gradient-to-r ${color} shadow-lg`}>
            <Icon className="w-5 h-5 text-white md:w-6 md:h-6" />
          </div>
          {trend && (
            <div className="flex items-center space-x-1 text-emerald-400">
              <TrendingUp className="w-3 h-3" />
              <span className="text-xs font-semibold">+{trend}%</span>
            </div>
          )}
        </div>
        <h3 className="mb-1 text-2xl font-bold text-white md:text-3xl">
          {(value || 0).toLocaleString()}
        </h3>
        <p className="text-sm font-medium text-white/60">{title}</p>
        {subtitle && <p className="mt-1 text-xs text-white/40">{subtitle}</p>}
      </div>
    </div>
  );

  const SportCard = ({ sport }) => {
    const handleSportClick = () => {
      if (sport.name === 'Cricket') {
        navigate('/cricket-management');
      } else {
        setSelectedSport(selectedSport?.id === sport.id ? null : sport);
      }
    };

    return (
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 via-violet-500/20 to-emerald-500/20 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 p-4 md:p-6 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
             onClick={handleSportClick}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${sport.color} shadow-lg`}>
                <span className="text-2xl">{sport.icon}</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white md:text-xl">{sport.name}</h3>
                <div className="flex items-center mt-1 space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    sport.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                    sport.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {sport.status.charAt(0).toUpperCase() + sport.status.slice(1)}
                  </span>
                  <span className="text-xs text-white/60">{sport.progress}% Complete</span>
                </div>
              </div>
            </div>
            <ChevronRight className={`w-5 h-5 text-white/40 transition-transform duration-300 ${selectedSport?.id === sport.id ? 'rotate-90' : ''}`} />
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center">
              <div className="text-lg font-bold text-white md:text-xl">{sport.players}</div>
              <div className="text-xs text-white/60">Players</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-white md:text-xl">{sport.teams}</div>
              <div className="text-xs text-white/60">Teams</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-white md:text-xl">{sport.matches}</div>
              <div className="text-xs text-white/60">Matches</div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/60">Tournament Progress</span>
              <span className="text-xs font-semibold text-white/80">{sport.progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div 
                className={`h-full bg-gradient-to-r ${sport.color} transition-all duration-1000 ease-out`}
                style={{ width: `${sport.progress}%` }}
              ></div>
            </div>
          </div>

          {selectedSport?.id === sport.id && sport.name !== 'Cricket' && (
            <div className="mt-4 p-4 bg-white/[0.02] rounded-xl border border-white/10 animate-slide-in">
              <p className="mb-3 text-sm text-white/80">{sport.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs text-white/60">
                  <Calendar className="w-3 h-3" />
                  <span>{sport.nextMatch}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openLogoManager(sport);
                  }}
                  className="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-blue-500/20 to-violet-500/20 rounded-lg border border-blue-500/30 text-blue-400 hover:from-blue-500/30 hover:to-violet-500/30 transition-all duration-300 text-xs"
                >
                  <Camera className="w-3 h-3" />
                  <span>Manage Team Logos</span>
                </button>
              </div>
            </div>
          )}

          {sport.name === 'Cricket' && (
            <div className="mt-4 space-y-3">
              <div className="p-3 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl border border-green-500/20">
                <p className="text-sm text-green-400 font-medium mb-2">Click to manage cricket teams and players</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{sport.teams}</div>
                    <div className="text-xs text-white/60">Active Teams</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{sport.players}</div>
                    <div className="text-xs text-white/60">Total Players</div>
                  </div>
                </div>
                {sport.teamList && sport.teamList.length > 0 && (
                  <div className="mt-3 space-y-1">
                    <div className="text-xs text-green-300 font-medium">Recent Teams:</div>
                    {sport.teamList.slice(0, 3).map(team => (
                      <div key={team.id} className="flex items-center justify-between text-xs text-white/70">
                        <span>{team.name}</span>
                        <span className="text-green-400">{team.playerCount || 0} players</span>
                      </div>
                    ))}
                    {sport.teamList.length > 3 && (
                      <div className="text-xs text-white/50">+{sport.teamList.length - 3} more teams</div>
                    )}
                  </div>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openLogoManager(sport);
                }}
                className="w-full flex items-center justify-center space-x-2 p-2 bg-gradient-to-r from-blue-500/10 to-violet-500/10 rounded-xl border border-blue-500/20 text-blue-400 hover:from-blue-500/20 hover:to-violet-500/20 transition-all duration-300 text-sm"
              >
                <Camera className="w-4 h-4" />
                <span>Manage Team Logos</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-violet-950"
    >
      {/* Show loading spinner while data is loading */}
      {loading && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center z-50">
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/30 to-violet-500/30 rounded-3xl blur-xl animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 mb-4 animate-spin">
                <Cpu className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Loading Dashboard</h3>
              <p className="text-white/70">Fetching latest tournament data...</p>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic background overlay */}
      <div 
        className="fixed inset-0 transition-all duration-1000 pointer-events-none opacity-20 md:opacity-30"
        style={{
          background: typeof window !== 'undefined' && window.innerWidth >= 768 
            ? `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at ${100 - mousePosition.x}% ${100 - mousePosition.y}%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)`
            : 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)'
        }}
      ></div>

      {/* Grid pattern overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-5 md:opacity-10">
        <div 
          className="w-full h-full" 
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'grid-move 20s linear infinite'
          }}
        ></div>
      </div>

      {/* Floating particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full blur-sm animate-float-${i % 4}`}
            style={{
              width: `${15 + (i % 3) * 10}px`,
              height: `${15 + (i % 3) * 10}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              background: `linear-gradient(135deg, ${
                i % 4 === 0 ? 'rgba(59, 130, 246, 0.08)' :
                i % 4 === 1 ? 'rgba(139, 92, 246, 0.08)' :
                i % 4 === 2 ? 'rgba(16, 185, 129, 0.08)' :
                'rgba(236, 72, 153, 0.08)'
              }, transparent)`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${8 + (i % 3) * 2}s`
            }}
          ></div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full min-h-screen p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-violet-500/20 to-emerald-500/20 rounded-3xl blur-xl animate-pulse-glow"></div>
            
            <div className="relative bg-white/[0.02] backdrop-blur-2xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
              <div className="relative p-6 md:p-8">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-violet-500/5 to-emerald-500/5"></div>
                
                <div className="relative z-10 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                  <div className="flex items-center space-x-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 transition-all duration-500 border shadow-lg md:w-20 md:h-20 group rounded-2xl bg-gradient-to-r from-blue-500/20 to-violet-500/20 border-white/10 hover:scale-110 hover:rotate-3">
                      <div className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-r from-blue-500 to-violet-500 rounded-2xl group-hover:opacity-10"></div>
                      <Trophy className="w-8 h-8 text-blue-400 transition-colors duration-500 md:w-10 md:h-10 group-hover:text-white" />
                      <div className="absolute flex items-center justify-center w-6 h-6 rounded-full -top-1 -right-1 bg-emerald-500">
                        <Sparkles className="w-3 h-3 text-white animate-spin" />
                      </div>
                    </div>
                    
                    <div>
                      <h1 className="text-2xl font-bold text-transparent md:text-4xl bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400 bg-clip-text">
                        Sports Tournament Dashboard
                      </h1>
                      <p className="mt-1 text-white/70">Professional Tournament Management System</p>
                      
                      <div className="flex items-center mt-2 space-x-4">
                        <div className="flex items-center space-x-1 text-emerald-400">
                          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
                          <Globe className="w-4 h-4" />
                          <span className="text-sm">Live</span>
                        </div>
                        <div className="flex items-center space-x-1 text-blue-400">
                          <Database className="w-4 h-4" />
                          <span className="text-sm">Secure</span>
                        </div>
                        <div className="flex items-center space-x-1 text-violet-400">
                          <Cpu className="w-4 h-4" />
                          <span className="text-sm">Fast</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button className="p-3 bg-white/[0.05] border border-white/10 rounded-xl hover:bg-white/[0.1] transition-all duration-300 hover:scale-110">
                      <Bell className="w-5 h-5 text-white/70" />
                    </button>
                    <button className="p-3 bg-white/[0.05] border border-white/10 rounded-xl hover:bg-white/[0.1] transition-all duration-300 hover:scale-110">
                      <Settings className="w-5 h-5 text-white/70" />
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center px-4 py-2 space-x-2 transition-all duration-300 border bg-gradient-to-r from-red-500/20 to-red-600/20 border-red-500/30 rounded-xl hover:from-red-500/30 hover:to-red-600/30"
                    >
                      <LogOut className="w-4 h-4 text-red-400" />
                      <span className="font-medium text-red-400">Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Overview */}
        <div className="mb-8">
          <h2 className="flex items-center mb-6 text-xl font-bold text-white md:text-2xl">
            <BarChart3 className="w-6 h-6 mr-3 text-blue-400" />
            Tournament Overview
          </h2>
          
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6 md:gap-6">
            <StatCard
              icon={Users}
              title="Total Players"
              value={dashboardStats.totalPlayers}
              subtitle="Across all sports"
              color="from-blue-500 to-blue-600"
              trend={12}
            />
            <StatCard
              icon={Trophy}
              title="Total Sports"
              value={dashboardStats.totalSports}
              subtitle="Active tournaments"
              color="from-emerald-500 to-emerald-600"
              trend={5}
            />
            <StatCard
              icon={Target}
              title="Total Teams"
              value={dashboardStats.totalTeams}
              subtitle="Participating teams"
              color="from-violet-500 to-violet-600"
              trend={8}
            />
            <StatCard
              icon={CheckCircle2}
              title="Matches Completed"
              value={dashboardStats.matchesCompleted}
              subtitle="Successfully finished"
              color="from-green-500 to-green-600"
              trend={15}
            />
            <StatCard
              icon={Activity}
              title="Active Matches"
              value={dashboardStats.activeMatches}
              subtitle="Currently ongoing"
              color="from-orange-500 to-orange-600"
            />
            <StatCard
              icon={Calendar}
              title="Upcoming Matches"
              value={dashboardStats.upcomingMatches}
              subtitle="Scheduled matches"
              color="from-pink-500 to-pink-600"
              trend={3}
            />
          </div>
        </div>

        {/* Sports List Section */}
        <div className="mb-8">
          <div className="flex flex-col mb-6 space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <h2 className="flex items-center text-xl font-bold text-white md:text-2xl">
              <Award className="w-6 h-6 mr-3 text-emerald-400" />
              Sports Tournament List
            </h2>
            
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
              <div className="relative">
                <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-white/40" />
                <input
                  type="text"
                  placeholder="Search sports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-white/40 focus:border-blue-400 focus:outline-none transition-all duration-300 w-full sm:w-64"
                />
              </div>
              
              <div className="flex space-x-2">
                {['all', 'active', 'completed', 'upcoming'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setFilterActive(filter)}
                    className={`px-3 py-2 rounded-xl font-medium text-sm transition-all duration-300 ${
                      filterActive === filter
                        ? 'bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-lg'
                        : 'bg-white/[0.05] border border-white/10 text-white/70 hover:bg-white/[0.1]'
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredSports.map((sport) => (
              <SportCard key={sport.id} sport={sport} />
            ))}
          </div>

          {filteredSports.length === 0 && (
            <div className="py-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/[0.05] mb-4">
                <Search className="w-8 h-8 text-white/40" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white/80">No sports found</h3>
              <p className="text-white/60">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Team Logo Management Modal */}
      {showLogoManager && selectedTeamForLogo && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center z-50 p-4">
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/30 to-violet-500/30 rounded-3xl blur-xl animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-2xl bg-gradient-to-r ${selectedTeamForLogo.color}`}>
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">Team Logo Manager</h2>
                    <p className="text-white/70">{selectedTeamForLogo.name} - Upload team logos</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowLogoManager(false)}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedTeamForLogo.teamList?.map((team) => (
                  <div key={team.id} className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-violet-500/20 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                    <div className="relative bg-white/[0.05] backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300">
                      
                      {/* Team Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-white">{team.name}</h3>
                          <p className="text-sm text-white/60">{team.shortName}</p>
                        </div>
                        <div className="text-2xl">{selectedTeamForLogo.icon}</div>
                      </div>

                      {/* Logo Display Area */}
                      <div className="relative mb-4">
                        <div className="w-full h-32 bg-white/[0.02] border-2 border-dashed border-white/20 rounded-xl flex items-center justify-center overflow-hidden">
                          {teamLogos[team.id] ? (
                            <div className="relative w-full h-full">
                              <img 
                                src={teamLogos[team.id]} 
                                alt={`${team.name} logo`}
                                className="w-full h-full object-contain"
                              />
                              <button
                                onClick={() => handleRemoveLogo(team.id)}
                                className="absolute top-2 right-2 p-1 bg-red-500/80 hover:bg-red-500 rounded-full transition-all duration-300"
                              >
                                <Trash2 className="w-3 h-3 text-white" />
                              </button>
                            </div>
                          ) : (
                            <div className="text-center">
                              <ImageIcon className="w-8 h-8 text-white/30 mx-auto mb-2" />
                              <p className="text-sm text-white/40">No logo uploaded</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Upload Button */}
                      <div className="space-y-3">
                        <label className="block">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) handleLogoUpload(team.id, file);
                            }}
                            className="hidden"
                          />
                          <div className="flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-blue-500/20 to-violet-500/20 border border-blue-500/30 rounded-xl text-blue-400 hover:from-blue-500/30 hover:to-violet-500/30 cursor-pointer transition-all duration-300">
                            <Upload className="w-4 h-4" />
                            <span className="font-medium">
                              {teamLogos[team.id] ? 'Change Logo' : 'Upload Logo'}
                            </span>
                          </div>
                        </label>

                        {teamLogos[team.id] && (
                          <button
                            onClick={() => handleRemoveLogo(team.id)}
                            className="w-full flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 rounded-xl text-red-400 hover:from-red-500/30 hover:to-red-600/30 transition-all duration-300"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="font-medium">Remove Logo</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setShowLogoManager(false)}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl text-white font-bold hover:from-green-600 hover:to-blue-700 transition-all duration-300"
                >
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        
        @keyframes float-0 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(-180deg); }
        }
        
        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(90deg); }
        }
        
        @keyframes float-3 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-90deg); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        @keyframes slide-in {
          0% { transform: translateY(-10px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        .animate-float-0 { animation: float-0 6s ease-in-out infinite; }
        .animate-float-1 { animation: float-1 7s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 5s ease-in-out infinite; }
        .animate-float-3 { animation: float-3 8s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default SportsDashboard;