import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useDraggable } from '@dnd-kit/core';
import type { EffectiveExerciseBlueprint, ExerciseSpec, PinState, ActiveItem } from '../../../../types/workout';
import { DraggableCard } from '../atoms/DraggableCard';
import type { DragItem } from '../../../../hooks/useDragAndDrop';
import { PinSystemHelpers } from '../../../../types/workout';
import { generateExerciseDragId } from '../../../../utils/dragIdGenerator';
import { ExerciseName } from '../../../sessionInstanceDetailsPage/components/molecules/ExerciseName';
import { ExerciseEditBottomSheet } from './ExerciseEditBottomSheet';

// formatExerciseSpec 함수 - session-instance-details와 동일
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

  const parts = [goalText, loadText].filter(Boolean);

  if (timeLimit && timeLimit > 0) {
    parts.push(`제한시간 ${timeLimit}초`);
  }

  return parts.join(' · ');
};

type Props = {
  exercise: EffectiveExerciseBlueprint;
  exerciseIndex: number;
  pinState?: PinState;
  onUpdate: (updatedExercise: EffectiveExerciseBlueprint) => void;
  onDelete: () => void;
  // DnD Props
  partIndex?: number;
  setIndex?: number;
  parentId?: string;
  // ActiveItem Props
  activeItem?: ActiveItem;
  onExerciseClick?: (exerciseId: string) => void;
  setSeedId?: string;
};

export const ExerciseEditCard: React.FC<Props> = ({
  exercise,
  exerciseIndex,
  pinState,
  onUpdate,
  onDelete,
  partIndex,
  setIndex,
  parentId,
  activeItem,
  onExerciseClick,
  setSeedId
}) => {
  // Phase 3: ExerciseEditBottomSheet 모달 상태
  const [exerciseModalOpen, setExerciseModalOpen] = useState(false);

  // Default Pin State (no pins active)
  const defaultPinState: PinState = {
    sessionPin: false,
    partPin: false,
    setPin: false,
    exercisePin: false
  };
  const activePinState = pinState || defaultPinState;

  // DragItem 생성 (ID 충돌 방지)
  const dragItem: DragItem = {
    id: generateExerciseDragId(partIndex || 0, setIndex || 0, exerciseIndex, exercise.exerciseTemplateId),
    type: 'exercise',
    data: {
      name: exercise.exerciseTemplateId,
      exercise: exercise,
      exerciseIndex: exerciseIndex
    },
    pinState: activePinState,
    parentId: parentId,
    level: 'exercise',
    indices: {
      partIndex,
      setIndex,
      exerciseIndex
    }
  };

  // Pin System에서 드래그 권한 체크
  const effectivePin = PinSystemHelpers.getEffectivePinState(activePinState);
  const canDrag = effectivePin.canDrag;

  // useDraggable 훅 사용
  const {
    attributes,
    listeners,
    // setNodeRef,
    // transform,
    // isDragging,
  } = useDraggable({
    id: dragItem.id,
    data: dragItem,
    disabled: !canDrag
  });

  // ActiveItem 체크 - WorkoutPlanTab 패턴 따라 구현
  const exerciseKey = setSeedId ? `${setSeedId}-${exercise.exerciseTemplateId}-${exercise.order}` : `exercise-${exerciseIndex}-${exercise.exerciseTemplateId}`;
  const isActive = activeItem?.level === 'move' && activeItem.id === exerciseKey;

  // Phase 3: ExerciseEditBottomSheet 저장 핸들러
  const handleExerciseModalSave = (updatedSpec: ExerciseSpec, applyToAll: boolean) => {
    const updatedExercise = {
      ...exercise,
      spec: updatedSpec
    };

    // PRD 요구사항: 일괄 적용 토글 처리
    if (applyToAll) {
      console.log('일괄 적용 모드: 세션 내 모든 동일한 운동에 변경 사항 적용', {
        exerciseTemplateId: exercise.exerciseTemplateId,
        newSpec: updatedSpec
      });
      // 실제 구현은 상위 컴포넌트에서 전체 세션 데이터에 접근해서 처리해야 함
    }

    onUpdate(updatedExercise);
  };

  return (
    <>
      <DraggableCard
        dragItem={dragItem}
        pinState={activePinState}
        disabled={true}
        dragHandle={false}
        className={`p-3 border rounded-lg transition-colors ${
          isActive
            ? 'bg-orange-50 border-orange-300'
            : 'bg-white border-gray-200 hover:bg-gray-50'
        }`}
      >
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => onExerciseClick?.(exerciseKey)}
        >
          <div className="flex items-center">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
              isActive
                ? 'bg-orange-100 text-orange-600'
                : 'bg-blue-100 text-blue-600'
            }`}>
              <span className="text-xs font-semibold">{exercise.order + 1}</span>
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm">
                <ExerciseName exerciseTemplateId={exercise.exerciseTemplateId} />
              </p>
              <p className="text-xs text-gray-600">
                {formatExerciseSpec(exercise.spec)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* ⚙️ 설정 버튼 (편집) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExerciseModalOpen(true);
              }}
              className="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100 transition-colors text-gray-600"
              title="운동 설정"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            {/* 🗑️ 삭제 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('이 운동을 삭제하시겠습니까?')) {
                  onDelete();
                }
              }}
              className="flex items-center justify-center w-8 h-8 rounded hover:bg-red-50 transition-colors text-red-500 hover:text-red-600"
              title="운동 삭제"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>

            {/* 드래그 핸들 */}
            <button
              {...(canDrag ? { ...attributes, ...listeners } : {})}
              className="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100 transition-colors text-gray-600 cursor-grab active:cursor-grabbing"
              title="운동 이동"
              disabled={!canDrag}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        </DraggableCard>

        {/* Phase 3: ExerciseEditBottomSheet 바텀시트 - Portal로 body에 렌더링 */}
        {ReactDOM.createPortal(
          <ExerciseEditBottomSheet
            isOpen={exerciseModalOpen}
            onClose={() => setExerciseModalOpen(false)}
            exercise={exercise}
            onSave={handleExerciseModalSave}
            onDelete={onDelete}
            recentRecord={undefined}
          />,
          document.body
        )}
      </>
    );
};
