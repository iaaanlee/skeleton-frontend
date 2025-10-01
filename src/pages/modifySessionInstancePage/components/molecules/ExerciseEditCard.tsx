import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useDraggable } from '@dnd-kit/core';
import type { EffectiveExerciseBlueprint, ExerciseSpec, PinState, ActiveItem } from '../../../../types/workout';
import { PinWrapper } from '../atoms';
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
  const [isEditing, setIsEditing] = useState(false);
  const [editingSpec, setEditingSpec] = useState<ExerciseSpec>(exercise.spec);
  // PRD PAGES 요구사항: "모든 동일한 운동에 일괄 적용" 토글
  const [applyToAllSame, setApplyToAllSame] = useState(false);

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

  const handleSave = () => {
    const updatedExercise = {
      ...exercise,
      spec: editingSpec
    };

    // PRD PAGES 요구사항: 일괄 적용 토글 처리
    if (applyToAllSame) {
      // TODO: Stage 4B 고급 구현에서 세션 내 동일한 exerciseTemplateId를 가진 모든 운동에 스펙 적용
      console.log('일괄 적용 모드: 동일한 운동에 스펙 적용 예정', {
        exerciseTemplateId: exercise.exerciseTemplateId,
        newSpec: editingSpec
      });
      // 실제 구현은 상위 컴포넌트에서 전체 세션 데이터에 접근해서 처리해야 함
    }

    onUpdate(updatedExercise);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditingSpec(exercise.spec);
    setApplyToAllSame(false); // 토글도 초기화
    setIsEditing(false);
  };

  // Phase 3: ExerciseEditBottomSheet 저장 핸들러
  const handleExerciseModalSave = (updatedSpec: ExerciseSpec, applyToAll: boolean) => {
    // 기존 handleSave 패턴과 동일하게 처리
    const updatedExercise = {
      ...exercise,
      spec: updatedSpec
    };

    // PRD 요구사항: 일괄 적용 토글 처리 (기존 로직 재사용)
    if (applyToAll) {
      console.log('일괄 적용 모드: 세션 내 모든 동일한 운동에 변경 사항 적용', {
        exerciseTemplateId: exercise.exerciseTemplateId,
        newSpec: updatedSpec
      });
      // 실제 구현은 상위 컴포넌트에서 전체 세션 데이터에 접근해서 처리해야 함
    }

    // 로컬 state도 업데이트 (기존 인라인 편집과 동기화)
    setEditingSpec(updatedSpec);

    onUpdate(updatedExercise);
  };

  const updateGoal = (updates: Partial<ExerciseSpec['goal']>) => {
    setEditingSpec(prev => ({
      ...prev,
      goal: { ...prev.goal, ...updates }
    }));
  };

  const updateLoad = (updates: Partial<ExerciseSpec['load']>) => {
    setEditingSpec(prev => ({
      ...prev,
      load: { ...prev.load, ...updates }
    }));
  };

  if (!isEditing) {
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
  }

  return (
    <>
      <PinWrapper
        pinState={activePinState}
        className="bg-white p-4 border border-blue-200"
      >
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h5 className="font-medium text-gray-900">
            {exercise.exerciseTemplateId} 편집
          </h5>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCancel}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              저장
            </button>
          </div>
        </div>

        {/* Goal Settings */}
        <div className="space-y-3">
          <h6 className="text-sm font-medium text-gray-700">목표 설정</h6>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs text-gray-600 mb-1">목표 타입</label>
              <select
                value={editingSpec.goal.type}
                onChange={(e) => updateGoal({ type: e.target.value as ExerciseSpec['goal']['type'] })}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="reps">횟수</option>
                <option value="time">시간</option>
                <option value="distance">거리</option>
                <option value="weight">무게</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">기준</label>
              <select
                value={editingSpec.goal.rule}
                onChange={(e) => updateGoal({ rule: e.target.value as ExerciseSpec['goal']['rule'] })}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="exact">정확히</option>
                <option value="min">최소</option>
                <option value="max">최대</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">값</label>
              <input
                type="number"
                value={editingSpec.goal.value}
                onChange={(e) => updateGoal({ value: parseInt(e.target.value) || 0 })}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Load Settings */}
        <div className="space-y-3">
          <h6 className="text-sm font-medium text-gray-700">부하 설정</h6>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-600 mb-1">부하 타입</label>
              <select
                value={editingSpec.load.type}
                onChange={(e) => updateLoad({
                  type: e.target.value as ExerciseSpec['load']['type'],
                  value: e.target.value === 'none' ? null : editingSpec.load.value || 0,
                  text: e.target.value === 'none' ? '없음' : editingSpec.load.text
                })}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="none">없음</option>
                <option value="bodyweight">체중</option>
                <option value="weight">중량</option>
                <option value="resistance">저항</option>
              </select>
            </div>

            {editingSpec.load.type !== 'none' && (
              <div>
                <label className="block text-xs text-gray-600 mb-1">설명</label>
                <input
                  type="text"
                  value={editingSpec.load.text}
                  onChange={(e) => updateLoad({ text: e.target.value })}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="예: 10kg, 중간 저항 등"
                />
              </div>
            )}
          </div>
        </div>

        {/* Time Limit */}
        <div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="timeLimit"
              checked={editingSpec.timeLimit !== null}
              onChange={(e) => setEditingSpec(prev => ({
                ...prev,
                timeLimit: e.target.checked ? 60 : null
              }))}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label htmlFor="timeLimit" className="text-sm text-gray-700">시간 제한 설정</label>
          </div>

          {editingSpec.timeLimit !== null && (
            <div className="mt-2">
              <input
                type="number"
                value={editingSpec.timeLimit}
                onChange={(e) => setEditingSpec(prev => ({
                  ...prev,
                  timeLimit: parseInt(e.target.value) || 60
                }))}
                className="w-24 px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
              />
              <span className="ml-2 text-sm text-gray-600">초</span>
            </div>
          )}
        </div>

        {/* PRD PAGES 요구사항: 일괄 적용 토글 */}
        <div className="border-t pt-3">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="applyToAllSame"
              checked={applyToAllSame}
              onChange={(e) => setApplyToAllSame(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label htmlFor="applyToAllSame" className="text-sm text-gray-700">
              이 세션 내 모든 동일한 운동에 일괄 적용
            </label>
          </div>
          {applyToAllSame && (
            <p className="mt-1 text-xs text-gray-500">
              같은 운동({exercise.exerciseTemplateId})의 모든 강도와 목표가 함께 수정됩니다
            </p>
          )}
        </div>
      </div>

    </PinWrapper>

    {/* Phase 3: ExerciseEditBottomSheet 바텀시트 - Portal로 body에 렌더링 */}
    {ReactDOM.createPortal(
      <ExerciseEditBottomSheet
        isOpen={exerciseModalOpen}
        onClose={() => setExerciseModalOpen(false)}
        exercise={exercise}
        onSave={handleExerciseModalSave}
        onDelete={onDelete}
        recentRecord={undefined} // TODO: 실제 최근 기록 데이터 연결
      />,
      document.body
    )}
    </>
  );
};