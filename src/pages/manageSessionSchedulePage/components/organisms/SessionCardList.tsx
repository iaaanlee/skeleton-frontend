import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDailySchedule } from '../../../../services/workoutService';
import { SessionSummary } from '../../../../types/workout';

type Props = {
  profileId: string;
  selectedDate: string;
};

export const SessionCardList: React.FC<Props> = ({ profileId, selectedDate }) => {
  const navigate = useNavigate();

  const { data: dailySchedule, isLoading, error } = useDailySchedule({
    profileId,
    date: selectedDate
  });

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-4 border animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">세션 데이터를 불러올 수 없습니다.</p>
        </div>
      </div>
    );
  }

  const sessions = dailySchedule?.sessions || [];

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {new Date(selectedDate).toLocaleDateString('ko-KR', {
            month: 'long',
            day: 'numeric',
            weekday: 'long'
          })}
        </h3>
        <div className="text-sm text-gray-500">
          총 {dailySchedule?.totalSessions || 0}개 세션
        </div>
      </div>

      {sessions.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-600 font-medium">이 날짜에 예정된 세션이 없습니다</p>
          <p className="text-gray-500 text-sm mt-1">새로운 세션을 추가해보세요</p>
          <button className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
            세션 추가
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <SessionCard
              key={session.sessionId}
              session={session}
              onCardClick={(sessionId) => {
                navigate(`/session-instance-details/${sessionId}`);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const SessionCard: React.FC<{
  session: SessionSummary;
  onCardClick: (sessionId: string) => void;
}> = ({ session, onCardClick }) => {
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'scheduled':
        return { label: '예정', bgColor: 'bg-blue-100', textColor: 'text-blue-800', iconColor: 'text-blue-600' };
      case 'started':
        return { label: '진행중', bgColor: 'bg-orange-100', textColor: 'text-orange-800', iconColor: 'text-orange-600' };
      case 'completed':
        return { label: '완료', bgColor: 'bg-green-100', textColor: 'text-green-800', iconColor: 'text-green-600' };
      default:
        return { label: '알 수 없음', bgColor: 'bg-gray-100', textColor: 'text-gray-800', iconColor: 'text-gray-600' };
    }
  };

  const statusInfo = getStatusInfo(session.status);
  const scheduledTime = new Date(session.scheduledAt).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div
      onClick={() => onCardClick(session.sessionId)}
      className="bg-white rounded-lg border hover:shadow-md transition-shadow cursor-pointer p-4"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <h4 className="font-medium text-gray-900 mr-3">
              {session.sessionName}
            </h4>
            <span className={`px-2 py-1 text-xs rounded-full ${statusInfo.bgColor} ${statusInfo.textColor}`}>
              {statusInfo.label}
            </span>
          </div>

          <div className="flex items-center text-sm text-gray-600 mb-2">
            <svg className={`w-4 h-4 mr-1 ${statusInfo.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{scheduledTime}</span>
            {session.estimatedDurationMinutes && (
              <>
                <span className="mx-2">•</span>
                <span>{session.estimatedDurationMinutes}분</span>
              </>
            )}
          </div>

          {session.seriesName && (
            <div className="flex items-center text-sm text-gray-500">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7l2 2-2 2m-2-2h-14m14 14l2-2-2-2" />
              </svg>
              <span>{session.seriesName}</span>
            </div>
          )}
        </div>

        <div className="ml-4 text-right">
          {session.completionRate !== undefined && session.completionRate > 0 && (
            <div className="text-sm font-medium text-green-600 mb-1">
              {session.completionRate}%
            </div>
          )}
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};