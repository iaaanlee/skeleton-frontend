import React, { useState, useEffect } from 'react';
import { ExerciseSelectionBottomSheet, SetEditCard } from '../molecules';
import type { EffectivePartBlueprint, ModifySessionRequest, PartModification, ExerciseTemplate, EffectiveSetBlueprint, PinState, ActiveItem } from '../../../../types/workout';
import { PartDraggableCard } from '../atoms/PartDraggableCard';
import type { DragItem, PlaceholderInfo } from '../../../../hooks/useDragAndDrop';
import { ExerciseName } from '../../../sessionInstanceDetailsPage/components/molecules/ExerciseName';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { useStatePreservation } from '../../../sessionInstanceDetailsPage/hooks/useStatePreservation';
import { generatePartDragId } from '../../../../utils/dragIdGenerator';

type Props = {
  effectiveBlueprint: EffectivePartBlueprint[];
  sessionId: string;
  onChange: (changes: Partial<ModifySessionRequest>) => void;
  onActiveItemChange?: (activeItem: ActiveItem) => void;
  placeholderInfo?: PlaceholderInfo;
};


// 파트 카드 컴포넌트 Props
type PartCardProps = {
  part: EffectivePartBlueprint;
  partIndex: number;
  isExpanded: boolean;
  isActive: boolean;
  expandedSets: Set<string>;
  defaultPinState: PinState;
  activeItem: ActiveItem;
  onPartClick: (partSeedId: string) => void;
  onSetClick: (setSeedId: string) => void;
  onExerciseClick: (exerciseId: string) => void;
  onUpdateSet: (partIndex: number, setIndex: number, updatedSet: EffectiveSetBlueprint) => void;
  onDeleteSet: (partIndex: number, setIndex: number) => void;
  onAddExercise: (partIndex: number) => void;
  togglePartExpansion: (partSeedId: string) => void;
  toggleSetExpansion: (setSeedId: string) => void;
  placeholderInfo?: PlaceholderInfo;
};

// 파트 카드 컴포넌트 - WorkoutPlanEditor 외부로 이동하여 안정화
const PartCard: React.FC<PartCardProps> = ({
  part,
  partIndex,
  isExpanded,
  isActive,
  expandedSets,
  defaultPinState,
  activeItem,
  onPartClick,
  onSetClick,
  onExerciseClick,
  onUpdateSet,
  onDeleteSet,
  onAddExercise,
  togglePartExpansion,
  toggleSetExpansion,
  placeholderInfo,
}) => {
  // 드래그 재시작 플래그 (무한 루프 방지)
  const isDragRestarted = React.useRef(false);

  // 파트 DragItem 생성
  const partDragItem: DragItem = {
    id: generatePartDragId(partIndex, part.partSeedId),
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

  // Pin System에서 드래그 권한 체크
  const canDrag = true; // 파트는 항상 드래그 가능 (Pin System 미적용)

  // useDraggable 훅 사용 (SetEditCard 패턴)
  const {
    attributes,
    listeners,
    setNodeRef,
  } = useDraggable({
    id: partDragItem.id,
    data: partDragItem,
    disabled: !canDrag
  });

  // 파트 헤더 드롭존 생성 (세트 해결책과 동일한 패턴)
  type DropZone = {
    id: string;
    type: string;
    accepts: string[];
    autoExpand: boolean;
  };

  const partHeaderDropZone: DropZone = {
    id: partDragItem.id, // part-{partIndex}-{partSeedId}
    type: 'container',
    accepts: ['exercise'], // 운동만 받음 (세트/파트는 제외)
    autoExpand: false
  };

  const { setNodeRef: partHeaderDropRef, isOver: isHeaderOver } = useDroppable({
    id: partHeaderDropZone.id,
    data: partHeaderDropZone,
    disabled: isExpanded // ✨ 펼쳐져 있으면 드롭존 비활성화
  });

  // 세트 목록 영역 드롭존 (펼쳤을 때만 활성화) - SetEditCard 패턴
  const { setNodeRef: partContentDropRef, isOver: isContentOver } = useDroppable({
    id: partDragItem.id, // 같은 ID 사용
    data: {
      id: partDragItem.id,
      type: 'container',
      accepts: ['set'], // 세트만 받음
      autoExpand: false
    },
    disabled: !isExpanded // 닫혀있으면 컨텐츠 드롭존 비활성화
  });

  // 파트 요약 텍스트
  const getPartSummary = (part: EffectivePartBlueprint) => {
    const totalSets = part.sets.length;
    const exerciseTemplateIds = new Map<string, number>();

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
    <PartDraggableCard
      dragItem={partDragItem}
      pinState={defaultPinState}
      disabled={true}
      dragHandle={false}
      className={`border rounded-lg overflow-hidden transition-colors ${
        isActive
          ? 'border-orange-400 bg-orange-50'
          : 'border-gray-200 bg-white hover:bg-gray-50'
      }`}
      data-part-id={`part-${partIndex}`}
      data-collapsed={!isExpanded}
    >
      {/* Part Header */}
      <div
        ref={partHeaderDropRef}
        className={`px-4 py-4 flex items-center justify-between transition-colors ${
          isHeaderOver ? 'bg-blue-50' : ''
        }`}
      >
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
            onClick={() => onPartClick(part.partSeedId)}
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
          {/* 드래그 핸들 버튼 - SetEditCard 패턴 */}
          <button
            ref={setNodeRef}
            {...(canDrag ? { ...attributes, ...listeners } : {})}
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 cursor-grab active:cursor-grabbing"
            title="파트 이동"
            disabled={!canDrag}
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => {
              // 재시작된 이벤트면 그냥 진행 (무한 루프 방지)
              if (isDragRestarted.current) {
                isDragRestarted.current = false;
                return;
              }

              // 드래그 시작 전 모든 파트 닫기 - 순차 처리
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
              const collapseEvent = new CustomEvent('drag-start-collapse-parts');
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

      {/* Part Content (Collapsible) - 전체 영역 드롭존 */}
      {isExpanded && (
        <div ref={partContentDropRef} className="px-4 pt-4 pb-12 space-y-3">
          {part.sets.map((set, setIndex) => {
            // Placeholder 렌더링 로직: 현재 세트 이전에 삽입되어야 하는지 체크
            const shouldShowPlaceholderBefore =
              placeholderInfo &&
              placeholderInfo.containerType === 'part' &&
              placeholderInfo.containerId === partDragItem.id &&
              placeholderInfo.insertIndex === setIndex;

            return (
              <React.Fragment key={set.setSeedId}>
                {/* Placeholder: 세트 이전 위치 */}
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

                <SetEditCard
                  set={set}
                  setIndex={setIndex}
                  partIndex={partIndex}
                  parentId={partDragItem.id}
                  pinState={defaultPinState}
                  activeItem={activeItem}
                  onSetClick={onSetClick}
                  onExerciseClick={onExerciseClick}
                  onUpdateSet={(updatedSet) => onUpdateSet(partIndex, setIndex, updatedSet)}
                  onDeleteSet={() => onDeleteSet(partIndex, setIndex)}
                  onAddExercise={() => onAddExercise(partIndex)}
                  isExpanded={expandedSets.has(set.setSeedId)}
                  onToggle={toggleSetExpansion}
                  placeholderInfo={placeholderInfo}
                />
              </React.Fragment>
            );
          })}

          {/* Placeholder: 마지막 세트 이후 위치 */}
          {placeholderInfo &&
            placeholderInfo.containerType === 'part' &&
            placeholderInfo.containerId === partDragItem.id &&
            placeholderInfo.insertIndex === part.sets.length && (
            <div
              className="h-1 bg-blue-400 rounded relative my-2 transition-all duration-200 ease-in-out"
              data-placeholder="true"
            >
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-2 bg-blue-100 border-2 border-dashed border-blue-400 rounded-lg whitespace-nowrap pointer-events-none">
                <span className="text-blue-600 text-sm font-medium">여기에 삽입</span>
              </div>
            </div>
          )}

          {/* 빈 파트에서도 placeholder 표시 */}
          {part.sets.length === 0 &&
            placeholderInfo &&
            placeholderInfo.containerType === 'part' &&
            placeholderInfo.containerId === partDragItem.id &&
            placeholderInfo.insertIndex === 0 && (
            <div
              className="h-24 bg-blue-100 border-2 border-dashed border-blue-400 rounded-lg flex items-center justify-center transition-all duration-200 ease-in-out"
              style={{ opacity: 0.8 }}
            >
              <span className="text-blue-600 text-sm font-medium">여기에 삽입</span>
            </div>
          )}

          {part.sets.length === 0 &&
            !(placeholderInfo &&
              placeholderInfo.containerType === 'part' &&
              placeholderInfo.containerId === partDragItem.id &&
              placeholderInfo.insertIndex === 0) && (
            <div className="text-center py-6 text-gray-500">
              <p>이 파트에는 세트가 없습니다.</p>
              <p className="text-sm text-gray-400 mt-2">우하단 + 버튼으로 운동을 추가하세요</p>
            </div>
          )}
        </div>
      )}
    </PartDraggableCard>
  );
};

export const WorkoutPlanEditor: React.FC<Props> = ({ effectiveBlueprint, sessionId, onChange, onActiveItemChange, placeholderInfo }) => {
  // 토글 상태 인계 시스템 적용
  const { expandedParts, expandedSets, togglePartExpansion, toggleSetExpansion, initializeToggleStates, collapseAllParts, collapseAllSets } = useStatePreservation(sessionId);

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

  // 자동 펼침 이벤트 리스너 연결
  useEffect(() => {
    const handleAutoExpand = (event: CustomEvent) => {
      const { partId } = event.detail;
      console.log('자동 펼침 이벤트 수신:', partId);

      // part-{index} 형태의 ID에서 실제 partSeedId 찾기
      // partId는 "part-{partIndex}-{partSeedId}" 형태
      const parts = partId.split('-');
      const partIndex = parts[1] ? parseInt(parts[1]) : NaN;

      if (!isNaN(partIndex) && partIndex >= 0 && partIndex < effectiveBlueprint.length) {
        const partSeedId = effectiveBlueprint[partIndex].partSeedId;

        // 현재 펼침 상태 확인 후 닫혀있으면 펼치기
        if (!expandedParts.has(partSeedId)) {
          console.log('닫힌 파트 자동 펼침:', partSeedId);
          togglePartExpansion(partSeedId);
        }
      }
    };

    document.addEventListener('auto-expand-part', handleAutoExpand as EventListener);

    return () => {
      document.removeEventListener('auto-expand-part', handleAutoExpand as EventListener);
    };
  }, [effectiveBlueprint, expandedParts, togglePartExpansion]);

  // 세트 자동 펼침 이벤트 리스너 연결
  useEffect(() => {
    const handleAutoExpandSet = (event: CustomEvent) => {
      const { setSeedId } = event.detail;
      console.log('세트 자동 펼침 이벤트 수신:', setSeedId);

      // 현재 펼침 상태 확인 후 닫혀있으면 펼치기
      if (!expandedSets.has(setSeedId)) {
        console.log('닫힌 세트 자동 펼침:', setSeedId);
        toggleSetExpansion(setSeedId);
      }
    };

    document.addEventListener('auto-expand-set', handleAutoExpandSet as EventListener);

    return () => {
      document.removeEventListener('auto-expand-set', handleAutoExpandSet as EventListener);
    };
  }, [expandedSets, toggleSetExpansion]);

  // 🆕 별도 기능: 세트 드래그 시작 시 모든 세트 닫기 이벤트 리스너
  useEffect(() => {
    const handleCollapseAllSets = () => {
      console.log('세트 드래그 시작: 모든 세트 닫기');
      collapseAllSets();
    };

    document.addEventListener('drag-start-collapse-sets', handleCollapseAllSets);

    return () => {
      document.removeEventListener('drag-start-collapse-sets', handleCollapseAllSets);
    };
  }, [collapseAllSets]);

  // 🆕 별도 기능: 파트 드래그 시작 시 모든 파트 닫기 이벤트 리스너
  useEffect(() => {
    const handleCollapseAllParts = () => {
      console.log('파트 드래그 시작: 모든 파트 닫기');
      collapseAllParts();
    };

    document.addEventListener('drag-start-collapse-parts', handleCollapseAllParts);

    return () => {
      document.removeEventListener('drag-start-collapse-parts', handleCollapseAllParts);
    };
  }, [collapseAllParts]);

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
    const newActiveItem = { level: 'part' as const, id: partSeedId };
    setActiveItem(newActiveItem);
    onActiveItemChange?.(newActiveItem);
  };

  const handleSetClick = (setSeedId: string) => {
    const newActiveItem = { level: 'set' as const, id: setSeedId };
    setActiveItem(newActiveItem);
    onActiveItemChange?.(newActiveItem);
  };

  const handleExerciseClick = (exerciseId: string) => {
    const newActiveItem = { level: 'move' as const, id: exerciseId };
    setActiveItem(newActiveItem);
    onActiveItemChange?.(newActiveItem);
  };

  const handleAddExercise = (partIndex: number) => {
    setSelectedPartIndex(partIndex);
    setShowExerciseSelection(true);
  };

  const handleExerciseSelected = (exercise: ExerciseTemplate) => {
    console.log('Selected exercise:', exercise.exerciseName, 'for part:', selectedPartIndex);

    if (selectedPartIndex === null || selectedPartIndex >= effectiveBlueprint.length) {
      console.error('유효하지 않은 파트 인덱스');
      setShowExerciseSelection(false);
      setSelectedPartIndex(null);
      return;
    }

    // 새로운 blueprint 생성 (immutable update)
    const newBlueprint = [...effectiveBlueprint];
    const targetPart = { ...newBlueprint[selectedPartIndex] };

    // 첫 번째 세트가 없으면 생성
    if (targetPart.sets.length === 0) {
      targetPart.sets = [{
        setBlueprintId: null,
        setSeedId: `set-${Date.now()}`,
        order: 1,
        restTime: 60,
        timeLimit: null,
        exercises: []
      }];
    }

    // 첫 번째 세트에 운동 추가
    const targetSet = { ...targetPart.sets[0] };
    targetSet.exercises = [...targetSet.exercises, {
      exerciseTemplateId: exercise._id,
      order: targetSet.exercises.length + 1,
      spec: {
        goal: {
          type: 'reps',
          value: 10,
          rule: 'exact'
        },
        load: {
          type: 'bodyweight',
          value: null,
          text: ''
        },
        timeLimit: null
      }
    }];

    targetPart.sets[0] = targetSet;
    newBlueprint[selectedPartIndex] = targetPart;

    // partModifications 형태로 변경 알림 (실제 API 호출은 향후 구현)
    console.log('✅ 운동 추가 완료 - 향후 API 연동 예정:', exercise.exerciseName);

    // 임시로 effectiveBlueprint 직접 업데이트 (개발 테스트용)
    // 실제로는 partModifications를 통해 백엔드 호출해야 함
    effectiveBlueprint[selectedPartIndex] = targetPart;

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">운동 계획</h2>
      </div>

      <div className="space-y-3">
        {effectiveBlueprint.map((part, partIndex) => {
          const isActive = activeItem?.level === 'part' && activeItem.id === part.partSeedId;
          const isExpanded = expandedParts.has(part.partSeedId);

          // Session-level placeholder 체크
          const shouldShowPlaceholderBefore =
            placeholderInfo &&
            placeholderInfo.containerType === 'session' &&
            placeholderInfo.insertIndex === partIndex;

          return (
            <React.Fragment key={part.partSeedId}>
              {/* Session-level Placeholder: 파트 이전 위치 */}
              {shouldShowPlaceholderBefore && (
                <div
                  className="h-32 bg-blue-100 border-2 border-dashed border-blue-400 rounded-lg flex items-center justify-center transition-all duration-200 ease-in-out"
                  style={{ opacity: 0.8 }}
                >
                  <span className="text-blue-600 text-sm font-medium">여기에 파트 삽입</span>
                </div>
              )}

              <PartCard
                part={part}
                partIndex={partIndex}
                isExpanded={isExpanded}
                isActive={isActive}
                expandedSets={expandedSets}
                defaultPinState={defaultPinState}
                activeItem={activeItem}
                onPartClick={handlePartClick}
                onSetClick={handleSetClick}
                onExerciseClick={handleExerciseClick}
                onUpdateSet={handleUpdateSet}
                onDeleteSet={handleDeleteSet}
                onAddExercise={handleAddExercise}
                togglePartExpansion={togglePartExpansion}
                toggleSetExpansion={toggleSetExpansion}
                placeholderInfo={placeholderInfo}
              />
            </React.Fragment>
          );
        })}

        {/* Session-level Placeholder: 마지막 파트 이후 위치 */}
        {placeholderInfo &&
          placeholderInfo.containerType === 'session' &&
          placeholderInfo.insertIndex === effectiveBlueprint.length && (
          <div
            className="h-32 bg-blue-100 border-2 border-dashed border-blue-400 rounded-lg flex items-center justify-center transition-all duration-200 ease-in-out"
            style={{ opacity: 0.8 }}
          >
            <span className="text-blue-600 text-sm font-medium">여기에 파트 삽입</span>
          </div>
        )}

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