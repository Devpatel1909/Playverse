import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const AdminProtectedRoute = ({ children, requiredSport }) => {
  const location = useLocation();

  const checkAuth = () => {
    // Admin auth
    const adminToken = localStorage.getItem('adminToken');
    const adminUserData = localStorage.getItem('adminUser');
    // Super admin auth (fallback)
    const superAdminToken = localStorage.getItem('superadmin_token');
    const superAdminUserData = localStorage.getItem('superadmin_user');

    // If super admin is logged in, grant access regardless of admin session
    if (superAdminToken && superAdminUserData) {
      return { authenticated: true, via: 'superadmin', role: 'superadmin' };
    }

    if (!adminToken || !adminUserData) {
      return { authenticated: false, via: 'none' };
    }

    try {
      const userData = JSON.parse(adminUserData);
      if (requiredSport) {
        const sportOk = userData.sport === requiredSport ||
          userData.sport === 'all' ||
          (Array.isArray(userData.permissions) && userData.permissions.includes(requiredSport));
        return { authenticated: !!sportOk, via: 'admin', role: userData.role || 'sport_admin', sportOk };
      }
      return { authenticated: true, via: 'admin', role: userData.role || 'sport_admin' };
    } catch (e) {
      console.error('Error parsing admin user data:', e);
      return { authenticated: false, via: 'error' };
    }
  };

  const authResult = checkAuth();

  console.log('AdminProtectedRoute check:', {
    ...authResult,
    path: location.pathname,
    requiredSport,
    adminTokenPresent: !!localStorage.getItem('adminToken'),
    superAdminTokenPresent: !!localStorage.getItem('superadmin_token')
  });

  if (!authResult.authenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminProtectedRoute;
