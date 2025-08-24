import React, { useState } from 'react';

type HybrIKOverlayDisplayProps = {
  overlayImageBase64?: string;
  debugVisualization?: {
    skeleton_plot?: string;
    skeleton_render?: string;
    overlay_2d?: string;
  };
  fileName?: string;
  className?: string;
};

export const HybrIKOverlayDisplay: React.FC<HybrIKOverlayDisplayProps> = ({
  overlayImageBase64,
  debugVisualization,
  fileName,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'overlay' | 'skeleton' | 'render'>('overlay');
  const [imageError, setImageError] = useState<Record<string, boolean>>({});

  // 이미지 로드 에러 핸들러
  const handleImageError = (imageType: string) => {
    setImageError(prev => ({ ...prev, [imageType]: true }));
  };

  // 사용 가능한 이미지들 확인
  const hasOverlay = overlayImageBase64 && !imageError.overlay;
  const hasSkeletonPlot = debugVisualization?.skeleton_plot && !imageError.skeleton;
  const hasSkeletonRender = debugVisualization?.skeleton_render && !imageError.render;
  const has2DOverlay = debugVisualization?.overlay_2d && !imageError.overlay_2d;

  // 기본으로 보여줄 탭 결정
  const defaultTab = has2DOverlay ? 'overlay' : 
                    hasSkeletonPlot ? 'skeleton' : 
                    hasSkeletonRender ? 'render' : 'overlay';

  const currentTab = activeTab === 'overlay' && !has2DOverlay ? defaultTab : activeTab;

  if (!hasOverlay && !hasSkeletonPlot && !hasSkeletonRender && !has2DOverlay) {
    return (
      <div className={`bg-gray-50 rounded-lg p-6 text-center ${className}`}>
        <div className="text-gray-400 text-2xl mb-2">🖼️</div>
        <p className="text-gray-500 text-sm">오버레이 이미지가 없습니다</p>
        {fileName && (
          <p className="text-gray-400 text-xs mt-1">{fileName}</p>
        )}
      </div>
    );
  }

  const renderImage = (imageData: string, imageType: string, title: string) => {
    if (imageError[imageType]) {
      return (
        <div className="bg-gray-50 rounded p-4 text-center">
          <div className="text-gray-400 text-lg mb-1">❌</div>
          <p className="text-gray-500 text-sm">{title} 로드 실패</p>
        </div>
      );
    }

    // Base64 데이터인지 확인 (HybrIK 2D overlay는 base64)
    const isBase64 = !imageData.startsWith('http') && !imageData.startsWith('./');
    const imageSrc = isBase64 ? `data:image/jpeg;base64,${imageData}` : imageData;

    return (
      <div className="relative">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-auto rounded-lg border border-gray-200"
          onError={() => handleImageError(imageType)}
          style={{ maxHeight: '400px', objectFit: 'contain' }}
        />
        
        {/* 이미지 정보 오버레이 */}
        <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
          {title}
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-medium text-gray-900 flex items-center">
          <span className="mr-2">🎯</span>
          HybrIK 시각화 결과
        </h4>
        
        {fileName && (
          <span className="text-xs text-gray-500 font-mono">{fileName}</span>
        )}
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex space-x-1 mb-4">
        {has2DOverlay && (
          <button
            onClick={() => setActiveTab('overlay')}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              currentTab === 'overlay'
                ? 'bg-blue-100 text-blue-700 font-medium'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            2D 오버레이
          </button>
        )}
        
        {hasSkeletonPlot && (
          <button
            onClick={() => setActiveTab('skeleton')}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              currentTab === 'skeleton'
                ? 'bg-green-100 text-green-700 font-medium'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            3D 스켈레톤
          </button>
        )}
        
        {hasSkeletonRender && (
          <button
            onClick={() => setActiveTab('render')}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              currentTab === 'render'
                ? 'bg-purple-100 text-purple-700 font-medium'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            3D 렌더링
          </button>
        )}
      </div>

      {/* 이미지 표시 영역 */}
      <div className="mb-3">
        {currentTab === 'overlay' && has2DOverlay && 
          renderImage(debugVisualization!.overlay_2d!, 'overlay_2d', '2D 관절 오버레이')
        }
        
        {currentTab === 'skeleton' && hasSkeletonPlot && 
          renderImage(debugVisualization!.skeleton_plot!, 'skeleton', '3D 스켈레톤 플롯')
        }
        
        {currentTab === 'render' && hasSkeletonRender && 
          renderImage(debugVisualization!.skeleton_render!, 'render', '3D 스켈레톤 렌더')
        }
      </div>

      {/* 설명 */}
      <div className="text-xs text-gray-600 bg-gray-50 rounded p-2">
        {currentTab === 'overlay' && (
          <>
            <strong>2D 오버레이:</strong> 원본 이미지에 HybrIK 24개 관절점과 스켈레톤을 오버레이한 결과입니다. 
            각 관절의 정확한 위치와 연결 구조를 확인할 수 있습니다.
          </>
        )}
        
        {currentTab === 'skeleton' && (
          <>
            <strong>3D 스켈레톤:</strong> HybrIK가 추정한 3D 관절 좌표를 matplotlib으로 시각화한 결과입니다. 
            X, Y, Z 축의 실제 공간 좌표를 확인할 수 있습니다.
          </>
        )}
        
        {currentTab === 'render' && (
          <>
            <strong>3D 렌더링:</strong> trimesh + pyrender를 사용하여 3D 스켈레톤을 고품질로 렌더링한 결과입니다. 
            현재 일부 렌더링 문제로 인해 표시되지 않을 수 있습니다.
          </>
        )}
      </div>
    </div>
  );
};