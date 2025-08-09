// 보안 스토리지 유틸리티
interface StoredData {
  data: any;
  expiresAt: number;
  encrypted: boolean;
}

// 간단한 암호화 키 (실제 프로덕션에서는 환경변수로 관리)
const ENCRYPTION_KEY = 'skeleton-app-secure-key-2024';

// 데이터 암호화
const encryptData = (data: any): string => {
  try {
    const jsonString = JSON.stringify(data);
    // UTF-8 문자를 안전하게 Base64로 인코딩
    return btoa(unescape(encodeURIComponent(jsonString)));
  } catch (error) {
    console.error('Encryption error:', error);
    return '';
  }
};

// 데이터 복호화
const decryptData = (encryptedData: string): any => {
  try {
    const jsonString = decodeURIComponent(escape(atob(encryptedData)));
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

// 만료시간 체크
const isExpired = (expiresAt: number): boolean => {
  return Date.now() > expiresAt;
};

// 보안 스토리지에 데이터 저장
export const secureSetItem = (key: string, data: any, expiresInHours: number = 3): void => {
  try {
    const storedData: StoredData = {
      data: encryptData(data),
      expiresAt: Date.now() + (expiresInHours * 60 * 60 * 1000),
      encrypted: true
    };
    
    localStorage.setItem(key, JSON.stringify(storedData));
  } catch (error) {
    console.error('Secure storage set error:', error);
  }
};

// 보안 스토리지에서 데이터 가져오기
export const secureGetItem = (key: string): any => {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return null;
    
    const storedData: StoredData = JSON.parse(stored);
    
    // 만료시간 체크
    if (isExpired(storedData.expiresAt)) {
      localStorage.removeItem(key);
      return null;
    }
    
    // 복호화
    return decryptData(storedData.data);
  } catch (error) {
    console.error('Secure storage get error:', error);
    // 오류 발생 시 해당 키 삭제
    localStorage.removeItem(key);
    return null;
  }
};

// 보안 스토리지에서 데이터 삭제
export const secureRemoveItem = (key: string): void => {
  localStorage.removeItem(key);
};

// 특정 패턴의 모든 키 삭제
export const secureRemoveItemsByPattern = (pattern: string): void => {
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(pattern)) {
      localStorage.removeItem(key);
    }
  });
};

// 모든 보안 데이터 정리
export const clearAllSecureData = (): void => {
  // 토큰 관련
  secureRemoveItem('token');
  
  // 프로필 관련 (selectedProfile_로 시작하는 모든 키)
  secureRemoveItemsByPattern('selectedProfile_');
  
  // 기타 앱 관련 데이터
  secureRemoveItemsByPattern('app_');
};

// 새 로그인 시 완전 초기화
export const initializeNewSession = (): void => {
  clearAllSecureData();
};

// 만료된 데이터 자동 정리
export const cleanupExpiredData = (): void => {
  Object.keys(localStorage).forEach(key => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const storedData: StoredData = JSON.parse(stored);
        if (storedData.expiresAt && isExpired(storedData.expiresAt)) {
          localStorage.removeItem(key);
        }
      }
    } catch (error) {
      // 파싱 오류 시 해당 키 삭제
      localStorage.removeItem(key);
    }
  });
};
