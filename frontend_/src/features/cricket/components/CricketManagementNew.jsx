/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Plus,
  Users,
  Trophy,
  Search,
  User,
  Phone,
  Mail,
  Edit,
  Trash2,
  Settings,
  Star,
  Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CricketManagement = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('teams');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [teams, setTeams] = useState([
    {
      id: 1,
      name: 'Voluptate',
      shortName: 'VOL',
      status: 'Elite',
      captain: 'Officia esse cupidtat',
      venue: 'Velit error dolore e',
      season: 'Y15',
      contact: '+1 (485) 444-5901',
      players: [
        { id: 1, name: 'John Doe', role: 'Batsman', experience: 'Pro' }
      ]
    },
    {
      id: 2,
      name: 'Facere',
      shortName: 'FAC',
      status: 'Elite',
      captain: 'Impedit ad qu',
      venue: 'Nulla ma',
      season: 'Q15',
      contact: '+1 (909) 571-8737',
      players: []
    },
    {
      id: 3,
      name: 'Et ut',
      shortName: 'ET',
      status: 'Elite',
      captain: 'Sed',
      venue: 'Haru',
      season: 'Q15',
      contact: '+1 (902) 123-1816',
      players: []
    }
  ]);

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.shortName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTeam = () => {
    // Add team logic here
    setShowAddTeamModal(false);
  };

  const TeamCard = ({ team }) => (
    <div className="p-6 transition-all duration-300 border bg-slate-800/50 border-slate-700/50 rounded-xl hover:bg-slate-700/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          {/* Team Logo */}
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600">
            <span className="text-lg font-bold text-white">{team.shortName}</span>
          </div>
          
          {/* Team Info */}
          <div>
            <h3 className="text-lg font-bold text-white">{team.name}</h3>
            <div className="flex items-center space-x-2 text-sm text-slate-400">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>{team.status}</span>
            </div>
          </div>
        </div>

        {/* Player Count */}
        <div className="text-right">
          <div className="text-2xl font-bold text-cyan-400">{team.players.length}</div>
          <div className="text-sm text-slate-400">Players</div>
        </div>
      </div>

      {/* Team Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4 md:grid-cols-4">
        <div className="p-3 text-center rounded-lg bg-slate-700/30">
          <div className="font-semibold text-green-400">Officia esse cupidtat</div>
          <div className="mt-1 text-xs text-slate-400">Captain</div>
        </div>
        <div className="p-3 text-center rounded-lg bg-slate-700/30">
          <div className="font-semibold text-blue-400">Velit error dolore e</div>
          <div className="mt-1 text-xs text-slate-400">Venue</div>
        </div>
        <div className="p-3 text-center rounded-lg bg-slate-700/30">
          <div className="font-semibold text-purple-400">Y15</div>
          <div className="mt-1 text-xs text-slate-400">Season</div>
        </div>
        <div className="p-3 text-center rounded-lg bg-slate-700/30">
          <div className="font-semibold text-orange-400">+1 (485) 444-5901</div>
          <div className="mt-1 text-xs text-slate-400">Contact</div>
        </div>
      </div>

      {/* Status and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="text-sm font-medium text-green-400">Active</span>
          <span className="text-sm text-slate-500">•</span>
          <span className="text-sm text-slate-400">inceptos@iymatio...</span>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 transition-colors duration-200 rounded-lg hover:bg-slate-600/50">
            <Settings className="w-4 h-4 text-slate-400 hover:text-white" />
          </button>
          <button className="px-3 py-1 text-sm font-medium transition-colors duration-200 rounded-lg bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600/30">
            Pro
          </button>
          <button className="p-2 transition-colors duration-200 rounded-lg hover:bg-slate-600/50">
            <Edit className="w-4 h-4 text-slate-400 hover:text-white" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-screen min-h-screen text-white bg-slate-900">
      {/* Header */}
      <div className="px-6 py-4 border-b bg-slate-800/50 border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/superadmin/sports')}
              className="p-2 transition-colors duration-200 rounded-lg hover:bg-slate-700/50"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Cricket Management Hub</h1>
                <p className="text-sm text-slate-400">Professional Team & Sub-Admin Management System</p>
                <div className="flex items-center mt-1 space-x-3">
                  <div className="flex items-center space-x-1 text-green-400">
                    <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                    <span className="text-xs">Live System</span>
                  </div>
                  <div className="flex items-center space-x-1 text-blue-400">
                    <Activity className="w-3 h-3" />
                    <span className="text-xs">Secure Platform</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation and Actions */}
          <div className="flex items-center space-x-4">
            <div className="flex p-1 rounded-lg bg-slate-700/30">
              <button className="px-4 py-2 text-sm font-medium text-white rounded-md bg-emerald-600">
                <Users className="inline w-4 h-4 mr-2" />
                Teams (3)
              </button>
              <button className="px-4 py-2 text-sm font-medium rounded-md text-slate-300 hover:text-white">
                <User className="inline w-4 h-4 mr-2" />
                Sub-Admins (2)
              </button>
            </div>
            
            <button
              onClick={() => setShowAddTeamModal(true)}
              className="flex items-center px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Team
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search teams by name or abbreviation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
            <div className="absolute text-sm transform -translate-y-1/2 right-3 top-1/2 text-slate-500">
              3 Teams
            </div>
          </div>
        </div>

        {/* Teams List */}
        <div className="space-y-4">
          {filteredTeams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      </div>

      {/* Add Team Modal */}
      {showAddTeamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="w-full max-w-md p-6 border bg-slate-800 border-slate-700 rounded-xl">
            <h3 className="mb-4 text-xl font-bold">Add New Team</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Team Name"
                className="w-full p-3 text-white border rounded-lg bg-slate-700/50 border-slate-600 placeholder-slate-400"
              />
              <input
                type="text"
                placeholder="Short Name"
                className="w-full p-3 text-white border rounded-lg bg-slate-700/50 border-slate-600 placeholder-slate-400"
              />
            </div>
            <div className="flex mt-6 space-x-3">
              <button
                onClick={() => setShowAddTeamModal(false)}
                className="flex-1 py-3 font-medium transition-colors rounded-lg bg-slate-700 hover:bg-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTeam}
                className="flex-1 py-3 font-medium rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-600"
              >
                Add Team
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CricketManagement;
