// DnD Hook for Stage 4B - @dnd-kit integration with Pin System
// PRD PAGES 요구사항: 롱프레스 150ms, 햅틱 피드백, 24px 오토스크롤

import { useState, useCallback, useRef, useEffect } from 'react';
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
  rectIntersection,
  CollisionDetection,
  pointerWithin
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
 * 드롭 타겟 ID 파싱 유틸리티 (일관된 ID 패턴 지원)
 */
const parseDropTargetId = (targetId: string) => {
  // 새로운 일관된 ID 패턴 파싱
  // 예: "part-0-partSeedId", "set-0-1-setSeedId", "exercise-0-1-2-templateId"

  if (targetId.startsWith('part-')) {
    const parts = targetId.split('-');
    const partIndex = parseInt(parts[1]);
    return {
      type: 'part',
      partIndex,
      setIndex: undefined,
      exerciseIndex: undefined,
      parentId: `part-${partIndex}`
    };
  }

  if (targetId.startsWith('set-')) {
    const parts = targetId.split('-');
    const partIndex = parseInt(parts[1]);
    const setIndex = parseInt(parts[2]);
    return {
      type: 'set',
      partIndex,
      setIndex,
      exerciseIndex: undefined,
      parentId: `set-${partIndex}-${setIndex}`
    };
  }

  if (targetId.startsWith('exercise-')) {
    const parts = targetId.split('-');
    const partIndex = parseInt(parts[1]);
    const setIndex = parseInt(parts[2]);
    const exerciseIndex = parseInt(parts[3]);
    return {
      type: 'exercise',
      partIndex,
      setIndex,
      exerciseIndex,
      parentId: `set-${partIndex}-${setIndex}`
    };
  }

  // 레거시 패턴 지원 (하위 호환성) - 업데이트된 generateSetDragId 패턴 지원
  if (targetId.includes('-exercises')) {
    // 새로운 패턴: "set-{partIndex}-{setIndex}-{setSeedId}-exercises"
    if (targetId.startsWith('set-') && targetId.split('-').length >= 4) {
      const parts = targetId.split('-');
      const partIndex = parseInt(parts[1]);
      const setIndex = parseInt(parts[2]);
      return {
        type: 'set',
        partIndex,
        setIndex,
        exerciseIndex: undefined,
        parentId: `set-${partIndex}-${setIndex}`
      };
    }
    // 기존 레거시 패턴: "set-{setIndex}-exercises"
    else {
      const setIndex = parseInt(targetId.split('-')[1]);
      return {
        type: 'set',
        partIndex: undefined,
        setIndex,
        exerciseIndex: undefined,
        parentId: `set-${setIndex}`
      };
    }
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
 * Placeholder 정보 타입
 */
export type PlaceholderInfo = {
  containerId: string;  // 타겟 컨테이너 ID (set-X-Y-seed, part-X-seed, 또는 'session')
  containerType: 'set' | 'part' | 'session';
  insertIndex: number;  // 삽입될 인덱스 위치
  partIndex?: number;
  setIndex?: number;
} | null;

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
  onPlaceholderUpdate?: (placeholderInfo: PlaceholderInfo) => void;
};

/**
 * Custom DnD Hook with Pin System Integration
 */
export const useDragAndDrop = (callbacks?: DragEventCallback) => {
  const [activeItem, setActiveItem] = useState<DragItem | null>(null);
  const [dropZones, setDropZones] = useState<DropZone[]>([]);
  const autoExpandTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const scrollIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // 실시간 마우스/터치 위치 추적 (정확한 삽입 위치 계산용)
  const currentPointerY = useRef<number>(-1);

  // 계산된 placeholder 정보 저장 (handleDragEnd에서 사용)
  const lastPlaceholderInfo = useRef<PlaceholderInfo>(null);

  // PRD 요구사항: 단순화된 센서 설정 - 충돌 방지
  // 토글 닫기 애니메이션 대기: 100ms delay
  const pointerSensor = useSensor(PointerSensor, {
    // 마우스 드래그: 100ms 지연 (토글 닫기 + DOM 업데이트 완료 대기)
    activationConstraint: {
      delay: 100,  // 토글 애니메이션 완료 후 드래그 시작
      tolerance: 5, // 5px 이동 허용
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    // 터치 드래그: 100ms 지연 (토글 닫기 + 스크롤 구분)
    activationConstraint: {
      delay: 100,  // 토글 애니메이션 완료 후 드래그 시작
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
   * 실시간 포인터 위치 추적 (드래그 중에만 리스너 등록)
   * 정확한 마우스 커서 위치로 삽입 위치 계산
   */
  useEffect(() => {
    if (!activeItem) return; // 드래그 중이 아니면 리스너 등록 안 함

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (e instanceof MouseEvent) {
        currentPointerY.current = e.clientY;
      } else if (e instanceof TouchEvent && e.touches.length > 0) {
        currentPointerY.current = e.touches[0].clientY;
      }
    };

    document.addEventListener('mousemove', handlePointerMove as EventListener);
    document.addEventListener('touchmove', handlePointerMove as EventListener, { passive: true });

    return () => {
      document.removeEventListener('mousemove', handlePointerMove as EventListener);
      document.removeEventListener('touchmove', handlePointerMove as EventListener);
    };
  }, [activeItem]);

  /**
   * 포인터 기반 충돌 감지: 드래그 버튼 위치만 고려
   */
  const customCollisionDetection: CollisionDetection = useCallback((args) => {
    // console.log('🔥 [COLLISION] 함수 호출됨!', { activeId: args.active.id });

    try {
      // 드래그 시작 후 매우 짧은 시간만 원형 드롭존 비활성화 (실수 방지)
      const timeSinceDragStart = Date.now() - dragStartTimeRef.current;
      const isInitialDragPhase = timeSinceDragStart < 100; // 실제 사용자 손가락 속도에 맞춤

      if (isInitialDragPhase) {
      // 초기 단계에서는 원형 드롭존을 제외하고 collision detection 실행
      const { droppableContainers } = args;

      // console.log('🔍 [Initial Phase] droppableContainers:', {
      //   total: droppableContainers.length,
      //   ids: droppableContainers.map(c => c.id)
      // });

      const filteredContainers = droppableContainers.filter(container => {
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

    // console.log('🔍 [Collision Detection] 전체 droppableContainers:', {
    //   total: droppableContainers.length,
    //   ids: droppableContainers.map(c => c.id),
    //   activeId: args.active.id
    // });

    // 원형 드롭존과 일반 컨테이너 분리
    const circularDropZones = droppableContainers.filter(container => {
      const idStr = typeof container.id === 'string' ? container.id : String(container.id);
      return idStr.startsWith('circular-drop-');
    });

    const regularContainers = droppableContainers.filter(container => {
      const idStr = typeof container.id === 'string' ? container.id : String(container.id);
      return !idStr.startsWith('circular-drop-');
    });

    // console.log('🔍 [Collision Detection] 분류 결과:', {
    //   circularCount: circularDropZones.length,
    //   regularCount: regularContainers.length,
    //   regularIds: regularContainers.map(c => c.id)
    // });

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

    // 일반 컨테이너: 모두 rectIntersection 사용 (운동/세트/파트 통일)
    // rectIntersection을 사용하면 드래그 중인 아이템의 rect와 타겟의 교차를 판정
    // → 마우스 위치에 따라 overId가 실시간으로 변경됨
    // → calculateInsertionPosition이 재호출되어 placeholder가 업데이트됨
    if (regularContainers.length > 0) {
      const result = rectIntersection({
        ...args,
        droppableContainers: regularContainers
      });

      // console.log('🔍 [Collision Detection] rectIntersection 결과:', {
      //   resultCount: result.length,
      //   resultIds: result.map(r => r.id)
      // });

      return result;
    }

    return [];
    } catch (error) {
      console.error('❌ [COLLISION] 에러 발생:', error);
      return [];
    }
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
   * PRD 요구사항: 닫힌 세트 위 1초 머무르면 자동 펼침
   */
  const handleAutoExpandSet = useCallback((setSeedId: string) => {
    if (autoExpandTimerRef.current) {
      clearTimeout(autoExpandTimerRef.current);
    }

    autoExpandTimerRef.current = setTimeout(() => {
      // 세트 펼침 이벤트 발생
      const expandEvent = new CustomEvent('auto-expand-set', {
        detail: { setSeedId }
      });
      document.dispatchEvent(expandEvent);
      // console.log('🔄 세트 자동 펼침 이벤트 발생:', setSeedId);
    }, DND_CONFIG.AUTO_EXPAND_DELAY);
  }, []);

  /**
   * Multi-Container Sortable: 포인터 위치 기반 삽입 위치 계산
   */
  const calculateInsertionPosition = useCallback((event: DragOverEvent, overId: string) => {
    if (!activeItem || !callbacks?.onPlaceholderUpdate) return;

    // 실시간 포인터 좌표 계산
    // event.active.rect.current.translated는 드래그 중인 아이템의 현재 위치
    const activeRect = event.active.rect.current.translated;

    if (!activeRect) {
      // console.log('❌ [Insertion Calc] activeRect 없음');
      return;
    }

    // 실제 마우스 커서 위치를 사용 (정확한 삽입 위치 계산)
    const clientY = currentPointerY.current >= 0
      ? currentPointerY.current  // ✅ 실제 마우스 위치
      : activeRect.top + activeRect.height / 2;  // Fallback: 컴포넌트 중심

    // console.log('🎯 [Insertion Calc] 시작:', {
    //   overId,
    //   activeItemType: activeItem.type,
    //   clientY,
    //   source: currentPointerY.current >= 0 ? 'real-pointer' : 'fallback-center',
    //   activeRect: { top: activeRect.top, height: activeRect.height }
    // });

    // 타겟 컨테이너 식별 및 아이템 목록 가져오기
    let targetContainerId: string | null = null;
    let containerType: 'set' | 'part' | 'session' | null = null;
    let partIndex: number | undefined;
    let setIndex: number | undefined;
    let items: HTMLElement[] = [];

    // 1. 운동 위에 hover → 부모 세트가 타겟 (운동 드래그 시에만)
    if (overId.startsWith('exercise-')) {
      if (activeItem.type === 'exercise') {
        // 운동 드래그 → 세트 내부의 운동들 사이
        const parts = overId.split('-');
        partIndex = parseInt(parts[1]);
        setIndex = parseInt(parts[2]);

        const parentSet = document.querySelector(
          `[data-part-index="${partIndex}"][data-set-index="${setIndex}"]`
        );
        const setSeedId = parentSet?.getAttribute('data-set-id');

        if (setSeedId) {
          targetContainerId = `set-${partIndex}-${setIndex}-${setSeedId}`;
          containerType = 'set';

          // 세트 내 모든 운동 아이템 가져오기 (SortableItem만 선택, placeholder 제외)
          items = Array.from(parentSet?.querySelectorAll('[data-sortable-id][data-drag-type="exercise"]') || []) as HTMLElement[];
        }
      }
      // 세트/파트 드래그 중 운동 hover는 무시
    }
    // 2. 세트 위에 hover (드래그 타입에 따라 다르게 처리)
    else if (overId.startsWith('set-')) {
      let overIdStr = overId;
      if (overIdStr.endsWith('-exercises')) {
        overIdStr = overIdStr.slice(0, -10);
      }

      const parts = overIdStr.split('-');
      partIndex = parseInt(parts[1]);
      setIndex = parseInt(parts[2]);
      const setSeedId = parts.slice(3).join('-');

      if (activeItem.type === 'exercise') {
        // 운동 드래그 → 세트 내부의 운동들 사이
        targetContainerId = `set-${partIndex}-${setIndex}-${setSeedId}`;
        containerType = 'set';

        const setElement = document.querySelector(`[data-set-id="${setSeedId}"]`);
        items = Array.from(setElement?.querySelectorAll('[data-sortable-id][data-drag-type="exercise"]') || []) as HTMLElement[];
      } else if (activeItem.type === 'set') {
        // 세트 드래그 → 부모 파트의 세트들 사이
        const dataPartId = `part-${partIndex}`;
        const partElement = document.querySelector(`[data-part-id="${dataPartId}"]`);

        // 파트의 정확한 dragItem.id 가져오기 (DraggableCard가 설정한 data-drag-id 사용)
        const partDragId = partElement?.getAttribute('data-drag-id');

        if (partDragId) {
          targetContainerId = partDragId;  // part-{partIndex}-{partSeedId}
          containerType = 'part';
          items = Array.from(partElement?.querySelectorAll('[data-sortable-id][data-drag-type="set"]') || []) as HTMLElement[];
        }
      }
      // 파트 드래그 중 세트 hover는 무시
    }
    // 3. 파트 위에 hover (드래그 타입에 따라 다르게 처리)
    else if (overId.startsWith('part-')) {
      const parts = overId.split('-');
      partIndex = parseInt(parts[1]);
      const partSeedId = parts.slice(2).join('-');

      if (activeItem.type === 'exercise') {
        // 운동 드래그 → 파트의 세트들 중... 어느 세트?
        // 일단 파트의 첫 번째 세트로 이동 (또는 빈 세트 생성)
        // TODO: 이 케이스는 나중에 처리
        targetContainerId = null;
        containerType = null;
      } else if (activeItem.type === 'set') {
        // 세트 드래그 → 파트의 세트들 사이
        targetContainerId = `part-${partIndex}-${partSeedId}`;
        containerType = 'part';

        const dataPartId = `part-${partIndex}`;
        const partElement = document.querySelector(`[data-part-id="${dataPartId}"]`);
        items = Array.from(partElement?.querySelectorAll('[data-sortable-id][data-drag-type="set"]') || []) as HTMLElement[];
      } else if (activeItem.type === 'part') {
        // 파트 드래그 → 세션의 파트들 사이
        targetContainerId = 'session';
        containerType = 'session';

        // Get all part elements at session level
        const sessionContainer = document.querySelector('[data-scroll-container]');
        items = Array.from(sessionContainer?.querySelectorAll('[data-sortable-id][data-drag-type="part"]') || []) as HTMLElement[];
      }
    }

    if (!targetContainerId || !containerType || items.length === 0) {
      // console.log('❌ [Insertion Calc] 타겟 컨테이너 또는 아이템 없음');
      callbacks.onPlaceholderUpdate(null);
      return;
    }

    // 드래그 중인 아이템 제외
    const filteredItems = items.filter(item => {
      const itemId = item.getAttribute('data-sortable-id');  // ✅ 올바른 속성명 사용
      return itemId !== activeItem.id;
    });

    // 🔍 [DEBUG] 진입점
    console.log('🎯 [삽입 계산]', {
      clientY,
      source: currentPointerY.current >= 0 ? '마우스' : 'fallback',
      totalItems: items.length,
      filtered: filteredItems.length,
      activeId: activeItem.id
    });

    // 삽입 위치 계산: 각 아이템과 포인터 Y 좌표 비교
    let insertIndex = 0;

    for (let i = 0; i < filteredItems.length; i++) {
      const item = filteredItems[i];
      const itemId = item.getAttribute('data-sortable-id');
      const rect = item.getBoundingClientRect();
      const itemMiddleY = rect.top + rect.height / 2;

      console.log(`  [${i}] ${itemId?.slice(-10)}:`, {
        top: Math.round(rect.top),
        mid: Math.round(itemMiddleY),
        clientY: Math.round(clientY),
        result: clientY < itemMiddleY ? '위쪽→앞삽입' : '아래쪽→계속'
      });

      // 마우스가 아이템 중간보다 위 → 아이템 앞에 삽입
      if (clientY < itemMiddleY) {
        insertIndex = i;
        break;
      }
      // 마우스가 아이템 중간 이상 → 다음 아이템으로 (또는 맨 뒤)
      else {
        insertIndex = i + 1;
      }
    }

    // 원본 배열 기준으로 insertIndex 변환
    // filteredItems는 드래그 중인 아이템을 제외했으므로
    // 렌더링 시 원본 배열과 인덱스 불일치 발생
    let insertIndexOriginal = insertIndex;

    // 드래그 중인 아이템의 원래 인덱스 찾기
    const activeItemOriginalIndex = items.findIndex(item => {
      const itemId = item.getAttribute('data-sortable-id');
      return itemId === activeItem.id;
    });

    // insertIndex가 드래그 아이템의 원래 위치 이상이면 +1
    if (activeItemOriginalIndex !== -1 && insertIndex >= activeItemOriginalIndex) {
      insertIndexOriginal = insertIndex + 1;
    }

    console.log('✅ [최종]', {
      insertIndex: insertIndexOriginal,
      filteredIndex: insertIndex,
      activeOriginalIndex: activeItemOriginalIndex,
      containerId: targetContainerId
    });

    const placeholderInfo: PlaceholderInfo = {
      containerId: targetContainerId,
      containerType,
      insertIndex: insertIndexOriginal,
      partIndex,
      setIndex
    };

    // placeholder 정보 저장 (handleDragEnd에서 사용)
    lastPlaceholderInfo.current = placeholderInfo;

    callbacks.onPlaceholderUpdate(placeholderInfo);
  }, [activeItem, callbacks]);

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

    // Pin 시스템 권한 검사
    if (!canDrag(dragItem)) {
      console.warn('❌ 드래그 차단: Pin 보호 영역', dragItem);
      return;
    }

    // 드래그 시작 시간 기록 (즉시 활성화 방지용)
    dragStartTimeRef.current = Date.now();
    currentPointerY.current = -1;  // 포인터 위치 초기화
    lastPlaceholderInfo.current = null;  // placeholder 정보 초기화

    // 토글 닫기는 드래그 핸들의 onPointerDown에서 이미 처리됨 (100ms 전에)

    setActiveItem(dragItem);
    triggerHapticFeedback(); // PRD: 가벼운 햅틱
  }, [canDrag, triggerHapticFeedback]);

  /**
   * 드래그 중 핸들러 (오토스크롤 + 자동펼침 + 원형드롭존 감지)
   */
  const handleDragOver = useCallback((event: DragOverEvent) => {
    // console.log('🔥 [DRAG OVER] 호출됨!', { overId: event.over?.id, activeItem: activeItem?.id });

    if (!activeItem) return;

    const overId = event.over?.id;

    // 원형 드롭존 호버 감지
    // if (overId && typeof overId === 'string' && overId.startsWith('circular-drop-')) {
    //   console.log('🌀 원형 드롭존 호버 감지:', overId);
    // }

    // 24px 가장자리 오토스크롤
    const pointerEvent = event as any;
    if (pointerEvent.activatorEvent?.clientY) {
      handleAutoScroll(pointerEvent.activatorEvent.clientY);
    }

    // 닫힌 파트/세트 위 호버링 감지
    if (overId && typeof overId === 'string') {
      // 세트 드래그 시 디버깅
      // if (activeItem?.type === 'set') {
      //   console.log('🔧 [세트 드래그] overId 감지:', {
      //     overId,
      //     activeItemId: activeItem?.id,
      //     startsWithPart: overId.startsWith('part-'),
      //     startsWithSet: overId.startsWith('set-'),
      //     startsWithExercise: overId.startsWith('exercise-')
      //   });
      // }

      // 자동 펼침: 운동 드래그 시 또는 세트 드래그 시
      const isExerciseDrag = activeItem?.type === 'exercise';
      const isSetDrag = activeItem?.type === 'set';

      // 운동 위에 hover했을 때 → 부모 세트 & 부모 파트 자동 확장
      if (overId.startsWith('exercise-') && isExerciseDrag) {
        // exercise-{partIndex}-{setIndex}-{exerciseIndex}-{templateId}
        const parts = overId.split('-');
        const exercisePartIndex = parts[1];
        const exerciseSetIndex = parts[2];

        // 1. 부모 파트 찾기 & 자동 확장
        const partId = `part-${exercisePartIndex}`;
        const parentPart = document.querySelector(`[data-part-id="${partId}"]`);

        if (parentPart) {
          const partIsCollapsed = parentPart.getAttribute('data-collapsed') === 'true';

          // console.log('📦 운동 hover 감지 - 부모 파트 확인:', {
          //   exerciseId: overId,
          //   exercisePartIndex,
          //   partId,
          //   partIsCollapsed
          // });

          if (partIsCollapsed) {
            // 파트 ID를 overId 형식으로 변환 (part-{partIndex}-{seedId})
            // DOM에서는 data-part-id="part-0" 형태
            // 실제 파트 dragItem.id는 part-{partIndex}-{seedId} 형태
            // 모든 파트를 찾아서 partIndex가 일치하는 것을 찾기
            const allParts = Array.from(document.querySelectorAll('[data-part-id]'));
            for (const p of allParts) {
              const pId = p.getAttribute('data-part-id');
              if (pId === partId) {
                // console.log('✅ 부모 파트 자동 확장 타이머 시작:', partId);
                // handleAutoExpandPart는 full ID (part-{partIndex}-{seedId})를 받지만
                // 여기서는 partId만 전달하므로 이벤트에서 partId로 찾아야 함
                handleAutoExpandPart(partId);
                break;
              }
            }
          }
        }

        // 2. 부모 세트 찾기 & 자동 확장
        const parentSet = document.querySelector(
          `[data-part-index="${exercisePartIndex}"][data-set-index="${exerciseSetIndex}"]`
        );

        if (parentSet) {
          const setSeedId = parentSet.getAttribute('data-set-id');
          const isCollapsed = parentSet.getAttribute('data-collapsed') === 'true';

          // console.log('📦 운동 hover 감지 - 부모 세트 확인:', {
          //   exerciseId: overId,
          //   exercisePartIndex,
          //   exerciseSetIndex,
          //   setSeedId,
          //   isCollapsed
          // });

          if (isCollapsed && setSeedId) {
            // console.log('✅ 부모 세트 자동 확장 타이머 시작:', setSeedId);
            handleAutoExpandSet(setSeedId);
          }
        }
      } else if (overId.startsWith('set-') && isExerciseDrag) {
        // 세트 위에 hover했을 때 → 부모 파트 자동 확장 (운동 드래그 시에만)
        // set-{partIndex}-{setIndex}-{setSeedId} 또는 set-{partIndex}-{setIndex}-{setSeedId}-exercises
        let overIdStr = overId;

        // "-exercises" 접미사 제거
        if (overIdStr.endsWith('-exercises')) {
          overIdStr = overIdStr.slice(0, -10);
        }

        const parts = overIdStr.split('-');
        const setPartIndex = parts[1];

        // 부모 파트 찾기 & 자동 확장
        const partId = `part-${setPartIndex}`;
        const parentPart = document.querySelector(`[data-part-id="${partId}"]`);

        if (parentPart) {
          const partIsCollapsed = parentPart.getAttribute('data-collapsed') === 'true';

          // console.log('📦 세트 hover 감지 - 부모 파트 확인:', {
          //   setId: overId,
          //   setPartIndex,
          //   partId,
          //   partIsCollapsed
          // });

          if (partIsCollapsed) {
            // console.log('✅ 부모 파트 자동 확장 타이머 시작 (세트 hover):', partId);
            handleAutoExpandPart(partId);
          }
        }

        // 세트 자체 자동 확장 (기존 로직)
        const setSeedId = parts.slice(3).join('-');
        const setElement = document.querySelector(`[data-set-id="${setSeedId}"]`);
        const isCollapsed = setElement?.getAttribute('data-collapsed') === 'true';

        if (isCollapsed) {
          // console.log('✅ 세트 자동 확장 타이머 시작:', setSeedId);
          handleAutoExpandSet(setSeedId);
        }
      } else if (overId.startsWith('part-') && (isExerciseDrag || isSetDrag)) {
        // overId는 "part-0-seedId" 형태, data-part-id는 "part-0" 형태
        // 파트 인덱스만 추출해서 매칭
        const parts = overId.split('-');
        const partIndex = parts[1];
        const dataPartId = `part-${partIndex}`;

        const partElement = document.querySelector(`[data-part-id="${dataPartId}"]`);
        const isCollapsed = partElement?.getAttribute('data-collapsed') === 'true';

        // console.log('📦 파트 상태 상세:', {
        //   partElement: !!partElement,
        //   dataPartId,
        //   isCollapsed,
        //   overId,
        //   domSelector: `[data-part-id="${dataPartId}"]`,
        //   allPartsInDOM: Array.from(document.querySelectorAll('[data-part-id]')).map(el => el.getAttribute('data-part-id')),
        //   elementFound: partElement ? {
        //     tagName: partElement.tagName,
        //     className: partElement.className,
        //     dataPartId: partElement.getAttribute('data-part-id'),
        //     dataCollapsed: partElement.getAttribute('data-collapsed')
        //   } : null
        // });

        if (isCollapsed) {
          // console.log('✅ 파트 자동 확장 타이머 시작:', overId);
          handleAutoExpandPart(overId);
        }
      }
      // 파트 → 세트 드래그 시에는 자동 펼침 비활성화 (위에서 isExerciseDrag/isSetDrag 체크로 처리됨)

      // ========== Multi-Container Sortable: 삽입 위치 계산 ==========
      // 포인터 위치 기반으로 타겟 컨테이너 내 삽입 위치 계산
      calculateInsertionPosition(event, overId);
    } else {
      // 다른 영역으로 이동하면 타이머 취소
      if (autoExpandTimerRef.current) {
        clearTimeout(autoExpandTimerRef.current);
        autoExpandTimerRef.current = undefined;
      }
      // placeholder 정보도 초기화
      callbacks?.onPlaceholderUpdate?.(null);
    }
  }, [activeItem, handleAutoScroll, handleAutoExpandPart, handleAutoExpandSet, calculateInsertionPosition, callbacks]);

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
    // console.log('🔍 드롭 유효성 검사:', { dragItem: dragItem.type, dropInfo });

    if (!dropInfo) {
      // console.log('❌ 드롭 위치 정보 없음');
      return { valid: false, reason: '드롭 위치 정보 없음' };
    }

    // Pin 시스템 권한 검사
    const effectivePin = PinSystemHelpers.getEffectivePinState(dragItem.pinState);
    if (!effectivePin.canDrag) {
      // console.log('❌ Pin 보호 영역');
      return { valid: false, reason: 'Pin 보호 영역' };
    }

    // 자기 자신으로의 드롭 방지
    if (dragItem.id === dropInfo.dropTarget) {
      // console.log('❌ 동일 위치 드롭 방지');
      return { valid: false, reason: '동일 위치 드롭 방지' };
    }

    // 일반적인 컨테이너 드롭은 대부분 허용 (관대한 정책)
    // console.log('✅ 드롭 허용');
    return { valid: true, reason: '유효한 드롭' };
  }, []);

  /**
   * 드래그 종료 핸들러 (실제 드롭 로직)
   */
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { over } = event;

    // console.log('🎯 handleDragEnd 호출:', { over: over?.id, activeItem: activeItem?.id });

    // 타이머 정리는 항상 실행
    if (autoExpandTimerRef.current) {
      clearTimeout(autoExpandTimerRef.current);
    }
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
    }

    // activeItem 검사를 먼저 (상태 업데이트 전)
    if (!over || !activeItem) {
      // console.log('드롭 취소: 유효한 드롭존 없음', { over: !!over, activeItem: !!activeItem });
      setActiveItem(null);
      return;
    }

    // console.log('드롭 완료:', {
    //   dragItem: activeItem,
    //   dropTargetId: over.id
    // });

    // 원형 드롭존 액션 처리 (::a.png 기능) - 우선 처리 (validation 불필요)
    // console.log('🎯 드롭 대상 ID 확인:', over.id, typeof over.id);

    if (over.id.toString().startsWith('circular-drop-')) {
      const action = over.id.toString().replace('circular-drop-', '') as 'duplicate' | 'delete';
      // console.log('🌀 원형 드롭존 액션 감지:', action);

      switch (action) {
        case 'duplicate':
          // console.log('🔄 복제 액션 실행:', activeItem);
          if (callbacks?.onItemDuplicate) {
            callbacks.onItemDuplicate({
              item: activeItem,
              targetIndices: activeItem.indices
            });
          }
          break;

        case 'delete':
          // console.log('🗑️ 삭제 액션 실행:', activeItem);
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
      // console.log('✅ 원형 드롭존 액션 완료 - 상태 초기화');
      setActiveItem(null);
      return;
    }

    // 기존 드롭 액션 처리 - validation 추가
    const dropInfo = calculateDropPosition(event);
    if (!dropInfo) {
      // console.log('드롭 취소: 위치 계산 실패');
      setActiveItem(null);
      return;
    }

    // 드롭 유효성 검사
    const validation = validateDrop(activeItem, dropInfo);
    if (!validation.valid) {
      // console.log('드롭 차단:', validation.reason);
      setActiveItem(null);
      return;
    }

    // console.log('🎯 일반 드롭 처리:', {
    //   dragItem: activeItem,
    //   dropTarget: over.id,
    //   dropType: over.data.current?.type
    // });

    // 다양한 드롭 타입 처리 - 관대한 정책으로 확장
    const dropData = over.data.current;
    const dropType = dropData?.type;

    // console.log('🎯 드롭 타입 확인:', { dropType, dropData });

    // 1. 컨테이너 드롭 (기존 로직)
    if (dropType === 'container') {
      // console.log('📝 컨테이너 내 순서 변경:', {
      //   from: activeItem.id,
      //   to: over.id,
      //   dragType: activeItem.type,
      //   placeholderInfo: lastPlaceholderInfo.current
      // });

      // 타겟 정보 파싱
      const targetInfo = parseDropTargetId(over.id.toString());
      if (targetInfo && callbacks?.onItemMove) {
        // ✅ placeholder의 정확한 insertIndex 사용
        const toIndices = {
          partIndex: targetInfo.partIndex,
          setIndex: targetInfo.setIndex,
          exerciseIndex: lastPlaceholderInfo.current?.insertIndex ?? targetInfo.exerciseIndex
        };

        // console.log('🎯 [드롭 실행]:', {
        //   from: activeItem.indices,
        //   to: toIndices,
        //   insertIndex: lastPlaceholderInfo.current?.insertIndex
        // });

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
      // console.log('🔄 다른 컴포넌트로 이동:', {
      //   from: activeItem.id,
      //   to: over.id,
      //   dragType: activeItem.type,
      //   dropType,
      //   placeholderInfo: lastPlaceholderInfo.current
      // });

      // 드롭 대상의 인덱스 정보 추출
      const targetInfo = parseDropTargetId(over.id.toString());
      if (targetInfo && callbacks?.onItemMove) {
        // ✅ placeholder의 정확한 insertIndex 사용
        const toIndices = {
          partIndex: targetInfo.partIndex,
          setIndex: targetInfo.setIndex,
          exerciseIndex: lastPlaceholderInfo.current?.insertIndex ?? targetInfo.exerciseIndex
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
      // console.log('🔄 일반 드롭 처리 (타입 없음):', {
      //   from: activeItem.id,
      //   to: over.id,
      //   dragType: activeItem.type,
      //   placeholderInfo: lastPlaceholderInfo.current
      // });

      // ID 기반으로 타겟 정보 파싱 시도
      const targetInfo = parseDropTargetId(over.id.toString());
      if (targetInfo && callbacks?.onItemMove) {
        // ✅ placeholder의 정확한 insertIndex 사용
        const toIndices = {
          partIndex: targetInfo.partIndex,
          setIndex: targetInfo.setIndex,
          exerciseIndex: lastPlaceholderInfo.current?.insertIndex ?? targetInfo.exerciseIndex
        };

        callbacks.onItemMove({
          itemId: activeItem.id,
          itemType: activeItem.type,
          fromIndices: activeItem.indices,
          toIndices: toIndices,
          newParentId: targetInfo.parentId
        });
      } else {
        // console.log('⚠️ 드롭 대상 파싱 실패, 기본 처리');
      }
    }

    // 새로운 컨테이너 생성 처리
    if (over.data.current?.type === 'new-set' || over.data.current?.type === 'new-part') {
      // console.log('🆕 새 컨테이너 생성:', {
      //   dragItem: activeItem,
      //   createType: over.data.current.type,
      //   position: dropInfo?.insertPosition
      // });

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