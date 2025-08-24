/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AdminSportsOverview = () => {
  const navigate = useNavigate();
  
  // Get current admin user data
  const getCurrentAdmin = () => {
    try {
      const adminUserData = localStorage.getItem('adminUser');
      return adminUserData ? JSON.parse(adminUserData) : null;
    } catch (error) {
      console.error('Error parsing admin user data:', error);
      return null;
    }
  };

  const currentAdmin = getCurrentAdmin();
  
  const handleLogout = () => {
    // Clear all admin-related tokens
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('authToken');
    navigate('/admin/login');
  };

  const handleSportNavigation = (sport) => {
    const sportRoutes = {
      cricket: '/cricket-management',
      football: '/football-management', 
      basketball: '/basketball-management',
      tennis: '/tennis-management'
    };
    
    if (sportRoutes[sport]) {
      navigate(sportRoutes[sport]);
    }
  };

  // Icon Components
  const TrophyIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  );

  const UsersIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  );

  const CalendarIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  const BarChartIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 75%, #475569 100%)'
    }}>
      {/* Header */}
      <motion.header 
        className="border-b bg-white/5 backdrop-blur-lg border-white/10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container flex items-center justify-between px-6 py-4 mx-auto">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 text-white rounded-xl"
                 style={{
                   background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)'
                 }}>
              <TrophyIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {currentAdmin?.sport === 'all' ? 'Sports Admin Dashboard' : 
                 `${currentAdmin?.sport?.toUpperCase()} Admin Dashboard`}
              </h1>
              <p className="text-sm text-slate-300">
                {currentAdmin?.sport === 'all' ? 'General Management System' : 
                 `${currentAdmin?.sport} Management System`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <span className="block text-sm text-slate-300">Welcome, {currentAdmin?.name || 'Admin'}</span>
              <span className="text-xs text-slate-400">
                {currentAdmin?.sport === 'all' ? 'General Access' : `${currentAdmin?.sport} Admin`}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white transition-colors duration-200 bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Logout
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="container px-6 py-8 mx-auto">
        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {[
            { title: 'Total Teams', value: '24', icon: UsersIcon, color: 'from-blue-600 to-blue-700' },
            { title: 'Active Matches', value: '8', icon: TrophyIcon, color: 'from-green-600 to-green-700' },
            { title: 'Scheduled Games', value: '15', icon: CalendarIcon, color: 'from-purple-600 to-purple-700' },
            { title: 'Total Players', value: '312', icon: BarChartIcon, color: 'from-orange-600 to-orange-700' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="p-6 border bg-white/5 backdrop-blur-lg border-white/10 rounded-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">{stat.title}</p>
                  <p className="mt-1 text-3xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="p-6 border bg-white/5 backdrop-blur-lg border-white/10 rounded-2xl">
            <h3 className="mb-4 text-xl font-bold text-white">Quick Actions</h3>
            <div className="space-y-3">
              {[
                'Manage Cricket Teams',
                'Schedule New Match',
                'View Player Statistics',
                'Generate Reports'
              ].map((action, index) => (
                <button
                  key={index}
                  className="w-full px-4 py-3 text-left transition-all duration-200 border rounded-xl bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 border bg-white/5 backdrop-blur-lg border-white/10 rounded-2xl">
            <h3 className="mb-4 text-xl font-bold text-white">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { action: 'New team registered', time: '2 hours ago', type: 'success' },
                { action: 'Match scheduled', time: '4 hours ago', type: 'info' },
                { action: 'Player updated', time: '1 day ago', type: 'warning' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'success' ? 'bg-green-500' :
                    activity.type === 'info' ? 'bg-blue-500' : 'bg-yellow-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-300">{activity.action}</p>
                    <p className="text-xs text-slate-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Sports Categories */}
        <motion.div 
          className="p-6 border bg-white/5 backdrop-blur-lg border-white/10 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="mb-6 text-xl font-bold text-white">
            {currentAdmin?.sport === 'all' ? 'Sports Management Access' : `${currentAdmin?.sport?.toUpperCase()} Management`}
          </h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {[
              { name: 'Cricket', key: 'cricket', emoji: '🏏', available: true },
              { name: 'Football', key: 'football', emoji: '⚽', available: true }, 
              { name: 'Basketball', key: 'basketball', emoji: '🏀', available: true },
              { name: 'Tennis', key: 'tennis', emoji: '🎾', available: true },
              { name: 'Badminton', key: 'badminton', emoji: '🏸', available: false },
              { name: 'Volleyball', key: 'volleyball', emoji: '🏐', available: false }
            ].map((sport, index) => {
              const hasAccess = currentAdmin?.sport === 'all' || currentAdmin?.sport === sport.key;
              const isAvailable = sport.available && hasAccess;
              
              return (
                <button
                  key={index}
                  onClick={() => isAvailable && handleSportNavigation(sport.key)}
                  disabled={!isAvailable}
                  className={`flex flex-col items-center p-4 rounded-xl border border-white/10 transition-all duration-200 group ${
                    isAvailable 
                      ? 'bg-white/5 hover:bg-white/10 cursor-pointer' 
                      : 'bg-white/2 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform ${
                    isAvailable 
                      ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 group-hover:scale-110' 
                      : 'bg-gradient-to-r from-gray-600 to-gray-700'
                  }`}>
                    <span className="text-xl">{sport.emoji}</span>
                  </div>
                  <span className={`text-sm font-medium ${
                    isAvailable ? 'text-slate-300' : 'text-slate-500'
                  }`}>
                    {sport.name}
                  </span>
                  {currentAdmin?.sport === sport.key && (
                    <span className="mt-1 text-xs text-emerald-400">Your Sport</span>
                  )}
                  {!sport.available && (
                    <span className="mt-1 text-xs text-slate-500">Coming Soon</span>
                  )}
                </button>
              );
            })}
          </div>
          
          {currentAdmin?.sport !== 'all' && (
            <div className="p-4 mt-6 border bg-emerald-500/10 border-emerald-500/20 rounded-xl">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-emerald-400">🔒</span>
                <span className="text-sm font-medium text-emerald-300">
                  You have {currentAdmin?.sport?.toUpperCase()} admin access. 
                  Click on {currentAdmin?.sport} to manage your sport.
                </span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminSportsOverview;