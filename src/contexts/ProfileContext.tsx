import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAccountAuth } from './AccountAuthContext';
import { profileService } from '../services/profileService';
import { QUERY_KEYS } from '../services/common/queryKey';

// 현재 선택된 프로필의 기본 정보만 포함하는 타입
export type CurrentProfileInfo = {
  profileId: string;
  profileName: string;
  accountId: string;
} | null;

type ProfileContextType = {
  currentProfile: CurrentProfileInfo;
  isLoading: boolean;
  error: Error | string | null;
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
  const queryClient = useQueryClient();
  const [shouldFetchProfile, setShouldFetchProfile] = useState(false);

  // 로그인/회원가입/프로필선택 페이지에서는 프로필 요청하지 않음
  const [isAuthPage, setIsAuthPage] = useState(() => {
    const pathname = window.location.pathname;
    return pathname === '/login' ||
           pathname === '/create-account' ||
           pathname === '/select-profile';
  });

  // URL 변경 감지하여 isAuthPage 업데이트
  useEffect(() => {
    const updateAuthPageStatus = () => {
      const pathname = window.location.pathname;
      const newIsAuthPage = pathname === '/login' ||
                           pathname === '/create-account' ||
                           pathname === '/select-profile';
      setIsAuthPage(newIsAuthPage);
    };

    // popstate 이벤트 리스너 (뒤로가기/앞으로가기)
    window.addEventListener('popstate', updateAuthPageStatus);

    // pushState, replaceState 감지 (React Router 네비게이션)
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function(state, title, url) {
      originalPushState.call(window.history, state, title, url);
      updateAuthPageStatus();
    };

    window.history.replaceState = function(state, title, url) {
      originalReplaceState.call(window.history, state, title, url);
      updateAuthPageStatus();
    };

    return () => {
      window.removeEventListener('popstate', updateAuthPageStatus);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, []);

  // 인증 상태가 변경될 때 처리
  useEffect(() => {
    if (!isAuthenticated) {
      // 로그아웃 시 프로필 관련 쿼리 제거
      queryClient.removeQueries({ queryKey: QUERY_KEYS.profile.current() });
      setShouldFetchProfile(false);
    }
  }, [isAuthenticated, queryClient]);

  // 인증 상태와 페이지 상태에 따라 프로필 요청 여부 결정
  useEffect(() => {
    // 인증되지 않았거나 인증 페이지인 경우 요청하지 않음
    if (!isAuthenticated || isAuthPage) {
      setShouldFetchProfile(false);
    } else {
      // 인증되고 + 비인증페이지가 아닌 경우에만 프로필 요청
      setShouldFetchProfile(true);
    }
  }, [isAuthenticated, isAuthPage]);

  // 현재 프로필 조회 (백엔드 Redis 세션에서)
  const {
    data: currentProfile,
    isLoading: isQueryLoading,
    error,
    refetch: refetchProfile
  } = useQuery({
    queryKey: QUERY_KEYS.profile.current(),
    queryFn: async () => {
      try {
        const response = await profileService.getCurrentProfile();
        return response.data;
      } catch (error: unknown) {
        // 프로필이 선택되지 않은 경우는 정상적인 상황
        // 404 에러는 예상된 에러이므로 콘솔에 출력하지 않음
        const isAxiosError = error && typeof error === 'object' && 'response' in error;
        const status = isAxiosError ? (error as { response?: { status?: number } }).response?.status : undefined;
        if (status !== 404) {
          console.error('Failed to fetch current profile:', error);
        }
        return null;
      }
    },
    enabled: shouldFetchProfile,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5분
    refetchOnWindowFocus: false, // 창 포커스 시 자동 재요청 방지
  });

  // 전체 로딩 상태
  const isLoading = isQueryLoading;

  // 프로필 관련 모든 캐시 정리 함수
  const clearAllProfileCaches = () => {
    // 프로필 관련 모든 쿼리 제거
    queryClient.removeQueries({ queryKey: QUERY_KEYS.currentProfile });
    queryClient.removeQueries({ queryKey: QUERY_KEYS.currentProfileDetails });
    queryClient.removeQueries({ queryKey: QUERY_KEYS.profile.all() });
    queryClient.removeQueries({ queryKey: QUERY_KEYS.profiles });
    
    // 프로필 관련 데이터가 포함될 수 있는 다른 쿼리들도 제거
    queryClient.removeQueries({ queryKey: QUERY_KEYS.prescription });
    queryClient.removeQueries({ queryKey: QUERY_KEYS.prescriptions });
    queryClient.removeQueries({ queryKey: QUERY_KEYS.exercise });
    queryClient.removeQueries({ queryKey: QUERY_KEYS.analysis });
    queryClient.removeQueries({ queryKey: QUERY_KEYS.media });
  };

  // 프로필 선택
  const selectProfile = async (profileId: string) => {
    // 먼저 기존 캐시 모두 정리
    clearAllProfileCaches();

    // 새 프로필 선택
    await profileService.selectProfile(profileId);

    // 새로운 프로필 정보 가져오기
    await refetchProfile();
  };

  // 프로필 선택 해제
  const clearProfile = async () => {
    await profileService.clearProfile();
    clearAllProfileCaches();
    setShouldFetchProfile(false);
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