import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { DropZone } from '../../../../hooks/useDragAndDrop';

type Props = {
  dropZone: DropZone;
  children: React.ReactNode;
  className?: string;
  placeholder?: string;
  showDropIndicator?: boolean;
};

/**
 * Droppable Zone Component - Stage 4B
 * 다양한 드롭존 타입 지원: container, new-set, new-part, duplicate, delete
 */
export const DroppableZone: React.FC<Props> = ({
  dropZone,
  children,
  className = '',
  placeholder,
  showDropIndicator = true
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: dropZone.id,
    data: dropZone,
  });

  // Drop zone type에 따른 스타일 클래스
  const getDropZoneClasses = () => {
    const baseClasses = 'transition-all duration-200';

    switch (dropZone.type) {
      case 'container':
        return `${baseClasses} ${isOver ? 'bg-blue-50 border-blue-300 border-2 border-dashed shadow-sm' : ''}`;

      case 'new-set':
        return `${baseClasses} ${isOver ? 'bg-green-50 border-green-300 border-2 border-dashed shadow-md animate-pulse' : 'border border-dashed border-gray-300 hover:border-gray-400'}`;

      case 'new-part':
        return `${baseClasses} ${isOver ? 'bg-purple-50 border-purple-300 border-2 border-dashed shadow-md animate-pulse' : 'border border-dashed border-gray-300 hover:border-gray-400'}`;

      case 'duplicate':
        return `${baseClasses} ${isOver ? 'bg-yellow-50 border-yellow-300 border-2 border-dashed shadow-md scale-105' : 'border border-dashed border-gray-300 hover:border-yellow-300'}`;

      case 'delete':
        return `${baseClasses} ${isOver ? 'bg-red-50 border-red-300 border-2 border-dashed shadow-md scale-105' : 'border border-dashed border-gray-300 hover:border-red-300'}`;

      default:
        return `${baseClasses} ${isOver ? 'bg-gray-50 border-gray-300 border-2 border-dashed shadow-sm' : ''}`;
    }
  };

  // Drop zone type에 따른 표시 텍스트
  const getPlaceholderText = () => {
    if (placeholder) return placeholder;

    switch (dropZone.type) {
      case 'new-set':
        return '여기에 놓으면 새 세트가 생성됩니다';
      case 'new-part':
        return '여기에 놓으면 새 파트가 생성됩니다';
      case 'duplicate':
        return '여기에 놓으면 복사됩니다';
      case 'delete':
        return '여기에 놓으면 삭제됩니다';
      default:
        return '드롭 가능한 영역입니다';
    }
  };

  // Drop indicator icon
  const getDropIcon = () => {
    switch (dropZone.type) {
      case 'new-set':
        return '📋';
      case 'new-part':
        return '📁';
      case 'duplicate':
        return '📑';
      case 'delete':
        return '🗑️';
      default:
        return '📥';
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`
        ${getDropZoneClasses()}
        ${className}
        min-h-12
        rounded-lg
        relative
      `}
      data-drop-zone-id={dropZone.id}
      data-drop-zone-type={dropZone.type}
    >
      {children}

      {/* Drop Indicator */}
      {isOver && showDropIndicator && (
        <div className="absolute inset-0 flex items-center justify-center bg-opacity-90 rounded-lg">
          <div className="text-center">
            <div className="text-2xl mb-1">{getDropIcon()}</div>
            <div className="text-sm font-medium text-gray-700">
              {getPlaceholderText()}
            </div>
          </div>
        </div>
      )}

      {/* Empty Drop Zone Placeholder */}
      {!children && !isOver && (
        <div className="flex items-center justify-center h-12 text-gray-400 text-sm">
          {getPlaceholderText()}
        </div>
      )}
    </div>
  );
};