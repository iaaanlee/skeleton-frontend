import { useCallback } from 'react';

/**
 * 문서 Phase 3.2: 양방향 싱크 기능
 * PRD 요구사항: 요약↔계획 탭 연동 + 스크롤/하이라이트
 */

type Props = {
  setActiveTab: (tab: 'plan' | 'summary') => void;
};

export const useBidirectionalSync = ({ setActiveTab }: Props) => {

  // 문서 기준: 운동 탭으로 이동하고 해당 운동 하이라이트
  const handleExerciseTap = useCallback((exerciseTemplateId: string) => {
    // 계획 탭으로 전환
    setActiveTab('plan');

    // DOM 업데이트 후 스크롤 및 하이라이트 처리
    setTimeout(() => {
      const element = document.getElementById(`exercise-${exerciseTemplateId}`);
      if (element) {
        // 스크롤 이동
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });

        // 하이라이트 애니메이션 추가
        element.classList.add('highlight-animation');
        setTimeout(() => {
          element.classList.remove('highlight-animation');
        }, 1500);
      }
    }, 100);
  }, [setActiveTab]);

  // 파트 탭으로 이동하고 해당 파트 하이라이트
  const handlePartTap = useCallback((partSeedId: string) => {
    setActiveTab('plan');

    setTimeout(() => {
      const element = document.getElementById(`part-${partSeedId}`);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        element.classList.add('highlight-animation');
        setTimeout(() => {
          element.classList.remove('highlight-animation');
        }, 1500);
      }
    }, 100);
  }, [setActiveTab]);

  // 세트 탭으로 이동하고 해당 세트 하이라이트
  const handleSetTap = useCallback((setSeedId: string) => {
    setActiveTab('plan');

    setTimeout(() => {
      const element = document.getElementById(`set-${setSeedId}`);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });

        element.classList.add('highlight-animation');
        setTimeout(() => {
          element.classList.remove('highlight-animation');
        }, 1500);
      }
    }, 100);
  }, [setActiveTab]);

  return {
    handleExerciseTap,
    handlePartTap,
    handleSetTap
  };
};