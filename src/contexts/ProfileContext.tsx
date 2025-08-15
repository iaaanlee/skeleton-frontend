import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAccountAuth } from './AccountAuthContext';
import { profileService } from '../services/profileService';
import { QUERY_KEYS } from '../services/common/queryKey';

// 현재 선택된 프로필의 기본 정보만 포함하는 타입
export type CurrentProfileInfo = {
  profileId: string;
  profileName: string;
  accountId: string;
} | null;

interface ProfileContextType {
  currentProfile: CurrentProfileInfo;
  isLoading: boolean;
  error: any;
  selectProfile: (profileId: string) => Promise<void>;
  clearProfile: () => Promise<void>;
  refetchProfile: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

type ProfileProviderProps = {
  children: ReactNode;
};

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const { isAuthenticated } = useAccountAuth();

  // 현재 프로필 조회 (백엔드 Redis 세션에서)
  const {
    data: currentProfile,
    isLoading,
    error,
    refetch: refetchProfile
  } = useQuery({
    queryKey: QUERY_KEYS.profile.current(),
    queryFn: async () => {
      try {
        const response = await profileService.getCurrentProfile();
        return response.data;
      } catch (error) {
        // 프로필이 선택되지 않은 경우는 정상적인 상황
        return null;
      }
    },
    enabled: isAuthenticated,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5분
  });

  // 프로필 선택
  const selectProfile = async (profileId: string) => {
    await profileService.selectProfile(profileId);
    refetchProfile();
  };

  // 프로필 선택 해제
  const clearProfile = async () => {
    await profileService.clearProfile();
    refetchProfile();
  };

  const value = {
    currentProfile: currentProfile || null,
    isLoading,
    error,
    selectProfile,
    clearProfile,
    refetchProfile,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};