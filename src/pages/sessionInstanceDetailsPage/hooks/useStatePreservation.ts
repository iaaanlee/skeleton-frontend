import { useState, useEffect, useCallback } from 'react';

/**
 * 문서 Phase 3.1: 세션 상태 보존 시스템
 * PRD 요구사항: "다른 화면 다녀와도 현재 탭과 스크롤 위치가 그대로 복원"
 */

type ScrollPositions = {
  [key: string]: number;
};

type ToggleStates = {
  expandedParts: Set<string>;
  expandedSets: Set<string>;
};

export const useStatePreservation = (sessionInstanceId: string) => {
  // 활성 탭 상태 보존
  const [activeTab, setActiveTab] = useState<'plan' | 'summary'>(() => {
    const saved = localStorage.getItem(`session-${sessionInstanceId}-activeTab`);
    return (saved as 'plan' | 'summary') || 'plan';
  });

  // 스크롤 위치 상태 보존
  const [scrollPositions, setScrollPositions] = useState<ScrollPositions>(() => {
    const saved = localStorage.getItem(`session-${sessionInstanceId}-scrolls`);
    return saved ? JSON.parse(saved) : {};
  });

  // 토글 상태 보존 (파트 및 세트 접기/펼치기)
  const [toggleStates, setToggleStates] = useState<ToggleStates>(() => {
    const savedToggleStates = localStorage.getItem(`session-${sessionInstanceId}-toggles`);
    if (savedToggleStates) {
      const parsed = JSON.parse(savedToggleStates);
      return {
        expandedParts: new Set(parsed.expandedParts || []),
        expandedSets: new Set(parsed.expandedSets || [])
      };
    }
    // 기본값: 첫 번째 파트만 펼쳐진 상태
    return {
      expandedParts: new Set(['first-part-id']), // 실제로는 첫 번째 파트 ID가 들어가야 함
      expandedSets: new Set()
    };
  });

  // 활성 탭 변경 시 로컬스토리지에 저장
  useEffect(() => {
    localStorage.setItem(`session-${sessionInstanceId}-activeTab`, activeTab);
  }, [activeTab, sessionInstanceId]);

  // 토글 상태 변경 시 로컬스토리지에 저장
  useEffect(() => {
    const toggleStatesToSave = {
      expandedParts: Array.from(toggleStates.expandedParts),
      expandedSets: Array.from(toggleStates.expandedSets)
    };
    localStorage.setItem(`session-${sessionInstanceId}-toggles`, JSON.stringify(toggleStatesToSave));
  }, [toggleStates, sessionInstanceId]);

  // 스크롤 위치 저장
  const saveScrollPosition = (key: string, position: number) => {
    const newPositions = { ...scrollPositions, [key]: position };
    setScrollPositions(newPositions);
    localStorage.setItem(`session-${sessionInstanceId}-scrolls`, JSON.stringify(newPositions));
  };

  // 스크롤 위치 복원
  const getScrollPosition = (key: string): number => {
    return scrollPositions[key] || 0;
  };

  // 파트 토글 상태 업데이트
  const togglePartExpansion = (partSeedId: string) => {
    setToggleStates(prev => {
      const newExpandedParts = new Set(prev.expandedParts);
      if (newExpandedParts.has(partSeedId)) {
        newExpandedParts.delete(partSeedId);
      } else {
        newExpandedParts.add(partSeedId);
      }
      return {
        ...prev,
        expandedParts: newExpandedParts
      };
    });
  };

  // 세트 토글 상태 업데이트
  const toggleSetExpansion = (setSeedId: string) => {
    setToggleStates(prev => {
      const newExpandedSets = new Set(prev.expandedSets);
      if (newExpandedSets.has(setSeedId)) {
        newExpandedSets.delete(setSeedId);
      } else {
        newExpandedSets.add(setSeedId);
      }
      return {
        ...prev,
        expandedSets: newExpandedSets
      };
    });
  };

  // 토글 상태 초기화 (첫 파트 자동 펼침 등)
  const initializeToggleStates = useCallback((firstPartId: string, firstSetId?: string) => {
    setToggleStates(prev => {
      let needsUpdate = false;
      const newExpandedParts = new Set(prev.expandedParts);
      const newExpandedSets = new Set(prev.expandedSets);

      // 첫 번째 파트가 없으면 추가
      if (firstPartId && !prev.expandedParts.has(firstPartId)) {
        newExpandedParts.add(firstPartId);
        needsUpdate = true;
      }

      // 첫 번째 세트가 있으면 추가
      if (firstSetId && !prev.expandedSets.has(firstSetId)) {
        newExpandedSets.add(firstSetId);
        needsUpdate = true;
      }

      // 변경사항이 있을 때만 새 상태 반환
      if (needsUpdate) {
        return {
          expandedParts: newExpandedParts,
          expandedSets: newExpandedSets
        };
      }

      return prev; // 변경사항이 없으면 기존 상태 반환
    });
  }, []);

  // 세션 종료 시 상태 정리 (옵션)
  const clearSessionState = () => {
    localStorage.removeItem(`session-${sessionInstanceId}-activeTab`);
    localStorage.removeItem(`session-${sessionInstanceId}-scrolls`);
    localStorage.removeItem(`session-${sessionInstanceId}-toggles`);
  };

  return {
    activeTab,
    setActiveTab,
    scrollPositions,
    saveScrollPosition,
    getScrollPosition,
    // 토글 상태 관리
    expandedParts: toggleStates.expandedParts,
    expandedSets: toggleStates.expandedSets,
    togglePartExpansion,
    toggleSetExpansion,
    initializeToggleStates,
    clearSessionState
  };
};