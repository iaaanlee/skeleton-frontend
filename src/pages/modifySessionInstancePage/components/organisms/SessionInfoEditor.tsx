import React, { useState } from 'react';
import type { SessionDetail, ModifySessionRequest } from '../../../../types/workout';

type Props = {
  sessionDetail: SessionDetail;
  onChange: (changes: Partial<ModifySessionRequest>) => void;
};

export const SessionInfoEditor: React.FC<Props> = ({ sessionDetail, onChange }) => {
  const [sessionName, setSessionName] = useState(sessionDetail.sessionName);

  // 🔧 방어적 코딩: scheduledAt이 undefined일 경우 대비
  const safeScheduledAt = sessionDetail.scheduledAt || new Date().toISOString();

  const [scheduledDate, setScheduledDate] = useState(
    safeScheduledAt.split('T')[0]
  );
  const [scheduledTime, setScheduledTime] = useState(
    safeScheduledAt.split('T')[1]?.substring(0, 5) || '09:00'
  );

  const handleSessionNameChange = (name: string) => {
    setSessionName(name);
    onChange({ sessionName: name });
  };

  const handleDateTimeChange = (date: string, time: string) => {
    const scheduledAt = `${date}T${time}:00.000Z`;
    onChange({ scheduledAt });
  };

  const handleDateChange = (date: string) => {
    setScheduledDate(date);
    handleDateTimeChange(date, scheduledTime);
  };

  const handleTimeChange = (time: string) => {
    setScheduledTime(time);
    handleDateTimeChange(scheduledDate, time);
  };

  return (
    <div className="bg-white rounded-lg border p-4 space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">세션 기본 정보</h2>

      <div className="space-y-3">
        {/* Session Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            세션명
          </label>
          <input
            type="text"
            value={sessionName}
            onChange={(e) => handleSessionNameChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="세션명을 입력하세요"
            maxLength={100}
          />
        </div>

        {/* Scheduled Date and Time */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              예정 날짜
            </label>
            <input
              type="date"
              value={scheduledDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              예정 시간
            </label>
            <input
              type="time"
              value={scheduledTime}
              onChange={(e) => handleTimeChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Session Info Display */}
        <div className="bg-gray-50 rounded-lg p-3 text-sm">
          <div className="flex justify-between items-center mb-1">
            <span className="text-gray-600">세션 유형:</span>
            <span className="text-gray-900 font-medium">
              {sessionDetail.creationType === 'single' ? '단독 세션' : '시리즈 세션'}
            </span>
          </div>

          {sessionDetail.seriesName && (
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-600">시리즈명:</span>
              <span className="text-gray-900 font-medium">{sessionDetail.seriesName}</span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-gray-600">예상 소요 시간:</span>
            <span className="text-gray-900 font-medium">
              {sessionDetail.preview.estimatedDurationMinutes}분
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};