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
  const { currentProfile, isLoading } = useProfile();

  // 1. account가 없으면 login으로
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireProfile) {
    // 2. 프로필이 로딩 중이면 대기
    if (isLoading) {
      return <div className="flex justify-center items-center min-h-screen">
        <div>로딩 중...</div>
      </div>;
    }

    // 3. account는 있는데 profile 정보가 없으면 select-profile로
    if (!currentProfile) {
      return <Navigate to="/select-profile" replace />;
    }
  }

  return <>{children}</>;
}; 