/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import superAdminAPI from '../../../services/superAdminAPI';
import cricketAPIService from '../../../services/cricketAPI';

const CricketAdminPage = () => {
  const navigate = useNavigate();

  const getCurrentAdmin = () => {
    try {
      const adminUserData = localStorage.getItem('adminUser');
      return adminUserData ? JSON.parse(adminUserData) : null;
    } catch (e) {
      return null;
    }
  };
  const currentAdmin = getCurrentAdmin();

  const [activeView, setActiveView] = useState('dashboard');
  const [adminCreds, setAdminCreds] = useState({});
  const [loadingCreds, setLoadingCreds] = useState(false);

  const [teams, setTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [teamsError, setTeamsError] = useState(null);

  const [matches, setMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [matchesError, setMatchesError] = useState(null);

  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Dashboard filters
  const [teamSearch, setTeamSearch] = useState('');
  const [playerSearch, setPlayerSearch] = useState('');
  const [playerTeamFilter, setPlayerTeamFilter] = useState('all');

  useEffect(() => {
    const sportsList = [
      { name: 'Cricket', key: 'cricket' },
      { name: 'Football', key: 'football' },
      { name: 'Basketball', key: 'basketball' },
      { name: 'Tennis', key: 'tennis' }
    ];

    setLoadingCreds(true);
    Promise.all(
      sportsList.map(sport =>
        superAdminAPI.getAdminCredentials(sport.key)
          .then(res => ({ sport: sport.key, data: res.data }))
          .catch(() => ({ sport: sport.key, data: null }))
      )
    ).then(results => {
      const creds = {};
      results.forEach(({ sport, data }) => { creds[sport] = data; });
      setAdminCreds(creds);
    }).finally(() => setLoadingCreds(false));

    let mounted = true;
    const loadTeams = async () => {
      setLoadingTeams(true); setTeamsError(null);
      try {
        const res = await cricketAPIService.getAllTeams();
        const data = Array.isArray(res) ? res : (res.data || res.teams || []);
        if (!mounted) return;
        setTeams(data);
      } catch (err) {
        if (!mounted) return;
        setTeamsError(err.message || 'Failed to load teams');
      } finally { if (mounted) setLoadingTeams(false); }
    };

    const loadMatches = async () => {
      setLoadingMatches(true); setMatchesError(null);
      try {
        const res = await cricketAPIService.getAllMatches();
        const data = Array.isArray(res) ? res : (res.data || res.matches || []);
        if (!mounted) return;
        setMatches(data);
      } catch (err) {
        if (!mounted) return;
        setMatchesError(err.message || 'Failed to load matches');
      } finally { if (mounted) setLoadingMatches(false); }
    };

    loadTeams(); loadMatches();
    return () => { mounted = false; };
  }, []);

  // Function to reload matches (can be called after match creation/updates)
  const reloadMatches = async () => {
    setLoadingMatches(true); setMatchesError(null);
    try {
      const res = await cricketAPIService.getAllMatches();
      const data = Array.isArray(res) ? res : (res.data || res.matches || []);
      setMatches(data);
    } catch (err) {
      setMatchesError(err.message || 'Failed to load matches');
    } finally {
      setLoadingMatches(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('authToken');
    navigate('/admin/login');
  };

  const openTeamDetail = async (teamId) => {
    try {
      setShowTeamModal(true); setSelectedTeam(null);
      const res = await cricketAPIService.getTeamById(teamId);
      const team = res?.data || res?.team || res;
      setSelectedTeam(team);
    } catch (err) {
      setSelectedTeam({ error: err.message || 'Failed to load team' });
    }
  };
  const closeTeamModal = () => { setShowTeamModal(false); setSelectedTeam(null); };

  const openScheduleModal = () => setShowScheduleModal(true);
  const closeScheduleModal = () => setShowScheduleModal(false);

  const handleCreateMatch = async (formData) => {
    try {
      const payload = { 
        teamA: formData.teamA, 
        teamB: formData.teamB, 
        date: formData.date, 
        venue: formData.venue,
        matchType: formData.matchType || 'T20',
        overs: formData.overs || 20
      };
      
      console.log('Creating match with payload:', payload);
      const res = await cricketAPIService.createMatch(payload);
      console.log('Match created successfully:', res);
      
      // Reload matches from database to ensure consistency
      await reloadMatches();
      
      closeScheduleModal();
      setActiveView('update');
      
      // Show success message
      alert('Match scheduled successfully!');
    } catch (err) {
      console.error('Failed to create match:', err);
      alert(err.message || 'Failed to schedule match');
    }
  };

  // Derived collections for filters
  const allPlayers = teams.flatMap(t => (t.players || []).map(p => ({ ...p, teamName: t.name, teamId: t._id })));
  const filteredTeams = teams.filter(t => {
    if (!teamSearch.trim()) return true;
    const q = teamSearch.toLowerCase();
    return (
      t.name?.toLowerCase().includes(q) ||
      t.shortName?.toLowerCase().includes(q) ||
      t.coach?.toLowerCase().includes(q) ||
      t.captain?.toLowerCase().includes(q)
    );
  });
  const filteredPlayers = allPlayers.filter(p => {
    const matchTeam = playerTeamFilter === 'all' ? true : p.teamId === playerTeamFilter;
    if (!playerSearch.trim()) return matchTeam;
    const q = playerSearch.toLowerCase();
    return matchTeam && (
      p.name?.toLowerCase().includes(q) ||
      p.role?.toLowerCase().includes(q) ||
      String(p.jerseyNumber || '').includes(q)
    );
  });

  return (
    <div className="min-h-screen w-screen relative overflow-x-hidden" style={{ background: 'linear-gradient(135deg, #0a0f1c 0%, #1a1f3a 25%, #2d3748 50%, #4a5568 75%, #667eea 100%)' }}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #10b981, transparent)' }}
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          initial={{ top: '10%', left: '80%' }}
        />
        <motion.div
          className="absolute w-64 h-64 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }}
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          initial={{ top: '60%', left: '10%' }}
        />
        <motion.div
          className="absolute w-48 h-48 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #f59e0b, transparent)' }}
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          initial={{ top: '30%', right: '20%' }}
        />
      </div>

      <motion.header 
        className="border-b backdrop-blur-xl border-white/20 sticky top-0 z-40 shadow-2xl" 
        style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 50%, rgba(245, 158, 11, 0.1) 100%)' }}
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="w-full flex items-center justify-between px-6 py-4">
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div 
              className="flex items-center justify-center w-14 h-14 text-white rounded-2xl shadow-2xl" 
              style={{ background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 50%, #f59e0b 100%)' }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: [
                  '0 0 20px rgba(16, 185, 129, 0.5)',
                  '0 0 30px rgba(59, 130, 246, 0.5)',
                  '0 0 20px rgba(245, 158, 11, 0.5)',
                  '0 0 20px rgba(16, 185, 129, 0.5)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" /></svg>
            </motion.div>
            <div>
              <motion.h1 
                className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-blue-400 to-amber-400 bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {currentAdmin?.sport === 'all' ? 'Sports Admin Dashboard' : `${currentAdmin?.sport?.toUpperCase()} Admin Dashboard`}
              </motion.h1>
              <motion.p 
                className="text-sm text-slate-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {currentAdmin?.sport === 'all' ? 'General Management System' : `${currentAdmin?.sport} Management System`}
              </motion.p>
            </div>
          </motion.div>

          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="text-right">
              <motion.span 
                className="block text-sm bg-gradient-to-r from-emerald-300 to-blue-300 bg-clip-text text-transparent font-medium"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                Welcome, {currentAdmin?.name || 'Admin'}
              </motion.span>
              <motion.span 
                className="text-xs text-slate-400"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                {currentAdmin?.sport === 'all' ? 'General Access' : `${currentAdmin?.sport} Admin`}
              </motion.span>
            </div>
            <motion.button 
              onClick={handleLogout} 
              className="px-5 py-2.5 text-sm font-bold text-white transition-all duration-300 rounded-xl shadow-lg"
              style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)' }}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: '0 10px 25px rgba(239, 68, 68, 0.4)',
                background: 'linear-gradient(135deg, #f87171 0%, #ef4444 50%, #dc2626 100%)'
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              Logout
            </motion.button>
          </motion.div>
        </div>

        <div className="w-full px-6 pb-4">
          <motion.div 
            className="flex items-center gap-2 flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {[
              { key: 'dashboard', label: 'Dashboard', icon: '📊', color: 'from-emerald-500 to-teal-500' },
              { key: 'schedule', label: 'Schedule', icon: '📅', color: 'from-blue-500 to-indigo-500' },
              { key: 'update', label: 'Scheduled Matches', icon: '📅', color: 'from-amber-500 to-orange-500' },
              { key: 'teams', label: 'Teams', icon: '👥', color: 'from-purple-500 to-pink-500' },
              { key: 'players', label: 'Players', icon: '🏏', color: 'from-green-500 to-emerald-500' },
              { key: 'live', label: 'Live', icon: '🔴', color: 'from-red-500 to-pink-500' },
              { key: 'reports', label: 'Reports', icon: '📈', color: 'from-cyan-500 to-blue-500' }
            ].map((item, index) => (
              <motion.button 
                key={item.key} 
                onClick={() => setActiveView(item.key)} 
                className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-300 shadow-lg backdrop-blur-sm border border-white/10 ${
                  activeView === item.key 
                    ? `bg-gradient-to-r ${item.color} text-white shadow-xl` 
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
                whileHover={{ 
                  scale: 1.05, 
                  y: -2,
                  boxShadow: activeView === item.key 
                    ? '0 10px 25px rgba(255, 255, 255, 0.2)' 
                    : '0 5px 15px rgba(255, 255, 255, 0.1)'
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </motion.header>

      <main className="w-full px-6 py-8 relative z-10">
        {activeView === 'dashboard' && (
          <motion.div 
            className="space-y-8" 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Top stats */}
            <motion.div 
              className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {[
                { label: 'Teams', value: teams.length, icon: '🏟️', color: 'from-emerald-500 to-teal-500', shadowColor: 'emerald' },
                { label: 'Players', value: allPlayers.length, icon: '🏏', color: 'from-blue-500 to-indigo-500', shadowColor: 'blue' },
                { label: 'Matches', value: matches.length, icon: '⚡', color: 'from-amber-500 to-orange-500', shadowColor: 'amber' },
                { label: 'Live', value: matches.filter(m => m.isLive || m.status === 'live').length, icon: '🔴', color: 'from-red-500 to-pink-500', shadowColor: 'red' }
              ].map((stat, index) => (
                <motion.div 
                  key={stat.label}
                  className={`p-6 border rounded-2xl backdrop-blur-xl border-white/20 shadow-2xl bg-gradient-to-br ${stat.color} bg-opacity-10`}
                  style={{ 
                    background: `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)`,
                    boxShadow: `0 8px 32px rgba(${stat.shadowColor === 'emerald' ? '16, 185, 129' : stat.shadowColor === 'blue' ? '59, 130, 246' : stat.shadowColor === 'amber' ? '245, 158, 11' : '239, 68, 68'}, 0.15)`
                  }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -5,
                    boxShadow: `0 12px 40px rgba(${stat.shadowColor === 'emerald' ? '16, 185, 129' : stat.shadowColor === 'blue' ? '59, 130, 246' : stat.shadowColor === 'amber' ? '245, 158, 11' : '239, 68, 68'}, 0.25)`
                  }}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`text-2xl bg-gradient-to-r ${stat.color} bg-clip-text text-transparent font-bold`}>{stat.icon}</div>
                    <motion.div 
                      className={`text-3xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.6 + index * 0.1, type: "spring", stiffness: 200 }}
                    >
                      {stat.value}
                    </motion.div>
                  </div>
                  <div className={`text-sm font-medium bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Available Teams */}
            <motion.div 
              className="p-8 border rounded-3xl backdrop-blur-xl border-white/20 shadow-2xl"
              style={{ 
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 50%, rgba(245, 158, 11, 0.1) 100%)',
                boxShadow: '0 8px 32px rgba(16, 185, 129, 0.1)'
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              whileHover={{ 
                boxShadow: '0 12px 40px rgba(16, 185, 129, 0.15)',
                y: -2
              }}
            >
              <div className="flex flex-col items-start justify-between gap-4 mb-6 sm:flex-row sm:items-center">
                <motion.h3 
                  className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  🏟️ Available Teams
                </motion.h3>
                <motion.input 
                  value={teamSearch} 
                  onChange={e => setTeamSearch(e.target.value)} 
                  placeholder="🔍 Search teams by name, coach, captain..." 
                  className="w-full sm:w-96 p-4 rounded-2xl bg-white/10 backdrop-blur-lg text-white placeholder:text-slate-400 border border-white/20 shadow-lg focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-300"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  whileFocus={{ scale: 1.02, boxShadow: '0 8px 25px rgba(16, 185, 129, 0.2)' }}
                />
              </div>
              {loadingTeams ? (
                <motion.div 
                  className="text-slate-300 text-center py-8"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  ⏳ Loading teams...
                </motion.div>
              ) : teamsError ? (
                <motion.div 
                  className="text-red-400 bg-red-500/10 p-4 rounded-xl border border-red-500/20"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  ❌ {teamsError}
                </motion.div>
              ) : (
                <motion.div 
                  className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  {filteredTeams.map((team, index) => (
                    <motion.div 
                      key={team._id} 
                      className="p-6 transition-all border rounded-2xl backdrop-blur-lg border-white/20 shadow-lg cursor-pointer"
                      style={{ 
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                      }}
                      whileHover={{ 
                        scale: 1.03, 
                        y: -5,
                        boxShadow: '0 12px 40px rgba(16, 185, 129, 0.2)',
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(59, 130, 246, 0.1) 100%)'
                      }}
                      whileTap={{ scale: 0.97 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.9 + index * 0.05 }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-lg font-bold text-white">{team.name}</div>
                        <motion.div 
                          className="px-3 py-1 text-xs rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-bold border border-emerald-400/30"
                          whileHover={{ scale: 1.1 }}
                        >
                          {team.shortName}
                        </motion.div>
                      </div>
                      <div className="text-sm text-slate-300 mb-1">👨‍💼 Coach: <span className="text-emerald-300 font-medium">{team.coach}</span></div>
                      <div className="text-sm text-slate-300 mb-4">👑 Captain: <span className="text-blue-300 font-medium">{team.captain}</span></div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-slate-400">👥 Players: {team.players?.length || 0}</div>
                        <motion.button 
                          onClick={() => openTeamDetail(team._id)} 
                          className="px-4 py-2 text-sm font-bold text-white rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 shadow-lg"
                          whileHover={{ 
                            scale: 1.05,
                            boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)'
                          }}
                          whileTap={{ scale: 0.95 }}
                        >
                          View Details
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                  {filteredTeams.length === 0 && (
                    <motion.div 
                      className="col-span-full py-12 text-center text-slate-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      🔍 No teams match your search criteria.
                    </motion.div>
                  )}
                </motion.div>
              )}
            </motion.div>

            {/* Available Players */}
            <motion.div 
              className="p-8 border rounded-3xl backdrop-blur-xl border-white/20 shadow-2xl"
              style={{ 
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 50%, rgba(236, 72, 153, 0.1) 100%)',
                boxShadow: '0 8px 32px rgba(59, 130, 246, 0.1)'
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
              whileHover={{ 
                boxShadow: '0 12px 40px rgba(59, 130, 246, 0.15)',
                y: -2
              }}
            >
              <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
                <motion.h3 
                  className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  🏏 Available Players
                </motion.h3>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <motion.select 
                    value={playerTeamFilter} 
                    onChange={e => setPlayerTeamFilter(e.target.value)} 
                    className="w-full sm:w-64 p-3 rounded-xl bg-white/10 backdrop-blur-lg text-white border border-white/20 shadow-lg focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                    whileFocus={{ scale: 1.02 }}
                  >
                    <option value="all" className="bg-slate-800">🌟 All Teams</option>
                    {teams.map(t => (<option key={t._id} value={t._id} className="bg-slate-800">🏟️ {t.name}</option>))}
                  </motion.select>
                  <motion.input 
                    value={playerSearch} 
                    onChange={e => setPlayerSearch(e.target.value)} 
                    placeholder="🔍 Search players by name, role, jersey..." 
                    className="w-full sm:w-96 p-3 rounded-xl bg-white/10 backdrop-blur-lg text-white placeholder:text-slate-400 border border-white/20 shadow-lg focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.0 }}
                    whileFocus={{ scale: 1.02 }}
                  />
                </div>
              </div>
              <motion.div 
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.1 }}
              >
                {filteredPlayers.slice(0, 24).map((player, index) => (
                  <motion.div 
                    key={player._id || `${player.teamId}-${player.jerseyNumber}-${player.name}`} 
                    className="p-5 transition-all border rounded-2xl backdrop-blur-lg border-white/20 shadow-lg"
                    style={{ 
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                    }}
                    whileHover={{ 
                      scale: 1.03, 
                      y: -3,
                      boxShadow: '0 10px 30px rgba(147, 51, 234, 0.2)',
                      background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.15) 0%, rgba(236, 72, 153, 0.1) 100%)'
                    }}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.4, delay: 1.2 + index * 0.03 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-bold text-white">{player.name}</div>
                      <motion.div 
                        className="px-2 py-1 text-xs font-bold text-white rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                        whileHover={{ scale: 1.1 }}
                      >
                        #{player.jerseyNumber}
                      </motion.div>
                    </div>
                    <div className="text-sm text-slate-300 mb-3">
                      🎯 <span className="text-blue-300 font-medium">{player.role}</span> • 
                      🏟️ <span className="text-emerald-300 font-medium">{player.teamName}</span>
                    </div>
                    <div className="text-xs text-slate-400 space-y-1">
                      <div>🏏 Matches: <span className="text-white font-medium">{player.matches || 0}</span></div>
                      <div>🏃 Runs: <span className="text-green-300 font-medium">{player.runs || 0}</span></div>
                      <div>🎯 Wickets: <span className="text-orange-300 font-medium">{player.wickets || 0}</span></div>
                    </div>
                  </motion.div>
                ))}
                {filteredPlayers.length === 0 && (
                  <motion.div 
                    className="col-span-full py-12 text-center text-slate-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    🔍 No players found for selected filters.
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {activeView === 'schedule' && (
          <div className="p-6 border bg-white/5 rounded-2xl">
            <h3 className="mb-4 text-xl font-bold text-white">Schedule Match</h3>
            <ScheduleForm teams={teams} onCreate={handleCreateMatch} />
          </div>
        )}

        {activeView === 'update' && (
          <div className="p-6 border bg-white/5 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Scheduled Matches</h3>
              <button 
                onClick={reloadMatches}
                disabled={loadingMatches}
                className="px-3 py-1 bg-blue-600 rounded text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingMatches ? '🔄 Loading...' : '🔄 Refresh'}
              </button>
            </div>
            {loadingMatches ? <div>Loading matches...</div> : matchesError ? <div className="text-red-300">{matchesError}</div> : matches.filter(m => m.status === 'scheduled' || !m.status).length === 0 ? (
              <div className="text-slate-400">No scheduled matches found. Create a new match to get started.</div>
            ) : (
              <div className="space-y-3">
                {matches.filter(m => m.status === 'scheduled' || !m.status).map(m => (
                  <div key={m._id} className="p-4 border rounded bg-white/5 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">{m.teamA?.name || 'TBD'} vs {m.teamB?.name || 'TBD'}</div>
                      <div className="text-sm text-slate-400">{m.date ? new Date(m.date).toLocaleString() : 'Date TBD'} • {m.venue || 'Venue TBD'}</div>
                      <div className="flex items-center mt-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                          📅 Scheduled
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => navigate(`/admin/cricket/score/${m._id}`)} 
                        className="px-3 py-1 bg-emerald-600 rounded text-white hover:bg-emerald-700 transition-colors"
                      >
                        🚀 Start Live Scoring
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}</div>
        )}

        {activeView === 'teams' && (
          <div className="p-6 border bg-white/5 rounded-2xl">
            <h3 className="mb-4 text-xl font-bold text-white">Teams</h3>
            <div className="mb-4">
              <input value={teamSearch} onChange={e => setTeamSearch(e.target.value)} placeholder="Search teams..." className="w-full p-2 rounded bg-slate-800 text-slate-100 border border-white/10" />
            </div>
            {loadingTeams ? <div>Loading teams...</div> : teamsError ? <div className="text-red-300">{teamsError}</div> : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{filteredTeams.map(team => (
                <div key={team._id} className="p-4 border rounded bg-white/5 border-white/10">
                  <div className="font-semibold text-white">{team.name}</div>
                  <div className="text-sm text-slate-400">{team.shortName} • {team.players?.length || 0} players</div>
                  <div className="mt-3"><button onClick={() => openTeamDetail(team._id)} className="px-3 py-1 bg-emerald-600 rounded text-white">Details</button></div>
                </div>
              ))}
              {filteredTeams.length === 0 && (<div className="col-span-full py-8 text-center text-slate-400">No teams match your search.</div>)}
              </div>
            )}
          </div>
        )}

        {activeView === 'players' && (
          <div className="p-6 border bg-white/5 rounded-2xl">
            <h3 className="mb-4 text-xl font-bold text-white">Players</h3>
            <div className="flex flex-col gap-2 mb-4 sm:flex-row">
              <select value={playerTeamFilter} onChange={e => setPlayerTeamFilter(e.target.value)} className="w-full sm:w-56 p-2 rounded bg-slate-800 text-slate-100 border border-white/10">
                <option value="all">All Teams</option>
                {teams.map(t => (<option key={t._id} value={t._id}>{t.name}</option>))}
              </select>
              <input value={playerSearch} onChange={e => setPlayerSearch(e.target.value)} placeholder="Search by name, role or jersey" className="w-full p-2 rounded bg-slate-800 text-slate-100 border border-white/10" />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{filteredPlayers.map(player => (
              <div key={player._id || `${player.teamId}-${player.jerseyNumber}-${player.name}`} className="p-3 border rounded bg-white/5 border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white">{player.name}</div>
                    <div className="text-xs text-slate-400">#{player.jerseyNumber} • {player.role} • {player.teamName}</div>
                  </div>
                  <div className="text-xs text-slate-300">{player.matches || 0} matches</div>
                </div>
              </div>
            ))}
            {filteredPlayers.length === 0 && (<div className="col-span-full py-8 text-center text-slate-400">No players match your filters.</div>)}
            </div>
          </div>
        )}

        {activeView === 'live' && (
          <div className="p-6 border bg-white/5 rounded-2xl">
            <h3 className="mb-4 text-xl font-bold text-white">Live Scoring</h3>
            {loadingMatches ? <div>Loading matches...</div> : matches.filter(m => m.isLive || m.status === 'live').length === 0 ? (
              <div className="text-slate-400">No live matches currently</div>
            ) : (
              <div className="space-y-3">{matches.filter(m => m.isLive || m.status === 'live').map(m => (
                <div key={m._id} className="p-4 border rounded bg-white/5 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">{m.teamA?.name} vs {m.teamB?.name}</div>
                    <div className="text-sm text-slate-400">{m.venue || 'Venue TBD'}</div>
                  </div>
                  <div><button onClick={() => navigate(`/admin/cricket/score/${m._id}`)} className="px-3 py-1 bg-emerald-600 rounded text-white">🏏 Continue Live Scoring</button></div>
                </div>
              ))}</div>
            )}
          </div>
        )}

        {activeView === 'reports' && (
          <div className="p-6 border bg-white/5 rounded-2xl">
            <h3 className="mb-4 text-xl font-bold text-white">Reports</h3>
            <p className="text-slate-400">Reports UI coming soon.</p>
          </div>
        )}

        {/* Modals */}
        {showScheduleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="w-full max-w-lg p-6 border bg-slate-900 rounded-xl border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xl font-bold text-white">Schedule New Match</h4>
                <button onClick={closeScheduleModal} className="text-slate-400">Close</button>
              </div>
              <ScheduleForm teams={teams} onCreate={handleCreateMatch} />
            </div>
          </div>
        )}

        {showTeamModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="w-full max-w-2xl p-6 border bg-slate-900 rounded-xl border-white/10">
              <div className="flex items-start justify-between mb-4">
                <h4 className="text-xl font-bold text-white">Team Details</h4>
                <button onClick={closeTeamModal} className="text-slate-400">Close</button>
              </div>
              {!selectedTeam ? (
                <div className="py-8 text-center text-slate-400">Loading team details...</div>
              ) : selectedTeam.error ? (
                <div className="py-6 text-red-300">{selectedTeam.error}</div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-lg font-semibold text-white">{selectedTeam.name}</h5>
                      <p className="text-sm text-slate-400">Short name: {selectedTeam.shortName}</p>
                    </div>
                    <div className="text-sm text-slate-300">Win %: {selectedTeam.winPercentage || '0'}</div>
                  </div>

                  <div>
                    <h6 className="mb-2 text-sm font-medium text-white">Players</h6>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">{(selectedTeam.players || []).map(player => (
                      <div key={player._id || player.jerseyNumber} className="p-3 rounded bg-white/3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-white">{player.name}</div>
                            <div className="text-xs text-slate-400">#{player.jerseyNumber} • {player.role}</div>
                          </div>
                          <div className="text-xs text-slate-300">{player.matches || 0} matches</div>
                        </div>
                      </div>
                    ))}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

// Schedule form component
const ScheduleForm = ({ teams = [], onCreate }) => {
  const [teamA, setTeamA] = useState(teams[0]?._id || '');
  const [teamB, setTeamB] = useState(teams[1]?._id || '');
  const [date, setDate] = useState('');
  const [venue, setVenue] = useState('');

  useEffect(() => {
    if (teams.length >= 2) {
      setTeamA(teams[0]._id);
      setTeamB(teams[1]._id);
    }
  }, [teams]);

  const submit = (e) => {
    e.preventDefault();
    if (!teamA || !teamB || !date) return alert('Please select teams and date');
    if (teamA === teamB) return alert('Team A and Team B must be different');
    onCreate({ teamA, teamB, date, venue });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block mb-1 text-sm text-slate-300">Team A</label>
        <select value={teamA} onChange={e => setTeamA(e.target.value)} className="w-full p-2 bg-slate-800 rounded">
          <option value="">Select team</option>
          {teams.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block mb-1 text-sm text-slate-300">Team B</label>
        <select value={teamB} onChange={e => setTeamB(e.target.value)} className="w-full p-2 bg-slate-800 rounded">
          <option value="">Select team</option>
          {teams.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block mb-1 text-sm text-slate-300">Date & Time</label>
        <input value={date} onChange={e => setDate(e.target.value)} type="datetime-local" className="w-full p-2 bg-slate-800 rounded" />
      </div>
      <div>
        <label className="block mb-1 text-sm text-slate-300">Venue (optional)</label>
        <input value={venue} onChange={e => setVenue(e.target.value)} className="w-full p-2 bg-slate-800 rounded" />
      </div>
      <div className="flex justify-end">
        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded">Schedule</button>
      </div>
    </form>
  );
};

export default CricketAdminPage;