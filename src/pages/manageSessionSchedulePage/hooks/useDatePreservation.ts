import { useState, useEffect } from 'react';
import { CalendarMode } from '../../../types/workout';

/**
 * 세션 스케줄 페이지 날짜 선택 상태 보존 Hook
 *
 * 기능:
 * - 선택한 날짜를 sessionStorage에 저장
 * - 같은 탭 내에서만 날짜 유지 (탭 닫으면 자동 초기화)
 * - 캘린더 모드(week/month)도 함께 보존
 *
 * 패턴: sessionStorage 사용으로 페이지 재진입 시 오늘 날짜로 자동 리셋
 */

type DatePreservationState = {
  selectedDate: string; // YYYY-MM-DD
  calendarMode: CalendarMode;
};

export const useDatePreservation = (profileId: string) => {
  const storageKey = `session-schedule-${profileId}`;

  // 초기 상태: sessionStorage에서 복원 또는 기본값(오늘 날짜)
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) {
        const parsed: DatePreservationState = JSON.parse(saved);
        // 유효한 날짜인지 검증
        if (parsed.selectedDate && /^\d{4}-\d{2}-\d{2}$/.test(parsed.selectedDate)) {
          return parsed.selectedDate;
        }
      }
    } catch (error) {
      console.error('Failed to parse saved date state:', error);
    }

    // 기본값: 오늘 날짜
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const [calendarMode, setCalendarMode] = useState<CalendarMode>(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) {
        const parsed: DatePreservationState = JSON.parse(saved);
        return parsed.calendarMode || 'week';
      }
    } catch (error) {
      console.error('Failed to parse saved calendar mode:', error);
    }
    return 'week';
  });

  // 상태 변경 시 sessionStorage에 자동 저장
  useEffect(() => {
    const stateToSave: DatePreservationState = {
      selectedDate,
      calendarMode
    };

    try {
      sessionStorage.setItem(storageKey, JSON.stringify(stateToSave));
    } catch (error) {
      console.error('Failed to save date state:', error);
    }
  }, [selectedDate, calendarMode, storageKey]);

  // 오늘 날짜로 리셋
  const resetToToday = () => {
    const today = new Date();
    setSelectedDate(today.toISOString().split('T')[0]);
  };

  // 상태 완전 삭제 (로그아웃 시 등)
  const clearState = () => {
    try {
      sessionStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Failed to clear date state:', error);
    }
  };

  return {
    selectedDate,
    setSelectedDate,
    calendarMode,
    setCalendarMode,
    resetToToday,
    clearState
  };
};
