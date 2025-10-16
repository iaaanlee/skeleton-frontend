import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { DragItem } from '../../../../hooks/useDragAndDrop';
import { PinWrapper } from './PinWrapper';
import type { PinState } from '../../../../types/workout';
import { PinSystemHelpers } from '../../../../types/workout';

type Props = {
  sortableId: string;
  dragItem: DragItem;
  children: React.ReactNode;
  pinState?: PinState;
  className?: string;
  disabled?: boolean;
};

/**
 * Sortable Item Component - Stage 4B
 * @dnd-kit/sortable을 사용한 정밀한 정렬 시스템
 * Pin System과 연동하여 드래그 권한 검사
 */
export const SortableItem: React.FC<Props> = ({
  sortableId,
  dragItem,
  children,
  pinState,
  className = '',
  disabled = false
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver
  } = useSortable({
    id: sortableId,
    data: dragItem,
    disabled
  });

  const style = {
    zIndex: isDragging ? 1000 : 1,
  };

  // Default Pin State
  const defaultPinState: PinState = {
    sessionPin: false,
    partPin: false,
    setPin: false,
    exercisePin: false
  };
  const activePinState = pinState || defaultPinState;

  // Pin System에서 드래그 권한 체크
  const effectivePin = PinSystemHelpers.getEffectivePinState(activePinState);
  const canDrag = effectivePin.canDrag && !disabled;

  const itemClasses = [
    'touch-manipulation',
    'transition-all duration-200',
    isDragging ? 'scale-105 shadow-xl z-40' : 'shadow-sm',
    isOver ? 'scale-102 shadow-md' : '',
    !canDrag ? 'cursor-not-allowed opacity-60' : 'cursor-grab active:cursor-grabbing',
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={itemClasses}
      {...attributes}
      {...(canDrag ? listeners : {})}
      data-sortable-id={sortableId}
      data-drag-type={dragItem.type}
      data-can-drag={canDrag}
    >
      <PinWrapper
        pinState={activePinState}
        showPinIndicator={true}
        pinIndicatorPosition="top-right"
        className={`
          ${isDragging ? 'ring-2 ring-blue-300' : ''}
          ${isOver ? 'ring-1 ring-blue-200' : ''}
          transition-all duration-150
        `}
      >
        {children}
      </PinWrapper>
    </div>
  );
};