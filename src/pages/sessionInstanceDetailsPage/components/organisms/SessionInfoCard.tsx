import React from 'react';
import type { SessionDetail } from '../../../../types/workout';

type Props = {
  sessionDetail: SessionDetail;
};

export const SessionInfoCard: React.FC<Props> = ({ sessionDetail }) => {
  // 문서 Phase 2.2: 상태별 텍스트 반환
  const getStatusText = (status: SessionDetail['status']) => {
    switch (status) {
      case 'scheduled':
        return '미진행';
      case 'started':
        return '진행중';
      case 'completed':
        return '완료';
      default:
        return '알 수 없음';
    }
  };

  // 문서 Phase 2.2: 간단한 날짜/시간 형식
  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('ko-KR', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg border p-4">
      {/* 문서 Phase 2.2: 이미지 기준 레이아웃 - 좌측 세션 정보, 우상단 상태 */}
      <div className="flex justify-between items-start mb-4">
        {/* 좌측: 세션 기본 정보 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{sessionDetail.sessionName}</h3>
          <p className="text-sm text-gray-600 mb-1">
            총 {sessionDetail.preview.totalParts}파트 {sessionDetail.preview.totalSets}세트
          </p>
          {sessionDetail.seriesName && (
            <p className="text-xs text-gray-500">프로그램: {sessionDetail.seriesName}</p>
          )}
        </div>

        {/* 우상단: 상태 정보 (이미지 기준) */}
        <div className="text-right text-sm">
          <div className="mb-1">
            <span className="text-gray-600">상태</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
              sessionDetail.status === 'scheduled' ? 'bg-gray-100 text-gray-700' :
              sessionDetail.status === 'started' ? 'bg-blue-100 text-blue-700' :
              'bg-green-100 text-green-700'
            }`}>
              {getStatusText(sessionDetail.status)}
            </span>
          </div>

          <div className="text-xs text-gray-600 mb-1">
            <span>시작(예정) </span>
            <span className="font-medium text-gray-900">
              {formatDateTime(sessionDetail.scheduledAt)}
            </span>
          </div>

          <div className="text-xs text-gray-600">
            <span>종료 </span>
            <span className="font-medium text-gray-900">
              {sessionDetail.completedAt ? formatDateTime(sessionDetail.completedAt) : '-'}
            </span>
          </div>
        </div>
      </div>

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