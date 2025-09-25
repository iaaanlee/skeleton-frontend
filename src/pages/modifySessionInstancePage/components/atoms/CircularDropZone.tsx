import React, { useRef, useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';

type Props = {
  type: 'duplicate' | 'delete';
  isActive: boolean;
  className?: string;
};

/**
 * Circular Drop Zone for Duplicate/Delete Actions
 * Reference: ::a.png - 드래그해서 복제/삭제 원형 드롭존
 * PRD: 드래그 중 화면 하단에 나타나는 복제/삭제 액션 존
 */
export const CircularDropZone: React.FC<Props> = ({
  type,
  isActive,
  className = ''
}) => {
  const dropZoneId = `circular-drop-${type}`;

  const { isOver, setNodeRef } = useDroppable({
    id: dropZoneId,
    data: {
      type,
      accepts: ['exercise', 'set', 'part'] // 모든 드래그 타입 허용
    }
  });

  // 이전 상태 추적을 위한 ref
  const prevStateRef = useRef({ isOver: false, isActive: false });

  // 상태 변경 시에만 로그 출력 (성능 최적화)
  useEffect(() => {
    const currentState = { isOver, isActive };
    const prevState = prevStateRef.current;

    // 상태가 실제로 변경된 경우에만 로그 출력
    if (prevState.isOver !== isOver || prevState.isActive !== isActive) {
      console.log('🌀 CircularDropZone 상태 변경:', {
        type,
        dropZoneId,
        isOver: `${prevState.isOver} → ${isOver}`,
        isActive: `${prevState.isActive} → ${isActive}`
      });
      prevStateRef.current = currentState;
    }
  }, [isOver, isActive, type, dropZoneId]);

  // 타입별 스타일 및 아이콘
  const config = {
    duplicate: {
      label: '드래그해서 복제',
      icon: '📄', // 복사 아이콘
      bgColor: 'bg-blue-100',
      borderColor: isOver ? 'border-blue-500' : 'border-blue-300',
      textColor: 'text-blue-700',
      iconBg: 'bg-blue-200'
    },
    delete: {
      label: '드래그해서 삭제',
      icon: '🗑️', // 삭제 아이콘
      bgColor: 'bg-red-100',
      borderColor: isOver ? 'border-red-500' : 'border-red-300',
      textColor: 'text-red-700',
      iconBg: 'bg-red-200'
    }
  };

  const style = config[type];

  // 활성 상태일 때만 표시
  if (!isActive) return null;

  return (
    <div className="flex flex-col items-center">
      {/* 라벨 */}
      <div className={`text-xs font-medium mb-2 ${style.textColor}`}>
        {style.label}
      </div>

      {/* 시각적 드롭존 - 큰 버튼 */}
      <div
        className={`
          w-16 h-16 rounded-full border-2
          ${style.bgColor} ${style.borderColor}
          flex items-center justify-center
          transition-all duration-200
          ${isOver ? 'scale-110 shadow-xl' : 'scale-100'}
          cursor-pointer
          relative
        `}
      >
        <span className="text-xl">{style.icon}</span>

        {/* 실제 collision detection 영역 - 작은 중앙 영역 */}
        <div
          ref={setNodeRef}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-4 h-4 rounded-full" />
        </div>
      </div>
    </div>
  );
};