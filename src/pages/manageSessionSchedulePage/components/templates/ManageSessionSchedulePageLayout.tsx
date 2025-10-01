import React from 'react';
import {
  TopNavigationBar,
  PageNavigationTabs,
  SeriesStrip,
  CalendarBar,
  SessionCardList
} from '../organisms';
import { useDatePreservation } from '../../hooks';

type Props = {
  profileId: string;
};

export const ManageSessionSchedulePageLayout: React.FC<Props> = ({ profileId }) => {
  // 날짜 선택 상태 보존 Hook
  const {
    selectedDate,
    setSelectedDate,
    calendarMode,
    setCalendarMode
  } = useDatePreservation(profileId);

  const handleCalendarModeToggle = () => {
    setCalendarMode(prev => prev === 'week' ? 'month' : 'week');
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 바 */}
      <TopNavigationBar />

      {/* 페이지 네비게이터 탭 */}
      <PageNavigationTabs activeTab="schedule" />

      {/* 시리즈 스트립 */}
      <SeriesStrip profileId={profileId} />

      {/* 캘린더 바 */}
      <CalendarBar
        mode={calendarMode}
        selectedDate={selectedDate}
        onModeToggle={handleCalendarModeToggle}
        onDateSelect={handleDateSelect}
        profileId={profileId}
      />

      {/* 세션 카드 리스트 */}
      <SessionCardList
        profileId={profileId}
        selectedDate={selectedDate}
      />
    </div>
  );
};