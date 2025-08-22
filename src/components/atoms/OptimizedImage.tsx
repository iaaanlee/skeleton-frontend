// 최적화된 이미지 표시 컴포넌트
import React, { useState, useCallback } from 'react';
import { EstimatedImage } from '../../types/blazePose';
import { useOptimizedImage, useImageExpiration } from '../../hooks/useOptimizedImage';

export type OptimizedImageProps = {
  images: EstimatedImage[];
  alt: string;
  className?: string;
  fallbackSrc?: string;
  onLoad?: () => void;
  onError?: (error: string) => void;
  enablePreloading?: boolean;
  maxRetries?: number;
  showLoadingState?: boolean;
  showErrorState?: boolean;
} & Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'onLoad' | 'onError'>;

/**
 * 브라우저 지원과 디바이스 특성을 고려한 최적화된 이미지 컴포넌트
 */
export function OptimizedImage({
  images,
  alt,
  className = '',
  fallbackSrc,
  onLoad,
  onError,
  enablePreloading = true,
  maxRetries = 2,
  showLoadingState = true,
  showErrorState = true,
  ...imgProps
}: OptimizedImageProps) {
  
  const [imgLoadState, setImgLoadState] = useState<'loading' | 'loaded' | 'error'>('loading');
  
  const [optimizedState, optimizedActions] = useOptimizedImage(images, {
    enablePreloading,
    maxRetries,
    onImageLoad: (image) => {
      console.log(`[OptimizedImage] Selected optimal image:`, {
        key: image.key,
        hasUrl: !!image.url,
        format: image.key.includes('.webp') ? 'webp' : image.key.includes('.jpg') ? 'jpeg' : 'unknown',
        device: image.key.includes('mobile') ? 'mobile' : 'desktop'
      });
      
      if (onLoad) onLoad();
    },
    onImageError: (error, image) => {
      console.warn(`[OptimizedImage] Image error:`, { error, imageKey: image.key });
      
      if (onError) onError(error);
    }
  });

  const { isExpired, expiresIn } = useImageExpiration(optimizedState.currentImage);

  // 이미지 로딩 성공 핸들러
  const handleImageLoad = useCallback(() => {
    setImgLoadState('loaded');
    if (onLoad) onLoad();
  }, [onLoad]);

  // 이미지 로딩 실패 핸들러
  const handleImageError = useCallback(() => {
    setImgLoadState('error');
    
    if (optimizedState.currentImage) {
      // 폴백 이미지 시도
      (optimizedActions as any).handleImageError(optimizedState.currentImage);
    } else if (onError) {
      onError('Image load failed');
    }
  }, [optimizedState.currentImage, optimizedActions, onError]);

  // URL 만료 체크
  if (isExpired && optimizedState.currentImage) {
    console.warn('[OptimizedImage] Image URL expired, retrying...', {
      imageKey: optimizedState.currentImage.key,
      expiresAt: optimizedState.currentImage.expiresAt
    });
    optimizedActions.retry();
  }

  // 로딩 상태 표시
  if (optimizedState.isLoading && showLoadingState) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`} {...imgProps}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // 에러 상태 표시
  if (optimizedState.error && !optimizedState.currentImage) {
    if (fallbackSrc) {
      return (
        <img
          src={fallbackSrc}
          alt={alt}
          className={className}
          onLoad={handleImageLoad}
          onError={() => setImgLoadState('error')}
          {...imgProps}
        />
      );
    }

    if (showErrorState) {
      return (
        <div className={`flex items-center justify-center bg-gray-100 text-gray-500 ${className}`} {...imgProps}>
          <div className="text-center">
            <div className="text-2xl mb-2">📷</div>
            <div className="text-sm">Image not available</div>
            {optimizedState.hasMultipleFormats && (
              <button
                onClick={optimizedActions.retry}
                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      );
    }
  }

  // 최적화된 이미지 표시
  if (optimizedState.currentImage?.url) {
    return (
      <div className="relative">
        <img
          src={optimizedState.currentImage.url}
          alt={alt}
          className={className}
          onLoad={handleImageLoad}
          onError={handleImageError}
          {...imgProps}
        />
        
        {/* 개발환경에서만 이미지 정보 표시 */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute top-0 right-0 bg-black bg-opacity-75 text-white text-xs p-1 rounded-bl">
            {optimizedState.currentImage.key.includes('.webp') ? 'WebP' : 'JPEG'}
            {optimizedState.currentImage.key.includes('mobile') ? ' • Mobile' : ' • Desktop'}
            {optimizedState.retryCount > 0 && ` • Retry:${optimizedState.retryCount}`}
            {expiresIn !== null && expiresIn < 300 && ` • Expires:${Math.floor(expiresIn/60)}m`}
          </div>
        )}
        
        {/* 로딩 오버레이 */}
        {imgLoadState === 'loading' && showLoadingState && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
    );
  }

  // 폴백 이미지
  if (fallbackSrc) {
    return (
      <img
        src={fallbackSrc}
        alt={alt}
        className={className}
        onLoad={handleImageLoad}
        onError={() => setImgLoadState('error')}
        {...imgProps}
      />
    );
  }

  // 최종 폴백 (빈 상태)
  return (
    <div className={`flex items-center justify-center bg-gray-100 ${className}`} {...imgProps}>
      <div className="text-gray-400 text-sm">No image</div>
    </div>
  );
}

/**
 * 간단한 이미지 선택기 컴포넌트 (개발/테스트용)
 */
export function ImageFormatSelector({
  images,
  onSelect,
  selectedImage
}: {
  images: EstimatedImage[];
  onSelect: (image: EstimatedImage) => void;
  selectedImage: EstimatedImage | null;
}) {
  if (images.length <= 1) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {images.map((image) => {
        const format = image.key.includes('.webp') ? 'WebP' : 'JPEG';
        const device = image.key.includes('mobile') ? 'Mobile' : 'Desktop';
        const isSelected = selectedImage?.key === image.key;
        
        return (
          <button
            key={image.key}
            onClick={() => onSelect(image)}
            className={`px-2 py-1 text-xs rounded border ${
              isSelected 
                ? 'bg-blue-500 text-white border-blue-500' 
                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
            }`}
            disabled={!image.url}
          >
            {format} • {device}
            {!image.url && ' (No URL)'}
          </button>
        );
      })}
    </div>
  );
}