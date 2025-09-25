import React, { useState } from 'react';
import { ExerciseEditCard } from './ExerciseEditCard';
import type { EffectiveSetBlueprint, EffectiveExerciseBlueprint, PinState } from '../../../../types/workout';
import { DraggableCard } from '../atoms/DraggableCard';
import { SortableContainer } from '../atoms/SortableContainer';
import { SortableItem } from '../atoms/SortableItem';
import type { DragItem, DropZone } from '../../../../hooks/useDragAndDrop';
import { PinSystemHelpers } from '../../../../types/workout';

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
};

export const SetEditCard: React.FC<Props> = ({
  set,
  setIndex,
  pinState,
  onUpdateSet,
  onDeleteSet,
  onAddExercise,
  partIndex,
  parentId
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [editingRestTime, setEditingRestTime] = useState(set.restTime);
  const [editingTimeLimit, setEditingTimeLimit] = useState(set.timeLimit);
  // PRD PAGES 요구사항: "동일 세트 패턴 일괄 적용" 토글
  const [applyToSimilarSets, setApplyToSimilarSets] = useState(false);

  // Default Pin State (no pins active)
  const defaultPinState: PinState = {
    sessionPin: false,
    partPin: false,
    setPin: false,
    exercisePin: false
  };
  const activePinState = pinState || defaultPinState;

  // DragItem 생성 (세트용)
  const dragItem: DragItem = {
    id: `set-${setIndex}`,
    type: 'set',
    data: {
      name: `세트 ${set.order}`,
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

  // 세트 내부 운동 드롭존
  const exerciseDropZone: DropZone = {
    id: `set-${setIndex}-exercises`,
    type: 'container',
    accepts: ['exercise'],
    autoExpand: false
  };

  // Pin System에서 드래그 권한 체크
  const effectivePin = PinSystemHelpers.getEffectivePinState(activePinState);
  const canDrag = effectivePin.canDrag;

  // Sortable 운동 목록 생성 (ID 배열)
  const exerciseIds = set.exercises.map((_, index) =>
    `exercise-${setIndex}-${index}`
  );

  const handleSaveSettings = () => {
    const updatedSet = {
      ...set,
      restTime: editingRestTime,
      timeLimit: editingTimeLimit
    };

    // PRD PAGES 요구사항: 일괄 적용 토글 처리
    if (applyToSimilarSets) {
      // TODO: Stage 4B 고급 구현에서 세션 내 유사한 패턴의 세트들에 설정 적용
      console.log('일괄 적용 모드: 유사한 세트에 설정 적용 예정', {
        restTime: editingRestTime,
        timeLimit: editingTimeLimit,
        exerciseCount: set.exercises.length
      });
      // 실제 구현은 상위 컴포넌트에서 전체 세션 데이터에 접근해서 처리해야 함
    }

    onUpdateSet(updatedSet);
    setIsEditingSettings(false);
  };

  const handleCancelSettings = () => {
    setEditingRestTime(set.restTime);
    setEditingTimeLimit(set.timeLimit);
    setApplyToSimilarSets(false); // 토글도 초기화
    setIsEditingSettings(false);
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
    <DraggableCard
      dragItem={dragItem}
      pinState={activePinState}
      disabled={!canDrag}
      className="bg-gray-50 p-3 rounded-lg"
    >
      {/* Set Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <svg
              className={`w-5 h-5 text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div>
            <h4 className="font-medium text-gray-900">
              세트 {set.order}
            </h4>
            <p className="text-sm text-gray-600">
              {set.exercises.length}개 운동
              {set.restTime > 0 && (
                <span className="ml-2">
                  • 휴식: {Math.floor(set.restTime / 60)}분 {set.restTime % 60}초
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* ::1.png 참조 - 이동 버튼 (햄버거 메뉴) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              // TODO: 이동 액션 메뉴 또는 드래그 모드 시작
              console.log('🔄 세트 이동 버튼 클릭:', dragItem);
            }}
            className="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100 transition-colors text-gray-600"
            title="세트 이동"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            </svg>
          </button>

          {/* 기존 버튼들 - 축소하여 유지 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditingSettings(!isEditingSettings);
            }}
            className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
          >
            {isEditingSettings ? '취소' : '설정'}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteSet();
            }}
            className="flex items-center justify-center w-8 h-8 rounded hover:bg-red-100 transition-colors text-red-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Set Settings Editor */}
      {isEditingSettings && (
        <div className="bg-white rounded-lg p-3 mb-3 border">
          <div className="space-y-3">
            <h5 className="text-sm font-medium text-gray-900">세트 설정</h5>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">휴식 시간 (초)</label>
                <input
                  type="number"
                  value={editingRestTime}
                  onChange={(e) => setEditingRestTime(parseInt(e.target.value) || 0)}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">시간 제한 (초, 선택사항)</label>
                <input
                  type="number"
                  value={editingTimeLimit || ''}
                  onChange={(e) => setEditingTimeLimit(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                  placeholder="제한 없음"
                />
              </div>
            </div>

            {/* PRD PAGES 요구사항: 일괄 적용 토글 */}
            <div className="border-t pt-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="applyToSimilarSets"
                  checked={applyToSimilarSets}
                  onChange={(e) => setApplyToSimilarSets(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor="applyToSimilarSets" className="text-sm text-gray-700">
                  이 세션 내 동일 세트 패턴 일괄 적용
                </label>
              </div>
              {applyToSimilarSets && (
                <p className="mt-1 text-xs text-gray-500">
                  비슷한 구성의 세트들({set.exercises.length}개 운동)에 동일한 휴식/제한시간이 적용됩니다
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCancelSettings}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleSaveSettings}
                className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exercises List */}
      {isExpanded && set.exercises.length > 0 && (
        <SortableContainer
          items={exerciseIds}
          dropZone={exerciseDropZone}
          strategy="vertical"
          className="space-y-2"
          showDropIndicator={true}
        >
          {set.exercises.map((exercise, exerciseIndex) => (
            <SortableItem
              key={exerciseIds[exerciseIndex]}
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
              disabled={!canDrag}
            >
              <ExerciseEditCard
                exercise={exercise}
                exerciseIndex={exerciseIndex}
                pinState={activePinState}
                onUpdate={(updatedExercise) => handleUpdateExercise(exerciseIndex, updatedExercise)}
                onDelete={() => handleDeleteExercise(exerciseIndex)}
                partIndex={partIndex}
                setIndex={setIndex}
                parentId={dragItem.id}
              />
            </SortableItem>
          ))}
        </SortableContainer>
      )}

      {set.exercises.length === 0 && (
        <div className="text-center py-4 text-gray-500 bg-white rounded-lg border border-dashed">
          <p className="text-sm">이 세트에는 운동이 없습니다.</p>
          <p className="text-xs text-gray-400 mt-1">우하단 + 버튼으로 운동을 추가하세요</p>
        </div>
      )}

    </DraggableCard>
  );
};