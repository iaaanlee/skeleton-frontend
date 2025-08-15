import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAccountAuth } from '../contexts/AccountAuthContext';
import { useProfile } from '../contexts/ProfileContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireProfile?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireProfile = false }) => {
  const { isAuthenticated } = useAccountAuth();
  const { currentProfile } = useProfile();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireProfile && !currentProfile) {
    return <Navigate to="/select-profile" replace />;
  }

  return <>{children}</>;
}; 