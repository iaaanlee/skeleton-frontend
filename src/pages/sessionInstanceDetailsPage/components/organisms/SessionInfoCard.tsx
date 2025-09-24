import React from 'react';
import type { SessionDetail } from '../../../../types/workout';

type Props = {
  sessionDetail: SessionDetail;
};

export const SessionInfoCard: React.FC<Props> = ({ sessionDetail }) => {
  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return {
      date: date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      }),
      time: date.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  const scheduled = formatDateTime(sessionDetail.scheduledAt);

  return (
    <div className="bg-white rounded-lg border p-4">
      {/* 일정 정보 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center text-gray-600 mb-1">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium">예정 시간</span>
          </div>
          <div className="ml-6">
            <p className="text-base font-semibold text-gray-900">{scheduled.date}</p>
            <p className="text-sm text-gray-600">{scheduled.time}</p>
          </div>
        </div>
      </div>

      {/* 시리즈 정보 */}
      {sessionDetail.seriesName && (
        <div className="flex items-center mb-4">
          <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7l2 2-2 2m-2-2h-14m14 14l2-2-2-2" />
          </svg>
          <span className="text-sm text-gray-600 mr-2">프로그램:</span>
          <span className="text-sm font-medium text-gray-900">{sessionDetail.seriesName}</span>
        </div>
      )}

      {/* 세션 미리보기 통계 */}
      <div className="grid grid-cols-4 gap-4 pt-4 border-t">
        <div className="text-center">
          <p className="text-lg font-bold text-blue-600">{sessionDetail.preview.totalParts}</p>
          <p className="text-xs text-gray-600">파트</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-green-600">{sessionDetail.preview.totalSets}</p>
          <p className="text-xs text-gray-600">세트</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-purple-600">{sessionDetail.preview.totalExercises}</p>
          <p className="text-xs text-gray-600">운동</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-orange-600">{sessionDetail.preview.estimatedDurationMinutes}</p>
          <p className="text-xs text-gray-600">분</p>
        </div>
      </div>

      {/* 생성 타입 표시 */}
      <div className="mt-3 pt-3 border-t">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>생성 방식</span>
          <span className={`px-2 py-1 rounded-full ${
            sessionDetail.creationType === 'series'
              ? 'bg-blue-50 text-blue-700'
              : 'bg-gray-50 text-gray-700'
          }`}>
            {sessionDetail.creationType === 'series' ? '시리즈' : '단독'}
          </span>
        </div>
      </div>
    </div>
  );
};