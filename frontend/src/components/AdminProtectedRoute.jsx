import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const AdminProtectedRoute = ({ children, requiredSport }) => {
  const location = useLocation();
  
  // Check if admin is authenticated
  const isAdminAuthenticated = () => {
    const adminToken = localStorage.getItem('adminToken');
    const adminUserData = localStorage.getItem('adminUser');
    
    if (!adminToken || !adminUserData) return false;
    
    try {
      const userData = JSON.parse(adminUserData);
      
      // If a specific sport is required, check permissions
      if (requiredSport) {
        return userData.sport === requiredSport || 
               userData.sport === 'all' || 
               (userData.permissions && userData.permissions.includes(requiredSport));
      }
      
      return true;
    } catch (error) {
      console.error('Error parsing admin user data:', error);
      return false;
    }
  };

  const authenticated = isAdminAuthenticated();

  console.log('AdminProtectedRoute check:', { 
    authenticated, 
    location: location.pathname,
    requiredSport,
    adminToken: localStorage.getItem('adminToken'),
    adminUser: localStorage.getItem('adminUser')
  });

  if (!authenticated) {
    // Redirect to admin login page with return path
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminProtectedRoute;
