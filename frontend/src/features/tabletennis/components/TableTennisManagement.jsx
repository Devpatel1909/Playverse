/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Plus,
  Users,
  Trophy,
  Search,
  Calendar,
  MapPin,
  Star,
  Award,
  Target,
  Zap,
  Crown,
  Shield,
  Activity,
  TrendingUp,
  User,
  Mail,
  Phone,
  Camera,
  Upload,
  Image,
  Edit3,
  Trash2,
  BarChart3,
  TrendingDown,
  UserPlus,
  X,
  Edit2,
  RefreshCw,
  Loader,
  Filter,
  Key,
  UserCheck,
  Settings,
  Lock,
  Eye,
  EyeOff,
  Edit,
  MoreVertical
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TableTennisManagement = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('teams');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [showAddSubAdminModal, setShowAddSubAdminModal] = useState(false);
  const [playerPhotos, setPlayerPhotos] = useState({});
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedPlayerForPhoto, setSelectedPlayerForPhoto] = useState(null);
  const [teams, setTeams] = useState([
    {
      id: 1,
      _id: '1',
      name: 'Paddle Masters',
      shortName: 'PM',
      captain: 'Rohit Sharma',
      coach: 'Vikram Singh',
      homeGround: 'Table Tennis Arena A',
      contactEmail: 'info@paddlemasters.com',
      contactPhone: '+91-9876543210',
      established: '2021',
      players: [
        { id: 1, name: 'Rohit Sharma', role: 'Singles Player', age: 26, jerseyNumber: 1, matches: 15, points: 245, ranking: 'National A' },
        { id: 2, name: 'Kavya Patel', role: 'Doubles Player', age: 24, jerseyNumber: 2, matches: 12, points: 198, ranking: 'State A' },
        { id: 3, name: 'Arjun Mehta', role: 'Mixed Doubles', age: 28, jerseyNumber: 3, matches: 18, points: 267, ranking: 'National B' }
      ]
    },
    {
      id: 2,
      _id: '2',
      name: 'Spin Doctors',
      shortName: 'SD',
      captain: 'Amit Singh',
      coach: 'Priya Sharma',
      homeGround: 'Sports Complex B',
      contactEmail: 'info@spindoctors.com',
      contactPhone: '+91-9876543211',
      established: '2020',
      players: [
        { id: 4, name: 'Amit Singh', role: 'Singles Player', age: 28, jerseyNumber: 1, matches: 20, points: 298, ranking: 'National B' },
        { id: 5, name: 'Neha Gupta', role: 'Mixed Doubles Player', age: 25, jerseyNumber: 2, matches: 17, points: 234, ranking: 'State B' },
        { id: 6, name: 'Kiran Kumar', role: 'Doubles Player', age: 27, jerseyNumber: 3, matches: 14, points: 189, ranking: 'State A' }
      ]
    },
    {
      id: 3,
      _id: '3',
      name: 'Racket Warriors',
      shortName: 'RW',
      captain: 'Sneha Patel',
      coach: 'Rajesh Kumar',
      homeGround: 'Championship Hall',
      contactEmail: 'info@racketwarriors.com',
      contactPhone: '+91-9876543212',
      established: '2019',
      players: [
        { id: 7, name: 'Sneha Patel', role: 'Singles Player', age: 23, jerseyNumber: 1, matches: 16, points: 256, ranking: 'National A' },
        { id: 8, name: 'Vikash Singh', role: 'Doubles Player', age: 29, jerseyNumber: 2, matches: 19, points: 278, ranking: 'National B' },
        { id: 9, name: 'Priya Jain', role: 'Mixed Doubles', age: 26, jerseyNumber: 3, matches: 13, points: 201, ranking: 'State A' }
      ]
    }
  ]);
  const [subAdmins, setSubAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subAdminError, setSubAdminError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const currentUser = 'TableTennisAdmin';
  const currentDateTime = '2025-01-22 14:30:00';
  const [newSubAdmin, setNewSubAdmin] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    specialization: '',
    permissions: {
      manageTeams: true,
      managePlayers: true,
      viewReports: true,
      manageMatches: false
    }
  });

  const [newPlayer, setNewPlayer] = useState({
    name: '',
    role: '',
    age: '',
    contactPhone: '',
    contactEmail: '',
    experience: ''
  });

  const [newTeam, setNewTeam] = useState({
    name: '',
    shortName: '',
    captain: '',
    coach: '',
    homeGround: '',
    contactEmail: '',
    contactPhone: '',
    established: ''
  });

  // Filter teams based on search
  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.captain?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter sub-admins based on search
  const filteredSubAdmins = subAdmins.filter(admin =>
    admin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Update player statistics
  const updatePlayerStats = (playerId) => {
    const newPoints = Math.floor(Math.random() * 30) + 10;
    const newMatches = 1;

    const updatedTeams = teams.map(team => ({
      ...team,
      players: team.players.map(player => 
        player.id === playerId 
          ? {
              ...player,
              matches: (player.matches || 0) + newMatches,
              points: (player.points || 0) + newPoints,
              average: ((player.points || 0) + newPoints) / ((player.matches || 0) + newMatches)
            }
          : player
      )
    }));

    setTeams(updatedTeams);
    
    if (selectedTeam) {
      const updatedSelectedTeam = updatedTeams.find(t => t.id === selectedTeam.id);
      setSelectedTeam(updatedSelectedTeam);
    }
    
    const updatedPlayer = updatedTeams
      .flatMap(team => team.players)
      .find(p => p.id === playerId);
    
    alert(`✅ Player Stats Updated!\n\n${updatedPlayer.name} earned ${newPoints} points in their latest match!\n\nNew Stats:\n• Matches: ${updatedPlayer.matches}\n• Total Points: ${updatedPlayer.points}\n• Average: ${updatedPlayer.average?.toFixed(1) || 'N/A'}`);
  };

  // Square Team Card Component
  const TeamCard = ({ team }) => {
    return (
      <div className="cursor-pointer group" onClick={() => {
        setSelectedTeam(team);
        setActiveView('team-details');
      }}>
        <div className="relative overflow-hidden transition-all duration-300 border h-480 bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-xl border-white/10 group-hover:border-white/30 group-hover:shadow-lg group-hover:transform group-hover:scale-105">
          
          {/* Background overlay */}
          <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 rounded-xl opacity-0 group-hover:opacity-20 transition-all duration-300"></div>
          
          <div className="relative flex flex-col h-full p-4">
            
            {/* Header with team logo and basic info */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="relative flex items-center justify-center w-10 h-10 transition-transform duration-300 rounded-lg shadow-lg bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 group-hover:scale-110">
                  <Trophy className="w-5 h-5 text-white drop-shadow-lg" />
                  <div className="absolute flex items-center justify-center w-3 h-3 bg-yellow-400 rounded-full -top-1 -right-1">
                    <Crown className="w-1.5 h-1.5 text-yellow-900" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-white truncate transition-colors duration-300 group-hover:text-blue-400">
                    {team.name}
                  </h3>
                  <div className="flex items-center space-x-1">
                    <span className="px-1.5 py-0.5 text-xs font-bold border rounded text-blue-400 bg-blue-500/20 border-blue-500/40 truncate max-w-[60px]">
                      {team.shortName}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end text-right">
                <div className="text-lg font-bold text-transparent bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 bg-clip-text">
                  {team.players?.length || 0}
                </div>
                <div className="text-xs font-medium text-white/70">Players</div>
              </div>
            </div>

            {/* Status indicator */}
            <div className="flex items-center mb-3 space-x-1">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-xs font-medium text-yellow-400">Elite</span>
            </div>

            {/* Main content - stats grid */}
            <div className="flex flex-col justify-center flex-1">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 text-center border rounded bg-gradient-to-r from-blue-500/10 to-indigo-600/10 border-blue-500/30">
                  <Shield className="w-3 h-3 mx-auto mb-1 text-blue-400" />
                  <div className="text-xs font-medium text-blue-400">Captain</div>
                  <div className="text-xs font-bold text-white truncate">{team.captain || 'TBA'}</div>
                </div>
                
                <div className="p-2 text-center border rounded bg-gradient-to-r from-indigo-500/10 to-purple-600/10 border-indigo-500/30">
                  <Award className="w-3 h-3 mx-auto mb-1 text-indigo-400" />
                  <div className="text-xs font-medium text-indigo-400">Coach</div>
                  <div className="text-xs font-bold text-white truncate">{team.coach || 'TBA'}</div>
                </div>
                
                <div className="p-2 text-center border rounded bg-gradient-to-r from-purple-500/10 to-pink-600/10 border-purple-500/30">
                  <Users className="w-3 h-3 mx-auto mb-1 text-purple-400" />
                  <div className="text-xs font-medium text-purple-400">Squad</div>
                  <div className={`text-xs font-bold ${
                    (team.players?.length || 0) >= 15 ? 'text-red-400' : 
                    (team.players?.length || 0) >= 12 ? 'text-yellow-400' : 'text-white'
                  }`}>
                    {team.players?.length || 0}/15
                  </div>
                </div>
                
                <div className="p-2 text-center border rounded bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border-cyan-500/30">
                  <Phone className="w-3 h-3 mx-auto mb-1 text-cyan-400" />
                  <div className="text-xs font-medium text-cyan-400">Contact</div>
                  <div className="text-xs font-bold text-white truncate">{team.contactPhone || 'N/A'}</div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2 mt-3 border-t border-white/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></div>
                  <span className="text-xs font-medium text-blue-400">Active</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <div className="px-1.5 py-0.5 border rounded bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-blue-500/30">
                    <span className="text-xs font-medium text-white">Pro</span>
                  </div>
                  <div className="p-1 transition-colors rounded bg-white/10 group-hover:bg-blue-500/20">
                    <Edit className="w-2.5 h-2.5 text-white/60 group-hover:text-blue-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 transition-opacity duration-300 opacity-0 pointer-events-none bg-gradient-to-br from-blue-400/5 via-indigo-400/5 to-purple-400/5 group-hover:opacity-100 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  };

  // Player Card Component
  const PlayerCard = ({ player, teamName }) => {
    return (
      <div className="relative overflow-hidden transition-all duration-300 border bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-xl border-white/10 hover:border-white/30 hover:shadow-lg group">
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="absolute flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full -bottom-1 -right-1">
                  {player.jerseyNumber}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-white truncate">{player.name}</h4>
                <p className="text-xs text-blue-400 truncate">{player.role}</p>
                <p className="text-xs text-white/60 truncate">{teamName}</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm font-bold text-blue-400">{player.points || 0}</div>
              <div className="text-xs text-white/60">Points</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="p-1.5 text-center border rounded bg-gradient-to-r from-blue-500/10 to-indigo-600/10 border-blue-500/20">
              <div className="text-xs font-bold text-white">{player.matches || 0}</div>
              <div className="text-xs text-blue-400">Matches</div>
            </div>
            <div className="p-1.5 text-center border rounded bg-gradient-to-r from-indigo-500/10 to-purple-600/10 border-indigo-500/20">
              <div className="text-xs font-bold text-white">{player.age}</div>
              <div className="text-xs text-indigo-400">Age</div>
            </div>
            <div className="p-1.5 text-center border rounded bg-gradient-to-r from-purple-500/10 to-pink-600/10 border-purple-500/20">
              <div className="text-xs font-bold text-white">{player.ranking || 'N/A'}</div>
              <div className="text-xs text-purple-400">Rank</div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <div className="flex items-center space-x-1.5">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-green-400">Performance</span>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => updatePlayerStats(player.id)}
                className="p-1 text-xs text-blue-400 transition-all duration-300 rounded bg-blue-500/20 hover:bg-blue-500/30"
                title="Update Stats"
              >
                <Edit2 className="w-2.5 h-2.5" />
              </button>
              <div className="flex space-x-0.5">
                {[1, 2, 3].map((star) => (
                  <Star key={star} className="w-2.5 h-2.5 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Enhanced Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute top-0 rounded-full left-1/4 w-96 h-96 bg-blue-500/4 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 rounded-full right-1/4 w-80 h-80 bg-indigo-500/4 blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute w-64 h-64 transform -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 bg-purple-500/3 blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
        
        <div className="absolute inset-0 opacity-[0.015]">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }}
          />
        </div>
      </div>

      <div className="relative z-10 p-6 text-white">
        {/* Enhanced Header */}
        <div className="mb-12">
          <div className="relative">
            {/* Header background glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-blue-500/20 rounded-3xl blur-2xl animate-pulse"></div>
            
            <div className="relative p-8 border bg-gradient-to-r from-slate-900/80 via-slate-800/80 to-slate-900/80 backdrop-blur-2xl rounded-3xl border-white/20">
              <div className="flex items-center justify-between max-w-full">
                <div className="flex items-center flex-1 min-w-0 space-x-3">
                  <button
                    onClick={() => {
                      if (activeView === 'team-details') {
                        setActiveView('teams');
                        setSelectedTeam(null);
                      } else {
                        navigate('/superadmin/sports');
                      }
                    }}
                    className="relative p-3 transition-all duration-300 border group bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-blue-500/30 rounded-2xl hover:from-blue-500/30 hover:to-indigo-500/30"
                  >
                    <ArrowLeft className="w-6 h-6 text-white transition-colors duration-300 group-hover:text-blue-400" />
                  </button>
                  
                  <div className="flex items-center flex-1 min-w-0 space-x-3">
                    <div className="relative flex-shrink-0">
                      <div className="p-2.5 shadow-lg bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-lg">
                        <Trophy className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h1 className="mb-0.5 text-xl font-bold text-transparent bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 bg-clip-text lg:text-2xl xl:text-3xl truncate">
                        {activeView === 'teams' ? 'Table Tennis Management Hub' : 
                         activeView === 'sub-admins' ? 'Table Tennis Sub-Administrators' :
                         `${selectedTeam?.name} Squad`}
                      </h1>
                      <p className="text-sm font-medium truncate text-white/80 lg:text-base">
                        {activeView === 'teams' ? 'Professional Team & Sub-Admin Management System' : 
                         activeView === 'sub-admins' ? 'Manage Table Tennis Sub-Administrator Access & Permissions' :
                         'Elite Player Roster & Performance Analytics'}
                      </p>
                      <div className="flex items-center mt-1 space-x-3">
                        <div className="flex items-center space-x-1 text-blue-400">
                          <div className="w-1 h-1 rounded-full bg-blue-400 animate-pulse"></div>
                          <span className="text-xs font-medium lg:text-sm">Live System</span>
                        </div>
                        <div className="flex items-center space-x-1 text-indigo-400">
                          <Shield className="w-3 h-3" />
                          <span className="text-xs font-medium">Secure Platform</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 lg:space-x-3">
                  {loading && (
                    <div className="flex items-center space-x-1.5 text-blue-400">
                      <Loader className="w-3.5 h-3.5 animate-spin" />
                      <span className="text-xs">Loading...</span>
                    </div>
                  )}
                  
                  {/* Compact Navigation Tabs */}
                  {activeView !== 'team-details' && (
                    <div className="flex space-x-1.5">
                      <button
                        onClick={() => setActiveView('teams')}
                        className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
                          activeView === 'teams' 
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white' 
                            : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                        }`}
                      >
                        <Users className="inline w-3.5 h-3.5 mr-1.5" />
                        Teams ({teams.length})
                      </button>
                      <button
                        onClick={() => setActiveView('sub-admins')}
                        className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
                          activeView === 'sub-admins' 
                            ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white' 
                            : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                        }`}
                      >
                        <UserCheck className="inline w-3.5 h-3.5 mr-1.5" />
                        Sub-Admins ({subAdmins.length})
                      </button>
                    </div>
                  )}
                  
                  <button
                    onClick={() => {
                      if (activeView === 'teams') setShowAddTeamModal(true);
                      else if (activeView === 'sub-admins') setShowAddSubAdminModal(true);
                      else setShowAddPlayerModal(true);
                    }}
                    disabled={activeView === 'team-details' && selectedTeam && selectedTeam.players?.length >= 15}
                    className={`flex items-center px-3 py-2 space-x-1.5 transition-all duration-300 transform shadow-lg rounded-lg hover:scale-105 text-sm font-semibold ${
                      activeView === 'team-details' && selectedTeam && selectedTeam.players?.length >= 15 
                        ? 'bg-gradient-to-r from-gray-600 to-gray-700 cursor-not-allowed opacity-60' 
                        : activeView === 'sub-admins'
                        ? 'bg-gradient-to-r from-purple-500 via-pink-600 to-red-600 hover:from-purple-600 hover:via-pink-700 hover:to-red-700'
                        : 'bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 hover:from-blue-600 hover:via-indigo-700 hover:to-purple-700'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5 text-white" />
                    <span className="text-white">
                      {activeView === 'teams' ? 'Create Team' : 
                       activeView === 'sub-admins' ? 'Add Sub-Admin' :
                       selectedTeam && selectedTeam.players?.length >= 15 ? `Full (${selectedTeam.players?.length || 0}/15)` : `Add Player (${selectedTeam?.players?.length || 0}/15)`}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Compact Search Bar */}
          {(activeView === 'teams' || activeView === 'sub-admins') && (
            <div className="max-w-xl mx-auto mt-4">
              <div className="relative group">
                <div className="absolute transition-opacity duration-300 opacity-0 -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur group-focus-within:opacity-100"></div>
                <div className="relative flex items-center">
                  <Search className="absolute z-10 w-3.5 h-3.5 text-blue-400 left-3" />
                  <input
                    type="text"
                    placeholder={activeView === 'teams' ? "Search teams by name or abbreviation..." : "Search sub-admins by name, email, or specialization..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full py-2.5 pr-5 text-sm text-white transition-all duration-300 border pl-9 bg-gradient-to-r from-slate-800/90 to-slate-900/90 backdrop-blur-xl border-white/20 rounded-lg placeholder-white/50 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                  />
                  <div className="absolute right-3">
                    <div className="px-2 py-0.5 border rounded-md bg-blue-500/20 border-blue-500/30">
                      <span className="text-xs font-medium text-blue-400">
                        {activeView === 'teams' ? `${filteredTeams.length} Teams` : `${filteredSubAdmins.length} Sub-Admins`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader className="w-10 h-10 mx-auto mb-3 text-blue-400 animate-spin" />
              <p className="text-base font-medium text-white/70">Loading table tennis data...</p>
            </div>
          </div>
        )}

        {/* Teams Grid View */}
        {activeView === 'teams' && !loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {filteredTeams.map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        )}

        {/* Team Details View */}
        {activeView === 'team-details' && selectedTeam && (
          <div className="space-y-6">
            {/* Team Header */}
            <div className="p-6 border bg-gradient-to-r from-slate-900/80 via-slate-800/80 to-slate-900/80 backdrop-blur-2xl rounded-2xl border-white/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 shadow-lg bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-xl">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 bg-clip-text">
                      {selectedTeam.name}
                    </h2>
                    <p className="text-white/70">Captain: {selectedTeam.captain} • Coach: {selectedTeam.coach}</p>
                    <p className="text-sm text-white/60">Home Ground: {selectedTeam.homeGround}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-400">{selectedTeam.players?.length || 0}</div>
                  <div className="text-white/70">Players</div>
                </div>
              </div>
            </div>

            {/* Players Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {selectedTeam.players?.map((player) => (
                <PlayerCard key={player.id} player={player} teamName={selectedTeam.name} />
              ))}
            </div>
          </div>
        )}

        {/* Sub-Admins View */}
        {activeView === 'sub-admins' && (
          <div className="text-center py-16">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-blue-400" />
            <h3 className="text-xl font-bold text-white mb-2">Sub-Admin Management</h3>
            <p className="text-white/70">Sub-administrator functionality coming soon...</p>
          </div>
        )}

        {/* Empty State */}
        {activeView === 'teams' && filteredTeams.length === 0 && !loading && (
          <div className="text-center py-16">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-blue-400" />
            <h3 className="text-xl font-bold text-white mb-2">No Teams Found</h3>
            <p className="text-white/70 mb-4">
              {searchTerm ? 'No teams match your search criteria.' : 'Get started by creating your first table tennis team.'}
            </p>
            <button
              onClick={() => setShowAddTeamModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
            >
              Create First Team
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableTennisManagement;