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
  Sparkles,
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
  Loader
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FootballManagement = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('teams');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [teams, setTeams] = useState([
    {
      id: 1,
      name: 'FC Ahmedabad',
      shortName: 'FCA',
      logo: null,
      players: [
        { id: 1, name: 'Rahul Sharma', position: 'Forward', jerseyNumber: 10, age: 25 },
        { id: 2, name: 'Amit Patel', position: 'Midfielder', jerseyNumber: 8, age: 23 },
        { id: 3, name: 'Vikram Singh', position: 'Defender', jerseyNumber: 4, age: 27 }
      ]
    },
    {
      id: 2,
      name: 'Gujarat United',
      shortName: 'GU',
      logo: null,
      players: [
        { id: 4, name: 'Suresh Kumar', position: 'Goalkeeper', jerseyNumber: 1, age: 29 },
        { id: 5, name: 'Ravi Joshi', position: 'Forward', jerseyNumber: 9, age: 24 }
      ]
    }
  ]);
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    navigate('/superadmin/sports');
  };

  const handleAddTeam = (teamData) => {
    const newTeam = {
      id: teams.length + 1,
      ...teamData,
      players: []
    };
    setTeams([...teams, newTeam]);
    setShowAddTeamModal(false);
  };

  const handleAddPlayer = (playerData) => {
    if (selectedTeam) {
      const updatedTeams = teams.map(team => 
        team.id === selectedTeam.id 
          ? { ...team, players: [...team.players, { id: Date.now(), ...playerData }] }
          : team
      );
      setTeams(updatedTeams);
      setSelectedTeam(updatedTeams.find(t => t.id === selectedTeam.id));
    }
    setShowAddPlayerModal(false);
  };

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.shortName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-screen h-screen overflow-hidden text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-950">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/5 to-blue-500/10 animate-pulse"></div>
        
        {/* Grid pattern */}
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
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-500/20 rounded-3xl blur-2xl animate-pulse"></div>
            
            <div className="relative p-8 border bg-gradient-to-r from-slate-900/80 via-slate-800/80 to-slate-900/80 backdrop-blur-2xl rounded-3xl border-white/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <button
                    onClick={() => {
                      if (activeView === 'players' && selectedTeam) {
                        setActiveView('teams');
                        setSelectedTeam(null);
                      } else {
                        navigate('/superadmin/sports');
                      }
                    }}
                    className="relative p-3 transition-all duration-300 border group bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/30 rounded-2xl hover:from-blue-500/30 hover:to-cyan-500/30"
                  >
                    <ArrowLeft className="w-6 h-6 text-white transition-colors duration-300 group-hover:text-blue-400" />
                    <div className="absolute transition-opacity duration-300 opacity-0 -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur group-hover:opacity-70"></div>
                  </button>
                  
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="p-4 shadow-2xl bg-gradient-to-br from-blue-500 via-cyan-600 to-blue-600 rounded-2xl">
                        <span className="text-3xl">⚽</span>
                        <div className="absolute flex items-center justify-center w-6 h-6 bg-yellow-400 rounded-full -top-2 -right-2">
                          <Sparkles className="w-3 h-3 text-yellow-900" />
                        </div>
                      </div>
                      <div className="absolute inset-0 opacity-50 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl blur-lg animate-pulse"></div>
                    </div>
                    
                    <div>
                      <h1 className="mb-2 text-4xl font-bold text-transparent bg-gradient-to-r from-blue-400 via-cyan-500 to-blue-500 bg-clip-text">
                        {activeView === 'teams' ? 'Football Championship Hub' : `${selectedTeam?.name} Squad`}
                      </h1>
                      <p className="text-lg font-medium text-white/80">
                        {activeView === 'teams' 
                          ? 'Professional Football Team Management System' 
                          : 'Elite Player Roster & Performance Analytics'
                        }
                      </p>
                      <div className="flex items-center mt-2 space-x-4">
                        <div className="flex items-center space-x-2 text-blue-400">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium">Live System</span>
                        </div>
                        <div className="flex items-center space-x-2 text-cyan-400">
                          <Shield className="w-4 h-4" />
                          <span className="text-sm font-medium">Secure Platform</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => activeView === 'teams' ? setShowAddTeamModal(true) : setShowAddPlayerModal(true)}
                  className="relative flex items-center px-6 py-3 space-x-3 transition-all duration-300 transform shadow-2xl group rounded-2xl hover:scale-105 bg-gradient-to-r from-blue-500 via-cyan-600 to-blue-600 hover:from-blue-600 hover:via-cyan-700 hover:to-blue-700"
                >
                  <div className="absolute transition-opacity duration-300 opacity-50 -inset-1 rounded-2xl blur group-hover:opacity-75 bg-gradient-to-r from-blue-500 to-cyan-600"></div>
                  <Plus className="relative w-5 h-5 text-white" />
                  <span className="relative font-semibold text-white">
                    {activeView === 'teams' ? 'Create Team' : 'Add Player'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur"></div>
            <div className="relative flex p-2 border bg-slate-900/50 backdrop-blur-xl rounded-2xl border-white/10">
              <button
                onClick={() => setActiveView('teams')}
                className={`relative flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeView === 'teams'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Users className="inline-block w-4 h-4 mr-2" />
                Teams Overview
              </button>
              <button
                onClick={() => setActiveView('players')}
                className={`relative flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeView === 'players'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <User className="inline-block w-4 h-4 mr-2" />
                Player Management
              </button>
            </div>
          </div>
        </div>

        {/* Teams View */}
        {activeView === 'teams' && (
          <div className="space-y-8">
            {/* Search and Filter Bar */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur"></div>
              <div className="relative flex items-center p-4 border bg-slate-900/50 backdrop-blur-xl rounded-2xl border-white/10">
                <Search className="w-5 h-5 mr-3 text-white/40" />
                <input
                  type="text"
                  placeholder="Search teams by name or abbreviation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 text-white bg-transparent placeholder-white/40 focus:outline-none"
                />
              </div>
            </div>

            {/* Teams Grid */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredTeams.map((team) => (
                <div
                  key={team.id}
                  className="relative transition-all duration-300 cursor-pointer group hover:scale-105"
                  onClick={() => {
                    setSelectedTeam(team);
                    setActiveView('players');
                  }}
                >
                  {/* Card glow effect */}
                  <div className="absolute transition-opacity duration-300 opacity-0 -inset-1 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-3xl blur group-hover:opacity-100"></div>
                  
                  <div className="relative p-8 border bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-3xl border-white/10 group-hover:border-white/20">
                    {/* Team Header */}
                    <div className="flex items-center mb-6 space-x-4">
                      <div className="relative">
                        <div className="flex items-center justify-center w-20 h-20 shadow-2xl bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl">
                          <span className="text-3xl">⚽</span>
                        </div>
                        <div className="absolute inset-0 opacity-50 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl blur-lg animate-pulse"></div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">{team.name}</h3>
                        <p className="text-lg font-medium text-blue-400">{team.shortName}</p>
                      </div>
                    </div>

                    {/* Team Stats */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-400">{team.players.length}</div>
                        <div className="text-sm font-medium text-white/60">Players</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-cyan-400">Active</div>
                        <div className="text-sm font-medium text-white/60">Status</div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex items-center justify-center p-3 transition-all duration-300 border bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/30 rounded-xl group-hover:from-blue-500/30 group-hover:to-cyan-500/30">
                      <span className="font-medium text-white">Manage Team</span>
                      <ArrowLeft className="w-4 h-4 ml-2 text-white rotate-180" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Players View */}
        {activeView === 'players' && selectedTeam && (
          <div className="space-y-8">
            {/* Team Header */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur"></div>
              <div className="relative p-6 border bg-slate-900/50 backdrop-blur-xl rounded-2xl border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-16 h-16 shadow-lg bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl">
                      <span className="text-2xl">⚽</span>
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">{selectedTeam.name}</h2>
                      <p className="text-lg text-blue-400">{selectedTeam.shortName} • {selectedTeam.players.length} Players</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-cyan-400">{selectedTeam.players.length}</div>
                    <div className="text-sm text-white/60">Squad Size</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Players Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {selectedTeam.players.map((player) => (
                <div
                  key={player.id}
                  className="relative transition-all duration-300 group hover:scale-105"
                >
                  {/* Card glow effect */}
                  <div className="absolute transition-opacity duration-300 opacity-0 -inset-1 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-2xl blur group-hover:opacity-100"></div>
                  
                  <div className="relative p-6 border bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-2xl border-white/10 group-hover:border-white/20">
                    {/* Player Header */}
                    <div className="flex items-center mb-4 space-x-4">
                      <div className="relative">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full shadow-lg bg-gradient-to-br from-blue-500 to-cyan-600">
                          <User className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute flex items-center justify-center w-6 h-6 font-bold text-white bg-yellow-500 rounded-full -top-1 -right-1">
                          {player.jerseyNumber}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{player.name}</h3>
                        <p className="font-medium text-blue-400">{player.position}</p>
                      </div>
                    </div>

                    {/* Player Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-xl font-bold text-blue-400">#{player.jerseyNumber}</div>
                        <div className="text-xs font-medium text-white/60">Jersey</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-cyan-400">{player.age}</div>
                        <div className="text-xs font-medium text-white/60">Age</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Team Modal */}
      {showAddTeamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-lg">
          <div className="w-full max-w-md p-8 border bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-2xl border-white/20 rounded-3xl">
            <h3 className="mb-6 text-2xl font-bold">Add New Football Team</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              handleAddTeam({
                name: formData.get('name'),
                shortName: formData.get('shortName')
              });
            }}>
              <div className="space-y-4">
                <input
                  name="name"
                  placeholder="Team Name"
                  className="w-full p-3 text-white border bg-white/10 border-white/20 rounded-xl placeholder-white/50"
                  required
                />
                <input
                  name="shortName"
                  placeholder="Short Name (e.g., FCA)"
                  className="w-full p-3 text-white border bg-white/10 border-white/20 rounded-xl placeholder-white/50"
                  required
                />
              </div>
              <div className="flex mt-6 space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAddTeamModal(false)}
                  className="flex-1 p-3 transition-all duration-300 bg-white/10 rounded-xl hover:bg-white/20"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 p-3 transition-all duration-300 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl hover:from-blue-600 hover:to-cyan-600"
                >
                  Add Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Player Modal */}
      {showAddPlayerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-lg">
          <div className="w-full max-w-md p-8 border bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-2xl border-white/20 rounded-3xl">
            <h3 className="mb-6 text-2xl font-bold">Add New Player</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              handleAddPlayer({
                name: formData.get('name'),
                position: formData.get('position'),
                jerseyNumber: parseInt(formData.get('jerseyNumber')),
                age: parseInt(formData.get('age'))
              });
            }}>
              <div className="space-y-4">
                <input
                  name="name"
                  placeholder="Player Name"
                  className="w-full p-3 text-white border bg-white/10 border-white/20 rounded-xl placeholder-white/50"
                  required
                />
                <select
                  name="position"
                  className="w-full p-3 text-white border bg-white/10 border-white/20 rounded-xl"
                  required
                >
                  <option value="">Select Position</option>
                  <option value="Goalkeeper">Goalkeeper</option>
                  <option value="Defender">Defender</option>
                  <option value="Midfielder">Midfielder</option>
                  <option value="Forward">Forward</option>
                </select>
                <input
                  name="jerseyNumber"
                  type="number"
                  placeholder="Jersey Number"
                  className="w-full p-3 text-white border bg-white/10 border-white/20 rounded-xl placeholder-white/50"
                  required
                />
                <input
                  name="age"
                  type="number"
                  placeholder="Age"
                  className="w-full p-3 text-white border bg-white/10 border-white/20 rounded-xl placeholder-white/50"
                  required
                />
              </div>
              <div className="flex mt-6 space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAddPlayerModal(false)}
                  className="flex-1 p-3 transition-all duration-300 bg-white/10 rounded-xl hover:bg-white/20"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 p-3 transition-all duration-300 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl hover:from-blue-600 hover:to-cyan-600"
                >
                  Add Player
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FootballManagement;