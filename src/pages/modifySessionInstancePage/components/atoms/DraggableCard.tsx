import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { DragItem } from '../../../../hooks/useDragAndDrop';
import { PinWrapper } from './PinWrapper';
import type { PinState } from '../../../../types/workout';

type Props = {
  dragItem: DragItem;
  children: React.ReactNode;
  pinState?: PinState;
  className?: string;
  disabled?: boolean;
  dragHandle?: boolean; // 드래그 핸들 사용 여부
};

/**
 * Draggable Card Component - Stage 4B
 * Pin System과 연동하여 드래그 권한 검사
 */
export const DraggableCard: React.FC<Props> = ({
  dragItem,
  children,
  pinState,
  className = '',
  disabled = false,
  dragHandle = false
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: dragItem.id,
    data: dragItem,
    disabled: disabled || dragHandle // dragHandle이 true면 기본 드래그 완전 비활성화
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    touchAction: 'none',
  };

  // Default Pin State (no pins active)
  const defaultPinState: PinState = {
    sessionPin: false,
    partPin: false,
    setPin: false,
    exercisePin: false
  };
  const activePinState = pinState || defaultPinState;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`touch-none select-none ${className}`}
      data-drag-type={dragItem.type}
      data-drag-id={dragItem.id}
      // dragHandle이 false일 때만 전체 영역에서 드래그 가능
      {...(!dragHandle && !disabled ? { ...attributes, ...listeners } : {})}
    >
      <PinWrapper
        pinState={activePinState}
        className={`
          transition-transform duration-200
          ${isDragging ? 'scale-105 shadow-xl' : 'shadow-sm'}
          ${disabled ? 'cursor-not-allowed' : dragHandle ? '' : 'cursor-grab active:cursor-grabbing'}
        `}
        showPinIndicator={true}
        pinIndicatorPosition="top-right"
      >
        <div className="relative">
          {children}

          {/* 드래그 핸들이 필요한 경우 별도의 드래그 핸들 생성 */}
          {dragHandle && !disabled && (
            <div className="absolute top-1/2 -translate-y-1/2 right-12 z-10">
              <DragHandleButton
                dragItem={dragItem}
                attributes={attributes}
                listeners={listeners}
              />
            </div>
          )}
        </div>
      </PinWrapper>
    </div>
  );
};

// 별도의 드래그 핸들 버튼 컴포넌트
const DragHandleButton: React.FC<{
  dragItem: DragItem;
  attributes: any;
  listeners: any;
}> = ({ dragItem, attributes, listeners }) => {
  const {
    setNodeRef: handleNodeRef,
    transform: handleTransform,
    isDragging: handleIsDragging,
  } = useDraggable({
    id: `handle-${dragItem.id}`,
    data: dragItem,
  });

  const handleStyle = {
    transform: CSS.Transform.toString(handleTransform),
    opacity: handleIsDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={handleNodeRef}
      style={handleStyle}
      {...attributes}
      {...listeners}
      className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 cursor-grab active:cursor-grabbing bg-white shadow-lg border-2 border-gray-300"
      title={`${dragItem.type} 이동`}
      onClick={(e) => e.stopPropagation()}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
      </svg>
    </div>
  );
};