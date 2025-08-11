import { ROUTES } from '../constants/routes';
import { clearAllSecureData } from './secureStorage';

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
export const handleLogout = (navigate: any) => {
  // 모든 보안 데이터 정리
  clearAllSecureData();
  
  // 세션 스토리지 클리어
  sessionStorage.clear();
  
  // React Query 캐시 클리어
  // (이 부분은 useQueryClient를 사용하는 컴포넌트에서 처리)
  
  // 로그인 페이지로 리다이렉트
  navigate(ROUTES.LOGIN);
};

// 인증 상태 확인 및 처리
export const validateAuthState = (token: string | null, navigate: any): boolean => {
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
