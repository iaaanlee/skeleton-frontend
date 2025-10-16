import React from 'react';
import { DndContext, DragOverlay, DragEndEvent, DragStartEvent, DragOverEvent } from '@dnd-kit/core';
import { useDragAndDrop, DragEventCallback } from '../hooks/useDragAndDrop';
import { CircularDropZone } from '../pages/modifySessionInstancePage/components/atoms';
import { ExerciseName } from '../pages/sessionInstanceDetailsPage/components/molecules/ExerciseName';
import type { ExerciseSpec } from '../types/workout';

// formatExerciseSpec 함수 - ExerciseEditCard와 동일
const formatExerciseSpec = (spec: ExerciseSpec) => {
  const { goal, load, timeLimit } = spec;

  let goalText = '';
  switch (goal.type) {
    case 'reps':
      goalText = `${goal.value}회`;
      break;
    case 'time':
      goalText = `${goal.value}초`;
      break;
    case 'distance':
      goalText = `${goal.value}m`;
      break;
    case 'weight':
      goalText = `${goal.value}kg`;
      break;
  }

  let loadText = load.text || '';
  if (load.type === 'weight' && load.value) {
    loadText = `${load.value}kg`;
  } else if (load.type === 'bodyweight') {
    loadText = '체중';
  }

  const parts = [loadText, goalText].filter(Boolean);  // loadText를 먼저 배치

  if (timeLimit && timeLimit > 0) {
    parts.push(`제한시간 ${timeLimit}초`);
  }

  return parts.join(' x ');  // ' x '로 연결
};

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
          <div
            className={`bg-blue-100 rounded-lg shadow-lg border-2 border-blue-300 ${
              dndHook.activeItem.type === 'exercise' ? 'p-3' : 'w-[calc(100vw-2rem)]'
            }`}
            style={
              dndHook.activeItem.type !== 'exercise'
                ? { transform: 'translateX(-16px)' } // 드래그 핸들 중심 위치 보정
                : undefined
            }
          >
            {dndHook.activeItem.type === 'exercise' && dndHook.activeItem.data?.exercise ? (
              // 운동 카드 스타일
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full flex items-center justify-center mr-3 bg-blue-200">
                  <span className="text-xs font-semibold text-blue-700">
                    {(dndHook.activeItem.data.exercise.order ?? 0) + 1}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-blue-900 text-sm">
                    <ExerciseName exerciseTemplateId={dndHook.activeItem.data.exercise.exerciseTemplateId} />
                  </p>
                  <p className="text-xs text-blue-700">
                    {formatExerciseSpec(dndHook.activeItem.data.exercise.spec)}
                  </p>
                </div>
              </div>
            ) : (
              // 세트/파트 카드 스타일 - SetEditCard 헤더 구조 복제
              <div className="px-3 pt-3 pb-3">
                <div className="flex items-center justify-between">
                  {/* 왼쪽: 토글 + 세트/파트 정보 */}
                  <div className="flex items-center">
                    {/* 토글 버튼 아이콘 */}
                    <div className="p-1 mr-2">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>

                    <div className="flex items-center">
                      <span className="text-sm font-medium text-blue-800">
                        {dndHook.activeItem.data?.name || `${dndHook.activeItem.type} 이동 중...`}
                      </span>
                    </div>
                  </div>

                  {/* 오른쪽: 삭제 버튼 + 드래그 핸들 */}
                  <div className="flex items-center space-x-1">
                    {/* 삭제 버튼 아이콘 */}
                    <div className="flex items-center justify-center w-8 h-8 rounded text-red-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </div>

                    {/* 드래그 핸들 아이콘 */}
                    <div className="flex items-center justify-center w-8 h-8 rounded text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}
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