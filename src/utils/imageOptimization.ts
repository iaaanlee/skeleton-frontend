// 이미지 최적화 선택 유틸리티
// 브라우저 지원 및 디바이스 특성에 따라 최적의 이미지를 선택

export type DeviceType = 'mobile' | 'tablet' | 'desktop';
export type ImageFormat = 'webp' | 'jpeg' | 'png';

/**
 * 사용자 에이전트를 기반으로 브라우저의 WebP 지원 여부 확인
 */
export function supportsWebP(): boolean {
  // Chrome 32+, Firefox 65+, Safari 14+, Edge 18+ 지원
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (userAgent.includes('chrome/')) {
    const version = getChromeVersion(userAgent);
    return version >= 32;
  }
  
  if (userAgent.includes('firefox/')) {
    const version = getFirefoxVersion(userAgent);
    return version >= 65;
  }
  
  if (userAgent.includes('safari/') && userAgent.includes('version/')) {
    const version = getSafariVersion(userAgent);
    return version >= 14;
  }
  
  if (userAgent.includes('edge/')) {
    const version = getEdgeVersion(userAgent);
    return version >= 18;
  }
  
  // 기타 브라우저는 보수적으로 false
  return false;
}

/**
 * 디바이스 타입 감지 (뷰포트 기반)
 */
export function detectDeviceType(): DeviceType {
  const width = window.innerWidth;
  
  if (width <= 768) return 'mobile';
  if (width <= 1024) return 'tablet';
  return 'desktop';
}

/**
 * 네트워크 연결 품질 감지
 */
export function getConnectionQuality(): 'slow' | 'normal' | 'fast' {
  // @ts-ignore - 실험적 API
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
  if (!connection) return 'normal';
  
  // 2G/slow-2g는 느림, 3G는 보통, 4G+는 빠름
  if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
    return 'slow';
  }
  
  if (connection.effectiveType === '4g' || connection.effectiveType === '5g') {
    return 'fast';
  }
  
  return 'normal';
}

/**
 * EstimatedImage 배열에서 최적의 이미지 선택
 */
export function selectOptimalImage(
  images: Array<{ key: string; url?: string; expiresAt?: string }>,
  options: {
    preferredFormats?: ImageFormat[];
    preferredDevice?: DeviceType;
    considerConnection?: boolean;
  } = {}
) {
  if (!images || images.length === 0) return null;
  
  const {
    preferredFormats = supportsWebP() ? ['webp', 'jpeg'] : ['jpeg'],
    preferredDevice = detectDeviceType(),
    considerConnection = true
  } = options;
  
  const connectionQuality = considerConnection ? getConnectionQuality() : 'normal';
  
  // 연결 품질에 따른 디바이스 조정
  let targetDevice = preferredDevice;
  if (connectionQuality === 'slow' && preferredDevice === 'desktop') {
    targetDevice = 'mobile'; // 느린 연결에서는 작은 이미지 선호
  }
  
  // 우선순위 점수 계산
  const scoredImages = images.map(image => {
    const score = calculateImageScore(image.key, {
      preferredFormats,
      targetDevice,
      connectionQuality
    });
    
    return {
      ...image,
      score,
      format: extractFormatFromKey(image.key),
      device: extractDeviceFromKey(image.key)
    };
  }).filter(img => img.url); // URL이 있는 이미지만
  
  // 점수 기준으로 정렬하고 최고 점수 반환
  scoredImages.sort((a, b) => b.score - a.score);
  
  return scoredImages.length > 0 ? scoredImages[0] : images.find(img => img.url) || null;
}

/**
 * 이미지 키에서 포맷 추출
 */
function extractFormatFromKey(key: string): ImageFormat {
  if (key.includes('.webp')) return 'webp';
  if (key.includes('.jpg') || key.includes('.jpeg')) return 'jpeg';
  if (key.includes('.png')) return 'png';
  return 'jpeg'; // 기본값
}

/**
 * 이미지 키에서 디바이스 타입 추출
 */
function extractDeviceFromKey(key: string): DeviceType {
  if (key.includes('mobile.')) return 'mobile';
  if (key.includes('tablet.')) return 'tablet';
  if (key.includes('desktop.')) return 'desktop';
  return 'desktop'; // 기본값
}

/**
 * 이미지 점수 계산 (높을수록 좋음)
 */
function calculateImageScore(
  key: string,
  criteria: {
    preferredFormats: ImageFormat[];
    targetDevice: DeviceType;
    connectionQuality: 'slow' | 'normal' | 'fast';
  }
): number {
  let score = 0;
  
  const format = extractFormatFromKey(key);
  const device = extractDeviceFromKey(key);
  
  // 포맷 점수 (선호도 순서)
  const formatIndex = criteria.preferredFormats.indexOf(format);
  if (formatIndex !== -1) {
    score += (criteria.preferredFormats.length - formatIndex) * 10;
  }
  
  // 디바이스 매치 점수
  if (device === criteria.targetDevice) {
    score += 20;
  } else if (
    (criteria.targetDevice === 'tablet' && device === 'mobile') ||
    (criteria.targetDevice === 'mobile' && device === 'tablet')
  ) {
    score += 10; // 유사한 크기는 중간 점수
  }
  
  // 연결 품질에 따른 조정
  if (criteria.connectionQuality === 'slow') {
    // 느린 연결에서는 작은 이미지 선호
    if (device === 'mobile') score += 5;
    if (format === 'webp') score += 5; // WebP는 압축률이 좋음
  } else if (criteria.connectionQuality === 'fast') {
    // 빠른 연결에서는 품질 우선
    if (device === 'desktop') score += 5;
  }
  
  return score;
}

/**
 * 브라우저 버전 추출 헬퍼 함수들
 */
function getChromeVersion(userAgent: string): number {
  const match = userAgent.match(/chrome\/(\d+)/);
  return match ? parseInt(match[1]) : 0;
}

function getFirefoxVersion(userAgent: string): number {
  const match = userAgent.match(/firefox\/(\d+)/);
  return match ? parseInt(match[1]) : 0;
}

function getSafariVersion(userAgent: string): number {
  const match = userAgent.match(/version\/(\d+)/);
  return match ? parseInt(match[1]) : 0;
}

function getEdgeVersion(userAgent: string): number {
  const match = userAgent.match(/edge\/(\d+)/);
  return match ? parseInt(match[1]) : 0;
}

/**
 * 이미지 로딩 실패시 폴백 이미지 선택
 */
export function getFallbackImage(
  images: Array<{ key: string; url?: string; expiresAt?: string }>,
  failedImage: { key: string; url?: string; expiresAt?: string }
) {
  // 실패한 이미지를 제외하고 다음 최적 이미지 선택
  const remainingImages = images.filter(img => img.key !== failedImage.key);
  
  // JPEG를 우선으로 하는 보수적 선택
  return selectOptimalImage(remainingImages, {
    preferredFormats: ['jpeg', 'png'], // WebP 제외
    considerConnection: false // 폴백시에는 연결 품질 고려하지 않음
  });
}

/**
 * 프리로딩을 위한 우선순위 이미지 목록 생성
 */
export function getPriorityImages(
  images: Array<{ key: string; url?: string; expiresAt?: string }>,
  count: number = 2
) {
  const deviceType = detectDeviceType();
  const connection = getConnectionQuality();
  
  // 현재 환경에 맞는 상위 N개 이미지 반환
  const scoredImages = images
    .map(image => ({
      ...image,
      score: calculateImageScore(image.key, {
        preferredFormats: supportsWebP() ? ['webp', 'jpeg'] : ['jpeg'],
        targetDevice: deviceType,
        connectionQuality: connection
      })
    }))
    .filter(img => img.url)
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
  
  return scoredImages;
}