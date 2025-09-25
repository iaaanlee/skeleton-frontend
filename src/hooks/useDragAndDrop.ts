// DnD Hook for Stage 4B - @dnd-kit integration with Pin System
// PRD PAGES 요구사항: 롱프레스 150ms, 햅틱 피드백, 24px 오토스크롤

import { useState, useCallback, useRef } from 'react';
import {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
  CollisionDetection,
  pointerWithin,
  getFirstCollision
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  horizontalListSortingStrategy
} from '@dnd-kit/sortable';
import type { PinState } from '../types/workout';
import { PinSystemHelpers } from '../types/workout';

/**
 * 드롭 타겟 ID 파싱 유틸리티
 */
const parseDropTargetId = (targetId: string) => {
  // 예: "set-1-exercises", "part-0", "exercise-1-2-123"
  if (targetId.startsWith('set-') && targetId.includes('-exercises')) {
    const setIndex = parseInt(targetId.split('-')[1]);
    return {
      type: 'set',
      partIndex: undefined,
      setIndex,
      exerciseIndex: undefined,
      parentId: `set-${setIndex}`
    };
  }

  if (targetId.startsWith('part-')) {
    const partIndex = parseInt(targetId.split('-')[1]);
    return {
      type: 'part',
      partIndex,
      setIndex: undefined,
      exerciseIndex: undefined,
      parentId: `part-${partIndex}`
    };
  }

  if (targetId.startsWith('exercise-')) {
    const parts = targetId.split('-');
    const setIndex = parseInt(parts[1]);
    const exerciseIndex = parseInt(parts[2]);
    return {
      type: 'exercise',
      partIndex: undefined,
      setIndex,
      exerciseIndex,
      parentId: `set-${setIndex}`
    };
  }

  return null;
};

/**
 * DnD Types for Workout Management
 */
export type DragType = 'exercise' | 'set' | 'part';

export type DragItem = {
  id: string;
  type: DragType;
  data: any;
  pinState: PinState;
  parentId?: string;  // 상위 컨테이너 ID
  level: 'session' | 'part' | 'set' | 'exercise';
  indices: {
    partIndex?: number;
    setIndex?: number;
    exerciseIndex?: number;
  };
};

export type DropZone = {
  id: string;
  type: 'container' | 'new-set' | 'new-part' | 'duplicate' | 'delete';
  accepts: DragType[];
  rect?: ClientRect;
  autoExpand?: boolean;  // 닫힌 파트 자동 펼침용
};

/**
 * DnD Configuration for PRD Compliance
 */
const DND_CONFIG = {
  LONG_PRESS_DELAY: 150,           // PRD: 롱프레스 150ms
  AUTO_EXPAND_DELAY: 1000,         // PRD: 1초 자동 펼침
  AUTO_SCROLL_THRESHOLD: 24,       // PRD: 24px 가장자리
  HAPTIC_FEEDBACK_DURATION: 50,    // 햅틱 피드백 50ms
  GHOST_OPACITY: 0.6,              // 고스트 투명도
  PLACEHOLDER_COLOR: '#e5e7eb'     // 플레이스홀더 색상 (gray-200)
};

/**
 * 드래그 이벤트 콜백 타입
 */
export type DragEventCallback = {
  onItemMove?: (moveData: {
    itemId: string;
    itemType: DragType;
    fromIndices: DragItem['indices'];
    toIndices: DragItem['indices'];
    newParentId?: string;
  }) => void;
  onItemDuplicate?: (duplicateData: {
    item: DragItem;
    targetIndices: DragItem['indices'];
  }) => void;
  onItemDelete?: (deleteData: {
    itemId: string;
    itemType: DragType;
    indices: DragItem['indices'];
  }) => void;
  onContainerCreate?: (createData: {
    containerType: 'set' | 'part';
    dragItem: DragItem;
    targetIndices: Partial<DragItem['indices']>;
  }) => void;
};

/**
 * Custom DnD Hook with Pin System Integration
 */
export const useDragAndDrop = (callbacks?: DragEventCallback) => {
  const [activeItem, setActiveItem] = useState<DragItem | null>(null);
  const [dropZones, setDropZones] = useState<DropZone[]>([]);
  const autoExpandTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const scrollIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // PRD 요구사항: 단순화된 센서 설정 - 충돌 방지
  const pointerSensor = useSensor(PointerSensor, {
    // 마우스 드래그: 클릭 후 바로 시작
    activationConstraint: {
      distance: 1,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    // 터치 드래그: 짧은 지연 후 시작 (스크롤과 구분)
    activationConstraint: {
      delay: 100,  // 100ms - 스크롤과 구분하면서도 반응성 유지
      tolerance: 15, // 15px - 더 관대하게
    },
  });

  const keyboardSensor = useSensor(KeyboardSensor);

  const sensors = useSensors(pointerSensor, touchSensor, keyboardSensor);

  /**
   * 드래그 시작 시간 추적 (즉시 활성화 방지)
   */
  const dragStartTimeRef = useRef<number>(0);

  /**
   * 포인터 기반 충돌 감지: 드래그 버튼 위치만 고려
   */
  const customCollisionDetection: CollisionDetection = useCallback((args) => {
    // 드래그 시작 후 매우 짧은 시간만 원형 드롭존 비활성화 (실수 방지)
    const timeSinceDragStart = Date.now() - dragStartTimeRef.current;
    const isInitialDragPhase = timeSinceDragStart < 100; // 실제 사용자 손가락 속도에 맞춤

    if (isInitialDragPhase) {
      // 초기 단계에서는 원형 드롭존을 제외하고 collision detection 실행
      const { droppableContainers } = args;
      const filteredContainers = Array.from(droppableContainers.values()).filter(container => {
        const idStr = typeof container.id === 'string' ? container.id : String(container.id);
        return !idStr.startsWith('circular-drop-');
      });

      const filteredArgs = {
        ...args,
        droppableContainers: filteredContainers
      };

      return closestCenter(filteredArgs);
    }

    // 100ms 후: 포인터 기반 + closestCenter 하이브리드 접근
    const { droppableContainers } = args;

    // 원형 드롭존과 일반 컨테이너 분리
    const circularDropZones = Array.from(droppableContainers.values()).filter(container => {
      const idStr = typeof container.id === 'string' ? container.id : String(container.id);
      return idStr.startsWith('circular-drop-');
    });

    const regularContainers = Array.from(droppableContainers.values()).filter(container => {
      const idStr = typeof container.id === 'string' ? container.id : String(container.id);
      return !idStr.startsWith('circular-drop-');
    });

    // 원형 드롭존: 포인터 기반 collision detection
    if (circularDropZones.length > 0) {
      const pointerCollisions = pointerWithin({
        ...args,
        droppableContainers: circularDropZones
      });

      if (pointerCollisions.length > 0) {
        // 삭제 드롭존 우선순위 (위험한 액션)
        const deleteZone = pointerCollisions.find(collision =>
          collision.id.toString().includes('delete')
        );
        if (deleteZone) return [deleteZone];

        return pointerCollisions.slice(0, 1); // 첫 번째 충돌만 반환
      }
    }

    // 일반 컨테이너: 기존 closestCenter 방식
    if (regularContainers.length > 0) {
      return closestCenter({
        ...args,
        droppableContainers: regularContainers
      });
    }

    return [];
  }, []);

  /**
   * PRD 요구사항: 햅틱 피드백 (가벼운 햅틱)
   */
  const triggerHapticFeedback = useCallback(() => {
    if ('vibrate' in navigator) {
      navigator.vibrate(DND_CONFIG.HAPTIC_FEEDBACK_DURATION);
    }
  }, []);

  /**
   * PRD 요구사항: 24px 가장자리 오토스크롤
   */
  const handleAutoScroll = useCallback((clientY: number) => {
    const scrollThreshold = DND_CONFIG.AUTO_SCROLL_THRESHOLD;
    const scrollSpeed = 5;

    const containerElement = document.querySelector('[data-scroll-container]');
    if (!containerElement) return;

    const containerRect = containerElement.getBoundingClientRect();
    const isNearTop = clientY - containerRect.top < scrollThreshold;
    const isNearBottom = containerRect.bottom - clientY < scrollThreshold;

    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = undefined;
    }

    if (isNearTop || isNearBottom) {
      scrollIntervalRef.current = setInterval(() => {
        if (isNearTop) {
          containerElement.scrollTop -= scrollSpeed;
        } else if (isNearBottom) {
          containerElement.scrollTop += scrollSpeed;
        }
      }, 16); // ~60fps
    }
  }, []);

  /**
   * PRD 요구사항: 닫힌 파트 위 1초 머무르면 자동 펼침
   */
  const handleAutoExpandPart = useCallback((partId: string) => {
    if (autoExpandTimerRef.current) {
      clearTimeout(autoExpandTimerRef.current);
    }

    autoExpandTimerRef.current = setTimeout(() => {
      // 파트 펼침 이벤트 발생
      const expandEvent = new CustomEvent('auto-expand-part', {
        detail: { partId }
      });
      document.dispatchEvent(expandEvent);
    }, DND_CONFIG.AUTO_EXPAND_DELAY);
  }, []);

  /**
   * Pin System과 연동한 드래그 권한 검사
   */
  const canDrag = useCallback((item: DragItem): boolean => {
    const effectivePin = PinSystemHelpers.getEffectivePinState(item.pinState);
    return effectivePin.canDrag;
  }, []);

  /**
   * 드래그 시작 핸들러
   */
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const dragItem = event.active.data.current as DragItem;

    console.log('🚀 드래그 시작 이벤트 발생:', {
      activeId: event.active.id,
      dragItem: dragItem,
      eventType: event
    });

    // Pin 시스템 권한 검사
    if (!canDrag(dragItem)) {
      console.warn('❌ 드래그 차단: Pin 보호 영역', dragItem);
      return;
    }

    // 드래그 시작 시간 기록 (즉시 활성화 방지용)
    dragStartTimeRef.current = Date.now();

    setActiveItem(dragItem);
    triggerHapticFeedback(); // PRD: 가벼운 햅틱

    console.log('✅ 드래그 시작 완료 - activeItem 설정됨:', dragItem);
  }, [canDrag, triggerHapticFeedback]);

  /**
   * 드래그 중 핸들러 (오토스크롤 + 자동펼침 + 원형드롭존 감지)
   */
  const handleDragOver = useCallback((event: DragOverEvent) => {
    if (!activeItem) return;

    const overId = event.over?.id;
    console.log('🔄 드래그 오버:', overId);

    // 원형 드롭존 호버 감지
    if (overId && typeof overId === 'string' && overId.startsWith('circular-drop-')) {
      console.log('🌀 원형 드롭존 호버 감지:', overId);
    }

    // 24px 가장자리 오토스크롤
    const pointerEvent = event as any;
    if (pointerEvent.activatorEvent?.clientY) {
      handleAutoScroll(pointerEvent.activatorEvent.clientY);
    }

    // 닫힌 파트 위 호버링 감지
    if (overId && typeof overId === 'string' && overId.startsWith('part-')) {
      const partElement = document.querySelector(`[data-part-id="${overId}"]`);
      const isCollapsed = partElement?.getAttribute('data-collapsed') === 'true';

      if (isCollapsed) {
        handleAutoExpandPart(overId);
      }
    } else {
      // 다른 영역으로 이동하면 타이머 취소
      if (autoExpandTimerRef.current) {
        clearTimeout(autoExpandTimerRef.current);
        autoExpandTimerRef.current = undefined;
      }
    }
  }, [activeItem, handleAutoScroll, handleAutoExpandPart]);

  /**
   * 드롭 좌표 계산 유틸리티
   */
  const calculateDropPosition = useCallback((event: DragEndEvent) => {
    const { active, over, delta, activatorEvent } = event;

    if (!over || !activatorEvent) return null;

    // 드롭 대상 요소의 위치 정보
    const overRect = over.rect;
    const activeRect = active.rect.current.translated;

    if (!overRect || !activeRect) return null;

    // 마우스/터치 상대 위치 계산
    const pointerPosition = {
      x: activeRect.left + delta.x,
      y: activeRect.top + delta.y
    };

    // 드롭존 내에서의 상대 위치 (0.0 ~ 1.0)
    const relativePosition = {
      x: (pointerPosition.x - overRect.left) / overRect.width,
      y: (pointerPosition.y - overRect.top) / overRect.height
    };

    // 세로 드롭 위치 판단 (위쪽 50% vs 아래쪽 50%)
    const insertPosition = relativePosition.y < 0.5 ? 'before' : 'after';

    return {
      dropTarget: over.id,
      dropType: over.data.current?.type,
      pointerPosition,
      relativePosition,
      insertPosition,
      overRect,
      activeRect
    };
  }, []);

  /**
   * 드롭 유효성 검사 - 관대한 검사로 수정
   */
  const validateDrop = useCallback((dragItem: DragItem, dropInfo: any) => {
    console.log('🔍 드롭 유효성 검사:', { dragItem: dragItem.type, dropInfo });

    if (!dropInfo) {
      console.log('❌ 드롭 위치 정보 없음');
      return { valid: false, reason: '드롭 위치 정보 없음' };
    }

    // Pin 시스템 권한 검사
    const effectivePin = PinSystemHelpers.getEffectivePinState(dragItem.pinState);
    if (!effectivePin.canDrag) {
      console.log('❌ Pin 보호 영역');
      return { valid: false, reason: 'Pin 보호 영역' };
    }

    // 자기 자신으로의 드롭 방지
    if (dragItem.id === dropInfo.dropTarget) {
      console.log('❌ 동일 위치 드롭 방지');
      return { valid: false, reason: '동일 위치 드롭 방지' };
    }

    // 일반적인 컨테이너 드롭은 대부분 허용 (관대한 정책)
    console.log('✅ 드롭 허용');
    return { valid: true, reason: '유효한 드롭' };
  }, []);

  /**
   * 드래그 종료 핸들러 (실제 드롭 로직)
   */
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { over } = event;

    console.log('🎯 handleDragEnd 호출:', { over: over?.id, activeItem: activeItem?.id });

    // 타이머 정리는 항상 실행
    if (autoExpandTimerRef.current) {
      clearTimeout(autoExpandTimerRef.current);
    }
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
    }

    // activeItem 검사를 먼저 (상태 업데이트 전)
    if (!over || !activeItem) {
      console.log('드롭 취소: 유효한 드롭존 없음', { over: !!over, activeItem: !!activeItem });
      setActiveItem(null);
      return;
    }

    console.log('드롭 완료:', {
      dragItem: activeItem,
      dropTargetId: over.id
    });

    // 원형 드롭존 액션 처리 (::a.png 기능) - 우선 처리 (validation 불필요)
    console.log('🎯 드롭 대상 ID 확인:', over.id, typeof over.id);

    if (over.id.toString().startsWith('circular-drop-')) {
      const action = over.id.toString().replace('circular-drop-', '') as 'duplicate' | 'delete';
      console.log('🌀 원형 드롭존 액션 감지:', action);

      switch (action) {
        case 'duplicate':
          console.log('🔄 복제 액션 실행:', activeItem);
          if (callbacks?.onItemDuplicate) {
            callbacks.onItemDuplicate({
              item: activeItem,
              targetIndices: activeItem.indices
            });
          }
          break;

        case 'delete':
          console.log('🗑️ 삭제 액션 실행:', activeItem);
          if (callbacks?.onItemDelete) {
            callbacks.onItemDelete({
              itemId: activeItem.id,
              itemType: activeItem.type,
              indices: activeItem.indices
            });
          }
          break;
      }

      // 원형 드롭존 액션 완료 후 상태 초기화
      console.log('✅ 원형 드롭존 액션 완료 - 상태 초기화');
      setActiveItem(null);
      return;
    } else {
      console.log('📝 일반 드롭 처리 진행');
    }

    // 기존 드롭 액션 처리 - validation 추가
    const dropInfo = calculateDropPosition(event);
    if (!dropInfo) {
      console.log('드롭 취소: 위치 계산 실패');
      setActiveItem(null);
      return;
    }

    // 드롭 유효성 검사
    const validation = validateDrop(activeItem, dropInfo);
    if (!validation.valid) {
      console.log('드롭 차단:', validation.reason);
      setActiveItem(null);
      return;
    }

    console.log('🎯 일반 드롭 처리:', {
      dragItem: activeItem,
      dropTarget: over.id,
      dropType: over.data.current?.type
    });

    // 다양한 드롭 타입 처리 - 관대한 정책으로 확장
    const dropData = over.data.current;
    const dropType = dropData?.type;

    console.log('🎯 드롭 타입 확인:', { dropType, dropData });

    // 1. 컨테이너 드롭 (기존 로직)
    if (dropType === 'container') {
      console.log('📝 컨테이너 내 순서 변경:', {
        from: activeItem.id,
        to: over.id,
        dragType: activeItem.type
      });

      // 타겟 정보 파싱
      const targetInfo = parseDropTargetId(over.id.toString());
      if (targetInfo && callbacks?.onItemMove) {
        const toIndices = {
          partIndex: targetInfo.partIndex,
          setIndex: targetInfo.setIndex,
          exerciseIndex: targetInfo.exerciseIndex
        };

        callbacks.onItemMove({
          itemId: activeItem.id,
          itemType: activeItem.type,
          fromIndices: activeItem.indices,
          toIndices: toIndices,
          newParentId: targetInfo.parentId
        });
      }
    }
    // 2. 다른 컴포넌트에 드롭 (세트, 파트 등) - 새로운 로직
    else if (dropType && ['set', 'part', 'exercise'].includes(dropType)) {
      console.log('🔄 다른 컴포넌트로 이동:', {
        from: activeItem.id,
        to: over.id,
        dragType: activeItem.type,
        dropType
      });

      // 드롭 대상의 인덱스 정보 추출
      const targetInfo = parseDropTargetId(over.id.toString());
      if (targetInfo && callbacks?.onItemMove) {
        const toIndices = {
          partIndex: targetInfo.partIndex,
          setIndex: targetInfo.setIndex,
          exerciseIndex: targetInfo.exerciseIndex
        };

        callbacks.onItemMove({
          itemId: activeItem.id,
          itemType: activeItem.type,
          fromIndices: activeItem.indices,
          toIndices: toIndices,
          newParentId: targetInfo.parentId
        });
      }
    }
    // 3. 드롭존 타입이 없어도 일반적인 이동으로 처리 (관대한 정책)
    else {
      console.log('🔄 일반 드롭 처리 (타입 없음):', {
        from: activeItem.id,
        to: over.id,
        dragType: activeItem.type
      });

      // ID 기반으로 타겟 정보 파싱 시도
      const targetInfo = parseDropTargetId(over.id.toString());
      if (targetInfo && callbacks?.onItemMove) {
        const toIndices = {
          partIndex: targetInfo.partIndex,
          setIndex: targetInfo.setIndex,
          exerciseIndex: targetInfo.exerciseIndex
        };

        callbacks.onItemMove({
          itemId: activeItem.id,
          itemType: activeItem.type,
          fromIndices: activeItem.indices,
          toIndices: toIndices,
          newParentId: targetInfo.parentId
        });
      } else {
        console.log('⚠️ 드롭 대상 파싱 실패, 기본 처리');
      }
    }

    // 새로운 컨테이너 생성 처리
    if (over.data.current?.type === 'new-set' || over.data.current?.type === 'new-part') {
      console.log('🆕 새 컨테이너 생성:', {
        dragItem: activeItem,
        createType: over.data.current.type,
        position: dropInfo?.insertPosition
      });

      const containerType = over.data.current.type === 'new-set' ? 'set' : 'part';
      const targetInfo = parseDropTargetId(over.id.toString());

      if (callbacks?.onContainerCreate) {
        callbacks.onContainerCreate({
          containerType,
          dragItem: activeItem,
          targetIndices: {
            partIndex: targetInfo?.partIndex,
            setIndex: targetInfo?.setIndex,
            exerciseIndex: undefined // 새 컨테이너이므로 undefined
          }
        });
      }
    }

    // 모든 드롭 처리 완료 후 상태 초기화
    setActiveItem(null);
  }, [activeItem, calculateDropPosition, validateDrop, callbacks]);

  /**
   * 드롭존 등록/해제
   */
  const registerDropZone = useCallback((zone: DropZone) => {
    setDropZones(prev => [...prev.filter(z => z.id !== zone.id), zone]);
  }, []);

  const unregisterDropZone = useCallback((zoneId: string) => {
    setDropZones(prev => prev.filter(z => z.id !== zoneId));
  }, []);

  return {
    // DnD Context Props
    sensors,
    collisionDetection: customCollisionDetection, // 원형 드롭존 정밀 감지
    modifiers: [], // 수직 제한 해제 (원형 드롭존을 위해)

    // Event Handlers
    onDragStart: handleDragStart,
    onDragOver: handleDragOver,
    onDragEnd: handleDragEnd,

    // State
    activeItem,
    dropZones,

    // Utilities
    canDrag,
    registerDropZone,
    unregisterDropZone,

    // Sortable Utilities
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
    horizontalListSortingStrategy,

    // Config
    DND_CONFIG
  };
};