import { NavigateFunction } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { clearAllSecureData, secureGetItem, secureSetItem, secureRemoveItem } from './secureStorage';
import { axiosHttpClient } from '../services/common/axiosHttpClient';

// JWT 토큰에서 payload 추출
export const extractTokenPayload = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload
  } catch {
    return null
  }
}

// 토큰에서 accountId 추출
export const extractAccountIdFromToken = (token: string): string | null => {
  const payload = extractTokenPayload(token)
  if (!payload) return null
  
  return payload.sub || payload.id || payload.accountId || null
}

// 토큰 유효성 검사
export const isTokenValid = (token: string): boolean => {
  const payload = extractTokenPayload(token)
  if (!payload) return false
  
  // 토큰 만료 시간 확인
  const currentTime = Date.now() / 1000
  if (payload.exp && payload.exp < currentTime) {
    return false
  }
  
  return true
}

// 로그아웃 처리
export const handleLogout = (navigate: NavigateFunction) => {
  // 모든 보안 데이터 정리
  clearAllSecureData();
  
  // 세션 스토리지 클리어
  sessionStorage.clear();
  
  // React Query 캐시 클리어
  // (이 부분은 useQueryClient를 사용하는 컴포넌트에서 처리)
  
  // 로그인 페이지로 리다이렉트
  navigate(ROUTES.LOGIN);
};

// 토큰 갱신
export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = secureGetItem('refreshToken');
    
    if (!refreshToken) {
      return null;
    }

    const response = await axiosHttpClient.post<{
      success: boolean;
      data: {
        accessToken: string;
        refreshToken: string;
      };
    }>('/account/refresh', {
      refreshToken
    });

    if (response.success) {
      const { accessToken, refreshToken: newRefreshToken } = response.data;
      
      // 새로운 토큰들을 저장
      secureSetItem('token', accessToken, 1); // 1시간
      secureSetItem('refreshToken', newRefreshToken, 1); // 1시간
      
      return accessToken;
    }
    
    return null;
  } catch (error) {
    console.error('Token refresh failed:', error);
    // 갱신 실패 시 토큰들 삭제
    secureRemoveItem('token');
    secureRemoveItem('refreshToken');
    return null;
  }
};

// 인증 상태 확인 및 처리
export const validateAuthState = (token: string | null, navigate: NavigateFunction): boolean => {
  if (!token) {
    handleLogout(navigate)
    return false
  }
  
  if (!isTokenValid(token)) {
    handleLogout(navigate)
    return false
  }
  
  return true
}
