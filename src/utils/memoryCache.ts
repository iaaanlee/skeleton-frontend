// 메모리 기반 캐시 시스템 (Redis 대안)
// LRU + TTL 기반 캐싱으로 이미지 URL과 분석 결과 캐싱

export type CacheEntry<T> = {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
};

export type CacheStats = {
  size: number;
  maxSize: number;
  hitRate: number;
  totalHits: number;
  totalMisses: number;
  oldestEntry: number | null;
  newestEntry: number | null;
};

/**
 * LRU + TTL 메모리 캐시 구현
 */
export class MemoryCache<T> {
  protected cache = new Map<string, CacheEntry<T>>();
  private accessOrder: string[] = [];
  private hits = 0;
  private misses = 0;

  constructor(
    private maxSize: number = 100,
    private defaultTTL: number = 300000 // 5분 기본 TTL
  ) {}

  /**
   * 캐시에 데이터 저장
   */
  set(key: string, data: T, ttlMs?: number): void {
    const now = Date.now();
    const ttl = ttlMs ?? this.defaultTTL;
    
    // 기존 엔트리 제거
    if (this.cache.has(key)) {
      this.removeFromAccessOrder(key);
    }

    // 캐시 크기 제한 확인
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      this.evictLRU();
    }

    // 새 엔트리 추가
    this.cache.set(key, {
      data,
      timestamp: now,
      ttl,
      accessCount: 1,
      lastAccessed: now
    });

    // 액세스 순서에 추가
    this.accessOrder.push(key);
  }

  /**
   * 캐시에서 데이터 조회
   */
  get(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.misses++;
      return null;
    }

    const now = Date.now();
    
    // TTL 체크
    if (now - entry.timestamp > entry.ttl) {
      this.delete(key);
      this.misses++;
      return null;
    }

    // 액세스 정보 업데이트
    entry.accessCount++;
    entry.lastAccessed = now;
    
    // LRU 순서 업데이트
    this.removeFromAccessOrder(key);
    this.accessOrder.push(key);
    
    this.hits++;
    return entry.data;
  }

  /**
   * 특정 키 삭제
   */
  delete(key: string): boolean {
    if (!this.cache.has(key)) {
      return false;
    }

    this.cache.delete(key);
    this.removeFromAccessOrder(key);
    return true;
  }

  /**
   * 캐시 전체 삭제
   */
  clear(): void {
    this.cache.clear();
    this.accessOrder = [];
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * 만료된 엔트리들 정리
   */
  cleanup(): number {
    const now = Date.now();
    let cleanupCount = 0;
    
    const keysToDelete: string[] = [];
    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => {
      this.delete(key);
      cleanupCount++;
    });
    
    return cleanupCount;
  }

  /**
   * 캐시 통계 조회
   */
  getStats(): CacheStats {
    const entries = Array.from(this.cache.values());
    const timestamps = entries.map(e => e.timestamp);
    
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: this.hits + this.misses > 0 ? this.hits / (this.hits + this.misses) : 0,
      totalHits: this.hits,
      totalMisses: this.misses,
      oldestEntry: timestamps.length > 0 ? Math.min(...timestamps) : null,
      newestEntry: timestamps.length > 0 ? Math.max(...timestamps) : null
    };
  }

  /**
   * 특정 패턴 키들 삭제
   */
  deleteByPattern(pattern: RegExp): number {
    let deleteCount = 0;
    
    const keysToDelete: string[] = [];
    this.cache.forEach((_, key) => {
      if (pattern.test(key)) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => {
      this.delete(key);
      deleteCount++;
    });
    
    return deleteCount;
  }

  /**
   * LRU 방식으로 오래된 엔트리 제거
   */
  private evictLRU(): void {
    if (this.accessOrder.length === 0) return;
    
    const oldestKey = this.accessOrder[0];
    this.delete(oldestKey);
  }

  /**
   * 액세스 순서에서 키 제거
   */
  private removeFromAccessOrder(key: string): void {
    const index = this.accessOrder.indexOf(key);
    if (index !== -1) {
      this.accessOrder.splice(index, 1);
    }
  }
}

/**
 * 이미지 URL 전용 캐시
 */
export class ImageUrlCache extends MemoryCache<string> {
  constructor() {
    super(500, 1800000); // 500개 엔트리, 30분 TTL
  }

  /**
   * Pre-signed URL 캐시 키 생성
   */
  static createKey(objectKey: string, device?: string, format?: string): string {
    return `img:${objectKey}${device ? `:${device}` : ''}${format ? `:${format}` : ''}`;
  }

  /**
   * 만료 임박한 URL들 조회 (재생성 트리거용)
   */
  getExpiringUrls(thresholdMs: number = 300000): Array<{ key: string; url: string; expiresIn: number }> {
    const now = Date.now();
    const expiring: Array<{ key: string; url: string; expiresIn: number }> = [];
    
    this.cache.forEach((entry, key) => {
      const expiresIn = (entry.timestamp + entry.ttl) - now;
      if (expiresIn <= thresholdMs && expiresIn > 0) {
        expiring.push({
          key,
          url: entry.data,
          expiresIn
        });
      }
    });
    
    return expiring;
  }
}

/**
 * BlazePose 분석 결과 캐시
 */
export class AnalysisResultCache extends MemoryCache<any> {
  constructor() {
    super(100, 3600000); // 100개 엔트리, 1시간 TTL
  }

  /**
   * 분석 결과 캐시 키 생성
   */
  static createKey(analysisId: string, type: 'status' | 'result'): string {
    return `analysis:${type}:${analysisId}`;
  }

  /**
   * 진행 중인 분석들 조회
   */
  getActiveAnalyses(): string[] {
    const activeIds: string[] = [];
    
    this.cache.forEach((entry, key) => {
      if (key.startsWith('analysis:status:')) {
        const data = entry.data;
        if (data && (data.status === 'pose_analyzing' || data.status === 'pending')) {
          const analysisId = key.replace('analysis:status:', '');
          activeIds.push(analysisId);
        }
      }
    });
    
    return activeIds;
  }
}

// 글로벌 캐시 인스턴스
export const imageUrlCache = new ImageUrlCache();
export const analysisResultCache = new AnalysisResultCache();

/**
 * 캐시 관리 유틸리티
 */
export class CacheManager {
  private cleanupInterval: NodeJS.Timeout | null = null;

  /**
   * 주기적 캐시 정리 시작
   */
  startCleanup(intervalMs: number = 300000): void { // 5분마다 정리
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }

    this.cleanupInterval = setInterval(() => {
      const imageCleanup = imageUrlCache.cleanup();
      const analysisCleanup = analysisResultCache.cleanup();
      
      if (imageCleanup > 0 || analysisCleanup > 0) {
        console.log('[CacheManager] Cleanup completed:', {
          imagesRemoved: imageCleanup,
          analysisRemoved: analysisCleanup,
          timestamp: new Date().toISOString()
        });
      }
    }, intervalMs);
  }

  /**
   * 캐시 정리 중지
   */
  stopCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  /**
   * 모든 캐시 통계 조회
   */
  getAllStats() {
    return {
      imageCache: imageUrlCache.getStats(),
      analysisCache: analysisResultCache.getStats()
    };
  }

  /**
   * 캐시 상태 로깅
   */
  logCacheStats(): void {
    const stats = this.getAllStats();
    console.log('[CacheManager] Cache Statistics:', {
      imageCache: {
        size: `${stats.imageCache.size}/${stats.imageCache.maxSize}`,
        hitRate: `${(stats.imageCache.hitRate * 100).toFixed(1)}%`,
        hits: stats.imageCache.totalHits,
        misses: stats.imageCache.totalMisses
      },
      analysisCache: {
        size: `${stats.analysisCache.size}/${stats.analysisCache.maxSize}`,
        hitRate: `${(stats.analysisCache.hitRate * 100).toFixed(1)}%`,
        hits: stats.analysisCache.totalHits,
        misses: stats.analysisCache.totalMisses
      }
    });
  }

  /**
   * 메모리 사용량 추정
   */
  getEstimatedMemoryUsage(): { images: number; analysis: number; total: number } {
    // 대략적인 메모리 사용량 추정 (바이트)
    const avgImageUrlSize = 200; // 평균 URL 길이
    const avgAnalysisSize = 5000; // 평균 분석 결과 크기
    
    const imageStats = imageUrlCache.getStats();
    const analysisStats = analysisResultCache.getStats();
    
    const images = imageStats.size * avgImageUrlSize;
    const analysis = analysisStats.size * avgAnalysisSize;
    
    return {
      images,
      analysis,
      total: images + analysis
    };
  }
}

// 글로벌 캐시 매니저
export const cacheManager = new CacheManager();