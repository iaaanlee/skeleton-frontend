import React from 'react';
import { SortableContext, verticalListSortingStrategy, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import type { DropZone } from '../../../../hooks/useDragAndDrop';
import { DroppableZone } from './DroppableZone';

type Props = {
  items: string[]; // sortable item IDs
  children: React.ReactNode;
  dropZone?: DropZone;
  strategy?: 'vertical' | 'horizontal';
  className?: string;
  showDropIndicator?: boolean;
};

/**
 * Sortable Container Component - Stage 4B
 * SortableContext와 DroppableZone을 결합한 컨테이너
 */
export const SortableContainer: React.FC<Props> = ({
  items,
  children,
  dropZone,
  strategy = 'vertical',
  className = '',
  showDropIndicator = true
}) => {
  const sortingStrategy = strategy === 'horizontal'
    ? horizontalListSortingStrategy
    : verticalListSortingStrategy;

  // DropZone이 있는 경우
  if (dropZone) {
    return (
      <DroppableZone
        dropZone={dropZone}
        className={className}
        showDropIndicator={showDropIndicator}
      >
        <SortableContext items={items} strategy={sortingStrategy}>
          {children}
        </SortableContext>
      </DroppableZone>
    );
  }

  // 단순 SortableContext만 사용하는 경우
  return (
    <div className={className}>
      <SortableContext items={items} strategy={sortingStrategy}>
        {children}
      </SortableContext>
    </div>
  );
};