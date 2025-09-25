import React from 'react';
import { DndContext, DragOverlay, DragEndEvent, DragStartEvent, DragOverEvent } from '@dnd-kit/core';
import { useDragAndDrop, DragEventCallback } from '../hooks/useDragAndDrop';
import { CircularDropZone } from '../pages/modifySessionInstancePage/components/atoms';

type Props = {
  children: React.ReactNode;
  onDragEnd?: (event: DragEndEvent) => void;
  onDragStart?: (event: DragStartEvent) => void;
  onDragOver?: (event: DragOverEvent) => void;
  dragCallbacks?: DragEventCallback;
};

/**
 * DnD Context Provider for Stage 4B - Workout Session Editing
 * PRD PAGES 요구사항: 롱프레스 150ms, 햅틱 피드백, 24px 오토스크롤
 */
export const DndContextProvider: React.FC<Props> = ({
  children,
  onDragEnd,
  onDragStart,
  onDragOver,
  dragCallbacks
}) => {
  const dndHook = useDragAndDrop(dragCallbacks);

  // 외부 핸들러와 내부 핸들러 결합
  const handleDragStart = (event: DragStartEvent) => {
    dndHook.onDragStart(event);
    onDragStart?.(event);
  };

  const handleDragOver = (event: DragOverEvent) => {
    dndHook.onDragOver(event);
    onDragOver?.(event);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    dndHook.onDragEnd(event);
    onDragEnd?.(event);
  };

  return (
    <DndContext
      sensors={dndHook.sensors}
      collisionDetection={dndHook.collisionDetection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      modifiers={dndHook.modifiers}
      autoScroll={false}  // 자동 스크롤 비활성화
    >
      {children}

      {/* Drag Overlay for Ghost Image */}
      <DragOverlay>
        {dndHook.activeItem ? (
          <div className="bg-blue-100 p-2 rounded-lg shadow-lg border border-blue-200 opacity-80">
            <div className="text-sm font-medium text-blue-800">
              {dndHook.activeItem.type === 'exercise' && '🏃 운동'}
              {dndHook.activeItem.type === 'set' && '📋 세트'}
              {dndHook.activeItem.type === 'part' && '📁 파트'}
            </div>
            <div className="text-xs text-blue-600 mt-1">
              {dndHook.activeItem.data?.name || `${dndHook.activeItem.type} 이동 중...`}
            </div>
          </div>
        ) : null}
      </DragOverlay>

      {/* Circular Drop Zones - Simplified Structure */}
      {dndHook.activeItem && (
        <>
          {/* 복제 드롭존 - 정확한 고정 위치 */}
          <div
            className="fixed z-[9998]"
            style={{
              bottom: '128px',
              left: '50%',
              transform: 'translateX(-80px)' // 좌측으로 80px 이동
            }}
          >
            <CircularDropZone
              type="duplicate"
              isActive={true}
            />
          </div>

          {/* 삭제 드롭존 - 우선순위 높음 (위험한 액션) */}
          <div
            className="fixed z-[9999]"
            style={{
              bottom: '128px',
              left: '50%',
              transform: 'translateX(48px)' // 우측으로 48px 이동
            }}
          >
            <CircularDropZone
              type="delete"
              isActive={true}
            />
          </div>
        </>
      )}
    </DndContext>
  );
};