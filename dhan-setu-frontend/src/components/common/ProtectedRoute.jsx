// src/components/common/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { STORAGE_KEYS } from '../../utils/constants';

const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

const ProtectedRoute = ({ 
  children, 
  requiredRole = null, 
  redirectTo = '/login' 
}) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  const userRole = localStorage.getItem(STORAGE_KEYS.ROLE);

  // Check if user is authenticated and token is not expired
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.ROLE);
    localStorage.removeItem(STORAGE_KEYS.USER_ID);
    return <Navigate to={redirectTo} replace />;
  }

  // Check if user has required role
  if (requiredRole && userRole !== requiredRole) {
    const roleDashboard = userRole === 'vendor' ? '/vendor' : '/lender';
    return <Navigate to={roleDashboard} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
