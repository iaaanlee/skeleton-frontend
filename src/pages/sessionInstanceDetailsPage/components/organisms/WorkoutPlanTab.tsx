import React, { useState } from 'react';
import type { EffectivePartBlueprint, SessionStatus, EffectiveSetBlueprint, ExerciseSpec } from '../../../../types/workout';

type Props = {
  effectiveBlueprint: EffectivePartBlueprint[];
  sessionStatus: SessionStatus;
};

export const WorkoutPlanTab: React.FC<Props> = ({ effectiveBlueprint, sessionStatus }) => {
  const [expandedParts, setExpandedParts] = useState<Set<string>>(new Set());
  const [activePart, setActivePart] = useState<string | null>(null);
  const [activeSet, setActiveSet] = useState<string | null>(null);

  const togglePartExpansion = (partSeedId: string) => {
    const newExpanded = new Set(expandedParts);
    if (expandedParts.has(partSeedId)) {
      newExpanded.delete(partSeedId);
    } else {
      newExpanded.add(partSeedId);
    }
    setExpandedParts(newExpanded);
  };

  const handlePartClick = (partSeedId: string) => {
    setActivePart(partSeedId);
    setActiveSet(null); // 파트 클릭 시 세트 선택 초기화
    togglePartExpansion(partSeedId);
  };

  const handleSetClick = (setSeedId: string, partSeedId: string) => {
    setActivePart(partSeedId);
    setActiveSet(setSeedId);
  };

  const formatExerciseSpec = (spec: ExerciseSpec) => {
    const { goal, load, timeLimit } = spec;

    let goalText = '';
    switch (goal.type) {
      case 'reps':
        goalText = `${goal.value}회`;
        break;
      case 'time':
        goalText = `${goal.value}초`;
        break;
      case 'distance':
        goalText = `${goal.value}m`;
        break;
      case 'weight':
        goalText = `${goal.value}kg`;
        break;
    }

    let loadText = load.text || '';
    if (load.type === 'weight' && load.value) {
      loadText = `${load.value}kg`;
    } else if (load.type === 'bodyweight') {
      loadText = '체중';
    }

    const parts = [goalText, loadText].filter(Boolean);

    if (timeLimit && timeLimit > 0) {
      parts.push(`제한시간 ${timeLimit}초`);
    }

    return parts.join(' · ');
  };

  const formatRestTime = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}초`;
    } else {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return remainingSeconds > 0 ? `${minutes}분 ${remainingSeconds}초` : `${minutes}분`;
    }
  };

  if (effectiveBlueprint.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <p className="text-gray-600 font-medium mb-2">운동 계획이 없습니다</p>
        <p className="text-gray-500 text-sm">세션에 운동이 추가되지 않았습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {effectiveBlueprint
        .sort((a, b) => a.order - b.order)
        .map((part) => {
          const isExpanded = expandedParts.has(part.partSeedId);
          const isActive = activePart === part.partSeedId;

          return (
            <div
              key={part.partSeedId}
              className={`bg-white rounded-lg border transition-all duration-200 ${
                isActive ? 'border-orange-400 shadow-md' : 'border-gray-200'
              }`}
            >
              {/* 파트 헤더 */}
              <button
                onClick={() => handlePartClick(part.partSeedId)}
                className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    isActive ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <span className="text-sm font-semibold">{part.order + 1}</span>
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">{part.partName}</h3>
                    <p className="text-sm text-gray-500">
                      {part.sets.length}개 세트 · {part.sets.reduce((sum, set) => sum + set.exercises.length, 0)}개 운동
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  {part.partBlueprintId === null && (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full mr-2">
                      새로 추가됨
                    </span>
                  )}
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      isExpanded ? 'rotate-90' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              {/* 파트 내용 (아코디언) */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-3">
                  {part.sets
                    .sort((a, b) => a.order - b.order)
                    .map((set, setIndex) => (
                      <SetCard
                        key={set.setSeedId}
                        set={set}
                        setIndex={setIndex}
                        isActive={activeSet === set.setSeedId}
                        onClick={() => handleSetClick(set.setSeedId, part.partSeedId)}
                        formatExerciseSpec={formatExerciseSpec}
                        formatRestTime={formatRestTime}
                      />
                    ))}
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};

// 세트 카드 컴포넌트
const SetCard: React.FC<{
  set: EffectiveSetBlueprint;
  setIndex: number;
  isActive: boolean;
  onClick: () => void;
  formatExerciseSpec: (spec: ExerciseSpec) => string;
  formatRestTime: (seconds: number) => string;
}> = ({ set, setIndex, isActive, onClick, formatExerciseSpec, formatRestTime }) => {
  return (
    <div
      className={`border rounded-lg p-3 cursor-pointer transition-colors ${
        isActive
          ? 'border-orange-400 bg-orange-50'
          : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
      }`}
      onClick={onClick}
    >
      {/* 세트 헤더 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-700 mr-2">
            세트 {setIndex + 1}
          </span>
          {set.setBlueprintId === null && (
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
              새로 추가됨
            </span>
          )}
        </div>
        <div className="flex items-center text-sm text-gray-500">
          {set.timeLimit && set.timeLimit > 0 && (
            <>
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="mr-3">{formatRestTime(set.timeLimit)}</span>
            </>
          )}
          {set.restTime > 0 && (
            <>
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15" />
              </svg>
              <span>휴식 {formatRestTime(set.restTime)}</span>
            </>
          )}
        </div>
      </div>

      {/* 운동 목록 */}
      <div className="space-y-2">
        {set.exercises
          .sort((a, b) => a.order - b.order)
          .map((exercise) => (
            <div
              key={exercise.exerciseTemplateId}
              className="flex items-center justify-between py-2 px-3 bg-white rounded border"
            >
              <div className="flex items-center">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3">
                  <span className="text-xs font-semibold">{exercise.order + 1}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    운동 {exercise.exerciseTemplateId} {/* TODO: 실제 운동명 조회 */}
                  </p>
                  <p className="text-xs text-gray-600">
                    {formatExerciseSpec(exercise.spec)}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};