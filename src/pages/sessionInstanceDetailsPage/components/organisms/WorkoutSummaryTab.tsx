import React from 'react';
import type { SessionDetail } from '../../../../types/workout';

type Props = {
  sessionDetail: SessionDetail;
};

export const WorkoutSummaryTab: React.FC<Props> = ({ sessionDetail }) => {
  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTotalRestTime = () => {
    return sessionDetail.effectiveBlueprint.reduce((totalRest, part) =>
      totalRest + part.sets.reduce((partRest, set) => partRest + (set.restTime || 0), 0), 0
    );
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}초`;
    } else {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return remainingSeconds > 0 ? `${minutes}분 ${remainingSeconds}초` : `${minutes}분`;
    }
  };

  const getExerciseTypes = () => {
    const exerciseCount = new Map<string, number>();

    sessionDetail.effectiveBlueprint.forEach(part => {
      part.sets.forEach(set => {
        set.exercises.forEach(exercise => {
          // TODO: 실제 운동 템플릿에서 운동 타입을 가져와야 함
          const exerciseType = `운동 ${exercise.exerciseTemplateId}`;
          exerciseCount.set(exerciseType, (exerciseCount.get(exerciseType) || 0) + 1);
        });
      });
    });

    return Array.from(exerciseCount.entries());
  };

  const totalRestTime = getTotalRestTime();
  const exerciseTypes = getExerciseTypes();

  return (
    <div className="space-y-6">
      {/* 세션 기본 정보 */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="font-semibold text-gray-900 mb-4">세션 정보</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">예정 시간</span>
            <span className="font-medium">{formatDateTime(sessionDetail.scheduledAt)}</span>
          </div>

          {sessionDetail.startedAt && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">시작 시간</span>
              <span className="font-medium">{formatDateTime(sessionDetail.startedAt)}</span>
            </div>
          )}

          {sessionDetail.completedAt && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">완료 시간</span>
              <span className="font-medium">{formatDateTime(sessionDetail.completedAt)}</span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-gray-600">생성 방식</span>
            <span className={`px-2 py-1 text-xs rounded-full ${
              sessionDetail.creationType === 'series'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {sessionDetail.creationType === 'series' ? '시리즈에서 생성' : '단독 생성'}
            </span>
          </div>

          {sessionDetail.seriesName && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">소속 프로그램</span>
              <span className="font-medium">{sessionDetail.seriesName}</span>
            </div>
          )}
        </div>
      </div>

      {/* 운동 통계 */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="font-semibold text-gray-900 mb-4">운동 통계</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{sessionDetail.preview.totalParts}</p>
            <p className="text-sm text-gray-600">총 파트</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{sessionDetail.preview.totalSets}</p>
            <p className="text-sm text-gray-600">총 세트</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">{sessionDetail.preview.totalExercises}</p>
            <p className="text-sm text-gray-600">총 운동</p>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">{sessionDetail.preview.estimatedDurationMinutes}</p>
            <p className="text-sm text-gray-600">예상시간(분)</p>
          </div>
        </div>
      </div>

      {/* 휴식 시간 정보 */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="font-semibold text-gray-900 mb-4">휴식 시간</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">총 휴식 시간</span>
            <span className="font-medium">{formatDuration(totalRestTime)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">평균 세트 간 휴식</span>
            <span className="font-medium">
              {sessionDetail.preview.totalSets > 0
                ? formatDuration(Math.round(totalRestTime / sessionDetail.preview.totalSets))
                : '0초'
              }
            </span>
          </div>
        </div>
      </div>

      {/* 운동 종류별 횟수 */}
      {exerciseTypes.length > 0 && (
        <div className="bg-white rounded-lg border p-4">
          <h3 className="font-semibold text-gray-900 mb-4">운동 구성</h3>
          <div className="space-y-2">
            {exerciseTypes.map(([exerciseType, count]) => (
              <div key={exerciseType} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                <span className="text-gray-700">{exerciseType}</span>
                <span className="font-medium text-gray-900">{count}회</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 파트별 상세 정보 */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="font-semibold text-gray-900 mb-4">파트별 상세</h3>
        <div className="space-y-3">
          {sessionDetail.effectiveBlueprint
            .sort((a, b) => a.order - b.order)
            .map((part, index) => (
              <div key={part.partSeedId} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">
                    {index + 1}. {part.partName}
                  </h4>
                  {part.partBlueprintId === null && (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                      새로 추가됨
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">세트: </span>
                    <span className="font-medium">{part.sets.length}개</span>
                  </div>
                  <div>
                    <span className="text-gray-600">운동: </span>
                    <span className="font-medium">
                      {part.sets.reduce((sum, set) => sum + set.exercises.length, 0)}개
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">휴식: </span>
                    <span className="font-medium">
                      {formatDuration(part.sets.reduce((sum, set) => sum + (set.restTime || 0), 0))}
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};