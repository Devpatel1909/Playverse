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

const VolleyballManagement = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('teams');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [teams, setTeams] = useState([
    {
      id: 1,
      _id: '1',
      name: 'Spike Masters',
      shortName: 'SM',
      captain: 'Ravi Kumar',
      coach: 'Vikram Singh',
      homeGround: 'Volleyball Arena A',
      contactEmail: 'info@spikemasters.com',
      contactPhone: '+91-9876543210',
      established: '2021',
      players: [
        { id: 1, name: 'Ravi Kumar', role: 'Spiker', age: 24, jerseyNumber: 7, matches: 18, points: 342, height: '6\'2"' },
        { id: 2, name: 'Anjali Patel', role: 'Setter', age: 22, jerseyNumber: 3, matches: 16, points: 289, height: '5\'8"' },
        { id: 3, name: 'Deepak Sharma', role: 'Blocker', age: 25, jerseyNumber: 12, matches: 20, points: 398, height: '6\'4"' }
      ]
    },
    {
      id: 2,
      _id: '2',
      name: 'Net Warriors',
      shortName: 'NW',
      captain: 'Suresh Singh',
      coach: 'Priya Sharma',
      homeGround: 'Sports Complex B',
      contactEmail: 'info@netwarriors.com',
      contactPhone: '+91-9876543211',
      established: '2020',
      players: [
        { id: 4, name: 'Suresh Singh', role: 'Blocker', age: 26, jerseyNumber: 12, matches: 20, points: 398, height: '6\'4"' },
        { id: 5, name: 'Meera Sharma', role: 'Libero', age: 23, jerseyNumber: 5, matches: 17, points: 267, height: '5\'6"' },
        { id: 6, name: 'Arjun Patel', role: 'Spiker', age: 27, jerseyNumber: 9, matches: 22, points: 445, height: '6\'3"' }
      ]
    },
    {
      id: 3,
      _id: '3',
      name: 'Volleyball Titans',
      shortName: 'VT',
      captain: 'Rohit Gupta',
      coach: 'Sneha Patel',
      homeGround: 'Elite Sports Arena',
      contactEmail: 'info@volleyballtitans.com',
      contactPhone: '+91-9876543212',
      established: '2019',
      players: [
        { id: 7, name: 'Rohit Gupta', role: 'Setter', age: 28, jerseyNumber: 1, matches: 24, points: 512, height: '6\'1"' },
        { id: 8, name: 'Kavya Singh', role: 'Spiker', age: 24, jerseyNumber: 8, matches: 19, points: 367, height: '5\'10"' },
        { id: 9, name: 'Vikram Mehta', role: 'Libero', age: 26, jerseyNumber: 4, matches: 21, points: 298, height: '5\'8"' }
      ]
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter teams based on search term
  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.captain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Update player statistics
  const updatePlayerStats = (playerId) => {
    const newPoints = Math.floor(Math.random() * 40) + 20;
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
  };

  // Team Card Component (matching Cricket design)
  const TeamCard = ({ team }) => {
    return (
      <div className="cursor-pointer group" onClick={() => {
        setSelectedTeam(team);
        setActiveView('team-details');
      }}>
        <div className="relative overflow-hidden transition-all duration-300 border h-80 bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-xl border-white/10 group-hover:border-white/30 group-hover:shadow-lg group-hover:transform group-hover:scale-105">
          
          {/* Background overlay */}
          <div className="absolute -inset-0.5 bg-gradient-to-br from-orange-500 via-red-600 to-orange-700 rounded-xl opacity-0 group-hover:opacity-20 transition-all duration-300"></div>
          
          <div className="relative flex flex-col h-full p-4">
            
            {/* Header with team logo and name */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="relative flex items-center justify-center w-10 h-10 rounded-lg shadow-lg bg-gradient-to-br from-orange-500 via-red-600 to-orange-700">
                  <span className="text-lg font-bold text-white">🏐</span>
                  <div className="absolute flex items-center justify-center w-3 h-3 bg-green-400 rounded-full -top-1 -right-1">
                    <Star className="w-1.5 h-1.5 text-green-900" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-white truncate transition-colors duration-300 group-hover:text-orange-400">
                    {team.name}
                  </h3>
                  <div className="flex items-center space-x-1">
                    <span className="px-1.5 py-0.5 text-xs font-bold border rounded text-orange-400 bg-orange-500/20 border-orange-500/40 truncate max-w-[60px]">
                      {team.shortName}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end text-right">
                <div className="text-lg font-bold text-transparent bg-gradient-to-r from-orange-400 via-red-500 to-orange-600 bg-clip-text">
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
                <div className="p-2 text-center border rounded bg-gradient-to-r from-orange-500/10 to-red-600/10 border-orange-500/30">
                  <Shield className="w-3 h-3 mx-auto mb-1 text-orange-400" />
                  <div className="text-xs font-medium text-orange-400">Captain</div>
                  <div className="text-xs font-bold text-white truncate">{team.captain || 'TBA'}</div>
                </div>
                
                <div className="p-2 text-center border rounded bg-gradient-to-r from-red-500/10 to-orange-600/10 border-red-500/30">
                  <Award className="w-3 h-3 mx-auto mb-1 text-red-400" />
                  <div className="text-xs font-medium text-red-400">Coach</div>
                  <div className="text-xs font-bold text-white truncate">{team.coach || 'TBA'}</div>
                </div>
                
                <div className="p-2 text-center border rounded bg-gradient-to-r from-yellow-500/10 to-orange-600/10 border-yellow-500/30">
                  <Users className="w-3 h-3 mx-auto mb-1 text-yellow-400" />
                  <div className="text-xs font-medium text-yellow-400">Squad</div>
                  <div className={`text-xs font-bold ${
                    (team.players?.length || 0) >= 15 ? 'text-red-400' : 
                    (team.players?.length || 0) >= 12 ? 'text-yellow-400' : 'text-white'
                  }`}>
                    {team.players?.length || 0}/15
                  </div>
                </div>
                
                <div className="p-2 text-center border rounded bg-gradient-to-r from-pink-500/10 to-red-600/10 border-pink-500/30">
                  <Phone className="w-3 h-3 mx-auto mb-1 text-pink-400" />
                  <div className="text-xs font-medium text-pink-400">Contact</div>
                  <div className="text-xs font-bold text-white truncate">{team.contactPhone || 'N/A'}</div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2 mt-3 border-t border-white/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"></div>
                  <span className="text-xs font-medium text-orange-400">Active</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <div className="px-1.5 py-0.5 border rounded bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/30">
                    <span className="text-xs font-medium text-white">Pro</span>
                  </div>
                  <div className="p-1 transition-colors rounded bg-white/10 group-hover:bg-orange-500/20">
                    <Edit className="w-2.5 h-2.5 text-white/60 group-hover:text-orange-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 transition-opacity duration-300 opacity-0 pointer-events-none bg-gradient-to-br from-orange-400/5 via-red-400/5 to-orange-400/5 group-hover:opacity-100 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  };

  // Player Card Component
  const PlayerCard = ({ player, teamName }) => {
    return (
      <div className="relative overflow-hidden transition-all duration-300 border cursor-pointer group bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-xl border-white/10 hover:border-white/30 hover:shadow-lg hover:transform hover:scale-105">
        <div className="absolute -inset-0.5 bg-gradient-to-br from-orange-500/20 via-red-600/20 to-orange-700/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
        
        <div className="relative p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-lg shadow-lg bg-gradient-to-br from-orange-500 via-red-600 to-orange-700">
                <User className="w-5 h-5 text-white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-white truncate group-hover:text-orange-400">
                  {player.name}
                </h4>
                <p className="text-xs text-orange-300 truncate">{player.role}</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-lg font-bold text-transparent bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text">
                #{player.jerseyNumber}
              </div>
              <div className="text-xs text-white/70">Jersey</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="p-2 text-center border rounded bg-gradient-to-r from-orange-500/10 to-red-600/10 border-orange-500/30">
              <div className="text-sm font-bold text-white">{player.matches || 0}</div>
              <div className="text-xs text-orange-400">Matches</div>
            </div>
            <div className="p-2 text-center border rounded bg-gradient-to-r from-red-500/10 to-orange-600/10 border-red-500/30">
              <div className="text-sm font-bold text-white">{player.points || 0}</div>
              <div className="text-xs text-red-400">Points</div>
            </div>
            <div className="p-2 text-center border rounded bg-gradient-to-r from-yellow-500/10 to-orange-600/10 border-yellow-500/30">
              <div className="text-sm font-bold text-white">{player.height || 'N/A'}</div>
              <div className="text-xs text-yellow-400">Height</div>
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
                className="p-1 text-xs text-orange-400 transition-all duration-300 rounded bg-orange-500/20 hover:bg-orange-500/30"
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
        <div className="absolute top-0 rounded-full left-1/4 w-96 h-96 bg-orange-500/4 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 rounded-full right-1/4 w-80 h-80 bg-red-500/4 blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute w-64 h-64 transform -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 bg-orange-500/3 blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
        
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
            <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/20 via-red-500/20 to-orange-500/20 rounded-3xl blur-2xl animate-pulse"></div>
            
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
                    className="relative p-3 transition-all duration-300 border group bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/30 rounded-2xl hover:from-orange-500/30 hover:to-red-500/30"
                  >
                    <ArrowLeft className="w-6 h-6 text-white transition-colors duration-300 group-hover:text-orange-400" />
                  </button>
                  
                  <div className="flex items-center flex-1 min-w-0 space-x-3">
                    <div className="relative flex-shrink-0">
                      <div className="p-2.5 shadow-lg bg-gradient-to-br from-orange-500 via-red-600 to-orange-600 rounded-lg">
                        <Trophy className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h1 className="mb-0.5 text-xl font-bold text-transparent bg-gradient-to-r from-orange-400 via-red-500 to-orange-500 bg-clip-text lg:text-2xl xl:text-3xl truncate">
                        {activeView === 'teams' ? 'Volleyball Management Hub' : `${selectedTeam?.name} Squad`}
                      </h1>
                      <p className="text-sm font-medium truncate text-white/80 lg:text-base">
                        {activeView === 'teams' ? 'Professional Volleyball Team Management System' : 'Elite Player Roster & Performance Analytics'}
                      </p>
                      <div className="flex items-center mt-1 space-x-3">
                        <div className="flex items-center space-x-1 text-orange-400">
                          <div className="w-1 h-1 rounded-full bg-orange-400 animate-pulse"></div>
                          <span className="text-xs font-medium lg:text-sm">Live System</span>
                        </div>
                        <div className="flex items-center space-x-1 text-red-400">
                          <Shield className="w-3 h-3" />
                          <span className="text-xs font-medium">Secure Platform</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 lg:space-x-3">
                  {loading && (
                    <div className="flex items-center space-x-1.5 text-orange-400">
                      <Loader className="w-3.5 h-3.5 animate-spin" />
                      <span className="text-xs">Loading...</span>
                    </div>
                  )}
                  
                  <button
                    onClick={() => {
                      if (activeView === 'teams') setShowAddTeamModal(true);
                      else setShowAddPlayerModal(true);
                    }}
                    disabled={activeView === 'team-details' && selectedTeam && selectedTeam.players?.length >= 15}
                    className={`flex items-center px-3 py-2 space-x-1.5 transition-all duration-300 transform shadow-lg rounded-lg hover:scale-105 text-sm font-semibold ${
                      activeView === 'team-details' && selectedTeam && selectedTeam.players?.length >= 15 
                        ? 'bg-gradient-to-r from-gray-600 to-gray-700 cursor-not-allowed opacity-60' 
                        : 'bg-gradient-to-r from-orange-500 via-red-600 to-orange-600 hover:from-orange-600 hover:via-red-700 hover:to-orange-700'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5 text-white" />
                    <span className="text-white">
                      {activeView === 'teams' ? 'Create Team' : 
                       selectedTeam && selectedTeam.players?.length >= 15 ? `Full (${selectedTeam.players?.length || 0}/15)` : `Add Player (${selectedTeam?.players?.length || 0}/15)`}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Compact Search Bar */}
          {activeView === 'teams' && (
            <div className="max-w-xl mx-auto mt-4">
              <div className="relative group">
                <div className="absolute transition-opacity duration-300 opacity-0 -inset-0.5 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg blur group-focus-within:opacity-100"></div>
                <div className="relative flex items-center">
                  <Search className="absolute z-10 w-3.5 h-3.5 text-orange-400 left-3" />
                  <input
                    type="text"
                    placeholder="Search teams by name or abbreviation..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full py-2.5 pr-5 text-sm text-white transition-all duration-300 border pl-9 bg-gradient-to-r from-slate-800/90 to-slate-900/90 backdrop-blur-xl border-white/20 rounded-lg placeholder-white/50 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/20"
                  />
                  <div className="absolute right-3">
                    <div className="px-2 py-0.5 border rounded-md bg-orange-500/20 border-orange-500/30">
                      <span className="text-xs font-medium text-orange-400">
                        {filteredTeams.length} Teams
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
              <Loader className="w-10 h-10 mx-auto mb-3 text-orange-400 animate-spin" />
              <p className="text-base font-medium text-white/70">Loading volleyball data...</p>
            </div>
          </div>
        )}

        {/* Teams Grid View */}
        {!loading && activeView === 'teams' && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredTeams.map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        )}

        {/* Team Details View */}
        {!loading && activeView === 'team-details' && selectedTeam && (
          <div className="space-y-6">
            {/* Team Header */}
            <div className="relative p-6 border bg-gradient-to-r from-slate-900/80 via-slate-800/80 to-slate-900/80 backdrop-blur-2xl rounded-2xl border-white/20">
              <div className="flex items-center space-x-4">
                <div className="p-3 shadow-lg bg-gradient-to-br from-orange-500 via-red-600 to-orange-600 rounded-xl">
                  <span className="text-2xl">🏐</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-orange-400 via-red-500 to-orange-500 bg-clip-text">
                    {selectedTeam.name}
                  </h2>
                  <p className="text-white/70">Captain: {selectedTeam.captain} | Coach: {selectedTeam.coach}</p>
                </div>
              </div>
            </div>

            {/* Players Grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {selectedTeam.players?.map((player) => (
                <PlayerCard key={player.id} player={player} teamName={selectedTeam.name} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && activeView === 'teams' && filteredTeams.length === 0 && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-orange-400/50" />
              <h3 className="mb-2 text-xl font-bold text-white">No Teams Found</h3>
              <p className="text-white/60">Create your first volleyball team to get started.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VolleyballManagement;