import React, { useState, useEffect } from 'react';
import { ExerciseSelectionBottomSheet, SetEditCard } from '../molecules';
import type { EffectivePartBlueprint, ModifySessionRequest, PartModification, ExerciseTemplate, EffectiveSetBlueprint, PinState, ActiveItem } from '../../../../types/workout';
import { DraggableCard } from '../atoms';
import type { DragItem } from '../../../../hooks/useDragAndDrop';
import { ExerciseName } from '../../../sessionInstanceDetailsPage/components/molecules/ExerciseName';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useStatePreservation } from '../../../sessionInstanceDetailsPage/hooks/useStatePreservation';

type Props = {
  effectiveBlueprint: EffectivePartBlueprint[];
  sessionId: string;
  onChange: (changes: Partial<ModifySessionRequest>) => void;
};

// 파트 드래그 버튼 컴포넌트 (인라인)
const PartDragButton: React.FC<{ partDragItem: DragItem }> = ({ partDragItem }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: partDragItem.id,
    data: partDragItem,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 cursor-grab active:cursor-grabbing"
      title="파트 이동"
      onClick={(e) => e.stopPropagation()}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  );
};

export const WorkoutPlanEditor: React.FC<Props> = ({ effectiveBlueprint, sessionId, onChange }) => {
  // 토글 상태 인계 시스템 적용
  const { expandedParts, expandedSets, togglePartExpansion, toggleSetExpansion, initializeToggleStates } = useStatePreservation(sessionId);

  const [activeItem, setActiveItem] = useState<ActiveItem>(null);
  // TODO: pendingModifications will be used in state management phase
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pendingModifications, setPendingModifications] = useState<PartModification[]>([]);

  // 첫 파트와 첫 세트 자동 펼치기 초기화
  useEffect(() => {
    if (effectiveBlueprint.length > 0) {
      const firstPartId = effectiveBlueprint[0].partSeedId;
      const firstSetId = effectiveBlueprint[0].sets.length > 0
        ? effectiveBlueprint[0].sets[0].setSeedId
        : undefined;
      initializeToggleStates(firstPartId, firstSetId);
    }
  }, [effectiveBlueprint, initializeToggleStates]);

  // Default Pin State (no pins active) - will be replaced with actual Pin detection in next phase
  const defaultPinState: PinState = {
    sessionPin: false,
    partPin: false,
    setPin: false,
    exercisePin: false
  };

  // Suppress unused variable warning - will be used in state management implementation
  void setPendingModifications;
  const [showExerciseSelection, setShowExerciseSelection] = useState(false);
  const [selectedPartIndex, setSelectedPartIndex] = useState<number | null>(null);

  // togglePartExpansion은 useStatePreservation에서 가져옴

  // ActiveItem 핸들러들 추가
  const handlePartClick = (partSeedId: string) => {
    setActiveItem({ level: 'part', id: partSeedId });
  };

  const handleSetClick = (setSeedId: string) => {
    setActiveItem({ level: 'set', id: setSeedId });
  };

  const handleExerciseClick = (exerciseId: string) => {
    setActiveItem({ level: 'move', id: exerciseId });
  };

  const handleAddExercise = (partIndex: number) => {
    setSelectedPartIndex(partIndex);
    setShowExerciseSelection(true);
  };

  const handleExerciseSelected = (exercise: ExerciseTemplate) => {
    console.log('Selected exercise:', exercise.exerciseName, 'for part:', selectedPartIndex);
    // For now, just show an alert. The actual modification logic will be implemented in the next task
    alert(`"${exercise.exerciseName}" 운동이 선택되었습니다. 실제 추가 기능은 다음 단계에서 구현됩니다.`);
    setShowExerciseSelection(false);
    setSelectedPartIndex(null);
  };

  const handleCloseExerciseSelection = () => {
    setShowExerciseSelection(false);
    setSelectedPartIndex(null);
  };

  const handleUpdateSet = (partIndex: number, setIndex: number, updatedSet: EffectiveSetBlueprint) => {
    console.log('Updating set:', partIndex, setIndex, updatedSet);
    // For now, just log. The actual modification logic will be implemented in state management
    alert('세트 수정 기능은 상태 관리 구현 후 활성화됩니다.');
  };

  const handleDeleteSet = (partIndex: number, setIndex: number) => {
    console.log('Deleting set:', partIndex, setIndex);
    alert('세트 삭제 기능은 상태 관리 구현 후 활성화됩니다.');
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAddSet = (partIndex: number) => {
    console.log('Adding set to part:', partIndex);
    alert('세트 추가 기능은 상태 관리 구현 후 활성화됩니다.');
  };

  // 파트 헤더 요약 텍스트를 위한 유틸리티 함수들
  const getPartSummary = (part: EffectivePartBlueprint) => {
    const totalSets = part.sets.length;
    const exerciseTemplateIds = new Map<string, number>();

    // 각 운동별로 등장 횟수 카운트
    part.sets.forEach(set => {
      set.exercises.forEach(exercise => {
        const templateId = exercise.exerciseTemplateId.toString();
        exerciseTemplateIds.set(templateId, (exerciseTemplateIds.get(templateId) || 0) + 1);
      });
    });

    return {
      totalSets,
      exerciseTemplateIds
    };
  };

  // 파트 요약을 렌더링하는 컴포넌트
  const PartSummaryText: React.FC<{ part: EffectivePartBlueprint }> = ({ part }) => {
    const { totalSets, exerciseTemplateIds } = getPartSummary(part);

    if (exerciseTemplateIds.size === 0) {
      return <span>총 {totalSets}세트</span>;
    }

    return (
      <span>
        총 {totalSets}세트 · {' '}
        {Array.from(exerciseTemplateIds.entries()).map(([templateId, count], index) => (
          <span key={templateId}>
            {index > 0 && ', '}
            <ExerciseName exerciseTemplateId={templateId} /> x {count}
          </span>
        ))}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">운동 계획</h2>
      </div>

      <div className="space-y-3">
        {effectiveBlueprint.map((part, partIndex) => {
          // 파트 DragItem 생성
          const partDragItem: DragItem = {
            id: `part-${partIndex}`,
            type: 'part',
            data: {
              name: part.partName,
              part: part,
              partIndex: partIndex
            },
            pinState: defaultPinState,
            parentId: 'session',
            level: 'part',
            indices: {
              partIndex
            }
          };

          // ActiveItem 체크
          const isActive = activeItem?.level === 'part' && activeItem.id === part.partSeedId;
          const isExpanded = expandedParts.has(part.partSeedId);

          return (
            <DraggableCard
              key={part.partSeedId}
              dragItem={partDragItem}
              pinState={defaultPinState}
              className={`bg-white border rounded-lg transition-all duration-200 ${
                isActive ? 'border-orange-400 shadow-md' : 'border-gray-200'
              }`}
              disabled={true}
            >
            {/* Part Header */}
            <div className="px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => togglePartExpansion(part.partSeedId)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
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
                  className="flex items-center flex-1 cursor-pointer"
                  onClick={() => handlePartClick(part.partSeedId)}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    isActive ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <span className="text-sm font-semibold">{partIndex + 1}</span>
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">{part.partName}</h3>
                    <p className="text-sm text-gray-500">
                      <PartSummaryText part={part} />
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {/* <button
                  className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
                  title="파트 설정"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button> */}
                <PartDragButton partDragItem={partDragItem} />
              </div>
            </div>

            {/* Part Content (Collapsible) */}
            {isExpanded && (
              <div className="p-4 space-y-3">
                {part.sets.map((set, setIndex) => (
                  <SetEditCard
                    key={set.setSeedId}
                    set={set}
                    setIndex={setIndex}
                    partIndex={partIndex}
                    parentId={partDragItem.id}
                    pinState={defaultPinState}
                    activeItem={activeItem}
                    onSetClick={handleSetClick}
                    onExerciseClick={handleExerciseClick}
                    onUpdateSet={(updatedSet) => handleUpdateSet(partIndex, setIndex, updatedSet)}
                    onDeleteSet={() => handleDeleteSet(partIndex, setIndex)}
                    onAddExercise={() => handleAddExercise(partIndex)}
                    isExpanded={expandedSets.has(set.setSeedId)}
                    onToggle={toggleSetExpansion}
                  />
                ))}

                {part.sets.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    <p>이 파트에는 세트가 없습니다.</p>
                    <p className="text-sm text-gray-400 mt-2">우하단 + 버튼으로 운동을 추가하세요</p>
                  </div>
                )}
              </div>
            )}
            </DraggableCard>
          );
        })}

        {effectiveBlueprint.length === 0 && (
          <div className="bg-white rounded-lg border p-8 text-center">
            <div className="text-gray-500 mb-4">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <p className="text-gray-600 mb-2">이 세션에는 운동 계획이 없습니다.</p>
            <p className="text-sm text-gray-400">우하단 + 버튼으로 운동을 추가하세요</p>
          </div>
        )}
      </div>

      {/* Exercise Selection Bottom Sheet */}
      <ExerciseSelectionBottomSheet
        isOpen={showExerciseSelection}
        onClose={handleCloseExerciseSelection}
        onSelectExercise={handleExerciseSelected}
      />
    </div>
  );
};