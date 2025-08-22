// 캐시 초기화 및 관리 유틸리티
import { cacheManager } from './memoryCache';
import { useState, useEffect } from 'react';

/**
 * 앱 시작시 캐시 시스템 초기화
 */
export function initializeCache(): void {
  console.log('[CacheInit] Initializing memory cache system...');
  
  // 주기적 캐시 정리 시작 (5분마다)
  cacheManager.startCleanup(300000);
  
  // 개발환경에서만 캐시 통계 로깅 (10분마다)
  if (process.env.NODE_ENV === 'development') {
    setInterval(() => {
      cacheManager.logCacheStats();
    }, 600000);
  }
  
  // 메모리 사용량 모니터링 (30분마다)
  setInterval(() => {
    const memoryUsage = cacheManager.getEstimatedMemoryUsage();
    
    // 10MB 초과시 경고
    if (memoryUsage.total > 10 * 1024 * 1024) {
      console.warn('[CacheInit] High memory usage detected:', {
        totalMB: (memoryUsage.total / (1024 * 1024)).toFixed(2),
        imagesMB: (memoryUsage.images / (1024 * 1024)).toFixed(2),
        analysisMB: (memoryUsage.analysis / (1024 * 1024)).toFixed(2)
      });
    }
  }, 1800000); // 30분

  console.log('[CacheInit] Cache system initialized successfully');
}

/**
 * 앱 종료시 캐시 정리
 */
export function cleanupCache(): void {
  console.log('[CacheInit] Cleaning up cache system...');
  cacheManager.stopCleanup();
  
  // 최종 통계 로깅
  if (process.env.NODE_ENV === 'development') {
    cacheManager.logCacheStats();
  }
}

/**
 * 캐시 시스템 상태 체크
 */
export function checkCacheHealth(): {
  isHealthy: boolean;
  issues: string[];
  stats: ReturnType<typeof cacheManager.getAllStats>;
} {
  const stats = cacheManager.getAllStats();
  const memoryUsage = cacheManager.getEstimatedMemoryUsage();
  const issues: string[] = [];
  
  // 캐시 히트율 체크 (50% 이하면 문제)
  if (stats.imageCache.hitRate < 0.5 && stats.imageCache.totalHits + stats.imageCache.totalMisses > 50) {
    issues.push(`Low image cache hit rate: ${(stats.imageCache.hitRate * 100).toFixed(1)}%`);
  }
  
  if (stats.analysisCache.hitRate < 0.3 && stats.analysisCache.totalHits + stats.analysisCache.totalMisses > 20) {
    issues.push(`Low analysis cache hit rate: ${(stats.analysisCache.hitRate * 100).toFixed(1)}%`);
  }
  
  // 메모리 사용량 체크 (20MB 초과시 문제)
  if (memoryUsage.total > 20 * 1024 * 1024) {
    issues.push(`High memory usage: ${(memoryUsage.total / (1024 * 1024)).toFixed(2)}MB`);
  }
  
  // 캐시 사이즈 체크
  if (stats.imageCache.size >= stats.imageCache.maxSize * 0.9) {
    issues.push(`Image cache nearly full: ${stats.imageCache.size}/${stats.imageCache.maxSize}`);
  }
  
  if (stats.analysisCache.size >= stats.analysisCache.maxSize * 0.9) {
    issues.push(`Analysis cache nearly full: ${stats.analysisCache.size}/${stats.analysisCache.maxSize}`);
  }
  
  return {
    isHealthy: issues.length === 0,
    issues,
    stats
  };
}

// React 컴포넌트에서 사용할 캐시 상태 Hook
export function useCacheHealth() {
  const [health, setHealth] = useState(() => checkCacheHealth());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setHealth(checkCacheHealth());
    }, 60000); // 1분마다 체크
    
    return () => clearInterval(interval);
  }, []);
  
  return health;
}

// 캐시 수동 정리 함수
export function manualCacheCleanup(): {
  imageCleanup: number;
  analysisCleanup: number;
  memoryFreed: number;
} {
  const beforeUsage = cacheManager.getEstimatedMemoryUsage();
  
  const { imageUrlCache, analysisResultCache } = require('./memoryCache');
  const imageCleanup = imageUrlCache.cleanup();
  const analysisCleanup = analysisResultCache.cleanup();
  
  const afterUsage = cacheManager.getEstimatedMemoryUsage();
  const memoryFreed = beforeUsage.total - afterUsage.total;
  
  console.log('[CacheInit] Manual cleanup completed:', {
    imageCleanup,
    analysisCleanup,
    memoryFreedKB: (memoryFreed / 1024).toFixed(2)
  });
  
  return {
    imageCleanup,
    analysisCleanup,
    memoryFreed
  };
}