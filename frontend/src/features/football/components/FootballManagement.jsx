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

const FootballManagement = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('teams');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [showAddSubAdminModal, setShowAddSubAdminModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [teams, setTeams] = useState([
    {
      id: 1,
      _id: '1',
      name: 'Manchester United',
      shortName: 'MUN',
      captain: 'Bruno Fernandes',
      coach: 'Erik ten Hag',
      homeGround: 'Old Trafford',
      contactEmail: 'info@manutd.com',
      contactPhone: '+44-161-868-8000',
      established: '1878',
      players: [
        { id: 1, name: 'Bruno Fernandes', role: 'Captain/Midfielder', age: 29, jerseyNumber: 8 },
        { id: 2, name: 'Marcus Rashford', role: 'Forward', age: 26, jerseyNumber: 10 },
        { id: 3, name: 'Harry Maguire', role: 'Defender', age: 30, jerseyNumber: 5 }
      ]
    },
    {
      id: 2,
      _id: '2',
      name: 'Arsenal FC',
      shortName: 'ARS',
      captain: 'Martin Ødegaard',
      coach: 'Mikel Arteta',
      homeGround: 'Emirates Stadium',
      contactEmail: 'info@arsenal.com',
      contactPhone: '+44-20-7619-5003',
      established: '1886',
      players: [
        { id: 4, name: 'Martin Ødegaard', role: 'Captain/Midfielder', age: 25, jerseyNumber: 8 },
        { id: 5, name: 'Bukayo Saka', role: 'Winger', age: 22, jerseyNumber: 7 },
        { id: 6, name: 'Gabriel Jesus', role: 'Forward', age: 27, jerseyNumber: 9 }
      ]
    },
    {
      id: 3,
      _id: '3',
      name: 'Liverpool FC',
      shortName: 'LIV',
      captain: 'Virgil van Dijk',
      coach: 'Jürgen Klopp',
      homeGround: 'Anfield',
      contactEmail: 'info@liverpoolfc.com',
      contactPhone: '+44-151-263-2361',
      established: '1892',
      players: [
        { id: 7, name: 'Virgil van Dijk', role: 'Captain/Defender', age: 32, jerseyNumber: 4 },
        { id: 8, name: 'Mohamed Salah', role: 'Forward', age: 31, jerseyNumber: 11 },
        { id: 9, name: 'Sadio Mané', role: 'Winger', age: 31, jerseyNumber: 10 }
      ]
    }
  ]);

  const [subAdmins, setSubAdmins] = useState([
    {
      id: 1,
      _id: '1',
      name: 'José Mourinho',
      email: 'jose.mourinho@football.com',
      phone: '+44-20-7946-0958',
      specialization: 'Tactical Analysis',
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
      name: 'Arsène Wenger',
      email: 'arsene.wenger@football.com',
      phone: '+33-1-47-43-48-00',
      specialization: 'Youth Development',
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
        <div className="relative overflow-hidden transition-all duration-300 border h-480 bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-xl border-white/10 group-hover:border-white/30 group-hover:shadow-lg group-hover:transform group-hover:scale-105">
          
          {/* Background overlay */}
          <div className="absolute -inset-0.5 bg-gradient-to-br from-emerald-500 via-blue-600 to-purple-700 rounded-xl opacity-0 group-hover:opacity-20 transition-all duration-300"></div>
          
          <div className="relative flex flex-col h-full p-4">
            
            {/* Header with team logo and basic info */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="relative flex items-center justify-center w-10 h-10 transition-transform duration-300 rounded-lg shadow-lg bg-gradient-to-br from-emerald-500 via-blue-600 to-purple-700 group-hover:scale-110">
                  <Trophy className="w-5 h-5 text-white drop-shadow-lg" />
                  <div className="absolute flex items-center justify-center w-3 h-3 bg-yellow-400 rounded-full -top-1 -right-1">
                    <Crown className="w-1.5 h-1.5 text-yellow-900" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-white truncate transition-colors duration-300 group-hover:text-emerald-400">
                    {team.name}
                  </h3>
                  <div className="flex items-center space-x-1">
                    <span className="px-1.5 py-0.5 text-xs font-bold border rounded text-emerald-400 bg-emerald-500/20 border-emerald-500/40 truncate max-w-[60px]">
                      {team.shortName}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end text-right">
                <div className="text-lg font-bold text-transparent bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 bg-clip-text">
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
                <div className="p-2 text-center border rounded bg-gradient-to-r from-emerald-500/10 to-green-600/10 border-emerald-500/30">
                  <Shield className="w-3 h-3 mx-auto mb-1 text-emerald-400" />
                  <div className="text-xs font-medium text-emerald-400">Captain</div>
                  <div className="text-xs font-bold text-white truncate">{team.captain || 'TBA'}</div>
                </div>
                
                <div className="p-2 text-center border rounded bg-gradient-to-r from-blue-500/10 to-cyan-600/10 border-blue-500/30">
                  <Award className="w-3 h-3 mx-auto mb-1 text-blue-400" />
                  <div className="text-xs font-medium text-blue-400">Coach</div>
                  <div className="text-xs font-bold text-white truncate">{team.coach || 'TBA'}</div>
                </div>
                
                <div className="p-2 text-center border rounded bg-gradient-to-r from-purple-500/10 to-violet-600/10 border-purple-500/30">
                  <Users className="w-3 h-3 mx-auto mb-1 text-purple-400" />
                  <div className="text-xs font-medium text-purple-400">Squad</div>
                  <div className={`text-xs font-bold ${
                    (team.players?.length || 0) >= 25 ? 'text-red-400' : 
                    (team.players?.length || 0) >= 20 ? 'text-yellow-400' : 'text-white'
                  }`}>
                    {team.players?.length || 0}/25
                  </div>
                </div>
                
                <div className="p-2 text-center border rounded bg-gradient-to-r from-orange-500/10 to-red-600/10 border-orange-500/30">
                  <Phone className="w-3 h-3 mx-auto mb-1 text-orange-400" />
                  <div className="text-xs font-medium text-orange-400">Contact</div>
                  <div className="text-xs font-bold text-white truncate">{team.contactPhone || 'N/A'}</div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2 mt-3 border-t border-white/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-xs font-medium text-emerald-400">Active</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <div className="px-1.5 py-0.5 border rounded bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border-emerald-500/30">
                    <span className="text-xs font-medium text-white">Pro</span>
                  </div>
                  <div className="p-1 transition-colors rounded bg-white/10 group-hover:bg-emerald-500/20">
                    <Edit className="w-2.5 h-2.5 text-white/60 group-hover:text-emerald-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 transition-opacity duration-300 opacity-0 pointer-events-none bg-gradient-to-br from-emerald-400/5 via-blue-400/5 to-purple-400/5 group-hover:opacity-100 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  };

  // Square Sub-Admin Card Component
  const SubAdminCard = ({ subAdmin }) => {
    const getStatusColor = (status) => {
      return status === 'Active' ? 'from-green-500 to-emerald-600' : 'from-red-500 to-rose-600';
    };

    const getPermissionCount = (permissions) => {
      return Object.values(permissions).filter(Boolean).length;
    };

    return (
      <div className="cursor-pointer group">
        <div className="relative overflow-hidden transition-all duration-300 border h-480 bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-xl border-white/10 group-hover:border-white/30 group-hover:shadow-lg group-hover:transform group-hover:scale-105">
          
          {/* Background overlay */}
          <div className="absolute -inset-0.5 bg-gradient-to-br from-cyan-500 via-purple-600 to-pink-700 rounded-xl opacity-0 group-hover:opacity-20 transition-all duration-300"></div>
          
          <div className="relative flex flex-col h-full p-4">
            
            {/* Header with admin info */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="relative flex items-center justify-center w-10 h-10 rounded-lg shadow-lg bg-gradient-to-br from-cyan-500 via-purple-600 to-pink-700">
                  <UserCheck className="w-5 h-5 text-white drop-shadow-lg" />
                  <div className="absolute flex items-center justify-center w-3 h-3 bg-green-400 rounded-full -top-1 -right-1">
                    <Shield className="w-1.5 h-1.5 text-green-900" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-white truncate transition-colors duration-300 group-hover:text-cyan-400">
                    {subAdmin.name}
                  </h3>
                  <div className="flex items-center space-x-1">
                    <span className={`px-1.5 py-0.5 text-xs font-bold border rounded bg-gradient-to-r ${getStatusColor(subAdmin.status)}/20 border-opacity-40 truncate max-w-[60px]`} 
                          style={{borderColor: subAdmin.status === 'Active' ? '#10b981' : '#ef4444', color: subAdmin.status === 'Active' ? '#10b981' : '#ef4444'}}>
                      {subAdmin.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end text-right">
                <div className="text-lg font-bold text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-600 bg-clip-text">
                  {getPermissionCount(subAdmin.permissions)}
                </div>
                <div className="text-xs font-medium text-white/70">Perms</div>
              </div>
            </div>

            {/* Specialization */}
            <div className="flex items-center mb-3 space-x-1">
              <Settings className="w-3 h-3 text-cyan-400" />
              <span className="text-xs font-medium truncate text-cyan-400">{subAdmin.specialization}</span>
            </div>

            {/* Main content - permissions grid */}
            <div className="flex flex-col justify-center flex-1">
              <div className="grid grid-cols-2 gap-2">
                <div className={`p-2 text-center border rounded ${subAdmin.permissions.manageTeams ? 'bg-gradient-to-r from-green-500/10 to-emerald-600/10 border-green-500/30' : 'bg-gradient-to-r from-gray-500/10 to-slate-600/10 border-gray-500/30'}`}>
                  <Users className={`w-3 h-3 mx-auto mb-1 ${subAdmin.permissions.manageTeams ? 'text-green-400' : 'text-gray-400'}`} />
                  <div className="text-xs font-medium text-green-400">Teams</div>
                  <div className={`text-xs font-bold ${subAdmin.permissions.manageTeams ? 'text-white' : 'text-gray-500'}`}>
                    {subAdmin.permissions.manageTeams ? '✓' : '✗'}
                  </div>
                </div>
                
                <div className={`p-2 text-center border rounded ${subAdmin.permissions.managePlayers ? 'bg-gradient-to-r from-blue-500/10 to-cyan-600/10 border-blue-500/30' : 'bg-gradient-to-r from-gray-500/10 to-slate-600/10 border-gray-500/30'}`}>
                  <User className={`w-3 h-3 mx-auto mb-1 ${subAdmin.permissions.managePlayers ? 'text-blue-400' : 'text-gray-400'}`} />
                  <div className="text-xs font-medium text-blue-400">Players</div>
                  <div className={`text-xs font-bold ${subAdmin.permissions.managePlayers ? 'text-white' : 'text-gray-500'}`}>
                    {subAdmin.permissions.managePlayers ? '✓' : '✗'}
                  </div>
                </div>
                
                <div className={`p-2 text-center border rounded ${subAdmin.permissions.viewReports ? 'bg-gradient-to-r from-purple-500/10 to-violet-600/10 border-purple-500/30' : 'bg-gradient-to-r from-gray-500/10 to-slate-600/10 border-gray-500/30'}`}>
                  <BarChart3 className={`w-3 h-3 mx-auto mb-1 ${subAdmin.permissions.viewReports ? 'text-purple-400' : 'text-gray-400'}`} />
                  <div className="text-xs font-medium text-purple-400">Reports</div>
                  <div className={`text-xs font-bold ${subAdmin.permissions.viewReports ? 'text-white' : 'text-gray-500'}`}>
                    {subAdmin.permissions.viewReports ? '✓' : '✗'}
                  </div>
                </div>
                
                <div className={`p-2 text-center border rounded ${subAdmin.permissions.manageMatches ? 'bg-gradient-to-r from-orange-500/10 to-red-600/10 border-orange-500/30' : 'bg-gradient-to-r from-gray-500/10 to-slate-600/10 border-gray-500/30'}`}>
                  <Trophy className={`w-3 h-3 mx-auto mb-1 ${subAdmin.permissions.manageMatches ? 'text-orange-400' : 'text-gray-400'}`} />
                  <div className="text-xs font-medium text-orange-400">Matches</div>
                  <div className={`text-xs font-bold ${subAdmin.permissions.manageMatches ? 'text-white' : 'text-gray-500'}`}>
                    {subAdmin.permissions.manageMatches ? '✓' : '✗'}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2 mt-3 border-t border-white/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
                  <span className="text-xs font-medium text-cyan-400">Sub-Admin</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <div className="px-1.5 py-0.5 border rounded bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-500/30">
                    <span className="text-xs font-medium text-white">Auth</span>
                  </div>
                  <div className="p-1 transition-colors rounded bg-white/10 group-hover:bg-cyan-500/20">
                    <MoreVertical className="w-2.5 h-2.5 text-white/60 group-hover:text-cyan-400" />
                  </div>
                </div>
              </div>
              
              {/* Email */}
              <div className="flex items-center mt-1 space-x-1">
                <Mail className="w-2.5 h-2.5 text-slate-400" />
                <span className="text-xs truncate text-slate-400">{subAdmin.email}</span>
              </div>
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 transition-opacity duration-300 opacity-0 pointer-events-none bg-gradient-to-br from-cyan-400/5 via-purple-400/5 to-pink-400/5 group-hover:opacity-100 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  };

  // Compact Player Card Component  
  const PlayerCard = ({ player }) => {
    const getRoleColor = (role) => {
      if (role?.includes('Captain')) return 'from-yellow-500 to-amber-600';
      if (role?.includes('Forward')) return 'from-green-500 to-emerald-600';
      if (role?.includes('Midfielder')) return 'from-blue-500 to-cyan-600';
      if (role?.includes('Defender')) return 'from-red-500 to-rose-600';
      if (role?.includes('Goalkeeper')) return 'from-purple-500 to-violet-600';
      return 'from-gray-500 to-slate-600';
    };

    const getRoleIcon = (role) => {
      if (role?.includes('Captain')) return Crown;
      if (role?.includes('Forward')) return Target;
      if (role?.includes('Midfielder')) return Zap;
      if (role?.includes('Defender')) return Shield;
      if (role?.includes('Goalkeeper')) return Award;
      return User;
    };

    const RoleIcon = getRoleIcon(player.role);

    return (
      <div className="relative group">
        <div className={`absolute -inset-0.5 bg-gradient-to-r ${getRoleColor(player.role)} rounded-lg opacity-0 group-hover:opacity-20 transition-all duration-300`}></div>
        
        <div className="relative h-full p-4 overflow-hidden transition-all duration-300 border rounded-lg bg-gradient-to-br from-slate-800/95 via-slate-700/95 to-slate-800/95 backdrop-blur-lg border-white/10 group-hover:border-white/30 group-hover:shadow-lg">
          <div className="relative flex items-start justify-between mb-3">
            <div className="flex items-center flex-1 min-w-0 space-x-2.5">
              <div className="relative flex-shrink-0">
                <div className="overflow-hidden border-2 rounded-lg w-11 h-11 bg-gradient-to-r from-slate-600 to-slate-700 border-white/20">
                  <div className="flex items-center justify-center w-full h-full">
                    <User className="w-5 h-5 text-white/40" />
                  </div>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="mb-0.5 text-sm font-bold text-white truncate transition-colors duration-300 group-hover:text-green-400">
                  {player.name}
                </h4>
                <p className="text-xs font-medium truncate text-white/70">{player.role}</p>
                <div className="flex items-center mt-1 space-x-1.5">
                  <div className={`px-1.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r ${getRoleColor(player.role)}/20 border border-opacity-30`}>
                    <RoleIcon className="inline w-2 h-2 mr-0.5" />
                    <span className="text-white/80">{player.experience || '0y'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end flex-shrink-0">
              <div className="flex items-center mb-0.5 space-x-0.5">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-xs font-semibold text-yellow-400">{player.age}</span>
              </div>
              <div className="px-1.5 py-0.5 border rounded-full bg-green-500/20 border-green-500/30">
                <span className="text-xs font-medium text-green-400">Active</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="p-2 text-center border rounded-lg bg-gradient-to-r from-blue-500/10 to-indigo-600/10 border-blue-500/20">
              <div className="flex items-center justify-center mb-0.5">
                <Activity className="w-3 h-3 mr-0.5 text-blue-400" />
                <div className="text-sm font-bold text-blue-400">{player.matches || 0}</div>
              </div>
              <div className="text-xs font-medium text-white/60">Matches</div>
            </div>
            
            <div className="p-2 text-center border rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-600/10 border-green-500/20">
              <div className="flex items-center justify-center mb-0.5">
                <TrendingUp className="w-3 h-3 mr-0.5 text-green-400" />
                <div className="text-sm font-bold text-green-400">{player.goals || 0}</div>
              </div>
              <div className="text-xs font-medium text-white/60">Goals</div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <div className="flex items-center space-x-1.5">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-green-400">Performance</span>
            </div>
            <div className="flex items-center space-x-1">
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
        <div className="absolute top-0 rounded-full left-1/4 w-96 h-96 bg-emerald-500/4 blur-3xl animate-pulse" />
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
            <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-emerald-500/20 rounded-3xl blur-2xl animate-pulse"></div>
            
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
                    className="relative p-3 transition-all duration-300 border group bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border-emerald-500/30 rounded-2xl hover:from-emerald-500/30 hover:to-blue-500/30"
                  >
                    <ArrowLeft className="w-6 h-6 text-white transition-colors duration-300 group-hover:text-emerald-400" />
                  </button>
                  
                  <div className="flex items-center flex-1 min-w-0 space-x-3">
                    <div className="relative flex-shrink-0">
                      <div className="p-2.5 shadow-lg bg-gradient-to-br from-emerald-500 via-blue-600 to-purple-600 rounded-lg">
                        <Trophy className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h1 className="mb-0.5 text-xl font-bold text-transparent bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 bg-clip-text lg:text-2xl xl:text-3xl truncate">
                        {activeView === 'teams' ? 'Football Management Hub' : 
                         activeView === 'sub-admins' ? 'Football Sub-Administrators' :
                         `${selectedTeam?.name} Squad`}
                      </h1>
                      <p className="text-sm font-medium truncate text-white/80 lg:text-base">
                        {activeView === 'teams' ? 'Professional Team & Sub-Admin Management System' : 
                         activeView === 'sub-admins' ? 'Manage Football Sub-Administrator Access & Permissions' :
                         'Elite Player Roster & Performance Analytics'}
                      </p>
                      <div className="flex items-center mt-1 space-x-3">
                        <div className="flex items-center space-x-1 text-emerald-400">
                          <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse"></div>
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
                            ? 'bg-gradient-to-r from-emerald-500 to-blue-600 text-white' 
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
                    disabled={activeView === 'team-details' && selectedTeam && selectedTeam.players?.length >= 25}
                    className={`flex items-center px-3 py-2 space-x-1.5 transition-all duration-300 transform shadow-lg rounded-lg hover:scale-105 text-sm font-semibold ${
                      activeView === 'team-details' && selectedTeam && selectedTeam.players?.length >= 25 
                        ? 'bg-gradient-to-r from-gray-600 to-gray-700 cursor-not-allowed opacity-60' 
                        : activeView === 'sub-admins'
                        ? 'bg-gradient-to-r from-purple-500 via-pink-600 to-red-600 hover:from-purple-600 hover:via-pink-700 hover:to-red-700'
                        : 'bg-gradient-to-r from-emerald-500 via-blue-600 to-purple-600 hover:from-emerald-600 hover:via-blue-700 hover:to-purple-700'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5 text-white" />
                    <span className="text-white">
                      {activeView === 'teams' ? 'Create Team' : 
                       activeView === 'sub-admins' ? 'Add Sub-Admin' :
                       selectedTeam && selectedTeam.players?.length >= 25 ? `Full (${selectedTeam.players?.length || 0}/25)` : `Add Player (${selectedTeam?.players?.length || 0}/25)`}
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
                <div className="absolute transition-opacity duration-300 opacity-0 -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-purple-500/20 rounded-lg blur group-focus-within:opacity-100"></div>
                <div className="relative flex items-center">
                  <Search className="absolute z-10 w-3.5 h-3.5 text-emerald-400 left-3" />
                  <input
                    type="text"
                    placeholder={activeView === 'teams' ? "Search teams by name or abbreviation..." : "Search sub-admins by name, email, or specialization..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full py-2.5 pr-5 text-sm text-white transition-all duration-300 border pl-9 bg-gradient-to-r from-slate-800/90 to-slate-900/90 backdrop-blur-xl border-white/20 rounded-lg placeholder-white/50 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
                  />
                  <div className="absolute right-3">
                    <div className="px-2 py-0.5 border rounded-md bg-emerald-500/20 border-emerald-500/30">
                      <span className="text-xs font-medium text-emerald-400">
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
              <Loader className="w-10 h-10 mx-auto mb-3 text-emerald-400 animate-spin" />
              <p className="text-base font-medium text-white/70">Loading football data...</p>
            </div>
          </div>
        )}

        {/* Teams View - Compact Cards */}
        {activeView === 'teams' && !loading && (
          <div>
            {filteredTeams.length === 0 ? (
              <div className="py-16 text-center">
                <Trophy className="w-12 h-12 mx-auto mb-3 text-white/20" />
                <h3 className="mb-1 text-lg font-semibold text-white/60">No teams found</h3>
                <p className="text-sm text-white/40">
                  {searchTerm ? 'Try adjusting your search terms' : 'Create your first football team to get started'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredTeams.map(team => (
                  <TeamCard key={team._id || team.id} team={team} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Sub-Admins View - Compact Cards */}
        {activeView === 'sub-admins' && !loading && (
          <div>
            {filteredSubAdmins.length === 0 ? (
              <div className="py-16 text-center">
                <UserCheck className="w-12 h-12 mx-auto mb-3 text-white/20" />
                <h3 className="mb-1 text-lg font-semibold text-white/60">No sub-admins found</h3>
                <p className="text-sm text-white/40">
                  {searchTerm ? 'Try adjusting your search terms' : 'Add your first football sub-administrator to get started'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredSubAdmins.map(subAdmin => (
                    <SubAdminCard key={subAdmin._id || subAdmin.id} subAdmin={subAdmin} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Team Details View */}
        {activeView === 'team-details' && selectedTeam && !loading && (
          <div>
            {/* Compact Team Statistics Banner */}
            <div className="relative mb-6">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/10 to-purple-500/10 rounded-xl blur-lg"></div>
              <div className="relative p-4 border bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-xl border-white/20">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="p-3 text-center border rounded-lg bg-gradient-to-r from-emerald-500/10 to-green-600/10 border-emerald-500/20">
                    <Shield className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                    <h3 className="text-xs font-medium text-emerald-400 mb-0.5">Team Captain</h3>
                    <p className="text-sm font-bold text-white truncate">{selectedTeam.captain || 'TBA'}</p>
                  </div>
                  <div className="p-3 text-center border rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-600/10 border-blue-500/20">
                    <Award className="w-4 h-4 mx-auto mb-1 text-blue-400" />
                    <h3 className="text-xs font-medium text-blue-400 mb-0.5">Head Coach</h3>
                    <p className="text-sm font-bold text-white truncate">{selectedTeam.coach || 'TBA'}</p>
                  </div>
                  <div className="p-3 text-center border rounded-lg bg-gradient-to-r from-purple-500/10 to-violet-600/10 border-purple-500/20">
                    <MapPin className="w-4 h-4 mx-auto mb-1 text-purple-400" />
                    <h3 className="text-xs font-medium text-purple-400 mb-0.5">Home Ground</h3>
                    <p className="text-sm font-bold text-white truncate">{selectedTeam.homeGround || 'Stadium'}</p>
                  </div>
                  <div className="p-3 text-center border rounded-lg bg-gradient-to-r from-orange-500/10 to-red-600/10 border-orange-500/20">
                    <Users className="w-4 h-4 mx-auto mb-1 text-orange-400" />
                    <h3 className="text-xs font-medium text-orange-400 mb-0.5">Squad Size</h3>
                    <p className={`text-sm font-bold ${selectedTeam.players?.length >= 25 ? 'text-red-400' : selectedTeam.players?.length >= 20 ? 'text-yellow-400' : 'text-white'}`}>
                      {selectedTeam.players?.length || 0}/25 Players
                    </p>
                    {selectedTeam.players?.length >= 25 && (
                      <p className="text-xs text-red-300">Maximum Reached</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Players Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="flex items-center text-lg font-bold text-white">
                  <Users className="w-5 h-5 mr-2 text-emerald-400" />
                  <span className="text-transparent bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text">
                    Elite Squad Members
                  </span>
                </h2>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1.5 text-white/70">
                    <Activity className="w-3.5 h-3.5" />
                    <span className="text-sm font-medium">{selectedTeam.players?.length || 0} Active Players</span>
                  </div>
                  <div className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                    selectedTeam.players?.length >= 25 
                      ? 'bg-red-500/20 text-red-300 border-red-500/30' 
                      : selectedTeam.players?.length >= 20 
                        ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                        : 'bg-green-500/20 text-green-300 border-green-500/30'
                  }`}>
                    {selectedTeam.players?.length || 0}/25 Squad Limit
                  </div>
                </div>
              </div>
              
              {/* Players Grid */}
              {selectedTeam.players?.length === 0 ? (
                <div className="py-12 text-center">
                  <User className="w-12 h-12 mx-auto mb-3 text-white/20" />
                  <h3 className="mb-1 text-lg font-semibold text-white/60">No players yet</h3>
                  <p className="text-sm text-white/40">Add players to build your championship squad</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {selectedTeam.players?.map(player => (
                    <PlayerCard key={player._id || player.id} player={player} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FootballManagement;