/* eslint-disable no-undef */
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

const TennisManagement = () => {
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
  const [loading, setLoading] = useState(false);

  const [teams, setTeams] = useState([
    {
      id: 1,
      _id: '1',
      name: 'Wimbledon Champions',
      shortName: 'WC',
      captain: 'Roger Federer',
      coach: 'Ivan Ljubicic',
      homeGround: 'All England Club',
      contactEmail: 'info@wimbledonchampions.com',
      contactPhone: '+44-20-8946-2244',
      established: '1877',
      players: [
        { id: 1, name: 'Roger Federer', role: 'Singles Player', age: 42, jerseyNumber: 1 },
        { id: 2, name: 'Steffi Graf', role: 'Singles Player', age: 54, jerseyNumber: 2 },
        { id: 3, name: 'John McEnroe', role: 'Singles Player', age: 65, jerseyNumber: 3 }
      ]
    },
    {
      id: 2,
      _id: '2',
      name: 'Roland Garros Elite',
      shortName: 'RGE',
      captain: 'Rafael Nadal',
      coach: 'Carlos Moya',
      homeGround: 'Stade Roland Garros',
      contactEmail: 'info@rolandgarroselite.com',
      contactPhone: '+33-1-47-43-48-00',
      established: '1891',
      players: [
        { id: 4, name: 'Rafael Nadal', role: 'Singles Player', age: 37, jerseyNumber: 1 },
        { id: 5, name: 'Serena Williams', role: 'Singles Player', age: 42, jerseyNumber: 2 },
        { id: 6, name: 'Novak Djokovic', role: 'Singles Player', age: 36, jerseyNumber: 3 }
      ]
    },
    {
      id: 3,
      _id: '3',
      name: 'US Open Masters',
      shortName: 'USM',
      captain: 'Andy Murray',
      coach: 'Brad Gilbert',
      homeGround: 'Arthur Ashe Stadium',
      contactEmail: 'info@usopenmasters.com',
      contactPhone: '+1-718-760-6200',
      established: '1881',
      players: [
        { id: 7, name: 'Andy Murray', role: 'Singles Player', age: 36, jerseyNumber: 1 },
        { id: 8, name: 'Venus Williams', role: 'Singles Player', age: 43, jerseyNumber: 2 },
        { id: 9, name: 'Pete Sampras', role: 'Singles Player', age: 52, jerseyNumber: 3 }
      ]
    }
  ]);

  const [subAdmins, setSubAdmins] = useState([
    {
      id: 1,
      _id: '1',
      name: 'Martina Navratilova',
      email: 'martina.navratilova@tennis.com',
      phone: '+1-305-555-0456',
      specialization: 'Player Development',
      status: 'active',
      permissions: {
        manageTeams: true,
        managePlayers: true,
        viewReports: true,
        manageMatches: false
      },
      createdAt: '2024-01-15T10:30:00Z',
      lastLogin: '2024-01-20T14:22:00Z'
    },
    {
      id: 2,
      _id: '2',
      name: 'Jimmy Connors',
      email: 'jimmy.connors@tennis.com',
      phone: '+1-212-555-0123',
      specialization: 'Tournament Management',
      status: 'active',
      permissions: {
        manageTeams: true,
        managePlayers: true,
        viewReports: true,
        manageMatches: true
      },
      createdAt: '2024-01-10T09:15:00Z',
      lastLogin: '2024-01-19T16:45:00Z'
    }
  ]);

  // Filter functions
  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.captain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSubAdmins = subAdmins.filter(admin =>
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Square Team Card Component
  const TeamCard = ({ team }) => {
    return (
      <div className="cursor-pointer group" onClick={() => {
        setSelectedTeam(team);
        setActiveView('team-details');
      }}>
        <div className="relative overflow-hidden transition-all duration-300 border aspect-square bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-xl border-white/10 group-hover:border-white/30 group-hover:shadow-lg group-hover:transform group-hover:scale-105">
          {/* Team Header */}
          <div className="relative p-4 border-b border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 shadow-lg bg-gradient-to-br from-green-500 via-blue-600 to-purple-600 rounded-lg">
                  <Trophy className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white truncate">{team.name}</h3>
                  <p className="text-xs text-green-400">{team.shortName}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-1 text-white/70">
                <Crown className="w-3 h-3 text-yellow-400" />
                <span className="truncate">{team.captain}</span>
              </div>
              <div className="flex items-center space-x-1 text-white/70">
                <User className="w-3 h-3 text-blue-400" />
                <span className="truncate">{team.coach}</span>
              </div>
              <div className="flex items-center space-x-1 text-white/70">
                <MapPin className="w-3 h-3 text-red-400" />
                <span className="truncate">{team.homeGround}</span>
              </div>
            </div>
          </div>

          {/* Team Stats */}
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="text-center">
                <div className="text-lg font-bold text-white">{team.players?.length || 0}</div>
                <div className="text-xs text-white/60">Players</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-400">{team.established}</div>
                <div className="text-xs text-white/60">Est.</div>
              </div>
            </div>
            
            <div className="mt-3 text-center">
              <button className="w-full px-3 py-1.5 text-xs font-medium text-white transition-all duration-300 border bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-500/30 rounded-lg hover:from-green-500/30 hover:to-blue-500/30">
                View Squad
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Sub Admin Card Component
  const SubAdminCard = ({ admin }) => {
    const getPermissionCount = (permissions) => {
      return Object.values(permissions).filter(Boolean).length;
    };

    return (
      <div className="cursor-pointer group">
        <div className="relative overflow-hidden transition-all duration-300 border aspect-square bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-xl border-white/10 group-hover:border-white/30 group-hover:shadow-lg group-hover:transform group-hover:scale-105">
          {/* Admin Header */}
          <div className="relative p-4 border-b border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 shadow-lg bg-gradient-to-br from-purple-500 via-pink-600 to-red-600 rounded-lg">
                  <UserCheck className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white truncate">{admin.name}</h3>
                  <p className="text-xs text-purple-400">{admin.specialization}</p>
                </div>
              </div>
              <div className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                admin.status === 'active' 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {admin.status}
              </div>
            </div>
            
            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-1 text-white/70">
                <Mail className="w-3 h-3 text-blue-400" />
                <span className="truncate">{admin.email}</span>
              </div>
              <div className="flex items-center space-x-1 text-white/70">
                <Phone className="w-3 h-3 text-green-400" />
                <span className="truncate">{admin.phone}</span>
              </div>
            </div>
          </div>

          {/* Admin Stats */}
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="text-center">
                <div className="text-lg font-bold text-purple-400">{getPermissionCount(admin.permissions)}</div>
                <div className="text-xs text-white/60">Permissions</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-white">{new Date(admin.createdAt).getFullYear()}</div>
                <div className="text-xs text-white/60">Joined</div>
              </div>
            </div>
            
            <div className="mt-3 text-center">
              <button className="w-full px-3 py-1.5 text-xs font-medium text-white transition-all duration-300 border bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30 rounded-lg hover:from-purple-500/30 hover:to-pink-500/30">
                Manage Access
              </button>
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
        <div className="absolute top-0 rounded-full left-1/4 w-96 h-96 bg-green-500/4 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 rounded-full right-1/4 w-80 h-80 bg-blue-500/4 blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
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
            <div className="absolute -inset-4 bg-gradient-to-r from-green-500/20 via-blue-500/20 to-green-500/20 rounded-3xl blur-2xl animate-pulse"></div>
            
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
                    className="relative p-3 transition-all duration-300 border group bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-500/30 rounded-2xl hover:from-green-500/30 hover:to-blue-500/30"
                  >
                    <ArrowLeft className="w-6 h-6 text-white transition-colors duration-300 group-hover:text-green-400" />
                  </button>
                  
                  <div className="flex items-center flex-1 min-w-0 space-x-3">
                    <div className="relative flex-shrink-0">
                      <div className="p-2.5 shadow-lg bg-gradient-to-br from-green-500 via-blue-600 to-purple-600 rounded-lg">
                        <Trophy className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h1 className="mb-0.5 text-xl font-bold text-transparent bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text lg:text-2xl xl:text-3xl truncate">
                        {activeView === 'teams' ? 'Tennis Management Hub' : 
                         activeView === 'sub-admins' ? 'Tennis Sub-Administrators' :
                         `${selectedTeam?.name} Squad`}
                      </h1>
                      <p className="text-sm font-medium truncate text-white/80 lg:text-base">
                        {activeView === 'teams' ? 'Professional Team & Sub-Admin Management System' : 
                         activeView === 'sub-admins' ? 'Manage Tennis Sub-Administrator Access & Permissions' :
                         'Elite Player Roster & Performance Analytics'}
                      </p>
                      <div className="flex items-center mt-1 space-x-3">
                        <div className="flex items-center space-x-1 text-green-400">
                          <div className="w-1 h-1 rounded-full bg-green-400 animate-pulse"></div>
                          <span className="text-xs font-medium lg:text-sm">Live System</span>
                        </div>
                        <div className="flex items-center space-x-1 text-blue-400">
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
                            ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white' 
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
                        : 'bg-gradient-to-r from-green-500 via-blue-600 to-purple-600 hover:from-green-600 hover:via-blue-700 hover:to-purple-700'
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
                <div className="absolute transition-opacity duration-300 opacity-0 -inset-0.5 bg-gradient-to-r from-green-500/20 to-purple-500/20 rounded-lg blur group-focus-within:opacity-100"></div>
                <div className="relative flex items-center">
                  <Search className="absolute z-10 w-3.5 h-3.5 text-green-400 left-3" />
                  <input
                    type="text"
                    placeholder={activeView === 'teams' ? "Search teams by name or abbreviation..." : "Search sub-admins by name, email, or specialization..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full py-2.5 pr-5 text-sm text-white transition-all duration-300 border pl-9 bg-gradient-to-r from-slate-800/90 to-slate-900/90 backdrop-blur-xl border-white/20 rounded-lg placeholder-white/50 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/20"
                  />
                  <div className="absolute right-3">
                    <div className="px-2 py-0.5 border rounded-md bg-green-500/20 border-green-500/30">
                      <span className="text-xs font-medium text-green-400">
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
              <Loader className="w-10 h-10 mx-auto mb-3 text-green-400 animate-spin" />
              <p className="text-base font-medium text-white/70">Loading tennis data...</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        {!loading && (
          <div className="relative">
            {/* Teams Grid */}
            {activeView === 'teams' && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                {filteredTeams.map((team) => (
                  <TeamCard key={team.id} team={team} />
                ))}
              </div>
            )}

            {/* Sub-Admins Grid */}
            {activeView === 'sub-admins' && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                {filteredSubAdmins.map((admin) => (
                  <SubAdminCard key={admin.id} admin={admin} />
                ))}
              </div>
            )}

            {/* Team Details View */}
            {activeView === 'team-details' && selectedTeam && (
              <div className="space-y-6">
                <div className="p-6 border bg-gradient-to-r from-slate-900/80 via-slate-800/80 to-slate-900/80 backdrop-blur-2xl rounded-2xl border-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 shadow-lg bg-gradient-to-br from-green-500 via-blue-600 to-purple-600 rounded-xl">
                        <Trophy className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">{selectedTeam.name}</h2>
                        <p className="text-green-400">{selectedTeam.shortName} • Est. {selectedTeam.established}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-green-400">{selectedTeam.players?.length || 0}</div>
                      <div className="text-sm text-white/60">Players</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="flex items-center space-x-2 text-white/80">
                      <Crown className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm">Captain: {selectedTeam.captain}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-white/80">
                      <User className="w-4 h-4 text-blue-400" />
                      <span className="text-sm">Coach: {selectedTeam.coach}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-white/80">
                      <MapPin className="w-4 h-4 text-red-400" />
                      <span className="text-sm">{selectedTeam.homeGround}</span>
                    </div>
                  </div>
                </div>

                {/* Players Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {selectedTeam.players?.map((player) => (
                    <div key={player.id} className="relative group">
                      <div className="relative overflow-hidden transition-all duration-300 border bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-xl border-white/10 group-hover:border-white/30 group-hover:shadow-lg group-hover:transform group-hover:scale-105">
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <div className="p-1.5 shadow-lg bg-gradient-to-br from-green-500 via-blue-600 to-purple-600 rounded-lg">
                                <User className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <h3 className="text-sm font-bold text-white truncate">{player.name}</h3>
                                <p className="text-xs text-green-400">{player.role}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-white">#{player.jerseyNumber}</div>
                              <div className="text-xs text-white/60">Jersey</div>
                            </div>
                          </div>
                          
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-white/60">Age:</span>
                              <span className="text-white">{player.age}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TennisManagement;