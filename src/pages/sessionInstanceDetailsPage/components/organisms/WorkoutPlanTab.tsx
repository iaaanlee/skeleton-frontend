import React, { useState } from 'react';
import type {
  EffectivePartBlueprint,
  SessionStatus,
  EffectiveSetBlueprint,
  ExerciseSpec,
  ActiveItem
} from '../../../../types/workout';
import { ExerciseName } from '../molecules/ExerciseName';

type Props = {
  effectiveBlueprint: EffectivePartBlueprint[];
  sessionStatus: SessionStatus;
};

export const WorkoutPlanTab: React.FC<Props> = ({ effectiveBlueprint, sessionStatus }) => {
  // PRD 요구사항: 파트1만 펼침 (line 240)
  const [expandedParts, setExpandedParts] = useState<Set<string>>(
    new Set(effectiveBlueprint.length > 0 ? [effectiveBlueprint[0].partSeedId] : [])
  );

  // PRD 요구사항: 단일 객체 활성화 시스템 (line 235)
  const [activeItem, setActiveItem] = useState<ActiveItem>(null);

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
    setActiveItem({ level: 'part', id: partSeedId });
  };

  const handlePartToggle = (partSeedId: string) => {
    togglePartExpansion(partSeedId);
  };

  const handleSetClick = (setSeedId: string) => {
    setActiveItem({ level: 'set', id: setSeedId });
  };

  const handleExerciseClick = (exerciseId: string) => {
    setActiveItem({ level: 'move', id: exerciseId });
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

  const formatRestTime = (seconds: number | null | undefined) => {
    if (!seconds || seconds <= 0) {
      return '0초';
    }

    const validSeconds = Math.floor(Number(seconds));
    if (validSeconds < 60) {
      return `${validSeconds}초`;
    } else {
      const minutes = Math.floor(validSeconds / 60);
      const remainingSeconds = validSeconds % 60;
      return remainingSeconds > 0 ? `${minutes}분 ${remainingSeconds}초` : `${minutes}분`;
    }
  };

  // 이미지 기준 파트 헤더 요약 텍스트 - "총 3세트 · 중량 덤벨이 x 3, 할로우 바디 포지션 x 2"
  const getPartSummary = (part: EffectivePartBlueprint): string => {
    const totalSets = part.sets.length;
    const exerciseCounts = new Map<string, number>();

    // 각 운동별로 등장 횟수 카운트
    part.sets.forEach(set => {
      set.exercises.forEach(exercise => {
        const templateId = exercise.exerciseTemplateId.toString();
        exerciseCounts.set(templateId, (exerciseCounts.get(templateId) || 0) + 1);
      });
    });

    if (exerciseCounts.size === 0) {
      return `총 ${totalSets}세트`;
    }

    // 운동 개수만 표시 (운동명은 복잡하므로 개수만)
    const exerciseTypes = exerciseCounts.size;
    const totalExercises = Array.from(exerciseCounts.values()).reduce((sum, count) => sum + count, 0);

    return `총 ${totalSets}세트 · ${exerciseTypes}개 운동 ${totalExercises}회`;
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
        .map((part, index) => {
          const isExpanded = expandedParts.has(part.partSeedId);
          const isActive = activeItem?.level === 'part' && activeItem.id === part.partSeedId;

          return (
            <div
              key={part.partSeedId}
              id={`part-${part.partSeedId}`}
              className={`bg-white rounded-lg border transition-all duration-200 ${
                isActive ? 'border-orange-400 shadow-md' : 'border-gray-200'
              }`}
            >
              {/* 파트 헤더 */}
              <div className="px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div
                  className="flex items-center flex-1 cursor-pointer"
                  onClick={() => handlePartClick(part.partSeedId)}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    isActive ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <span className="text-sm font-semibold">{index + 1}</span>
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">{part.partName}</h3>
                    <p className="text-sm text-gray-500">
                      {getPartSummary(part)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  {part.partBlueprintId === null && (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full mr-2">
                      새로 추가됨
                    </span>
                  )}
                  <button
                    onClick={() => handlePartToggle(part.partSeedId)}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                  >
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
                  </button>
                </div>
              </div>

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
                        isActive={activeItem?.level === 'set' && activeItem.id === set.setSeedId}
                        onClick={() => handleSetClick(set.setSeedId)}
                        formatExerciseSpec={formatExerciseSpec}
                        formatRestTime={formatRestTime}
                        activeItem={activeItem}
                        onExerciseClick={handleExerciseClick}
                        sessionStatus={sessionStatus}
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

// 세트 카드 컴포넌트 - 문서 Phase 0.1 구조 완전 재구현
const SetCard: React.FC<{
  set: EffectiveSetBlueprint;
  setIndex: number;
  isActive: boolean;
  onClick: () => void;
  formatExerciseSpec: (spec: ExerciseSpec) => string;
  formatRestTime: (seconds: number) => string;
  activeItem: ActiveItem;
  onExerciseClick: (exerciseId: string) => void;
  sessionStatus: SessionStatus;
}> = ({ set, setIndex, isActive, onClick, formatExerciseSpec, formatRestTime, activeItem, onExerciseClick, sessionStatus }) => {
  return (
    <div
      id={`set-${set.setSeedId}`}
      className={`border rounded-lg overflow-hidden cursor-pointer transition-colors ${
        isActive
          ? 'border-orange-400 bg-orange-50'
          : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
      }`}
      onClick={onClick}
    >
      {/* 세트 헤더 - 세트 번호와 새로 추가됨 배지만 */}
      <div className="px-3 pt-3 pb-2">
        <div className="flex items-center justify-between">
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
        </div>
      </div>

      {/* 문서 기준: 세트 상단 - 시간제한 배지 */}
      <div className="px-3 mb-3">
        <div className="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
          {set.timeLimit === null || set.timeLimit === 0
            ? "운동 시간 제한 없음"
            : `운동 시간 제한 ${set.timeLimit}초`}
        </div>
      </div>

      {/* 문서 기준: 세트 내용 (운동 목록) */}
      <div className="px-3 space-y-2">
        {set.exercises
          .sort((a, b) => a.order - b.order)
          .map((exercise) => {
            const exerciseKey = `${set.setSeedId}-${exercise.exerciseTemplateId}-${exercise.order}`;
            const isExerciseActive = activeItem?.level === 'move' && activeItem.id === exerciseKey;

            return (
              <div
                key={exerciseKey}
                id={`exercise-${exercise.exerciseTemplateId}`}
                className={`flex items-center justify-between py-2 px-3 rounded border cursor-pointer transition-colors ${
                  isExerciseActive
                    ? 'bg-orange-50 border-orange-300'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  onExerciseClick(exerciseKey);
                }}
              >
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                    isExerciseActive
                      ? 'bg-orange-100 text-orange-600'
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    <span className="text-xs font-semibold">{exercise.order + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      <ExerciseName
                        exerciseTemplateId={exercise.exerciseTemplateId.toString()}
                      />
                    </p>
                    <p className="text-xs text-gray-600">
                      {formatExerciseSpec(exercise.spec)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* 문서 기준: 세트 하단 - 휴식시간 섹션 */}
      {set.restTime && set.restTime > 0 && (
        <div className="mt-3 p-2 bg-blue-50 rounded text-sm text-center mx-3 mb-3">
          <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293L12 11l.707-.707A1 1 0 0113.414 10H15M9 10v4.586a1 1 0 00.293.707L10 16l.707-.707A1 1 0 0011.414 15H13M9 10V9a2 2 0 012-2h2a2 2 0 012 2v1" />
          </svg>
          운동 후 휴식 {formatRestTime(set.restTime)}
          {sessionStatus === 'started' && <span className="text-xs opacity-75"> (진행중)</span>}
        </div>
      )}
    </div>
  );
};