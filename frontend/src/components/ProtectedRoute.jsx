import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import superAdminAPIService from '../services/superAdminAPI';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = superAdminAPIService.isAuthenticated();

  console.log('ProtectedRoute check:', { isAuthenticated, location: location.pathname });

  if (!isAuthenticated) {
    // Redirect to login page with return path
    return <Navigate to="/superadmin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
