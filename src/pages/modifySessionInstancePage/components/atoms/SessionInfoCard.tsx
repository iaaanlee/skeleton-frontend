import React from 'react';
import type { SessionDetail } from '../../../../types/workout';

type Props = {
  sessionDetail: SessionDetail;
  className?: string;
};

/**
 * Session Info Card - 참조 이미지 기반 재구현
 * 참조: front_ui_reference_images/:modify-session-instanece ::1.png
 * 좌측: 프로그램명 + 운동 요약, 우측: 상태 + 시작예정
 */
export const SessionInfoCard: React.FC<Props> = ({
  sessionDetail,
  className = ''
}) => {
  // 상태 표시 (예정/진행중/완료)
  const getStatusDisplay = (status: string) => {
    const statusMap = {
      'scheduled': '예정',
      'started': '진행중',
      'completed': '완료'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  // 상태별 색상 스타일
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'text-blue-600 bg-blue-50';
      case 'started':
        return 'text-green-600 bg-green-50';
      case 'completed':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  // 날짜/시간 포맷팅 (9/16 14:30 형태)
  const formatScheduledDateTime = (scheduledAt: string | undefined) => {
    if (!scheduledAt) return '-';

    try {
      const date = new Date(scheduledAt);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');

      return `${month}/${day} ${hours}:${minutes}`;
    } catch {
      return '-';
    }
  };

  // 운동 요약 정보 계산
  const calculateSummary = () => {
    const totalParts = sessionDetail.effectiveBlueprint?.length || 0;
    const totalSets = sessionDetail.effectiveBlueprint?.reduce(
      (sum, part) => sum + (part.sets?.length || 0), 0
    ) || 0;

    return `총 ${totalParts}파트 ${totalSets}세트`;
  };

  // 프로그램명 표시 (시리즈명 또는 세션명)
  const programName = sessionDetail.seriesName || sessionDetail.sessionName;
  const programSubtitle = sessionDetail.seriesName ?
    `${sessionDetail.sessionName}` : // 시리즈가 있으면 세션명을 부제로
    ''; // 시리즈가 없으면 부제 없음

  return (
    <div className={`bg-white rounded-2xl border border-gray-200 ${className}`}>
      {/* 헤더 */}
      <div className="px-4 py-3 border-b border-gray-100">
        <h2 className="text-sm font-medium text-gray-600">세션 정보</h2>
      </div>

      {/* 메인 정보 */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          {/* 좌측: 프로그램 정보 */}
          <div className="flex-1">
            <div className="mb-1">
              <h3 className="text-base font-semibold text-gray-900 leading-tight">
                {programName}
              </h3>
              {programSubtitle && (
                <p className="text-sm text-gray-600 mt-0.5">{programSubtitle}</p>
              )}
            </div>
            <p className="text-sm text-gray-500">
              {calculateSummary()}
            </p>
          </div>

          {/* 우측: 상태 및 시간 정보 */}
          <div className="text-right ml-4">
            <div className="space-y-1">
              <div className="flex items-center justify-end space-x-2">
                <span className="text-xs text-gray-500">상태</span>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(sessionDetail.status)}`}>
                  {getStatusDisplay(sessionDetail.status)}
                </span>
              </div>

              <div className="flex items-center justify-end space-x-2">
                <span className="text-xs text-gray-500">시작예정</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatScheduledDateTime(sessionDetail.scheduledAt)}
                </span>
              </div>

              <div className="flex items-center justify-end space-x-2">
                <span className="text-xs text-gray-500">총 소요</span>
                <span className="text-sm font-medium text-gray-900">
                  {sessionDetail.preview?.estimatedDurationMinutes ?
                    `${sessionDetail.preview.estimatedDurationMinutes}분` : '-'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};