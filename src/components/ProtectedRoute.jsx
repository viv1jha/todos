import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStatus } from '../hooks/useAuthStatus';
import LoadingScreen from './LoadingScreen';

const ProtectedRoute = ({ children }) => {
  const { loggedIn, checkingStatus } = useAuthStatus();
  
  if (checkingStatus) {
    return <LoadingScreen />;
  }
  
  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;