import React from 'react';

type Props = {
  position: 'before' | 'after' | 'inside';
  type: 'exercise' | 'set' | 'part';
  isActive: boolean;
  className?: string;
};

/**
 * Drop Guideline Component - Stage 4B
 * 드롭 위치를 시각적으로 안내하는 오렌지색 가이드라인
 * PRD PAGES 요구사항: 오렌지 가이드라인으로 드롭 위치 표시
 */
export const DropGuideline: React.FC<Props> = ({
  position,
  type,
  isActive,
  className = ''
}) => {
  if (!isActive) return null;

  // 타입별 가이드라인 스타일
  const getGuidelineStyle = () => {
    const baseClasses = 'transition-all duration-150 ease-out';

    switch (position) {
      case 'before':
        return `${baseClasses} border-t-2 border-orange-400 shadow-orange-200 shadow-sm animate-pulse`;

      case 'after':
        return `${baseClasses} border-b-2 border-orange-400 shadow-orange-200 shadow-sm animate-pulse`;

      case 'inside':
        return `${baseClasses} border-2 border-orange-400 border-dashed bg-orange-50 bg-opacity-30 shadow-orange-200 shadow-sm animate-pulse rounded-lg`;
    }
  };

  // 타입별 가이드 메시지
  const getGuideMessage = () => {
    const typeNames = {
      exercise: '운동',
      set: '세트',
      part: '파트'
    };

    const positionText = {
      before: '위에',
      after: '아래에',
      inside: '안에'
    };

    return `${typeNames[type]}을 여기 ${positionText[position]} 배치`;
  };

  // 아이콘 선택
  const getIcon = () => {
    switch (type) {
      case 'exercise': return '🏃';
      case 'set': return '📋';
      case 'part': return '📁';
      default: return '📥';
    }
  };

  if (position === 'inside') {
    return (
      <div className={`${getGuidelineStyle()} ${className} p-2`}>
        <div className="flex items-center justify-center space-x-2 text-orange-700">
          <span className="text-lg">{getIcon()}</span>
          <span className="text-sm font-medium">{getGuideMessage()}</span>
        </div>
      </div>
    );
  }

  // before/after 가이드라인 (얇은 선)
  return (
    <div className={`${getGuidelineStyle()} ${className} h-0.5 relative`}>
      {/* 중앙에 작은 아이콘과 텍스트 */}
      <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 bg-orange-400 rounded-full px-2 py-0.5 flex items-center space-x-1 text-white text-xs font-medium shadow-sm">
        <span>{getIcon()}</span>
        <span>{getGuideMessage()}</span>
      </div>
    </div>
  );
};