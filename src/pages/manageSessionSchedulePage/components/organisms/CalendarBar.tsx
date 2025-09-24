import React, { useMemo } from 'react';
import { CalendarMode } from '../../../../types/workout';
import { useCalendarDots } from '../../../../services/workoutService';

type Props = {
  mode: CalendarMode;
  selectedDate: string;
  onModeToggle: () => void;
  onDateSelect: (date: string) => void;
  profileId: string;
};

export const CalendarBar: React.FC<Props> = ({
  mode,
  selectedDate,
  onModeToggle,
  onDateSelect,
  profileId
}) => {
  // 현재 선택된 날짜 기준으로 date range 계산
  const { startDate, endDate, dates } = useMemo(() => {
    const selected = new Date(selectedDate);

    if (mode === 'week') {
      // 주 단위: 선택된 날짜를 중심으로 ±3일 = 7일
      const start = new Date(selected);
      start.setDate(start.getDate() - 3);
      const end = new Date(selected);
      end.setDate(end.getDate() + 3);

      const weekDates = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(start);
        date.setDate(start.getDate() + i);
        weekDates.push(date);
      }

      return {
        startDate: start.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0],
        dates: weekDates
      };
    } else {
      // 월 단위: 전체 월력
      const start = new Date(selected.getFullYear(), selected.getMonth(), 1);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const end = new Date(selected.getFullYear(), selected.getMonth() + 1, 0);

      // 월력 전체 날짜 (이전/다음 월 일부 포함)
      const firstDayOfWeek = start.getDay();
      const calendarStart = new Date(start);
      calendarStart.setDate(start.getDate() - firstDayOfWeek);

      const monthDates = [];
      for (let i = 0; i < 42; i++) { // 6주 * 7일
        const date = new Date(calendarStart);
        date.setDate(calendarStart.getDate() + i);
        monthDates.push(date);
      }

      return {
        startDate: calendarStart.toISOString().split('T')[0],
        endDate: monthDates[41].toISOString().split('T')[0],
        dates: monthDates
      };
    }
  }, [selectedDate, mode]);

  // 캘린더 도트 데이터 조회
  const { data: dotsData } = useCalendarDots({
    profileId,
    startDate,
    endDate
  });

  const getDotForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return dotsData?.calendarDots.find(dot => dot.date === dateStr);
  };

  const getDayName = (date: Date) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days[date.getDay()];
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return date.toISOString().split('T')[0] === selectedDate;
  };

  const isCurrentMonth = (date: Date) => {
    if (mode === 'week') return true;
    const selected = new Date(selectedDate);
    return date.getMonth() === selected.getMonth();
  };

  return (
    <div className="bg-white border-b border-gray-200 py-4">
      <div className="px-4">
        {/* 모드 토글 버튼 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <h3 className="text-lg font-semibold text-gray-900 mr-3">
              {mode === 'week' ? '주간 보기' : '월간 보기'}
            </h3>
            <span className="text-sm text-gray-500">
              {new Date(selectedDate).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long'
              })}
            </span>
          </div>
          <button
            onClick={onModeToggle}
            className="p-2 rounded-md hover:bg-gray-100"
            aria-label={mode === 'week' ? '월간 보기로 변경' : '주간 보기로 변경'}
          >
            {mode === 'week' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            )}
          </button>
        </div>

        {/* 캘린더 */}
        {mode === 'week' ? (
          <WeekView
            dates={dates}
            selectedDate={selectedDate}
            onDateSelect={onDateSelect}
            getDotForDate={getDotForDate}
            getDayName={getDayName}
            isToday={isToday}
            isSelected={isSelected}
          />
        ) : (
          <MonthView
            dates={dates}
            selectedDate={selectedDate}
            onDateSelect={onDateSelect}
            getDotForDate={getDotForDate}
            getDayName={getDayName}
            isToday={isToday}
            isSelected={isSelected}
            isCurrentMonth={isCurrentMonth}
          />
        )}
      </div>
    </div>
  );
};

// 주간 뷰 컴포넌트
const WeekView: React.FC<{
  dates: Date[];
  selectedDate: string;
  onDateSelect: (date: string) => void;
  getDotForDate: (date: Date) => any;
  getDayName: (date: Date) => string;
  isToday: (date: Date) => boolean;
  isSelected: (date: Date) => boolean;
}> = ({ dates, selectedDate, onDateSelect, getDotForDate, getDayName, isToday, isSelected }) => {
  return (
    <div className="grid grid-cols-7 gap-1">
      {dates.map((date, index) => {
        const dot = getDotForDate(date);
        const today = isToday(date);
        const selected = isSelected(date);

        return (
          <button
            key={index}
            onClick={() => onDateSelect(date.toISOString().split('T')[0])}
            className={`relative p-3 rounded-lg text-center transition-colors ${
              selected
                ? 'bg-blue-600 text-white'
                : today
                  ? 'bg-blue-50 text-blue-600'
                  : 'hover:bg-gray-50'
            }`}
          >
            <div className="text-xs text-center mb-1">
              {getDayName(date)}
            </div>
            <div className={`text-lg font-medium ${selected ? 'text-white' : 'text-gray-900'}`}>
              {date.getDate()}
            </div>

            {/* 도트 */}
            {dot && dot.dotType === 'gray' && (
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                <div className={`w-1.5 h-1.5 rounded-full ${selected ? 'bg-white' : 'bg-gray-400'}`} />
              </div>
            )}

            {/* 파란 포커스 링 */}
            {selected && (
              <div className="absolute inset-0 rounded-lg ring-2 ring-blue-300 ring-offset-2" />
            )}
          </button>
        );
      })}
    </div>
  );
};

// 월간 뷰 컴포넌트
const MonthView: React.FC<{
  dates: Date[];
  selectedDate: string;
  onDateSelect: (date: string) => void;
  getDotForDate: (date: Date) => any;
  getDayName: (date: Date) => string;
  isToday: (date: Date) => boolean;
  isSelected: (date: Date) => boolean;
  isCurrentMonth: (date: Date) => boolean;
}> = ({ dates, selectedDate, onDateSelect, getDotForDate, getDayName, isToday, isSelected, isCurrentMonth }) => {
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div>
      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdays.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-1">
        {dates.map((date, index) => {
          const dot = getDotForDate(date);
          const today = isToday(date);
          const selected = isSelected(date);
          const currentMonth = isCurrentMonth(date);

          return (
            <button
              key={index}
              onClick={() => onDateSelect(date.toISOString().split('T')[0])}
              className={`relative p-2 rounded-lg text-center transition-colors ${
                selected
                  ? 'bg-blue-600 text-white'
                  : today
                    ? 'bg-blue-50 text-blue-600'
                    : currentMonth
                      ? 'hover:bg-gray-50 text-gray-900'
                      : 'text-gray-400 hover:bg-gray-50'
              }`}
            >
              <div className={`text-sm ${currentMonth ? 'font-medium' : 'font-normal'}`}>
                {date.getDate()}
              </div>

              {/* 도트 */}
              {dot && dot.dotType === 'gray' && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                  <div className={`w-1 h-1 rounded-full ${selected ? 'bg-white' : 'bg-gray-400'}`} />
                </div>
              )}

              {/* 파란 포커스 링 */}
              {selected && (
                <div className="absolute inset-0 rounded-lg ring-2 ring-blue-300 ring-offset-2" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};