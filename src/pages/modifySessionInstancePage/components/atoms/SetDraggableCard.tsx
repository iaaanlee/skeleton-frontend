import React from 'react';
import { useDroppable } from '@dnd-kit/core';
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
} & Record<string, any>; // 추가 data 속성들을 위한 확장

/**
 * Set Draggable Card Component
 * DraggableCard와 동일한 역할 - collision detection만 담당
 * 실제 드래그는 SortableItem에서 처리
 */
export const SetDraggableCard: React.FC<Props> = ({
  dragItem,
  children,
  pinState,
  className = '',
  disabled = false,
  dragHandle = false,
  ...dataAttributes // 추가 data 속성들 (data-set-id, data-collapsed 등)
}) => {
  // useDroppable: collision detection을 위한 droppable 기능만 제공
  // 실제 드래그는 SortableItem이 처리하므로 useDraggable 제거
  const {
    setNodeRef,
    isOver
  } = useDroppable({
    id: dragItem.id,
    data: dragItem,
    disabled: false // 항상 droppable (collision detection을 위해 필수)
  });

  // transform 제거 - SortableItem에서 처리
  const style = {
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
      data-sortable-id={dragItem.id}
      data-drag-type={dragItem.type}
      data-drag-id={dragItem.id}
      {...dataAttributes} // 추가 data 속성들 적용 (data-set-id, data-collapsed 등)
    >
      <PinWrapper
        pinState={activePinState}
        className="transition-transform duration-200 shadow-sm"
        showPinIndicator={true}
        pinIndicatorPosition="top-right"
      >
        {children}
      </PinWrapper>
    </div>
  );
};
