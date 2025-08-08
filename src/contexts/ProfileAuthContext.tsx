import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ProfileInfo } from '../types/profile/profile';
import { useAccountAuth } from './AccountAuthContext'

interface ProfileAuthContextType {
  selectedProfile: ProfileInfo | null;
  setSelectedProfile: (profile: ProfileInfo | null) => void;
  isProfileSelected: boolean;
  clearSelectedProfile: () => void;
  clearAllProfileData: () => void;
}

const ProfileAuthContext = createContext<ProfileAuthContextType | undefined>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileAuthContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileAuthProvider');
  }
  return context;
};

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileAuthProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const [selectedProfile, setSelectedProfile] = useState<ProfileInfo | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { isAuthenticated, token } = useAccountAuth();
  const queryClient = useQueryClient();

  // 계정별 프로필 상태 관리를 위한 키 생성
  const getProfileStorageKey = (accountToken: string) => {
    try {
      // 토큰에서 accountId 추출 (JWT payload의 sub 또는 id 필드 사용)
      const payload = JSON.parse(atob(accountToken.split('.')[1]));
      const accountId = payload.sub || payload.id || payload.accountId;
      return `selectedProfile_${accountId}`;
    } catch (error) {
      console.error('Error parsing token for profile storage key:', error);
      return null;
    }
  };

  // 초기화 시 현재 계정의 선택된 프로필 복원
  useEffect(() => {
    const initializeProfile = () => {
      try {
        if (!isAuthenticated || !token) {
          setSelectedProfile(null);
          setIsInitialized(true);
          return;
        }

        const storageKey = getProfileStorageKey(token);
        if (!storageKey) {
          setSelectedProfile(null);
          setIsInitialized(true);
          return;
        }

        const storedProfile = localStorage.getItem(storageKey);
        if (storedProfile) {
          const profile = JSON.parse(storedProfile);
          setSelectedProfile(profile);
        } else {
          setSelectedProfile(null);
        }
      } catch (error) {
        console.error('Error initializing profile:', error);
        setSelectedProfile(null);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeProfile();
  }, [isAuthenticated, token]);

  // 인증 상태 변경 시 프로필 상태 관리
  useEffect(() => {
    if (!isAuthenticated) {
      // 로그아웃 시 프로필 상태 초기화
      setSelectedProfile(null);
    }
  }, [isAuthenticated]);

  const isProfileSelected = selectedProfile !== null;

  const clearSelectedProfile = () => {
    setSelectedProfile(null);
    if (token) {
      const storageKey = getProfileStorageKey(token);
      if (storageKey) {
        localStorage.removeItem(storageKey);
      }
    }
    // 프로필 관련 쿼리 무효화
    queryClient.invalidateQueries({ queryKey: ['profiles'] });
  };

  // 모든 프로필 데이터 정리 (계정 로그아웃 시)
  const clearAllProfileData = () => {
    // selectedProfile_로 시작하는 모든 키 삭제
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('selectedProfile_')) {
        localStorage.removeItem(key);
      }
    });
    setSelectedProfile(null);
  };

  // 프로필 선택 시 계정별로 localStorage에 저장
  const handleSetSelectedProfile = (profile: ProfileInfo | null) => {
    setSelectedProfile(profile);
    
    if (!token) {
      console.warn('No token available for profile storage');
      return;
    }

    const storageKey = getProfileStorageKey(token);
    if (!storageKey) {
      console.warn('Could not generate storage key for profile');
      return;
    }

    if (profile) {
      localStorage.setItem(storageKey, JSON.stringify(profile));
    } else {
      localStorage.removeItem(storageKey);
    }
  };

  const value = {
    selectedProfile,
    setSelectedProfile: handleSetSelectedProfile,
    isProfileSelected,
    clearSelectedProfile,
    clearAllProfileData,
  };

  // 초기화가 완료되지 않았으면 로딩 표시
  if (!isInitialized) {
    return <div className="min-h-screen flex items-center justify-center">프로필 초기화 중...</div>;
  }

  return (
    <ProfileAuthContext.Provider value={value}>
      {children}
    </ProfileAuthContext.Provider>
  );
};
