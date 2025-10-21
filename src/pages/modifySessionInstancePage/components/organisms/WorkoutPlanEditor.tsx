import React, { useState, useEffect } from 'react';
import { ExerciseSelectionBottomSheet, SetEditCard } from '../molecules';
import type {
  EffectivePartBlueprint,
  EditablePartBlueprint,
  ExerciseTemplate,
  EffectiveSetBlueprint,
  PinState,
  ActiveItem,
  ExerciseSpec
} from '../../../../types/workout';
import { SortableItem } from '../atoms/SortableItem';
import type { DragItem, PlaceholderInfo } from '../../../../hooks/useDragAndDrop';
import { ExerciseName } from '../../../sessionInstanceDetailsPage/components/molecules/ExerciseName';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useStatePreservation } from '../../../sessionInstanceDetailsPage/hooks/useStatePreservation';
import { generatePartDragId, generateSetDragId } from '../../../../utils/dragIdGenerator';
import { useDragHandleOffset } from '../../../../hooks/useDragHandleOffset';
import { DEFAULT_SET_VALUES } from '../../../../constants/workoutDefaults';

type Props = {
  // 🆕 Day 3: editable state를 받음 (editable 대신)
  editable: EditablePartBlueprint[];
  sessionId: string;
  onActiveItemChange?: (activeItem: ActiveItem) => void;
  placeholderInfo?: PlaceholderInfo;
  // 🆕 Day 2-3: Editable State Update Functions
  onUpdateExerciseSpec?: (partIndex: number, setIndex: number, exerciseIndex: number, spec: ExerciseSpec) => void;
  onUpdateSetProperties?: (partIndex: number, setIndex: number, properties: { restTime?: number; timeLimit?: number | null }) => void;
  onUpdatePartName?: (partIndex: number, partName: string) => void;
  onAddExercise?: (partIndex: number, setIndex: number, exercise: Omit<import('../../../../types/workout').EditableExerciseBlueprint, '_isModified' | '_originalOrder'>) => void;
  onDeleteExercise?: (partIndex: number, setIndex: number, exerciseIndex: number) => void;
  onAddSet?: (partIndex: number, set: Omit<import('../../../../types/workout').EditableSetBlueprint, '_isModified' | '_originalOrder'>) => void;
  onDeleteSet?: (partIndex: number, setIndex: number) => void;
  onAddPart?: (part: Omit<EditablePartBlueprint, '_isModified' | '_originalOrder'>) => void;
  onDeletePart?: (partIndex: number) => void;
  onUpdateExerciseOrder?: (partIndex: number, setIndex: number, exerciseIndex: number, newOrder: number) => void;
};


// Drag Handle Props type
type DragHandleProps = {
  setActivatorNodeRef: (element: HTMLElement | null) => void;
  listeners: Record<string, Function> | undefined;
  attributes: Record<string, any>;
};

// 파트 카드 컴포넌트 Props
type PartCardProps = {
  part: EditablePartBlueprint;
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
  onDeleteExercise?: (partIndex: number, setIndex: number, exerciseIndex: number) => void;
  onDeletePart?: (partIndex: number) => void;
  onAddExercise: (partIndex: number) => void;
  onAddSet?: (partIndex: number, set: Omit<import('../../../../types/workout').EditableSetBlueprint, '_isModified' | '_originalOrder'>) => void;
  togglePartExpansion: (partSeedId: string) => void;
  toggleSetExpansion: (setSeedId: string) => void;
  placeholderInfo?: PlaceholderInfo;
  // Drag Handle Props (from SortableItem render props)
  dragHandleProps?: DragHandleProps;
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
  onDeleteExercise,
  onDeletePart,
  onAddExercise,
  onAddSet,
  togglePartExpansion,
  toggleSetExpansion,
  placeholderInfo,
  dragHandleProps,
}) => {
  // 드래그 재시작 플래그 (무한 루프 방지)
  const isDragRestarted = React.useRef(false);

  // 🆕 드래그 핸들 offset 설정 hook
  const setDragHandleOffset = useDragHandleOffset();

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

  // Sortable 세트 목록 생성 (ID 충돌 방지를 위한 고유 ID) - Exercise 패턴
  const setIds = part.sets.map((set, index) =>
    generateSetDragId(partIndex, index, set.setSeedId)
  );

  // ❌ useDraggable 제거: SortableItem이 드래그 처리함 (SetEditCard 패턴)

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
    accepts: ['exercise', 'set'], // 운동과 세트 모두 받음
    autoExpand: false
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { setNodeRef: _partHeaderDropRef, isOver: _isHeaderOver } = useDroppable({
    id: partHeaderDropZone.id,
    data: partHeaderDropZone,
    disabled: true // ✅ 항상 비활성화: 파트 활성화 클릭이 작동하도록 함
  });

  // 세트 목록 영역 드롭존 (펼쳤을 때만 활성화) - SetEditCard 패턴
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { setNodeRef: partContentDropRef, isOver: _isContentOver } = useDroppable({
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

  const handleDeletePart = () => {
    if (window.confirm('이 파트를 삭제하시겠습니까? 포함된 모든 세트와 운동이 함께 삭제됩니다.')) {
      onDeletePart?.(partIndex);
    }
  };

  return (
    <div
      className={`border rounded-lg overflow-hidden transition-colors ${
        isActive
          ? 'border-orange-400 bg-orange-50'
          : 'border-gray-200 bg-white hover:bg-gray-50'
      }`}
      data-part-id={`part-${partIndex}`}
      data-collapsed={!isExpanded}
      data-drag-id={partDragItem.id}
    >
      {/* Part Header */}
      <div
        className={`px-4 py-4 flex items-center justify-between transition-colors`}
      >
        <div className="flex items-center space-x-3 flex-1">
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
            onPointerDown={(e) => {
              // ✅ @dnd-kit 센서보다 먼저 이벤트 캡처
              e.stopPropagation();
            }}
            onClick={() => {
              onPartClick(part.partSeedId);
            }}
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
        <div className="flex items-center space-x-1">
          {/* 🗑️ 삭제 버튼 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeletePart();
            }}
            className="flex items-center justify-center w-8 h-8 rounded hover:bg-red-50 transition-colors text-red-500 hover:text-red-600"
            title="파트 삭제"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>

          {/* 드래그 핸들 버튼 (SortableItem activator 적용) */}
          <button
            ref={dragHandleProps?.setActivatorNodeRef}
            {...(dragHandleProps?.attributes || {})}
            {...(dragHandleProps?.listeners || {})}
            className="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100 transition-colors text-gray-600 cursor-grab active:cursor-grabbing"
            title="파트 이동"
            disabled={!canDrag}
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

                  // ✅ collapse 후 실제 위치 기준으로 offset 계산 (마우스 위치에 정확히 고정)
                  const rect = target.getBoundingClientRect();
                  const handleCenterX = rect.left + rect.width / 2;
                  const handleCenterY = rect.top + rect.height / 2;
                  const offsetX = savedEvent.clientX - handleCenterX;
                  const offsetY = savedEvent.clientY - handleCenterY;

                  // Context로 전달
                  setDragHandleOffset(offsetX, offsetY);

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
          <SortableContext items={setIds} strategy={verticalListSortingStrategy}>
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

                  <SortableItem
                    sortableId={setIds[setIndex]}
                    dragItem={{
                      id: setIds[setIndex],
                      type: 'set',
                      data: {
                        name: `세트 ${setIndex + 1}`,
                        set: set,
                        setIndex: setIndex
                      },
                      pinState: defaultPinState,
                      parentId: partDragItem.id,
                      level: 'set',
                      indices: {
                        partIndex,
                        setIndex
                      }
                    }}
                    pinState={defaultPinState}
                    disabled={false}
                    useDragHandle={true}
                  >
                    {(dragHandleProps) => (
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
                        onDeleteExercise={(exerciseIndex) => onDeleteExercise?.(partIndex, setIndex, exerciseIndex)}
                        onAddExercise={() => onAddExercise(partIndex)}
                        isExpanded={expandedSets.has(set.setSeedId)}
                        onToggle={toggleSetExpansion}
                        placeholderInfo={placeholderInfo}
                        dragHandleProps={dragHandleProps}
                      />
                    )}
                  </SortableItem>
                </React.Fragment>
              );
            })}
          </SortableContext>

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
              <p className="text-sm text-gray-400 mt-2">아래 버튼으로 세트를 추가하세요</p>
            </div>
          )}

          {/* 세트 추가 버튼 */}
          <button
            onClick={() => {
              if (onAddSet) {
                onAddSet(partIndex, {
                  setBlueprintId: null,
                  setSeedId: `set-${Date.now()}`,
                  order: part.sets.length,
                  restTime: DEFAULT_SET_VALUES.REST_TIME,
                  timeLimit: DEFAULT_SET_VALUES.TIME_LIMIT,
                  exercises: []
                });
              }
            }}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="font-medium">세트 추가하기</span>
          </button>
        </div>
      )}
    </div>
  );
};

export const WorkoutPlanEditor: React.FC<Props> = ({
  editable,
  sessionId,
  onActiveItemChange,
  placeholderInfo,
  onUpdateExerciseSpec,
  onUpdateSetProperties,
  onUpdatePartName,
  onAddExercise,
  onDeleteExercise,
  onAddSet,
  onDeleteSet,
  onAddPart,
  onDeletePart,
  onUpdateExerciseOrder
}) => {
  // 토글 상태 인계 시스템 적용
  const { expandedParts, expandedSets, togglePartExpansion, toggleSetExpansion, initializeToggleStates, collapseAllParts, collapseAllSets } = useStatePreservation(sessionId);

  const [activeItem, setActiveItem] = useState<ActiveItem>(null);

  // 첫 파트와 첫 세트 자동 펼치기 초기화
  useEffect(() => {
    if (editable.length > 0) {
      const firstPartId = editable[0].partSeedId;
      const firstSetId = editable[0].sets.length > 0
        ? editable[0].sets[0].setSeedId
        : undefined;
      initializeToggleStates(firstPartId, firstSetId);
    }
  }, [editable, initializeToggleStates]);

  // 자동 펼침 이벤트 리스너 연결
  useEffect(() => {
    const handleAutoExpand = (event: CustomEvent) => {
      const { partId } = event.detail;

      // part-{index} 형태의 ID에서 실제 partSeedId 찾기
      // partId는 "part-{partIndex}-{partSeedId}" 형태
      const parts = partId.split('-');
      const partIndex = parts[1] ? parseInt(parts[1]) : NaN;

      if (!isNaN(partIndex) && partIndex >= 0 && partIndex < editable.length) {
        const partSeedId = editable[partIndex].partSeedId;

        // 현재 펼침 상태 확인 후 닫혀있으면 펼치기
        if (!expandedParts.has(partSeedId)) {
          togglePartExpansion(partSeedId);
        }
      }
    };

    document.addEventListener('auto-expand-part', handleAutoExpand as EventListener);

    return () => {
      document.removeEventListener('auto-expand-part', handleAutoExpand as EventListener);
    };
  }, [editable, expandedParts, togglePartExpansion]);

  // 세트 자동 펼침 이벤트 리스너 연결
  useEffect(() => {
    const handleAutoExpandSet = (event: CustomEvent) => {
      const { setSeedId } = event.detail;

      // 현재 펼침 상태 확인 후 닫혀있으면 펼치기
      if (!expandedSets.has(setSeedId)) {
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
      collapseAllParts();
    };

    document.addEventListener('drag-start-collapse-parts', handleCollapseAllParts);

    return () => {
      document.removeEventListener('drag-start-collapse-parts', handleCollapseAllParts);
    };
  }, [collapseAllParts]);

  // 🆕 드래그 시작 시 활성화 해제 이벤트 리스너
  useEffect(() => {
    const handleClearActive = () => {
      setActiveItem(null);
      onActiveItemChange?.(null);
    };

    document.addEventListener('drag-start-clear-active', handleClearActive);

    return () => {
      document.removeEventListener('drag-start-clear-active', handleClearActive);
    };
  }, [onActiveItemChange]);

  // Default Pin State (no pins active) - will be replaced with actual Pin detection in next phase
  const defaultPinState: PinState = {
    sessionPin: false,
    partPin: false,
    setPin: false,
    exercisePin: false
  };

  const [showExerciseSelection, setShowExerciseSelection] = useState(false);
  const [selectedPartIndex, setSelectedPartIndex] = useState<number | null>(null);

  // togglePartExpansion은 useStatePreservation에서 가져옴


  // ActiveItem 핸들러들 추가
  const handlePartClick = (partSeedId: string) => {
    // 이미 활성화된 파트를 다시 클릭하면 해제 (토글)
    if (activeItem?.level === 'part' && activeItem.id === partSeedId) {
      setActiveItem(null);
      onActiveItemChange?.(null);
      return;
    }

    const newActiveItem = { level: 'part' as const, id: partSeedId };
    setActiveItem(newActiveItem);
    onActiveItemChange?.(newActiveItem);
  };

  const handleSetClick = (setSeedId: string) => {
    // 이미 활성화된 세트를 다시 클릭하면 해제 (토글)
    if (activeItem?.level === 'set' && activeItem.id === setSeedId) {
      setActiveItem(null);
      onActiveItemChange?.(null);
      return;
    }

    const newActiveItem = { level: 'set' as const, id: setSeedId };
    setActiveItem(newActiveItem);
    onActiveItemChange?.(newActiveItem);
  };

  const handleExerciseClick = (exerciseId: string) => {
    // 이미 활성화된 운동을 다시 클릭하면 해제 (토글)
    if (activeItem?.level === 'move' && activeItem.id === exerciseId) {
      setActiveItem(null);
      onActiveItemChange?.(null);
      return;
    }

    const newActiveItem = { level: 'move' as const, id: exerciseId };
    setActiveItem(newActiveItem);
    onActiveItemChange?.(newActiveItem);
  };

  const handleAddExercise = (partIndex: number) => {
    setSelectedPartIndex(partIndex);
    setShowExerciseSelection(true);
  };

  const handleExerciseSelected = (exercise: ExerciseTemplate) => {
    if (selectedPartIndex === null || selectedPartIndex >= editable.length) {
      setShowExerciseSelection(false);
      setSelectedPartIndex(null);
      return;
    }

    console.log('🆕 [Day 3] handleExerciseSelected:', { selectedPartIndex, exercise });

    const targetPart = editable[selectedPartIndex];

    // 🆕 Day 3: editable state update 함수 사용
    // 첫 번째 세트가 없으면 생성
    if (targetPart.sets.length === 0) {
      console.log('  → Creating new set first');
      onAddSet?.(selectedPartIndex, {
        setBlueprintId: null,
        setSeedId: `set-${Date.now()}`,
        order: 0,
        restTime: DEFAULT_SET_VALUES.REST_TIME,
        timeLimit: DEFAULT_SET_VALUES.TIME_LIMIT,
        exercises: []
      });
      // Note: 세트가 생성된 직후 운동을 추가하려면 state 업데이트 후 재시도 필요
      // 현재는 사용자가 다시 추가 버튼을 누르도록 함
      setShowExerciseSelection(false);
      setSelectedPartIndex(null);
      alert('세트가 생성되었습니다. 운동을 다시 추가해주세요.');
      return;
    }

    // 첫 번째 세트에 운동 추가
    const targetSetIndex = 0;
    const targetSet = targetPart.sets[targetSetIndex];

    onAddExercise?.(selectedPartIndex, targetSetIndex, {
      exerciseTemplateId: exercise._id,
      order: targetSet.exercises.length,
      spec: {
        goal: {
          type: 'rep',
          value: 10,
          rule: 'exact'
        },
        load: {
          type: 'free',
          value: null,
          text: ''
        },
        timeLimit: null
      }
    });

    setShowExerciseSelection(false);
    setSelectedPartIndex(null);
    console.log('  → Exercise added via onAddExercise');
  };

  const handleCloseExerciseSelection = () => {
    setShowExerciseSelection(false);
    setSelectedPartIndex(null);
  };

  const handleUpdateSet = (partIndex: number, setIndex: number, updatedSet: EffectiveSetBlueprint) => {
    console.log('🆕 [Day 3] handleUpdateSet called:', { partIndex, setIndex, updatedSet });

    // 🆕 Day 3: editable state update (완전 전환)
    const originalSet = editable[partIndex]?.sets[setIndex];
    if (!originalSet) {
      console.warn('  → Original set not found, skipping update');
      return;
    }

    // Set properties 변경 감지
    const hasRestTimeChange = originalSet.restTime !== updatedSet.restTime;
    const hasTimeLimitChange = originalSet.timeLimit !== updatedSet.timeLimit;

    if (hasRestTimeChange || hasTimeLimitChange) {
      console.log('  → Set properties changed, calling onUpdateSetProperties');
      onUpdateSetProperties?.(partIndex, setIndex, {
        restTime: updatedSet.restTime,
        timeLimit: updatedSet.timeLimit
      });
    }

    // Exercise spec 변경 감지
    updatedSet.exercises.forEach((exercise, exerciseIndex) => {
      const originalExercise = originalSet.exercises[exerciseIndex];
      if (originalExercise && JSON.stringify(originalExercise.spec) !== JSON.stringify(exercise.spec)) {
        console.log('  → Exercise spec changed, calling onUpdateExerciseSpec');
        onUpdateExerciseSpec?.(partIndex, setIndex, exerciseIndex, exercise.spec);
      }
    });
  };

  const handleDeleteSet = (partIndex: number, setIndex: number) => {
    console.log('🆕 [Day 3] handleDeleteSet called:', { partIndex, setIndex });
    onDeleteSet?.(partIndex, setIndex);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAddSet = (partIndex: number) => {
    alert('세트 추가 기능은 상태 관리 구현 후 활성화됩니다.');
  };

  // Session-level Part ID 목록 생성 (SortableContext용)
  const partIds = editable.map((part, index) =>
    generatePartDragId(index, part.partSeedId)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">운동 계획</h2>
      </div>

      <SortableContext items={partIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {editable.map((part, partIndex) => {
          const isActive = activeItem?.level === 'part' && activeItem.id === part.partSeedId;
          const isExpanded = expandedParts.has(part.partSeedId);

          // Session-level placeholder 체크
          const shouldShowPlaceholderBefore =
            placeholderInfo &&
            placeholderInfo.containerType === 'session' &&
            placeholderInfo.insertIndex === partIndex;

          // Part DragItem 생성 (SortableItem용)
          const partDragItem: DragItem = {
            id: partIds[partIndex],
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

          return (
            <React.Fragment key={part.partSeedId}>
              {/* Session-level Placeholder: 파트 이전 위치 */}
              {shouldShowPlaceholderBefore && (
                <div
                  className="h-1 bg-blue-400 rounded relative my-2 transition-all duration-200 ease-in-out"
                  data-placeholder="true"
                >
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-2 bg-blue-100 border-2 border-dashed border-blue-400 rounded-lg whitespace-nowrap pointer-events-none">
                    <span className="text-blue-600 text-sm font-medium">여기에 파트 삽입</span>
                  </div>
                </div>
              )}

              <SortableItem
                sortableId={partIds[partIndex]}
                dragItem={partDragItem}
                pinState={defaultPinState}
                disabled={false}
                useDragHandle={true}
              >
                {(dragHandleProps) => (
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
                    onDeleteExercise={onDeleteExercise}
                    onDeletePart={onDeletePart}
                    onAddExercise={handleAddExercise}
                    onAddSet={onAddSet}
                    togglePartExpansion={togglePartExpansion}
                    toggleSetExpansion={toggleSetExpansion}
                    placeholderInfo={placeholderInfo}
                    dragHandleProps={dragHandleProps}
                  />
                )}
              </SortableItem>
            </React.Fragment>
          );
        })}

        {/* Session-level Placeholder: 마지막 파트 이후 위치 */}
        {placeholderInfo &&
          placeholderInfo.containerType === 'session' &&
          placeholderInfo.insertIndex === editable.length && (
          <div
            className="h-1 bg-blue-400 rounded relative my-2 transition-all duration-200 ease-in-out"
            data-placeholder="true"
          >
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-2 bg-blue-100 border-2 border-dashed border-blue-400 rounded-lg whitespace-nowrap pointer-events-none">
              <span className="text-blue-600 text-sm font-medium">여기에 파트 삽입</span>
            </div>
          </div>
        )}

        {editable.length === 0 && (
          <div className="bg-white rounded-lg border p-8 text-center">
            <div className="text-gray-500 mb-4">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <p className="text-gray-600 mb-2">이 세션에는 운동 계획이 없습니다.</p>
            <p className="text-sm text-gray-400">아래 버튼으로 파트를 추가하세요</p>
          </div>
        )}

        {/* 파트 추가 버튼 */}
        <button
          onClick={() => {
            if (onAddPart) {
              onAddPart({
                partBlueprintId: null,
                partSeedId: `part-${Date.now()}`,
                partName: `파트 ${editable.length + 1}`,
                order: editable.length,
                sets: []
              });
            }
          }}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="font-medium">파트 추가하기</span>
        </button>
        </div>
      </SortableContext>

      {/* Exercise Selection Bottom Sheet */}
      <ExerciseSelectionBottomSheet
        isOpen={showExerciseSelection}
        onClose={handleCloseExerciseSelection}
        onSelectExercise={handleExerciseSelected}
      />
    </div>
  );
};