import { useState, useEffect } from 'react';

/**
 * 문서 Phase 3.1: 세션 상태 보존 시스템
 * PRD 요구사항: "다른 화면 다녀와도 현재 탭과 스크롤 위치가 그대로 복원"
 */

type ScrollPositions = {
  [key: string]: number;
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

  // 활성 탭 변경 시 로컬스토리지에 저장
  useEffect(() => {
    localStorage.setItem(`session-${sessionInstanceId}-activeTab`, activeTab);
  }, [activeTab, sessionInstanceId]);

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

  // 세션 종료 시 상태 정리 (옵션)
  const clearSessionState = () => {
    localStorage.removeItem(`session-${sessionInstanceId}-activeTab`);
    localStorage.removeItem(`session-${sessionInstanceId}-scrolls`);
  };

  return {
    activeTab,
    setActiveTab,
    scrollPositions,
    saveScrollPosition,
    getScrollPosition,
    clearSessionState
  };
};