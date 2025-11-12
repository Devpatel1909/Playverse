/* eslint-disable no-unused-vars */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import superAdminAPIService from '../services/superAdminAPI';

const SuperAdminDebug = () => {
  const navigate = useNavigate();

  const testLogin = async () => {
    try {
      // First register a test user
      const registerData = {
        fullName: 'Test Admin',
        email: 'test@example.com',
        password: 'password123'
      };
      
      try {
        await superAdminAPIService.createSuperAdmin(registerData);
        console.log('Test user registered');
      } catch (error) {
        console.log('User might already exist, continuing...');
      }

      // Now try to login
      const loginResult = await superAdminAPIService.login('test@example.com', 'password123');
      console.log('Login result:', loginResult);
      
      if (loginResult.success) {
        console.log('Login successful, navigating to sports...');
        navigate('/superadmin/sports');
      }
    } catch (error) {
      console.error('Test login error:', error);
    }
  };

  const checkAuth = () => {
    console.log('Token:', localStorage.getItem('superadmin_token'));
    console.log('User:', localStorage.getItem('superadmin_user'));
    console.log('Is Authenticated:', superAdminAPIService.isAuthenticated());
  };

  const clearAuth = () => {
    localStorage.removeItem('superadmin_token');
    localStorage.removeItem('superadmin_user');
    console.log('Auth cleared');
  };

  return (
    <div className="min-h-screen p-8 text-white bg-slate-900">
      <h1 className="mb-8 text-3xl font-bold">SuperAdmin Debug Page</h1>
      
      <div className="space-y-4">
        <button 
          onClick={testLogin}
          className="px-6 py-3 font-medium bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Test Login & Navigate
        </button>
        
        <button 
          onClick={checkAuth}
          className="px-6 py-3 font-medium bg-green-600 rounded-lg hover:bg-green-700"
        >
          Check Authentication
        </button>
        
        <button 
          onClick={clearAuth}
          className="px-6 py-3 font-medium bg-red-600 rounded-lg hover:bg-red-700"
        >
          Clear Authentication
        </button>
        
        <button 
          onClick={() => navigate('/superadmin/sports')}
          className="px-6 py-3 font-medium bg-purple-600 rounded-lg hover:bg-purple-700"
        >
          Direct Navigate to Sports
        </button>
        
        <button 
          onClick={() => navigate('/superadmin/login')}
          className="px-6 py-3 font-medium bg-yellow-600 rounded-lg hover:bg-yellow-700"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default SuperAdminDebug;
