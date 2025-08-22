// 최적화된 이미지 선택과 폴백 처리를 위한 React Hook
import { useState, useEffect, useCallback } from 'react';
import { EstimatedImage } from '../types/blazePose';
import { blazePoseService } from '../services/blazePoseService';

export type OptimizedImageState = {
  currentImage: EstimatedImage | null;
  isLoading: boolean;
  error: string | null;
  hasMultipleFormats: boolean;
  retryCount: number;
};

export type OptimizedImageActions = {
  retry: () => void;
  selectSpecificImage: (image: EstimatedImage) => void;
  reset: () => void;
};

/**
 * 최적화된 이미지 선택과 폴백 처리를 위한 Hook
 */
export function useOptimizedImage(
  images: EstimatedImage[],
  options: {
    enablePreloading?: boolean;
    maxRetries?: number;
    onImageLoad?: (image: EstimatedImage) => void;
    onImageError?: (error: string, image: EstimatedImage) => void;
  } = {}
): [OptimizedImageState, OptimizedImageActions] {
  
  const {
    enablePreloading = true,
    maxRetries = 2,
    onImageLoad,
    onImageError
  } = options;

  const [state, setState] = useState<OptimizedImageState>({
    currentImage: null,
    isLoading: true,
    error: null,
    hasMultipleFormats: false,
    retryCount: 0
  });

  // 최적 이미지 선택
  const selectOptimalImage = useCallback(() => {
    if (!images || images.length === 0) {
      setState(prev => ({
        ...prev,
        currentImage: null,
        isLoading: false,
        error: 'No images available',
        hasMultipleFormats: false
      }));
      return;
    }

    const optimalImage = blazePoseService.getOptimalImage(images);
    
    setState(prev => ({
      ...prev,
      currentImage: optimalImage,
      isLoading: false,
      error: optimalImage ? null : 'No suitable image found',
      hasMultipleFormats: images.length > 1
    }));

    if (optimalImage && onImageLoad) {
      onImageLoad(optimalImage);
    }
  }, [images, onImageLoad]);

  // 이미지 로딩 실패시 폴백 처리
  const handleImageError = useCallback((failedImage: EstimatedImage) => {
    if (state.retryCount >= maxRetries) {
      setState(prev => ({
        ...prev,
        error: `Failed to load image after ${maxRetries} retries`
      }));
      
      if (onImageError) {
        onImageError(`Max retries exceeded`, failedImage);
      }
      return;
    }

    const fallbackImage = blazePoseService.getFallbackImageForError(images, failedImage);
    
    if (fallbackImage) {
      setState(prev => ({
        ...prev,
        currentImage: fallbackImage,
        retryCount: prev.retryCount + 1,
        error: null
      }));
      
      if (onImageLoad) {
        onImageLoad(fallbackImage);
      }
    } else {
      setState(prev => ({
        ...prev,
        error: 'No fallback image available',
        retryCount: prev.retryCount + 1
      }));
      
      if (onImageError) {
        onImageError('No fallback available', failedImage);
      }
    }
  }, [images, state.retryCount, maxRetries, onImageLoad, onImageError]);

  // 재시도 함수
  const retry = useCallback(() => {
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      retryCount: 0
    }));
    selectOptimalImage();
  }, [selectOptimalImage]);

  // 특정 이미지 선택 함수
  const selectSpecificImage = useCallback((image: EstimatedImage) => {
    setState(prev => ({
      ...prev,
      currentImage: image,
      isLoading: false,
      error: null,
      retryCount: 0
    }));
    
    if (onImageLoad) {
      onImageLoad(image);
    }
  }, [onImageLoad]);

  // 초기화 함수
  const reset = useCallback(() => {
    setState({
      currentImage: null,
      isLoading: true,
      error: null,
      hasMultipleFormats: false,
      retryCount: 0
    });
    selectOptimalImage();
  }, [selectOptimalImage]);

  // 이미지 프리로딩 (옵션)
  useEffect(() => {
    if (!enablePreloading || !images || images.length === 0) return;

    const preloadImages = async () => {
      // 상위 2개 이미지를 프리로드
      const priorityImages = images
        .filter(img => img.url)
        .slice(0, 2);

      const preloadPromises = priorityImages.map(image => {
        if (!image.url) return Promise.resolve();
        
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve(); // 에러도 완료로 처리
          img.src = image.url!;
        });
      });

      try {
        await Promise.all(preloadPromises);
      } catch (error) {
        console.warn('Image preloading failed:', error);
      }
    };

    preloadImages();
  }, [images, enablePreloading]);

  // 초기 이미지 선택
  useEffect(() => {
    selectOptimalImage();
  }, [selectOptimalImage]);

  return [
    state,
    {
      retry,
      selectSpecificImage,
      reset,
      // 내부적으로 사용할 이미지 에러 핸들러 노출
      handleImageError: handleImageError
    } as OptimizedImageActions & { handleImageError: (failedImage: EstimatedImage) => void }
  ];
}

/**
 * 이미지 URL 만료 체크 Hook
 */
export function useImageExpiration(image: EstimatedImage | null) {
  const [isExpired, setIsExpired] = useState(false);
  const [expiresIn, setExpiresIn] = useState<number | null>(null);

  useEffect(() => {
    if (!image?.expiresAt) {
      setIsExpired(false);
      setExpiresIn(null);
      return;
    }

    const checkExpiration = () => {
      const expiryTime = new Date(image.expiresAt!).getTime();
      const currentTime = Date.now();
      const timeUntilExpiry = expiryTime - currentTime;

      setIsExpired(timeUntilExpiry <= 0);
      setExpiresIn(timeUntilExpiry > 0 ? Math.floor(timeUntilExpiry / 1000) : 0);
    };

    checkExpiration();
    const interval = setInterval(checkExpiration, 30000); // 30초마다 체크

    return () => clearInterval(interval);
  }, [image?.expiresAt]);

  return { isExpired, expiresIn };
}