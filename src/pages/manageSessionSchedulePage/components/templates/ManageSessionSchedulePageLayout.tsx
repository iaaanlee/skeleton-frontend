import React, { useState } from 'react';
import { CalendarMode } from '../../../../types/workout';
import {
  TopNavigationBar,
  PageNavigationTabs,
  SeriesStrip,
  CalendarBar,
  SessionCardList
} from '../organisms';

type Props = {
  profileId: string;
};

export const ManageSessionSchedulePageLayout: React.FC<Props> = ({ profileId }) => {
  const [calendarMode, setCalendarMode] = useState<CalendarMode>('week');
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // YYYY-MM-DD
  });

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