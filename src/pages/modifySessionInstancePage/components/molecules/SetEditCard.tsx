import React, { useState } from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ExerciseEditCard } from './ExerciseEditCard';
import type { EffectiveSetBlueprint, EffectiveExerciseBlueprint, PinState, ActiveItem } from '../../../../types/workout';
import { SetDraggableCard } from '../atoms/SetDraggableCard';
import { SortableItem } from '../atoms/SortableItem';
import type { DragItem, DropZone, PlaceholderInfo } from '../../../../hooks/useDragAndDrop';
import { PinSystemHelpers } from '../../../../types/workout';
import { generateExerciseDragId, generateSetDragId } from '../../../../utils/dragIdGenerator';
import { RestTimeEditBottomSheet } from './RestTimeEditBottomSheet';
import { TimeLimitEditBottomSheet } from './TimeLimitEditBottomSheet';

type Props = {
  set: EffectiveSetBlueprint;
  setIndex: number;
  pinState?: PinState;
  onUpdateSet: (updatedSet: EffectiveSetBlueprint) => void;
  onDeleteSet: () => void;
  onAddExercise: () => void;
  // DnD Props
  partIndex?: number;
  parentId?: string;
  // ActiveItem Props
  activeItem?: ActiveItem;
  onSetClick?: (setSeedId: string) => void;
  onExerciseClick?: (exerciseId: string) => void;
  // 토글 상태 인계 Props
  isExpanded?: boolean;
  onToggle?: (setSeedId: string) => void;
  // Placeholder Props
  placeholderInfo?: PlaceholderInfo;
};

export const SetEditCard: React.FC<Props> = ({
  set,
  setIndex,
  pinState,
  onUpdateSet,
  onDeleteSet,
  onAddExercise,
  partIndex,
  parentId,
  activeItem,
  onSetClick,
  onExerciseClick,
  isExpanded: propIsExpanded,
  onToggle,
  placeholderInfo
}) => {
  // 토글 상태 인계: props에서 받은 상태 또는 기본값 사용
  const isExpanded = propIsExpanded !== undefined
    ? propIsExpanded
    : (partIndex === 0 && setIndex === 0); // fallback for backward compatibility

  // Phase 2: RestTimeEditBottomSheet 모달 상태
  const [restTimeModalOpen, setRestTimeModalOpen] = useState(false);

  // Phase 4: TimeLimitEditBottomSheet 모달 상태
  const [timeLimitModalOpen, setTimeLimitModalOpen] = useState(false);

  // 드래그 재시작 플래그 (무한 루프 방지)
  const isDragRestarted = React.useRef(false);

  // Phase 1 완료: BaseEditBottomSheet 기반 구축 완료

  // Default Pin State (no pins active)
  const defaultPinState: PinState = {
    sessionPin: false,
    partPin: false,
    setPin: false,
    exercisePin: false
  };
  const activePinState = pinState || defaultPinState;

  // DragItem 생성 (ID 충돌 방지를 위한 고유 ID)
  const dragId = generateSetDragId(partIndex || 0, setIndex, set.setSeedId);

  const dragItem: DragItem = {
    id: dragId,
    type: 'set',
    data: {
      name: `세트 ${setIndex + 1}`,
      set: set,
      setIndex: setIndex
    },
    pinState: activePinState,
    parentId: parentId,
    level: 'set',
    indices: {
      partIndex,
      setIndex
    }
  };

  // Pin System에서 드래그 권한 체크
  const effectivePin = PinSystemHelpers.getEffectivePinState(activePinState);
  const canDrag = effectivePin.canDrag;

  // useDraggable 훅 사용
  const {
    attributes,
    listeners,
    setNodeRef,
  } = useDraggable({
    id: dragItem.id,
    data: dragItem,
    disabled: !canDrag
  });

  // ActiveItem 체크
  const isActive = activeItem?.level === 'set' && activeItem.id === set.setSeedId;

  // Sortable 운동 목록 생성 (ID 충돌 방지를 위한 고유 ID)
  const exerciseIds = set.exercises.map((exercise, index) =>
    generateExerciseDragId(partIndex || 0, setIndex, index, exercise.exerciseTemplateId)
  );

  // 세트 전체를 드롭존으로 만들기 (닫혔을 때 = 헤더만, 펼쳤을 때 = 운동 목록 영역)
  const setDropZone: DropZone = {
    id: dragItem.id, // set-{partIndex}-{setIndex}-{setSeedId}
    type: 'container',
    accepts: ['exercise'],
    autoExpand: false
  };

  // 헤더 드롭존 (닫혔을 때만 활성화)
  const { setNodeRef: setHeaderDropRef, isOver: isHeaderOver } = useDroppable({
    id: setDropZone.id,
    data: setDropZone,
    disabled: isExpanded // 펼쳐져 있으면 헤더 드롭존 비활성화
  });

  // 운동 목록 영역 드롭존 (펼쳤을 때만 활성화)
  const { setNodeRef: setContentDropRef, isOver: isContentOver } = useDroppable({
    id: setDropZone.id,
    data: setDropZone,
    disabled: !isExpanded // 닫혀있으면 컨텐츠 드롭존 비활성화
  });

  // Phase 2: RestTimeEditBottomSheet 저장 핸들러
  const handleRestTimeModalSave = (restTime: number, applyToAll: boolean) => {
    const updatedSet = {
      ...set,
      restTime: restTime
    };

    // PRD 요구사항: 일괄 적용 토글 처리
    if (applyToAll) {
      // console.log('일괄 적용 모드: 세션 내 모든 휴식에 변경 사항 적용', {
      //   restTime: restTime,
      //   exerciseCount: set.exercises.length
      // });
      // 실제 구현은 상위 컴포넌트에서 전체 세션 데이터에 접근해서 처리해야 함
    }

    onUpdateSet(updatedSet);
  };

  // Phase 4: TimeLimitEditBottomSheet 저장 핸들러
  const handleTimeLimitModalSave = (timeLimit: number | null, applyToAll: boolean) => {
    const updatedSet = {
      ...set,
      timeLimit: timeLimit
    };

    // PRD 요구사항: 일괄 적용 토글 처리
    if (applyToAll) {
      // console.log('일괄 적용 모드: 세션 내 모든 시간 제한에 변경 사항 적용', {
      //   timeLimit: timeLimit,
      //   exerciseCount: set.exercises.length
      // });
      // 실제 구현은 상위 컴포넌트에서 전체 세션 데이터에 접근해서 처리해야 함
    }

    onUpdateSet(updatedSet);
  };

  const handleUpdateExercise = (exerciseIndex: number, updatedExercise: EffectiveExerciseBlueprint) => {
    const updatedExercises = [...set.exercises];
    updatedExercises[exerciseIndex] = updatedExercise;

    onUpdateSet({
      ...set,
      exercises: updatedExercises
    });
  };

  const handleDeleteExercise = (exerciseIndex: number) => {
    if (window.confirm('이 운동을 삭제하시겠습니까?')) {
      const updatedExercises = set.exercises.filter((_, index) => index !== exerciseIndex);
      onUpdateSet({
        ...set,
        exercises: updatedExercises
      });
    }
  };

  const handleDeleteSet = () => {
    if (window.confirm('이 세트를 삭제하시겠습니까? 포함된 모든 운동이 함께 삭제됩니다.')) {
      onDeleteSet();
    }
  };

  return (
    <SetDraggableCard
      dragItem={dragItem}
      pinState={activePinState}
      disabled={true}
      dragHandle={false}
      className={`border rounded-lg overflow-hidden transition-colors ${
        isActive
          ? 'border-orange-400 bg-orange-50'
          : 'border-gray-200 bg-white hover:bg-gray-50'
      }`}
      data-set-id={set.setSeedId}
      data-collapsed={!isExpanded}
      data-part-index={partIndex}
      data-set-index={setIndex}
    >
      {/* 세트 헤더 - session-details 스타일 */}
      <div
        ref={setHeaderDropRef}
        className={`px-3 pt-3 ${isExpanded ? 'pb-2' : 'pb-3'}`}
      >
        <div className="flex items-center justify-between">
          {/* 왼쪽: 토글 + 세트 정보 */}
          <div className="flex items-center">
            {/* 토글 버튼 - 왼쪽으로 이동 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggle?.(set.setSeedId);
              }}
              className="p-1 hover:bg-gray-200 rounded transition-colors mr-2"
            >
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  isExpanded ? 'rotate-90' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div
              className="flex items-center cursor-pointer"
              onClick={() => onSetClick?.(set.setSeedId)}
            >
              <span className="text-sm font-medium text-gray-700 mr-2">
                세트 {setIndex + 1}
              </span>
              {set.setBlueprintId === null && (
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  새로 추가됨
                </span>
              )}
            </div>
          </div>

          {/* 오른쪽: 삭제 버튼 + 드래그 핸들 */}
          <div className="flex items-center space-x-1">
            {/* 🗑️ 삭제 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteSet();
              }}
              className="flex items-center justify-center w-8 h-8 rounded hover:bg-red-50 transition-colors text-red-500 hover:text-red-600"
              title="세트 삭제"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>

            {/* 드래그 핸들 */}
            <button
              ref={setNodeRef}
              {...(canDrag ? { ...attributes, ...listeners } : {})}
              className="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100 transition-colors text-gray-600 cursor-grab active:cursor-grabbing"
              title="세트 이동"
              disabled={!canDrag}
              onPointerDown={(e) => {
                // 재시작된 이벤트면 그냥 진행 (무한 루프 방지)
                if (isDragRestarted.current) {
                  isDragRestarted.current = false;
                  return;
                }

                // 드래그 시작 전 모든 세트 닫기 - 순차 처리
                e.preventDefault();
                e.stopPropagation();

                const target = e.currentTarget;
                const savedEvent = {
                  clientX: e.clientX,
                  clientY: e.clientY,
                  pointerId: e.pointerId,
                  pointerType: e.pointerType,
                  pressure: e.pressure,
                  button: e.button,
                  buttons: e.buttons,
                };

                // 1. collapse 이벤트 dispatch
                const collapseEvent = new CustomEvent('drag-start-collapse-sets');
                document.dispatchEvent(collapseEvent);

                // 2. DOM 업데이트 완전 대기 후 드래그 시작 (더블 RAF)
                requestAnimationFrame(() => {
                  requestAnimationFrame(() => {
                    if (!canDrag) return;

                    // 플래그 설정하고 새 이벤트 발행
                    isDragRestarted.current = true;
                    const newEvent = new PointerEvent('pointerdown', {
                      bubbles: true,
                      cancelable: true,
                      ...savedEvent,
                    });
                    target.dispatchEvent(newEvent);
                  });
                });
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 세트 내용 - 접힘/펼침 + 전체 영역 드롭존 */}
      {isExpanded && (
        <div
          ref={setContentDropRef}
          className=""
        >
          {/* 시간제한 배지 - session-details 스타일 + 클릭 가능 */}
          <div className="px-3 mb-3">
            <div
              className="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setTimeLimitModalOpen(true);
              }}
              title="클릭하여 시간제한 수정"
            >
              {set.timeLimit === null || set.timeLimit === 0
                ? "운동 시간 제한 없음"
                : `운동 시간 제한 ${set.timeLimit}초`}
            </div>
          </div>

          {/* 운동 목록 - session-details 스타일 래퍼 */}
          {set.exercises.length > 0 && (
            <div className="px-3 space-y-2 mb-2">
              <SortableContext items={exerciseIds} strategy={verticalListSortingStrategy}>
              {set.exercises.map((exercise, exerciseIndex) => {
                // Placeholder 렌더링 로직: 현재 운동 이전에 삽입되어야 하는지 체크
                const shouldShowPlaceholderBefore =
                  placeholderInfo &&
                  placeholderInfo.containerType === 'set' &&
                  placeholderInfo.containerId === dragId &&
                  placeholderInfo.insertIndex === exerciseIndex;

                return (
                  <React.Fragment key={exerciseIds[exerciseIndex]}>
                    {/* Placeholder: 운동 이전 위치 */}
                    {shouldShowPlaceholderBefore && (
                      <div
                        className="h-1 bg-blue-400 rounded relative my-2 transition-all duration-200 ease-in-out"
                        data-placeholder="true"
                      >
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-2 bg-blue-100 border-2 border-dashed border-blue-400 rounded-lg whitespace-nowrap pointer-events-none">
                          <span className="text-blue-600 text-sm font-medium">여기에 삽입</span>
                        </div>
                      </div>
                    )}

                    <SortableItem
                      sortableId={exerciseIds[exerciseIndex]}
                      dragItem={{
                        id: exerciseIds[exerciseIndex],
                        type: 'exercise',
                        data: {
                          name: exercise.exerciseTemplateId,
                          exercise: exercise,
                          exerciseIndex: exerciseIndex
                        },
                        pinState: activePinState,
                        parentId: dragItem.id,
                        level: 'exercise',
                        indices: {
                          partIndex,
                          setIndex,
                          exerciseIndex
                        }
                      }}
                      pinState={activePinState}
                      disabled={true}
                    >
                      <ExerciseEditCard
                        exercise={exercise}
                        exerciseIndex={exerciseIndex}
                        pinState={activePinState}
                        activeItem={activeItem}
                        onExerciseClick={onExerciseClick}
                        setSeedId={set.setSeedId}
                        onUpdate={(updatedExercise) => handleUpdateExercise(exerciseIndex, updatedExercise)}
                        onDelete={() => handleDeleteExercise(exerciseIndex)}
                        partIndex={partIndex}
                        setIndex={setIndex}
                        parentId={dragItem.id}
                      />
                    </SortableItem>
                  </React.Fragment>
                );
              })}

              {/* Placeholder: 마지막 운동 이후 위치 */}
              {placeholderInfo &&
                placeholderInfo.containerType === 'set' &&
                placeholderInfo.containerId === dragId &&
                placeholderInfo.insertIndex === set.exercises.length && (
                <div
                  className="h-1 bg-blue-400 rounded relative my-2 transition-all duration-200 ease-in-out"
                  data-placeholder="true"
                >
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-2 bg-blue-100 border-2 border-dashed border-blue-400 rounded-lg whitespace-nowrap pointer-events-none">
                    <span className="text-blue-600 text-sm font-medium">여기에 삽입</span>
                  </div>
                </div>
              )}
              </SortableContext>
            </div>
          )}

          {/* 빈 세트에서도 placeholder 표시 */}
          {set.exercises.length === 0 && (
            <div className="px-3 mb-2 min-h-[60px]">
              {placeholderInfo &&
                placeholderInfo.containerType === 'set' &&
                placeholderInfo.containerId === dragId &&
                placeholderInfo.insertIndex === 0 && (
                <div
                  className="h-1 bg-blue-400 rounded relative my-2 transition-all duration-200 ease-in-out"
                  data-placeholder="true"
                >
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-2 bg-blue-100 border-2 border-dashed border-blue-400 rounded-lg whitespace-nowrap pointer-events-none">
                    <span className="text-blue-600 text-sm font-medium">여기에 삽입</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 휴식시간 섹션 - session-details 스타일 + 클릭 가능 (드롭존 내부!) */}
          {set.restTime && set.restTime > 0 && (
            <div className="px-3 mb-3">
              <div
                className="flex items-center py-2 px-3 rounded border bg-gray-50 border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setRestTimeModalOpen(true);
                }}
                title="클릭하여 휴식시간 수정"
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center mr-3 bg-gray-100">
                  <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">운동 후 휴식</p>
                  <p className="text-xs text-gray-600">
                    {Math.floor(set.restTime / 60) > 0 && `${Math.floor(set.restTime / 60)}분 `}
                    {set.restTime % 60 > 0 && `${set.restTime % 60}초`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 빈 세트 안내 메시지 (드롭존 내부!) */}
          {set.exercises.length === 0 && (
            <div className="px-3 mb-3">
              <div className="text-center py-4 text-gray-500 bg-white rounded-lg border border-dashed">
                <p className="text-sm">이 세트에는 운동이 없습니다.</p>
                <p className="text-xs text-gray-400 mt-1">우하단 + 버튼으로 운동을 추가하세요</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Phase 2: RestTimeEditBottomSheet 모달 */}
      <RestTimeEditBottomSheet
        isOpen={restTimeModalOpen}
        onClose={() => setRestTimeModalOpen(false)}
        currentRestTime={set.restTime}
        partName={`파트${(partIndex ?? 0) + 1}`}
        setIndex={setIndex}
        onSave={handleRestTimeModalSave}
      />

      {/* Phase 4: TimeLimitEditBottomSheet 모달 */}
      <TimeLimitEditBottomSheet
        isOpen={timeLimitModalOpen}
        onClose={() => setTimeLimitModalOpen(false)}
        currentTimeLimit={set.timeLimit}
        onSave={handleTimeLimitModalSave}
      />

    </SetDraggableCard>
  );
};