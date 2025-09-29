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
import volleyballAPIService from '../../../services/volleyballAPI';
import subAdminAPIService from '../../../services/subAdminAPI';

const VolleyballManagement = () => {
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
      name: 'Spike Masters',
      shortName: 'SM',
      captain: 'Bruno Rezende',
      coach: 'Renan Dal Zotto',
      homeGround: 'Ginásio do Maracanãzinho',
      contactEmail: 'info@spikemasters.com',
      contactPhone: '+55 21 1234 5678',
      established: '2021',
      players: [
        { id: 1, name: 'Bruno Rezende', role: 'Setter', age: 36, jerseyNumber: 1 },
        { id: 2, name: 'Yoandy Leal', role: 'Outside Hitter', age: 34, jerseyNumber: 9 },
        { id: 3, name: 'Lucas Saatkamp', role: 'Middle Blocker', age: 37, jerseyNumber: 16 }
      ]
    },
    {
      id: 2,
      _id: '2',
      name: 'Block Busters',
      shortName: 'BB',
      captain: 'Micah Christenson',
      coach: 'John Speraw',
      homeGround: 'Walter Pyramid',
      contactEmail: 'info@blockbusters.com',
      contactPhone: '+1 562 985 4111',
      established: '2022',
      players: [
        { id: 4, name: 'Micah Christenson', role: 'Setter', age: 29, jerseyNumber: 11 },
        { id: 5, name: 'Matt Anderson', role: 'Opposite Hitter', age: 35, jerseyNumber: 1 },
        { id: 6, name: 'Taylor Sander', role: 'Outside Hitter', age: 31, jerseyNumber: 3 }
      ]
    },
  ]);
  const [subAdmins, setSubAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subAdminError, setSubAdminError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const currentUser = 'Dsp2810';
  const currentDateTime = '2025-08-24 12:35:01';
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

  // --- Data Loading Helpers (added) ---
  const loadTeamsFromAPI = async () => {
    try {
      setError(null);
      const res = await volleyballAPIService.getAllTeams();
      // Backend shape: { success, count, data: [teams] }
      if (res?.success && Array.isArray(res.data)) {
        setTeams(res.data);
      } else if (Array.isArray(res?.data?.data)) { // fallback shape safeguard
        setTeams(res.data.data);
      } else {
        setTeams([]);
      }
    } catch (e) {
      console.error('Error loading teams:', e);
      setError(e.message || 'Failed to load teams');
    }
  };

  const loadSubAdminsFromAPI = async () => {
    try {
      // Service returns { success: boolean, data: <backendResponse>, status }
      const res = await subAdminAPIService.getAllSubAdmins();
      if (res.success && res.data?.success && Array.isArray(res.data.data)) {
        setSubAdmins(res.data.data);
      } else if (Array.isArray(res?.data?.data)) {
        setSubAdmins(res.data.data);
      } else {
        setSubAdmins([]);
      }
    } catch (e) {
      console.error('Error loading sub-admins:', e);
      setError(prev => prev || e.message || 'Failed to load sub-admins');
    }
  };

  // Load data on component mount
  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([loadTeamsFromAPI(), loadSubAdminsFromAPI()]);
      setLoading(false);
    })();
  }, []);

  // Save teams to localStorage
  const saveTeamsToStorage = async (newTeams) => {
    try {
      localStorage.setItem('volleyballTeams', JSON.stringify(newTeams));
      window.dispatchEvent(new CustomEvent('volleyballTeamsUpdated'));
    } catch (error) {
      console.error('Error saving teams to localStorage:', error);
    }
  };

  // Save sub-admins to storage
  const saveSubAdminsToStorage = (newSubAdmins) => {
    try {
      localStorage.setItem('volleyballSubAdmins', JSON.stringify(newSubAdmins));
    } catch (error) {
      console.error('Error saving sub-admins to localStorage:', error);
    }
  };

  // Enhanced Add Sub-Admin functionality with API
  const handleAddSubAdmin = async () => {
    if (!newSubAdmin.name || !newSubAdmin.email || !newSubAdmin.password) {
      alert('❌ Please fill in all required fields (Name, Email, and Password)');
      return;
    }

    if (newSubAdmin.password !== newSubAdmin.confirmPassword) {
      alert('❌ Passwords do not match');
      return;
    }

    if (newSubAdmin.password.length < 8) {
      alert('❌ Password must be at least 8 characters long');
      return;
    }

    // Check if email already exists
    const emailExists = subAdmins.some(admin => admin.email.toLowerCase() === newSubAdmin.email.toLowerCase());
    if (emailExists) {
      alert('❌ Email already exists. Please use a different email address.');
      return;
    }

    try {
      setLoading(true);
      
      // Try API first
  const response = await subAdminAPIService.createSubAdmin(newSubAdmin);
  const created = response?.data?.data; // backend: { success, data: {subAdminFields}, message }
  if (response.success && response.data?.success && created) {
        // Refresh from server to keep in sync (avoids mixing fallback/local objects)
        await loadSubAdminsFromAPI();

        setTimeout(() => {
          alert(`✅ Volleyball Sub-Admin Created Successfully in Database!\n\n${created.name} has been saved to MongoDB!\nEmail: ${created.email}\nSpecialization: ${created.specialization}\nStatus: ${created.status}\nSub-Admin ID: ${created._id}`);
        }, 100);
      } else {
        const errMsg = response.error || response.data?.error || response.data?.message || 'Unknown error';
        setSubAdminError(errMsg);
        alert(`❌ Failed to create sub-admin in database.\n\n${errMsg}`);
      }

      // Reset form
      setNewSubAdmin({
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
      setShowAddSubAdminModal(false);
      
    } catch (error) {
      console.error('Failed to create sub-admin:', error);
      alert(`❌ Failed to Create Sub-Admin\n\nError: ${error.message}\n\nPlease check your data and try again.`);
    } finally {
      setLoading(false);
    }
  };

  // Update player statistics
  const updatePlayerStats = (playerId) => {
    const newKills = Math.floor(Math.random() * 10) + 1;
    const newAces = Math.floor(Math.random() * 5);
    const newBlocks = Math.floor(Math.random() * 5);

    const updatedTeams = teams.map(team => ({
      ...team,
      players: team.players.map(player => 
        player.id === playerId 
          ? {
              ...player,
              matches: (player.matches || 0) + 1,
              kills: (player.kills || 0) + newKills,
              aces: (player.aces || 0) + newAces,
              blocks: (player.blocks || 0) + newBlocks,
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
    
    alert(`📊 Stats Updated!\n\n${updatedPlayer.name} performance updated:\n+${newKills} kills\n+${newAces} aces\n+${newBlocks} blocks\n\nTotal Matches: ${updatedPlayer.matches}`);
  };

  const [newTeam, setNewTeam] = useState({
    name: '',
    shortName: '',
    captain: '',
    coach: '',
    homeGround: '',
    contactEmail: '',
    contactPhone: '',
    established: new Date().getFullYear().toString()
  });

  const [newPlayer, setNewPlayer] = useState({
    name: '',
    role: '',
    age: '',
    contactPhone: '',
    contactEmail: '',
    experience: ''
  });

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.shortName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSubAdmins = subAdmins.filter(admin =>
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Photo management functions
  const handlePhotoUpload = (playerId, file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPlayerPhotos(prev => ({
          ...prev,
          [playerId]: e.target.result
        }));
        setShowPhotoModal(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const openPhotoModal = (player) => {
    setSelectedPlayerForPhoto(player);
    setShowPhotoModal(true);
  };

  const handleRemovePhoto = (playerId) => {
    setPlayerPhotos(prev => {
      const newPhotos = { ...prev };
      delete newPhotos[playerId];
      return newPhotos;
    });
  };

  const handleAddTeam = async () => {
    if (!newTeam.name || !newTeam.shortName || !newTeam.contactEmail || !newTeam.contactPhone) {
      alert('❌ Please fill in all required fields (Name, Short Name, Contact Email, and Contact Phone)');
      return;
    }
    
    try {
      setLoading(true);
      
      volleyballAPIService.validateTeamData(newTeam);
      const response = await volleyballAPIService.createTeam(newTeam);
      
      if (response.success && response.data) {
        const updatedTeams = [...teams, response.data];
        setTeams(updatedTeams);
        
        setNewTeam({
          name: '',
          shortName: '',
          captain: '',
          coach: '',
          homeGround: '',
          contactEmail: '',
          contactPhone: '',
          established: new Date().getFullYear().toString()
        });
        setShowAddTeamModal(false);
        
        setTimeout(() => {
          alert(`✅ Team Created Successfully in Database!\n\n${response.data.name} has been saved to MongoDB!\nShort Name: ${response.data.shortName}\nTotal Teams: ${updatedTeams.length}\nTeam ID: ${response.data._id}`);
        }, 100);
      }
    } catch (error) {
      console.error('Failed to create team:', error);
      alert(`❌ Failed to Create Team\n\nError: ${error.message}\n\nPlease check your connection and try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlayer = async () => {
    if (!newPlayer.name || !newPlayer.role || !selectedTeam) {
      alert('❌ Please fill in all required fields (Name and Role)');
      return;
    }
    
    if (selectedTeam.players && selectedTeam.players.length >= 15) {
      alert('⚠️ Maximum Team Size Reached!\n\nEach team can have a maximum of 15 players. Please remove a player before adding a new one.');
      return;
    }
    
    try {
      setLoading(true);
      
      const playerData = {
        name: newPlayer.name.trim(),
        role: newPlayer.role,
        age: parseInt(newPlayer.age) || 18,
        jerseyNumber: (selectedTeam.players?.length || 0) + 1,
        contactPhone: newPlayer.contactPhone?.trim() || '',
        contactEmail: newPlayer.contactEmail?.trim().toLowerCase() || '',
        experience: newPlayer.experience?.trim() || '0 years',
        matches: 0,
        kills: 0,
        aces: 0,
        blocks: 0,
      };
      
      volleyballAPIService.validatePlayerData(playerData);
      const response = await volleyballAPIService.addPlayer(selectedTeam._id || selectedTeam.id, playerData);
      
      if (response.success && response.data) {
        const updatedTeams = teams.map(team => 
          (team._id || team.id) === (selectedTeam._id || selectedTeam.id) 
            ? response.data.team 
            : team
        );
        
        setTeams(updatedTeams);
  // No local storage persistence; state only
        setSelectedTeam(response.data.team);
        
        setNewPlayer({
          name: '',
          role: '',
          age: '',
          contactPhone: '',
          contactEmail: '',
          experience: ''
        });
        setShowAddPlayerModal(false);
        
        setTimeout(() => {
          const addedPlayer = response.data.player;
          alert(`✅ Player Added Successfully to Database!\n\n${addedPlayer.name} has been saved to MongoDB!\nTeam: ${response.data.team.name}\nJersey Number: #${addedPlayer.jerseyNumber}\nTeam Size: ${response.data.team.players.length}/15\nPlayer ID: ${addedPlayer._id}`);
        }, 100);
      }
    } catch (error) {
      console.error('Failed to add player:', error);
      alert(`❌ Failed to Add Player\n\nError: ${error.message}\n\nPlease check your data and try again.`);
    } finally {
      setLoading(false);
    }
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
                  <div className={`text-xs font-bold ${ (team.players?.length || 0) >= 15 ? 'text-red-400' : (team.players?.length || 0) >= 12 ? 'text-yellow-400' : 'text-white'}`}>
                    {team.players?.length || 0}/15
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
      if (role?.includes('Setter')) return 'from-blue-500 to-cyan-600';
      if (role?.includes('Hitter')) return 'from-green-500 to-emerald-600';
      if (role?.includes('Blocker')) return 'from-red-500 to-rose-600';
      if (role?.includes('Libero')) return 'from-purple-500 to-violet-600';
      return 'from-gray-500 to-slate-600';
    };

    const getRoleIcon = (role) => {
      if (role?.includes('Setter')) return Users;
      if (role?.includes('Hitter')) return Target;
      if (role?.includes('Blocker')) return Shield;
      if (role?.includes('Libero')) return Zap;
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
                  {playerPhotos[player.id] ? (
                    <img 
                      src={playerPhotos[player.id]} 
                      alt={player.name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">
                      <User className="w-5 h-5 text-white/40" />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => openPhotoModal(player)}
                  className="absolute p-0.5 transition-all duration-300 bg-blue-500 border rounded-full -bottom-0.5 -right-0.5 hover:bg-blue-600 border-slate-800 hover:scale-110"
                >
                  <Camera className="w-2 h-2 text-white" />
                </button>
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
              <div className="px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 border-green-500/30">
                <span className="text-xs font-medium text-green-400">Active</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mb-3">
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
                <div className="text-sm font-bold text-green-400">{player.kills || 0}</div>
              </div>
              <div className="text-xs font-medium text-white/60">Kills</div>
            </div>
            <div className="p-2 text-center border rounded-lg bg-gradient-to-r from-red-500/10 to-rose-600/10 border-red-500/20">
              <div className="flex items-center justify-center mb-0.5">
                <Shield className="w-3 h-3 mr-0.5 text-red-400" />
                <div className="text-sm font-bold text-red-400">{player.blocks || 0}</div>
              </div>
              <div className="text-xs font-medium text-white/60">Blocks</div>
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
                        {activeView === 'teams' ? 'Volleyball Management Hub' : 
                         activeView === 'sub-admins' ? 'Volleyball Sub-Administrators' :
                         `${selectedTeam?.name} Squad`}
                      </h1>
                      <p className="text-sm font-medium truncate text-white/80 lg:text-base">
                        {activeView === 'teams' ? 'Professional Team & Sub-Admin Management System' : 
                         activeView === 'sub-admins' ? 'Manage Volleyball Sub-Administrator Access & Permissions' :
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
                        className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-all duration-300 ${ activeView === 'teams' 
                            ? 'bg-gradient-to-r from-emerald-500 to-blue-600 text-white' 
                            : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50' }`}
                      >
                        <Users className="inline w-3.5 h-3.5 mr-1.5" />
                        Teams ({teams.length})
                      </button>
                      <button
                        onClick={() => setActiveView('sub-admins')}
                        className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-all duration-300 ${ activeView === 'sub-admins' 
                            ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white' 
                            : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50' }`}
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
                    className={`flex items-center px-3 py-2 space-x-1.5 transition-all duration-300 transform shadow-lg rounded-lg hover:scale-105 text-sm font-semibold ${ activeView === 'team-details' && selectedTeam && selectedTeam.players?.length >= 15 
                        ? 'bg-gradient-to-r from-gray-600 to-gray-700 cursor-not-allowed opacity-60' 
                        : activeView === 'sub-admins'
                        ? 'bg-gradient-to-r from-purple-500 via-pink-600 to-red-600 hover:from-purple-600 hover:via-pink-700 hover:to-red-700'
                        : 'bg-gradient-to-r from-emerald-500 via-blue-600 to-purple-600 hover:from-emerald-600 hover:via-blue-700 hover:to-purple-700' }`}
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
              <p className="text-base font-medium text-white/70">Loading volleyball data...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="max-w-xl p-3 mx-auto mb-4 border rounded-lg bg-yellow-500/10 border-yellow-500/30">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-yellow-400" />
              <div>
                <h4 className="text-sm font-semibold text-yellow-200">Connection Notice</h4>
                <p className="text-xs text-yellow-200/80">{error}</p>
              </div>
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
                  {searchTerm ? 'Try adjusting your search terms' : 'Create your first volleyball team to get started'}
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
                  {searchTerm ? 'Try adjusting your search terms' : 'Add your first volleyball sub-administrator to get started'}
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
                    <p className={`text-sm font-bold ${selectedTeam.players?.length >= 15 ? 'text-red-400' : selectedTeam.players?.length >= 12 ? 'text-yellow-400' : 'text-white'}`}>
                      {selectedTeam.players?.length || 0}/15 Players
                    </p>
                    {selectedTeam.players?.length >= 15 && (
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
                  <div className={`px-2.5 py-1 rounded-full text-xs font-medium border ${ selectedTeam.players?.length >= 15 
                      ? 'bg-red-500/20 text-red-300 border-red-500/30' 
                      : selectedTeam.players?.length >= 12 
                        ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                        : 'bg-green-500/20 text-green-300 border-green-500/30' }`}>
                    {selectedTeam.players?.length || 0}/15 Squad Limit
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

        {/* Add Team Modal */}
        {showAddTeamModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="relative w-full max-w-3xl">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-xl blur-lg"></div>
              <div className="relative bg-gradient-to-br from-slate-900/98 via-slate-800/98 to-slate-900/98 backdrop-blur-2xl border border-white/20 rounded-xl p-5 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-blue-600">
                      <Plus className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Create New Volleyball Team</h2>
                      <p className="text-sm text-white/70">Build your championship squad</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAddTeamModal(false)}
                    className="p-2 transition-all duration-300 rounded-lg text-white/60 hover:text-white hover:bg-white/10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 gap-4 mb-5 md:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-emerald-400">Team Name *</label>
                    <input
                      type="text"
                      value={newTeam.name}
                      onChange={(e) => setNewTeam({...newTeam, name: e.target.value})}
                      className="w-full px-3 py-2.5 text-white transition-all duration-300 border rounded-lg bg-gradient-to-r from-slate-800/80 to-slate-700/80 border-white/20 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
                      placeholder="Enter team name"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-blue-400">Team Abbreviation *</label>
                    <input
                      type="text"
                      value={newTeam.shortName}
                      onChange={(e) => setNewTeam({...newTeam, shortName: e.target.value})}
                      className="w-full px-3 py-2.5 text-white transition-all duration-300 border rounded-lg bg-gradient-to-r from-slate-800/80 to-slate-700/80 border-white/20 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                      placeholder="e.g., SM"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-purple-400">Team Captain</label>
                    <div className="relative">
                      <Crown className="absolute w-3.5 h-3.5 text-purple-400 transform -translate-y-1/2 left-3 top-1/2" />
                      <input
                        type="text"
                        value={newTeam.captain}
                        onChange={(e) => setNewTeam({...newTeam, captain: e.target.value})}
                        className="w-full py-2.5 pl-9 pr-3 text-white transition-all duration-300 border rounded-lg bg-gradient-to-r from-slate-800/80 to-slate-700/80 border-white/20 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
                        placeholder="Captain name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-orange-400">Head Coach</label>
                    <div className="relative">
                      <Award className="absolute w-3.5 h-3.5 text-orange-400 transform -translate-y-1/2 left-3 top-1/2" />
                      <input
                        type="text"
                        value={newTeam.coach}
                        onChange={(e) => setNewTeam({...newTeam, coach: e.target.value})}
                        className="w-full py-2.5 pl-9 pr-3 text-white transition-all duration-300 border rounded-lg bg-gradient-to-r from-slate-800/80 to-slate-700/80 border-white/20 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/20"
                        placeholder="Coach name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-cyan-400">Home Ground</label>
                    <div className="relative">
                      <MapPin className="absolute w-3.5 h-3.5 transform -translate-y-1/2 left-3 top-1/2 text-cyan-400" />
                      <input
                        type="text"
                        value={newTeam.homeGround}
                        onChange={(e) => setNewTeam({...newTeam, homeGround: e.target.value})}
                        className="w-full py-2.5 pl-9 pr-3 text-white transition-all duration-300 border rounded-lg bg-gradient-to-r from-slate-800/80 to-slate-700/80 border-white/20 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                        placeholder="Arena name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-yellow-400">Established Year</label>
                    <div className="relative">
                      <Calendar className="absolute w-3.5 h-3.5 text-yellow-400 transform -translate-y-1/2 left-3 top-1/2" />
                      <input
                        type="text"
                        value={newTeam.established}
                        onChange={(e) => setNewTeam({...newTeam, established: e.target.value})}
                        className="w-full py-2.5 pl-9 pr-3 text-white transition-all duration-300 border rounded-lg bg-gradient-to-r from-slate-800/80 to-slate-700/80 border-white/20 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20"
                        placeholder="2025"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-rose-400">Contact Email *</label>
                    <div className="relative">
                      <Mail className="absolute w-3.5 h-3.5 transform -translate-y-1/2 text-rose-400 left-3 top-1/2" />
                      <input
                        type="email"
                        value={newTeam.contactEmail}
                        onChange={(e) => setNewTeam({...newTeam, contactEmail: e.target.value})}
                        className="w-full py-2.5 pl-9 pr-3 text-white transition-all duration-300 border rounded-lg bg-gradient-to-r from-slate-800/80 to-slate-700/80 border-white/20 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400/20"
                        placeholder="team@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-indigo-400">Contact Phone *</label>
                    <div className="relative">
                      <Phone className="absolute w-3.5 h-3.5 transform -translate-y-1/2 left-3 top-1/2 text-indigo-400" />
                      <input
                        type="tel"
                        value={newTeam.contactPhone}
                        onChange={(e) => setNewTeam({...newTeam, contactPhone: e.target.value})}
                        className="w-full py-2.5 pl-9 pr-3 text-white transition-all duration-300 border rounded-lg bg-gradient-to-r from-slate-800/80 to-slate-700/80 border-white/20 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/20"
                        placeholder="+01 123 456 7890"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex pt-4 space-x-3 border-t border-white/20">
                  <button
                    onClick={handleAddTeam}
                    disabled={loading}
                    className="flex-1 py-2.5 text-sm font-bold text-white transition-all duration-300 transform shadow-lg bg-gradient-to-r from-emerald-500 via-blue-600 to-purple-600 rounded-lg hover:from-emerald-600 hover:via-blue-700 hover:to-purple-700 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <Loader className="w-3.5 h-3.5 animate-spin" />
                        <span>Creating Team...</span>
                      </div>
                    ) : (
                      'Create Championship Team'
                    )}
                  </button>
                  <button
                    onClick={() => setShowAddTeamModal(false)}
                    className="flex-1 py-2.5 text-sm font-bold text-white transition-all duration-300 border bg-gradient-to-r from-slate-700 to-slate-600 border-white/20 rounded-lg hover:from-slate-600 hover:to-slate-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Player Modal */}
        {showAddPlayerModal && selectedTeam && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="relative w-full max-w-3xl">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-emerald-500/20 rounded-xl blur-lg"></div>
              <div className="relative bg-gradient-to-br from-slate-900/98 via-slate-800/98 to-slate-900/98 backdrop-blur-2xl border border-white/20 rounded-xl p-5 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-emerald-600">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Add Elite Player</h2>
                      <p className="text-sm text-white/70">Recruit to {selectedTeam.name}</p>
                      <div className={`mt-0.5 px-2 py-0.5 rounded-full text-xs font-medium inline-block border ${ selectedTeam.players?.length >= 15 
                          ? 'bg-red-500/20 text-red-300 border-red-500/30' 
                          : selectedTeam.players?.length >= 12 
                            ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                            : 'bg-green-500/20 text-green-300 border-green-500/30' }`}>
                        Current Squad: {selectedTeam.players?.length || 0}/15 Players
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAddPlayerModal(false)}
                    className="p-2 transition-all duration-300 rounded-lg text-white/60 hover:text-white hover:bg-white/10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 gap-4 mb-5 md:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-emerald-400">Player Name *</label>
                    <div className="relative">
                      <User className="absolute w-3.5 h-3.5 transform -translate-y-1/2 text-emerald-400 left-3 top-1/2" />
                      <input
                        type="text"
                        value={newPlayer.name}
                        onChange={(e) => setNewPlayer({...newPlayer, name: e.target.value})}
                        className="w-full py-2.5 pl-9 pr-3 text-white transition-all duration-300 border rounded-lg bg-gradient-to-r from-slate-800/80 to-slate-700/80 border-white/20 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
                        placeholder="Enter player name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-blue-400">Playing Role *</label>
                    <div className="relative">
                      <Target className="absolute w-3.5 h-3.5 text-blue-400 transform -translate-y-1/2 left-3 top-1/2" />
                      <select
                        value={newPlayer.role}
                        onChange={(e) => setNewPlayer({...newPlayer, role: e.target.value})}
                        className="w-full py-2.5 pl-9 pr-3 text-white transition-all duration-300 border rounded-lg appearance-none bg-gradient-to-r from-slate-800/80 to-slate-700/80 border-white/20 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                      >
                        <option value="" className="bg-slate-800">Select role</option>
                        <option value="Setter" className="bg-slate-800">Setter</option>
                        <option value="Outside Hitter" className="bg-slate-800">Outside Hitter</option>
                        <option value="Middle Blocker" className="bg-slate-800">Middle Blocker</option>
                        <option value="Opposite Hitter" className="bg-slate-800">Opposite Hitter</option>
                        <option value="Libero" className="bg-slate-800">Libero</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-purple-400">Age</label>
                    <div className="relative">
                      <Star className="absolute w-3.5 h-3.5 text-purple-400 transform -translate-y-1/2 left-3 top-1/2" />
                      <input
                        type="number"
                        value={newPlayer.age}
                        onChange={(e) => setNewPlayer({...newPlayer, age: e.target.value})}
                        className="w-full py-2.5 pl-9 pr-3 text-white transition-all duration-300 border rounded-lg bg-gradient-to-r from-slate-800/80 to-slate-700/80 border-white/20 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
                        placeholder="Player age"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-orange-400">Experience (Years)</label>
                    <div className="relative">
                      <Award className="absolute w-3.5 h-3.5 text-orange-400 transform -translate-y-1/2 left-3 top-1/2" />
                      <input
                        type="text"
                        value={newPlayer.experience}
                        onChange={(e) => setNewPlayer({...newPlayer, experience: e.target.value})}
                        className="w-full py-2.5 pl-9 pr-3 text-white transition-all duration-300 border rounded-lg bg-gradient-to-r from-slate-800/80 to-slate-700/80 border-white/20 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/20"
                        placeholder="Years of experience"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-cyan-400">Contact Phone</label>
                    <div className="relative">
                      <Phone className="absolute w-3.5 h-3.5 transform -translate-y-1/2 left-3 top-1/2 text-cyan-400" />
                      <input
                        type="tel"
                        value={newPlayer.contactPhone}
                        onChange={(e) => setNewPlayer({...newPlayer, contactPhone: e.target.value})}
                        className="w-full py-2.5 pl-9 pr-3 text-white transition-all duration-300 border rounded-lg bg-gradient-to-r from-slate-800/80 to-slate-700/80 border-white/20 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                        placeholder="+01 123 456 7890"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-yellow-400">Contact Email</label>
                    <div className="relative">
                      <Mail className="absolute w-3.5 h-3.5 text-yellow-400 transform -translate-y-1/2 left-3 top-1/2" />
                      <input
                        type="email"
                        value={newPlayer.contactEmail}
                        onChange={(e) => setNewPlayer({...newPlayer, contactEmail: e.target.value})}
                        className="w-full py-2.5 pl-9 pr-3 text-white transition-all duration-300 border rounded-lg bg-gradient-to-r from-slate-800/80 to-slate-700/80 border-white/20 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20"
                        placeholder="player@email.com"
                      />
                    </div>
                  </div>
                </div>
                
                {selectedTeam.players?.length >= 12 && (
                  <div className={`mt-3 mb-4 p-3 rounded-lg border ${ selectedTeam.players?.length >= 15 
                      ? 'bg-red-500/10 border-red-500/30 text-red-200'
                      : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-200' }`}>
                    <div className="flex items-center space-x-2">
                      <Shield className="flex-shrink-0 w-4 h-4" />
                      <div>
                        {selectedTeam.players?.length >= 15 ? (
                          <div>
                            <h4 className="text-sm font-semibold">Maximum Squad Size Reached!</h4>
                            <p className="text-xs opacity-80">This team already has 15 players (maximum allowed). Remove a player before adding new ones.</p>
                          </div>
                        ) : (
                          <div>
                            <h4 className="text-sm font-semibold">Approaching Squad Limit</h4>
                            <p className="text-xs opacity-80">Only {15 - (selectedTeam.players?.length || 0)} more player(s) can be added to reach the 15-player limit.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex pt-4 space-x-3 border-t border-white/20">
                  <button
                    onClick={handleAddPlayer}
                    disabled={selectedTeam.players?.length >= 15 || loading}
                    className={`flex-1 py-2.5 text-sm font-bold text-white transition-all duration-300 transform shadow-lg rounded-lg hover:scale-105 ${ selectedTeam.players?.length >= 15 || loading
                        ? 'bg-gradient-to-r from-gray-600 to-gray-700 cursor-not-allowed opacity-60'
                        : 'bg-gradient-to-r from-purple-500 via-pink-600 to-emerald-600 hover:from-purple-600 hover:via-pink-700 hover:to-emerald-700' }`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <Loader className="w-3.5 h-3.5 animate-spin" />
                        <span>Adding Player...</span>
                      </div>
                    ) : selectedTeam.players?.length >= 15 ? 
                      'Squad Full - Cannot Add' : 
                      'Recruit Elite Player'
                    }
                  </button>
                  <button
                    onClick={() => setShowAddPlayerModal(false)}
                    className="flex-1 py-2.5 text-sm font-bold text-white transition-all duration-300 border bg-gradient-to-r from-slate-700 to-slate-600 border-white/20 rounded-lg hover:from-slate-600 hover:to-slate-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Add Sub-Admin Modal */}
        {showAddSubAdminModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="relative w-full max-w-4xl">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 rounded-2xl blur-lg"></div>
              <div className="relative bg-gradient-to-br from-slate-900/98 via-slate-800/98 to-slate-900/98 backdrop-blur-2xl border border-white/20 rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
                
                {/* Enhanced Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="p-2.5 shadow-lg bg-gradient-to-r from-purple-500 via-pink-600 to-cyan-600 rounded-xl">
                        <UserCheck className="w-6 h-6 text-white" />
                      </div>
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/50 to-cyan-500/50 rounded-xl blur-sm -z-10"></div>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text">
                        Add Volleyball Sub-Administrator
                      </h2>
                      <p className="text-sm text-white/80 mt-0.5">Create secure admin account with custom permissions</p>
                      <div className="flex items-center mt-1.5 space-x-3 text-xs text-slate-400">
                        <div className="flex items-center space-x-1">
                          <User className="w-3 h-3" />
                          <span>Created by: Dsp2810</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>2025-08-24 12:38:34</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Shield className="w-3 h-3 text-green-400" />
                          <span className="text-green-400">Secure Registration</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAddSubAdminModal(false)}
                    className="p-2.5 transition-all duration-300 rounded-lg text-white/60 hover:text-white hover:bg-white/10 hover:scale-110"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Enhanced Form */}
                <div className="space-y-6">
                  
                  {/* Personal Information Section */}
                  <div className="p-5 border rounded-xl bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-white/10">
                    <h3 className="flex items-center mb-4 text-lg font-bold text-white">
                      <User className="w-5 h-5 mr-2.5 text-emerald-400" />
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="block mb-2 text-sm font-bold text-emerald-400">Full Name *</label>
                        <div className="relative group">
                          <User className="absolute w-4 h-4 transition-transform transform -translate-y-1/2 text-emerald-400 left-3 top-1/2 group-focus-within:scale-110" />
                          <input
                            type="text"
                            value={newSubAdmin.name}
                            onChange={(e) => setNewSubAdmin({...newSubAdmin, name: e.target.value})}
                            className="w-full py-3 pl-10 pr-3 text-white transition-all duration-300 border-2 rounded-lg bg-gradient-to-r from-slate-800/80 to-slate-700/80 border-white/20 focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-400/20 hover:border-white/30"
                            placeholder="Enter full name (e.g., Bruno Rezende)"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-bold text-blue-400">Email Address *</label>
                        <div className="relative group">
                          <Mail className="absolute w-4 h-4 text-blue-400 transition-transform transform -translate-y-1/2 left-3 top-1/2 group-focus-within:scale-110" />
                          <input
                            type="email"
                            value={newSubAdmin.email}
                            onChange={(e) => setNewSubAdmin({...newSubAdmin, email: e.target.value})}
                            className="w-full py-3 pl-10 pr-3 text-white transition-all duration-300 border-2 rounded-lg bg-gradient-to-r from-slate-800/80 to-slate-700/80 border-white/20 focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-400/20 hover:border-white/30"
                            placeholder="admin@volleyball.sports.com"
                            required
                          />
                        </div>
                        <p className="mt-1.5 text-xs text-blue-300">This will be used for login authentication</p>
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-bold text-cyan-400">Phone Number</label>
                        <div className="relative group">
                          <Phone className="absolute w-4 h-4 text-cyan-400 transition-transform transform -translate-y-1/2 left-3 top-1/2 group-focus-within:scale-110" />
                          <input
                            type="tel"
                            value={newSubAdmin.phone}
                            onChange={(e) => setNewSubAdmin({...newSubAdmin, phone: e.target.value})}
                            className="w-full py-3 pl-10 pr-3 text-white transition-all duration-300 border-2 rounded-lg bg-gradient-to-r from-slate-800/80 to-slate-700/80 border-white/20 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-400/20 hover:border-white/30"
                            placeholder="+01 123 456 7890"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-bold text-orange-400">Specialization</label>
                        <div className="relative group">
                          <Settings className="absolute w-4 h-4 text-orange-400 transition-transform transform -translate-y-1/2 left-3 top-1/2 group-focus-within:scale-110" />
                          <select
                            value={newSubAdmin.specialization}
                            onChange={(e) => setNewSubAdmin({...newSubAdmin, specialization: e.target.value})}
                            className="w-full py-3 pl-10 pr-3 text-white transition-all duration-300 border-2 rounded-lg appearance-none bg-gradient-to-r from-slate-800/80 to-slate-700/80 border-white/20 focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-400/20 hover:border-white/30"
                          >
                            <option value="" className="bg-slate-800">Select specialization</option>
                            <option value="Team Management" className="bg-slate-800">Team Management</option>
                            <option value="Player Development" className="bg-slate-800">Player Development</option>
                            <option value="Match Analytics" className="bg-slate-800">Match Analytics & Statistics</option>
                            <option value="Performance Analysis" className="bg-slate-800">Performance Analysis</option>
                            <option value="Tournament Management" className="bg-slate-800">Tournament Management</option>
                            <option value="Youth Development" className="bg-slate-800">Youth Development</option>
                            <option value="Technical Analysis" className="bg-slate-800">Technical Analysis</option>
                            <option value="General Management" className="bg-slate-800">General Management</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Security Information Section */}
                  <div className="p-5 border rounded-xl bg-gradient-to-r from-red-900/20 to-pink-900/20 border-red-500/30">
                    <h3 className="flex items-center mb-4 text-lg font-bold text-white">
                      <Lock className="w-5 h-5 mr-2.5 text-red-400" />
                      Security Credentials
                    </h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="block mb-2 text-sm font-bold text-purple-400">Secure Password *</label>
                        <div className="relative group">
                          <Lock className="absolute w-4 h-4 text-purple-400 transition-transform transform -translate-y-1/2 left-3 top-1/2 group-focus-within:scale-110" />
                          <input
                            type={showPassword ? "text" : "password"}
                            value={newSubAdmin.password}
                            onChange={(e) => setNewSubAdmin({...newSubAdmin, password: e.target.value})}
                            className="w-full py-3 pl-10 pr-12 text-white transition-all duration-300 border-2 rounded-lg bg-gradient-to-r from-slate-800/80 to-slate-700/80 border-white/20 focus:border-purple-400 focus:outline-none focus:ring-4 focus:ring-purple-400/20 hover:border-white/30"
                            placeholder="Create strong password (min 8 chars)"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute transition-colors transform -translate-y-1/2 right-3 top-1/2 text-white/60 hover:text-white"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        <div className="mt-1.5 text-xs text-purple-300">
                          Password strength: {newSubAdmin.password.length >= 8 ? '🟢 Strong' : newSubAdmin.password.length >= 6 ? '🟡 Medium' : '🔴 Weak'}
                        </div>
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-bold text-pink-400">Confirm Password *</label>
                        <div className="relative group">
                          <Key className="absolute w-4 h-4 text-pink-400 transition-transform transform -translate-y-1/2 left-3 top-1/2 group-focus-within:scale-110" />
                          <input
                            type={showPassword ? "text" : "password"}
                            value={newSubAdmin.confirmPassword}
                            onChange={(e) => setNewSubAdmin({...newSubAdmin, confirmPassword: e.target.value})}
                            className="w-full py-3 pl-10 pr-3 text-white transition-all duration-300 border-2 rounded-lg bg-gradient-to-r from-slate-800/80 to-slate-700/80 border-white/20 focus:border-pink-400 focus:outline-none focus:ring-4 focus:ring-pink-400/20 hover:border-white/30"
                            placeholder="Confirm your password"
                            required
                          />
                        </div>
                        <div className="mt-1.5 text-xs">
                          {newSubAdmin.confirmPassword && (
                            <span className={newSubAdmin.password === newSubAdmin.confirmPassword ? 'text-green-400' : 'text-red-400'}>
                              {newSubAdmin.password === newSubAdmin.confirmPassword ? '✅ Passwords match' : '❌ Passwords do not match'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Security Guidelines */}
                    <div className="p-3 mt-4 border rounded-lg bg-slate-800/50 border-yellow-500/30">
                      <h4 className="flex items-center mb-2 text-sm font-bold text-yellow-400">
                        <Shield className="w-3.5 h-3.5 mr-2" />
                        Security Guidelines
                      </h4>
                      <ul className="space-y-0.5 text-xs text-yellow-200">
                        <li>• Password must be at least 8 characters long</li>
                        <li>• Include uppercase, lowercase, numbers, and special characters</li>
                        <li>• Avoid using personal information or common words</li>
                        <li>• Sub-admin will be required to change password on first login</li>
                      </ul>
                    </div>
                  </div>

                  {/* Enhanced Permissions Section */}
                  <div className="p-5 border rounded-xl bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-500/30">
                    <h3 className="flex items-center mb-4 text-lg font-bold text-white">
                      <Shield className="w-5 h-5 mr-2.5 text-green-400" />
                      Access Permissions & Privileges
                    </h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      
                      {/* Core Permissions */}
                      <div className="space-y-3">
                        <h4 className="text-base font-semibold text-green-400">Core Management</h4>
                        
                        <div className="flex items-center justify-between p-3 transition-colors border rounded-lg bg-slate-700/30 border-white/10 hover:bg-slate-600/30">
                          <div className="flex items-center space-x-2.5">
                            <Users className="w-4 h-4 text-emerald-400" />
                            <div>
                              <span className="text-sm font-medium text-white">Team Management</span>
                              <p className="text-xs text-slate-400">Create, edit, and manage volleyball teams</p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={newSubAdmin.permissions.manageTeams}
                              onChange={(e) => setNewSubAdmin({
                                ...newSubAdmin, 
                                permissions: {...newSubAdmin.permissions, manageTeams: e.target.checked}
                              })}
                              className="sr-only peer"
                            />
                            <div className="relative w-10 h-5 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-3 transition-colors border rounded-lg bg-slate-700/30 border-white/10 hover:bg-slate-600/30">
                          <div className="flex items-center space-x-2.5">
                            <User className="w-4 h-4 text-blue-400" />
                            <div>
                              <span className="text-sm font-medium text-white">Player Management</span>
                              <p className="text-xs text-slate-400">Add, edit, and manage player profiles</p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={newSubAdmin.permissions.managePlayers}
                              onChange={(e) => setNewSubAdmin({
                                ...newSubAdmin, 
                                permissions: {...newSubAdmin.permissions, managePlayers: e.target.checked}
                              })}
                              className="sr-only peer"
                            />
                            <div className="relative w-10 h-5 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>

                      {/* Advanced Permissions */}
                      <div className="space-y-3">
                        <h4 className="text-base font-semibold text-purple-400">Advanced Features</h4>
                        
                        <div className="flex items-center justify-between p-3 transition-colors border rounded-lg bg-slate-700/30 border-white/10 hover:bg-slate-600/30">
                          <div className="flex items-center space-x-2.5">
                            <BarChart3 className="w-4 h-4 text-purple-400" />
                            <div>
                              <span className="text-sm font-medium text-white">Analytics & Reports</span>
                              <p className="text-xs text-slate-400">View detailed statistics and reports</p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={newSubAdmin.permissions.viewReports}
                              onChange={(e) => setNewSubAdmin({
                                ...newSubAdmin, 
                                permissions: {...newSubAdmin.permissions, viewReports: e.target.checked}
                              })}
                              className="sr-only peer"
                            />
                            <div className="relative w-10 h-5 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-3 transition-colors border rounded-lg bg-slate-700/30 border-white/10 hover:bg-slate-600/30">
                          <div className="flex items-center space-x-2.5">
                            <Trophy className="w-4 h-4 text-orange-400" />
                            <div>
                              <span className="text-sm font-medium text-white">Match Management</span>
                              <p className="text-xs text-slate-400">Schedule and manage volleyball matches</p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={newSubAdmin.permissions.manageMatches}
                              onChange={(e) => setNewSubAdmin({
                                ...newSubAdmin, 
                                permissions: {...newSubAdmin.permissions, manageMatches: e.target.checked}
                              })}
                              className="sr-only peer"
                            />
                            <div className="relative w-10 h-5 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Permission Summary */}
                    <div className="p-3 mt-4 border rounded-lg bg-emerald-900/20 border-emerald-500/30">
                      <h4 className="flex items-center mb-2 text-sm font-bold text-emerald-400">
                        <Activity className="w-3.5 h-3.5 mr-2" />
                        Permission Summary
                      </h4>
                      <div className="text-sm text-emerald-200">
                        Selected Permissions: {Object.values(newSubAdmin.permissions).filter(Boolean).length} out of 4
                        <div className="mt-1.5 text-xs text-emerald-300">
                          {Object.entries(newSubAdmin.permissions).filter(([_, value]) => value).map(([key, _]) => 
                            key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
                          ).join(' • ')}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex pt-4 space-x-3 border-t border-white/20">
                    <button
                      onClick={handleAddSubAdmin}
                      disabled={loading}
                      className="flex-1 py-3 text-base font-bold text-white transition-all duration-300 transform shadow-lg bg-gradient-to-r from-purple-500 via-pink-600 to-cyan-600 rounded-xl hover:from-purple-600 hover:via-pink-700 hover:to-cyan-700 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center space-x-2.5">
                          <Loader className="w-5 h-5 animate-spin" />
                          <span>Creating Volleyball Sub-Administrator...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2.5">
                          <UserCheck className="w-5 h-5" />
                          <span>Create Volleyball Sub-Administrator</span>
                        </div>
                      )}
                    </button>
                    
                    <button
                      onClick={() => setShowAddSubAdminModal(false)}
                      className="flex-1 py-3 text-base font-bold text-white transition-all duration-300 transform border-2 bg-gradient-to-r from-slate-700 to-slate-600 border-white/20 rounded-xl hover:from-slate-600 hover:to-slate-500 hover:scale-105"
                    >
                      Cancel
                    </button>
                  </div>

                  {/* Footer Info */}
                  <div className="p-3 text-center border rounded-lg bg-slate-800/30 border-white/10">
                    <div className="space-y-1 text-xs text-slate-400">
                      <div>🔐 All sub-admin accounts are encrypted and securely stored</div>
                      <div>📧 Login credentials will be sent to the provided email address</div>
                      <div>⚡ Sub-admin will have immediate access upon account creation</div>
                      <div className="pt-1.5 mt-1.5 border-t border-slate-700">
                        Administrator: Dsp2810 | Created: 2025-08-24 12:38:34 | Status: Secure Registration
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Photo Upload Modal */}
        {showPhotoModal && selectedPlayerForPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="relative w-full max-w-md">
              <div className="absolute rounded-lg -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-lg"></div>
              <div className="relative p-5 border rounded-lg bg-gradient-to-br from-slate-900/98 via-slate-800/98 to-slate-900/98 backdrop-blur-2xl border-white/20">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                      <Camera className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Update Player Photo</h3>
                      <p className="text-sm text-white/70">{selectedPlayerForPhoto.name}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPhotoModal(false)}
                    className="p-1.5 transition-all duration-300 text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto overflow-hidden border-2 rounded-lg bg-gradient-to-r from-slate-600 to-slate-700 border-white/20">
                      {playerPhotos[selectedPlayerForPhoto.id] ? (
                        <img 
                          src={ playerPhotos[selectedPlayerForPhoto.id] ? ( playerPhotos[selectedPlayerForPhoto.id] ) : ( '' ) }
                          alt={selectedPlayerForPhoto.name}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full">
                          <User className="w-10 h-10 text-white/40" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block w-full">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePhotoUpload(selectedPlayerForPhoto.id, e.target.files[0])}
                        className="hidden"
                      />
                      <div className="flex items-center justify-center w-full py-2.5 text-sm font-semibold text-white transition-all duration-300 transform border rounded-lg cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 border-blue-500/30 hover:from-blue-600 hover:to-purple-700 hover:scale-105">
                        <Upload className="w-3.5 h-3.5 mr-2" />
                        Upload New Photo
                      </div>
                    </label>

                    {playerPhotos[selectedPlayerForPhoto.id] && (
                      <button
                        onClick={() => {
                          handleRemovePhoto(selectedPlayerForPhoto.id);
                          setShowPhotoModal(false);
                        }}
                        className="flex items-center justify-center w-full py-2.5 text-sm font-semibold text-white transition-all duration-300 border rounded-lg bg-gradient-to-r from-red-500 to-rose-600 border-red-500/30 hover:from-red-600 hover:to-rose-700"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-2" />
                        Remove Photo
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VolleyballManagement;
