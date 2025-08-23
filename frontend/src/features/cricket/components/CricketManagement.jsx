import React, { useState } from 'react';
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
  Sparkles,
  Shield,
  Activity,
  TrendingUp,
  User,
  Mail,
  Phone
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CricketManagement = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('teams');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);

  const [teams, setTeams] = useState([
    {
      id: 1,
      name: 'CSPIT Warriors',
      shortName: 'CSPIT',
      captain: 'Rajesh Patel',
      coach: 'Amit Shah',
      established: '2020',
      homeGround: 'CSPIT Cricket Ground',
      contactEmail: 'cspit.cricket@example.com',
      contactPhone: '+91 98765 43210',
      players: [
        { id: 1, name: 'Rajesh Patel', role: 'Captain/Batsman', age: 24, matches: 45, runs: 1250 },
        { id: 2, name: 'Suresh Kumar', role: 'Bowler', age: 22, matches: 40, wickets: 65 },
        { id: 3, name: 'Vikram Singh', role: 'All-rounder', age: 23, matches: 42, runs: 890, wickets: 35 }
      ]
    },
    {
      id: 2,
      name: 'DEPSTAR Champions',
      shortName: 'DEPSTAR',
      captain: 'Arjun Mehta',
      coach: 'Ravi Jadeja',
      established: '2019',
      homeGround: 'DEPSTAR Sports Complex',
      contactEmail: 'depstar.cricket@example.com',
      contactPhone: '+91 87654 32109',
      players: [
        { id: 4, name: 'Arjun Mehta', role: 'Captain/Wicket Keeper', age: 25, matches: 50, runs: 1450 },
        { id: 5, name: 'Kiran Patel', role: 'Fast Bowler', age: 21, matches: 35, wickets: 48 },
        { id: 6, name: 'Rohit Sharma', role: 'Batsman', age: 24, matches: 38, runs: 1100 }
      ]
    },
    {
      id: 3,
      name: 'AMPICE Tigers',
      shortName: 'AMPICE',
      captain: 'Dev Patel',
      coach: 'Mahendra Singh',
      established: '2021',
      homeGround: 'AMPICE Cricket Arena',
      contactEmail: 'ampice.cricket@example.com',
      contactPhone: '+91 76543 21098',
      players: [
        { id: 7, name: 'Dev Patel', role: 'Captain/All-rounder', age: 23, matches: 35, runs: 950, wickets: 28 },
        { id: 8, name: 'Harsh Shah', role: 'Spinner', age: 22, matches: 30, wickets: 42 },
        { id: 9, name: 'Nitin Kumar', role: 'Batsman', age: 24, matches: 33, runs: 1050 }
      ]
    }
  ]);

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

  const handleAddTeam = () => {
    if (!newTeam.name || !newTeam.shortName) return;
    
    const team = {
      ...newTeam,
      id: teams.length + 1,
      players: []
    };
    
    setTeams([...teams, team]);
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
  };

  const handleAddPlayer = () => {
    if (!newPlayer.name || !newPlayer.role || !selectedTeam) return;
    
    const player = {
      ...newPlayer,
      id: Date.now(),
      matches: 0,
      runs: 0,
      wickets: 0
    };
    
    setTeams(teams.map(team => 
      team.id === selectedTeam.id 
        ? { ...team, players: [...team.players, player] }
        : team
    ));
    
    setNewPlayer({
      name: '',
      role: '',
      age: '',
      contactPhone: '',
      contactEmail: '',
      experience: ''
    });
    setShowAddPlayerModal(false);
  };

  const TeamCard = ({ team }) => {
    const teamColors = {
      'CSPIT Warriors': 'from-emerald-500 via-green-600 to-teal-700',
      'DEPSTAR Champions': 'from-blue-500 via-indigo-600 to-purple-700', 
      'AMPICE Tigers': 'from-orange-500 via-red-600 to-pink-700'
    };

    const getTeamGradient = (teamName) => {
      return teamColors[teamName] || 'from-green-500 via-blue-600 to-purple-700';
    };

    return (
      <div className="relative transition-all duration-500 transform cursor-pointer group hover:scale-105" onClick={() => {
        setSelectedTeam(team);
        setActiveView('team-details');
      }}>
        {/* Glowing border effect */}
        <div className={`absolute -inset-1 bg-gradient-to-r ${getTeamGradient(team.name)} rounded-3xl blur-md opacity-30 group-hover:opacity-70 transition-all duration-500`}></div>
        
        {/* Main card */}
        <div className="relative p-8 overflow-hidden transition-all duration-500 border bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-3xl border-white/20 group-hover:border-white/40">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>

          {/* Floating cricket ball decoration */}
          <div className="absolute w-20 h-20 transition-transform duration-500 rounded-full -top-4 -right-4 bg-gradient-to-br from-red-400/20 to-orange-500/20 blur-xl group-hover:scale-110"></div>
          
          {/* Header */}
          <div className="relative flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className={`relative p-4 rounded-2xl bg-gradient-to-br ${getTeamGradient(team.name)} shadow-2xl group-hover:rotate-12 transition-transform duration-500`}>
                <Trophy className="w-8 h-8 text-white drop-shadow-lg" />
                <div className="absolute flex items-center justify-center w-6 h-6 bg-yellow-400 rounded-full -top-1 -right-1">
                  <Crown className="w-3 h-3 text-yellow-900" />
                </div>
              </div>
              <div>
                <h3 className="mb-1 text-2xl font-bold text-white transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-green-400">
                  {team.name}
                </h3>
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 text-sm font-semibold text-green-400 border rounded-full bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-500/30">
                    {team.shortName}
                  </span>
                  <div className="flex items-center space-x-1 text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium">Pro Team</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text">
                {team.players.length}
              </div>
              <div className="text-sm font-medium text-white/60">Active Players</div>
            </div>
          </div>

          {/* Team stats grid */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="p-4 border bg-gradient-to-r from-green-500/10 to-emerald-600/10 border-green-500/20 rounded-xl">
              <div className="flex items-center mb-2 space-x-3">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-sm font-medium text-green-400">Captain</span>
              </div>
              <div className="text-lg font-semibold text-white">{team.captain}</div>
            </div>
            <div className="p-4 border bg-gradient-to-r from-blue-500/10 to-indigo-600/10 border-blue-500/20 rounded-xl">
              <div className="flex items-center mb-2 space-x-3">
                <Award className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium text-blue-400">Coach</span>
              </div>
              <div className="text-lg font-semibold text-white">{team.coach}</div>
            </div>
          </div>

          {/* Footer info */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center space-x-2 text-white/70">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Est. {team.established}</span>
            </div>
            <div className="flex items-center space-x-2 text-white/70">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">Home Stadium</span>
            </div>
            <div className="flex items-center space-x-2 text-green-400">
              <Activity className="w-4 h-4" />
              <span className="text-sm font-medium">Active</span>
            </div>
          </div>

          {/* Hover effect overlay */}
          <div className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-br from-white/5 to-transparent group-hover:opacity-100 rounded-3xl"></div>
        </div>
      </div>
    );
  };

  const PlayerCard = ({ player }) => {
    const getRoleColor = (role) => {
      if (role?.includes('Captain')) return 'from-yellow-500 to-amber-600';
      if (role?.includes('Batsman')) return 'from-green-500 to-emerald-600';
      if (role?.includes('Bowler')) return 'from-red-500 to-rose-600';
      if (role?.includes('All-rounder')) return 'from-purple-500 to-violet-600';
      if (role?.includes('Wicket Keeper')) return 'from-blue-500 to-cyan-600';
      return 'from-gray-500 to-slate-600';
    };

    const getRoleIcon = (role) => {
      if (role?.includes('Captain')) return Crown;
      if (role?.includes('Batsman')) return Target;
      if (role?.includes('Bowler')) return Zap;
      if (role?.includes('All-rounder')) return Award;
      if (role?.includes('Wicket Keeper')) return Shield;
      return User;
    };

    const RoleIcon = getRoleIcon(player.role);

    return (
      <div className="relative transition-all duration-500 transform cursor-pointer group hover:scale-105">
        {/* Glowing border */}
        <div className={`absolute -inset-0.5 bg-gradient-to-r ${getRoleColor(player.role)} rounded-2xl blur opacity-20 group-hover:opacity-60 transition-all duration-500`}></div>
        
        <div className="relative p-6 overflow-hidden transition-all duration-500 border bg-gradient-to-br from-slate-800/90 via-slate-700/90 to-slate-800/90 backdrop-blur-xl rounded-2xl border-white/20 group-hover:border-white/40">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 -mt-16 -mr-16 rounded-full bg-gradient-to-bl from-white/5 to-transparent"></div>
          
          {/* Header */}
          <div className="relative flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${getRoleColor(player.role)} shadow-lg group-hover:rotate-12 transition-transform duration-500`}>
                <RoleIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-green-400">
                  {player.name}
                </h4>
                <p className="text-sm font-medium text-white/70">{player.role}</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center mb-1 space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-semibold text-yellow-400">Age {player.age}</span>
              </div>
              <div className="px-2 py-1 border rounded-full bg-green-500/20 border-green-500/30">
                <span className="text-xs font-medium text-green-400">Active</span>
              </div>
            </div>
          </div>
          
          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="p-3 text-center border rounded-lg bg-gradient-to-r from-blue-500/10 to-indigo-600/10 border-blue-500/20">
              <div className="flex items-center justify-center mb-1">
                <Activity className="w-4 h-4 mr-1 text-blue-400" />
                <div className="text-lg font-bold text-blue-400">{player.matches || 0}</div>
              </div>
              <div className="text-xs font-medium text-white/60">Matches</div>
            </div>
            
            {player.runs !== undefined && (
              <div className="p-3 text-center border rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-600/10 border-green-500/20">
                <div className="flex items-center justify-center mb-1">
                  <TrendingUp className="w-4 h-4 mr-1 text-green-400" />
                  <div className="text-lg font-bold text-green-400">{player.runs}</div>
                </div>
                <div className="text-xs font-medium text-white/60">Runs</div>
              </div>
            )}
            
            {player.wickets !== undefined && (
              <div className="p-3 text-center border rounded-lg bg-gradient-to-r from-purple-500/10 to-violet-600/10 border-purple-500/20">
                <div className="flex items-center justify-center mb-1">
                  <Target className="w-4 h-4 mr-1 text-purple-400" />
                  <div className="text-lg font-bold text-purple-400">{player.wickets}</div>
                </div>
                <div className="text-xs font-medium text-white/60">Wickets</div>
              </div>
            )}
          </div>

          {/* Performance indicator */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-400">Performance</span>
            </div>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-3 h-3 text-yellow-400 fill-current" />
              ))}
            </div>
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-br from-white/5 to-transparent group-hover:opacity-100 rounded-2xl"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Clean Professional Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        {/* Subtle radial gradients for depth */}
        <div className="absolute top-0 rounded-full left-1/4 w-96 h-96 bg-green-500/5 blur-3xl" />
        <div className="absolute bottom-0 rounded-full right-1/4 w-80 h-80 bg-blue-500/5 blur-3xl" />
        <div className="absolute w-64 h-64 transform -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 bg-purple-500/3 blur-3xl" />
        
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '60px 60px'
            }}
          />
        </div>
        
        {/* Noise texture for depth */}
        <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px'
          }} />
        </div>
      </div>

      <div className="relative z-10 p-6 text-white">
        {/* Enhanced Header */}
        <div className="mb-12">
          <div className="relative">
            {/* Header background glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-green-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl animate-pulse"></div>
            
            <div className="relative p-8 border bg-gradient-to-r from-slate-900/80 via-slate-800/80 to-slate-900/80 backdrop-blur-2xl rounded-3xl border-white/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <button
                    onClick={() => {
                      if (activeView === 'team-details') {
                        setActiveView('teams');
                        setSelectedTeam(null);
                      } else {
                        navigate('/superadmin/dashboard');
                      }
                    }}
                    className="relative p-3 transition-all duration-300 border group bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-500/30 rounded-2xl hover:from-green-500/30 hover:to-blue-500/30"
                  >
                    <ArrowLeft className="w-6 h-6 text-white transition-colors duration-300 group-hover:text-green-400" />
                    <div className="absolute transition-opacity duration-300 opacity-0 -inset-1 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl blur group-hover:opacity-70"></div>
                  </button>
                  
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="p-4 shadow-2xl bg-gradient-to-br from-green-500 via-emerald-600 to-blue-600 rounded-2xl">
                        <Trophy className="w-10 h-10 text-white" />
                        <div className="absolute flex items-center justify-center w-6 h-6 bg-yellow-400 rounded-full -top-2 -right-2">
                          <Sparkles className="w-3 h-3 text-yellow-900" />
                        </div>
                      </div>
                      <div className="absolute inset-0 opacity-50 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl blur-lg animate-pulse"></div>
                    </div>
                    
                    <div>
                      <h1 className="mb-2 text-4xl font-bold text-transparent bg-gradient-to-r from-green-400 via-emerald-500 to-blue-500 bg-clip-text">
                        {activeView === 'teams' ? 'Cricket Championship Hub' : `${selectedTeam?.name} Squad`}
                      </h1>
                      <p className="text-lg font-medium text-white/80">
                        {activeView === 'teams' 
                          ? 'Professional Cricket Team Management System' 
                          : 'Elite Player Roster & Performance Analytics'
                        }
                      </p>
                      <div className="flex items-center mt-2 space-x-4">
                        <div className="flex items-center space-x-2 text-green-400">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium">Live System</span>
                        </div>
                        <div className="flex items-center space-x-2 text-blue-400">
                          <Shield className="w-4 h-4" />
                          <span className="text-sm font-medium">Secure Platform</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => activeView === 'teams' ? setShowAddTeamModal(true) : setShowAddPlayerModal(true)}
                  className="relative flex items-center px-6 py-3 space-x-3 transition-all duration-300 transform shadow-2xl group bg-gradient-to-r from-green-500 via-emerald-600 to-blue-600 rounded-2xl hover:from-green-600 hover:via-emerald-700 hover:to-blue-700 hover:scale-105"
                >
                  <div className="absolute transition-opacity duration-300 opacity-50 -inset-1 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl blur group-hover:opacity-75"></div>
                  <Plus className="relative w-5 h-5 text-white" />
                  <span className="relative font-semibold text-white">
                    {activeView === 'teams' ? 'Create Team' : 'Add Player'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Search Bar */}
          {activeView === 'teams' && (
            <div className="max-w-2xl mx-auto mt-8">
              <div className="relative group">
                <div className="absolute transition-opacity duration-300 opacity-0 -inset-1 bg-gradient-to-r from-green-500/30 to-blue-500/30 rounded-2xl blur group-hover:opacity-70"></div>
                <div className="relative flex items-center">
                  <Search className="absolute z-10 w-5 h-5 text-green-400 left-4" />
                  <input
                    type="text"
                    placeholder="Search teams by name or abbreviation..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full py-4 pl-12 pr-6 text-lg text-white transition-all duration-300 border bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-xl border-white/20 rounded-2xl placeholder-white/50 focus:border-green-400 focus:outline-none"
                  />
                  <div className="absolute right-4">
                    <div className="px-3 py-1 border rounded-lg bg-green-500/20 border-green-500/30">
                      <span className="text-sm font-medium text-green-400">{filteredTeams.length} Teams</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Teams View */}
        {activeView === 'teams' && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {filteredTeams.map(team => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        )}

        {/* Team Details View */}
        {activeView === 'team-details' && selectedTeam && (
          <div>
            {/* Team Statistics Banner */}
            <div className="relative mb-10">
              <div className="absolute -inset-2 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-3xl blur-xl"></div>
              <div className="relative p-8 border bg-gradient-to-r from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-3xl border-white/20">
                <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                  <div className="p-6 text-center border bg-gradient-to-r from-green-500/10 to-emerald-600/10 border-green-500/20 rounded-2xl">
                    <Shield className="w-8 h-8 mx-auto mb-3 text-green-400" />
                    <h3 className="mb-2 text-sm font-medium text-green-400">Team Captain</h3>
                    <p className="text-lg font-bold text-white">{selectedTeam.captain}</p>
                  </div>
                  <div className="p-6 text-center border bg-gradient-to-r from-blue-500/10 to-cyan-600/10 border-blue-500/20 rounded-2xl">
                    <Award className="w-8 h-8 mx-auto mb-3 text-blue-400" />
                    <h3 className="mb-2 text-sm font-medium text-blue-400">Head Coach</h3>
                    <p className="text-lg font-bold text-white">{selectedTeam.coach}</p>
                  </div>
                  <div className="p-6 text-center border bg-gradient-to-r from-purple-500/10 to-violet-600/10 border-purple-500/20 rounded-2xl">
                    <MapPin className="w-8 h-8 mx-auto mb-3 text-purple-400" />
                    <h3 className="mb-2 text-sm font-medium text-purple-400">Home Ground</h3>
                    <p className="text-lg font-bold text-white">Stadium</p>
                  </div>
                  <div className="p-6 text-center border bg-gradient-to-r from-orange-500/10 to-red-600/10 border-orange-500/20 rounded-2xl">
                    <Users className="w-8 h-8 mx-auto mb-3 text-orange-400" />
                    <h3 className="mb-2 text-sm font-medium text-orange-400">Squad Size</h3>
                    <p className="text-lg font-bold text-white">{selectedTeam.players.length} Players</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Players Section */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="flex items-center text-3xl font-bold text-white">
                  <Users className="w-8 h-8 mr-4 text-green-400" />
                  <span className="text-transparent bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text">
                    Elite Squad Members
                  </span>
                </h2>
                <div className="flex items-center space-x-3 text-white/70">
                  <Activity className="w-5 h-5" />
                  <span className="font-medium">{selectedTeam.players.length} Active Players</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {selectedTeam.players.map(player => (
                  <PlayerCard key={player.id} player={player} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Add Team Modal */}
        {showAddTeamModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-lg animate-fadeIn">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-green-500/30 to-blue-500/30 rounded-3xl blur-xl animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl">
                      <Plus className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">Create New Cricket Team</h2>
                      <p className="text-white/70">Build your championship squad</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block mb-3 text-sm font-semibold text-green-400">Team Name *</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={newTeam.name}
                        onChange={(e) => setNewTeam({...newTeam, name: e.target.value})}
                        className="w-full px-4 py-3 text-lg text-white transition-all duration-300 border bg-gradient-to-r from-slate-800/80 to-slate-700/80 border-white/20 rounded-xl focus:border-green-400 focus:outline-none"
                        placeholder="Enter team name"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block mb-3 text-sm font-semibold text-blue-400">Team Abbreviation *</label>
                    <input
                      type="text"
                      value={newTeam.shortName}
                      onChange={(e) => setNewTeam({...newTeam, shortName: e.target.value})}
                      className="w-full px-4 py-3 text-lg text-white transition-all duration-300 border bg-gradient-to-r from-slate-800/80 to-slate-700/80 border-white/20 rounded-xl focus:border-blue-400 focus:outline-none"
                      placeholder="e.g., CSPIT"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block mb-3 text-sm font-semibold text-purple-400">Team Captain</label>
                    <div className="relative">
                      <Crown className="absolute w-5 h-5 text-purple-400 transform -translate-y-1/2 left-3 top-1/2" />
                      <input
                        type="text"
                        value={newTeam.captain}
                        onChange={(e) => setNewTeam({...newTeam, captain: e.target.value})}
                        className="w-full py-3 pl-12 pr-4 text-lg text-white transition-all duration-300 border bg-gradient-to-r from-slate-800/80 to-slate-700/80 border-white/20 rounded-xl focus:border-purple-400 focus:outline-none"
                        placeholder="Captain name"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block mb-3 text-sm font-semibold text-orange-400">Head Coach</label>
                    <div className="relative">
                      <Award className="absolute w-5 h-5 text-orange-400 transform -translate-y-1/2 left-3 top-1/2" />
                      <input
                        type="text"
                        value={newTeam.coach}
                        onChange={(e) => setNewTeam({...newTeam, coach: e.target.value})}
                        className="w-full py-3 pl-12 pr-4 text-lg text-white transition-all duration-300 border bg-gradient-to-r from-slate-800/80 to-slate-700/80 border-white/20 rounded-xl focus:border-orange-400 focus:outline-none"
                        placeholder="Coach name"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block mb-3 text-sm font-semibold text-cyan-400">Home Ground</label>
                    <div className="relative">
                      <MapPin className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-cyan-400" />
                      <input
                        type="text"
                        value={newTeam.homeGround}
                        onChange={(e) => setNewTeam({...newTeam, homeGround: e.target.value})}
                        className="w-full py-3 pl-12 pr-4 text-lg text-white transition-all duration-300 border bg-gradient-to-r from-slate-800/80 to-slate-700/80 border-white/20 rounded-xl focus:border-cyan-400 focus:outline-none"
                        placeholder="Stadium name"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block mb-3 text-sm font-semibold text-yellow-400">Established Year</label>
                    <div className="relative">
                      <Calendar className="absolute w-5 h-5 text-yellow-400 transform -translate-y-1/2 left-3 top-1/2" />
                      <input
                        type="text"
                        value={newTeam.established}
                        onChange={(e) => setNewTeam({...newTeam, established: e.target.value})}
                        className="w-full py-3 pl-12 pr-4 text-lg text-white transition-all duration-300 border bg-gradient-to-r from-slate-800/80 to-slate-700/80 border-white/20 rounded-xl focus:border-yellow-400 focus:outline-none"
                        placeholder="2025"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex pt-6 space-x-4 border-t border-white/20">
                  <button
                    onClick={handleAddTeam}
                    className="flex-1 py-4 text-lg font-bold text-white transition-all duration-300 transform shadow-2xl bg-gradient-to-r from-green-500 via-emerald-600 to-blue-600 rounded-2xl hover:from-green-600 hover:via-emerald-700 hover:to-blue-700 hover:scale-105"
                  >
                    Create Championship Team
                  </button>
                  <button
                    onClick={() => setShowAddTeamModal(false)}
                    className="flex-1 py-4 text-lg font-bold text-white transition-all duration-300 border bg-gradient-to-r from-slate-700 to-slate-600 border-white/20 rounded-2xl hover:from-slate-600 hover:to-slate-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Add Player Modal */}
        {showAddPlayerModal && selectedTeam && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-lg animate-fadeIn">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/30 to-green-500/30 rounded-3xl blur-xl animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-r from-purple-500 to-green-600 rounded-2xl">
                      <UserPlus className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">Add Elite Player</h2>
                      <p className="text-white/70">Recruit to {selectedTeam.name}</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block mb-3 text-sm font-semibold text-green-400">Player Name *</label>
                    <div className="relative">
                      <User className="absolute w-5 h-5 text-green-400 transform -translate-y-1/2 left-3 top-1/2" />
                      <input
                        type="text"
                        value={newPlayer.name}
                        onChange={(e) => setNewPlayer({...newPlayer, name: e.target.value})}
                        className="w-full py-3 pl-12 pr-4 text-lg text-white transition-all duration-300 border bg-gradient-to-r from-slate-800/80 to-slate-700/80 border-white/20 rounded-xl focus:border-green-400 focus:outline-none"
                        placeholder="Enter player name"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block mb-3 text-sm font-semibold text-blue-400">Playing Role *</label>
                    <div className="relative">
                      <Target className="absolute w-5 h-5 text-blue-400 transform -translate-y-1/2 left-3 top-1/2" />
                      <select
                        value={newPlayer.role}
                        onChange={(e) => setNewPlayer({...newPlayer, role: e.target.value})}
                        className="w-full py-3 pl-12 pr-4 text-lg text-white transition-all duration-300 border appearance-none bg-gradient-to-r from-slate-800/80 to-slate-700/80 border-white/20 rounded-xl focus:border-blue-400 focus:outline-none"
                      >
                        <option value="">Select role</option>
                        <option value="Batsman">Batsman</option>
                        <option value="Bowler">Bowler</option>
                        <option value="All-rounder">All-rounder</option>
                        <option value="Wicket Keeper">Wicket Keeper</option>
                        <option value="Captain">Captain</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block mb-3 text-sm font-semibold text-purple-400">Age</label>
                    <div className="relative">
                      <Star className="absolute w-5 h-5 text-purple-400 transform -translate-y-1/2 left-3 top-1/2" />
                      <input
                        type="number"
                        value={newPlayer.age}
                        onChange={(e) => setNewPlayer({...newPlayer, age: e.target.value})}
                        className="w-full py-3 pl-12 pr-4 text-lg text-white transition-all duration-300 border bg-gradient-to-r from-slate-800/80 to-slate-700/80 border-white/20 rounded-xl focus:border-purple-400 focus:outline-none"
                        placeholder="Player age"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block mb-3 text-sm font-semibold text-orange-400">Experience (Years)</label>
                    <div className="relative">
                      <Award className="absolute w-5 h-5 text-orange-400 transform -translate-y-1/2 left-3 top-1/2" />
                      <input
                        type="number"
                        value={newPlayer.experience}
                        onChange={(e) => setNewPlayer({...newPlayer, experience: e.target.value})}
                        className="w-full py-3 pl-12 pr-4 text-lg text-white transition-all duration-300 border bg-gradient-to-r from-slate-800/80 to-slate-700/80 border-white/20 rounded-xl focus:border-orange-400 focus:outline-none"
                        placeholder="Years of experience"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block mb-3 text-sm font-semibold text-cyan-400">Contact Phone</label>
                    <div className="relative">
                      <Phone className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-cyan-400" />
                      <input
                        type="tel"
                        value={newPlayer.contactPhone}
                        onChange={(e) => setNewPlayer({...newPlayer, contactPhone: e.target.value})}
                        className="w-full py-3 pl-12 pr-4 text-lg text-white transition-all duration-300 border bg-gradient-to-r from-slate-800/80 to-slate-700/80 border-white/20 rounded-xl focus:border-cyan-400 focus:outline-none"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block mb-3 text-sm font-semibold text-yellow-400">Contact Email</label>
                    <div className="relative">
                      <Mail className="absolute w-5 h-5 text-yellow-400 transform -translate-y-1/2 left-3 top-1/2" />
                      <input
                        type="email"
                        value={newPlayer.contactEmail}
                        onChange={(e) => setNewPlayer({...newPlayer, contactEmail: e.target.value})}
                        className="w-full py-3 pl-12 pr-4 text-lg text-white transition-all duration-300 border bg-gradient-to-r from-slate-800/80 to-slate-700/80 border-white/20 rounded-xl focus:border-yellow-400 focus:outline-none"
                        placeholder="player@email.com"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex pt-6 space-x-4 border-t border-white/20">
                  <button
                    onClick={handleAddPlayer}
                    className="flex-1 py-4 text-lg font-bold text-white transition-all duration-300 transform shadow-2xl bg-gradient-to-r from-purple-500 via-pink-600 to-green-600 rounded-2xl hover:from-purple-600 hover:via-pink-700 hover:to-green-700 hover:scale-105"
                  >
                    Recruit Elite Player
                  </button>
                  <button
                    onClick={() => setShowAddPlayerModal(false)}
                    className="flex-1 py-4 text-lg font-bold text-white transition-all duration-300 border bg-gradient-to-r from-slate-700 to-slate-600 border-white/20 rounded-2xl hover:from-slate-600 hover:to-slate-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        
        @keyframes fadeIn {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CricketManagement;
