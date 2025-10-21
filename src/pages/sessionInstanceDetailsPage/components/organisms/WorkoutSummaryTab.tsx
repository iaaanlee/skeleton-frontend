import React from 'react';
import type { SessionDetail, EffectivePartBlueprint, ExerciseSpec } from '../../../../types/workout';
import { ExerciseName } from '../molecules/ExerciseName';

type Props = {
  sessionDetail: SessionDetail;
  onExerciseClick?: (exerciseTemplateId: string) => void;
};

// 문서 Phase 2.1 기준: 운동별 그룹핑 로직 (이미지 기준)
type ExerciseGroup = {
  exerciseTemplateId: string;
  name: string;
  sets: {
    setNumber: number;
    currentPlan: string;
    previousRecords: string[];
  }[];
};

export const WorkoutSummaryTab: React.FC<Props> = ({ sessionDetail, onExerciseClick }) => {
  const formatExerciseSpec = (spec: ExerciseSpec) => {
    const { goal, load, timeLimit } = spec;

    // Goal 텍스트 생성 (단위 변환: g→kg, mm→m)
    let goalText = '';
    let goalValue = goal.value;
    if (goal.type === 'mm' && goalValue) {
      goalValue = goalValue / 1000; // mm → m
    } else if (goal.type === 'g' && goalValue) {
      goalValue = goalValue / 1000; // g → kg
    }

    switch (goal.type) {
      case 'rep':
        goalText = `${goalValue}회`;
        break;
      case 'second':
        goalText = `${goalValue}초`;
        break;
      case 'mm':
        goalText = `${goalValue}m`;
        break;
      case 'g':
        goalText = `${goalValue}kg`;
        break;
    }

    // Load 텍스트 생성 (단위 변환: g→kg, mm→m)
    let loadText = '';
    let loadValue = load.value;
    if (load.type === 'g' && loadValue) {
      loadValue = loadValue / 1000; // g → kg
      loadText = `${loadValue}kg`;
    } else if (load.type === 'mm' && loadValue) {
      loadValue = loadValue / 1000; // mm → m
      loadText = `${loadValue}m`;
    } else if (load.type === 'second' && loadValue) {
      loadText = `${loadValue}초`;
    } else if (load.type === 'free') {
      loadText = load.text || '맨몸';
    }

    const parts = [goalText, loadText].filter(Boolean);

    if (timeLimit && timeLimit > 0) {
      parts.push(`제한시간 ${timeLimit}초`);
    }

    return parts.join(' · ');
  };

  // 문서 기준: 운동별 그룹핑 로직
  const groupExercisesByKey = (blueprint: EffectivePartBlueprint[]): ExerciseGroup[] => {
    const groups = new Map<string, ExerciseGroup>();

    blueprint.forEach(part => {
      part.sets.forEach(set => {
        set.exercises.forEach(exercise => {
          const key = exercise.exerciseTemplateId.toString();
          if (!groups.has(key)) {
            groups.set(key, {
              exerciseTemplateId: key,
              name: '', // ExerciseName 컴포넌트에서 표시
              sets: []
            });
          }

          const group = groups.get(key)!;
          group.sets.push({
            setNumber: group.sets.length + 1,
            currentPlan: formatExerciseSpec(exercise.spec),
            previousRecords: [] // TODO: API 연동 필요
          });
        });
      });
    });

    return Array.from(groups.values());
  };

  const exerciseGroups = groupExercisesByKey(sessionDetail.effectiveBlueprint);

  // 문서 기준: ExerciseSummaryTable 컴포넌트
  const ExerciseSummaryTable: React.FC<{ exercise: ExerciseGroup }> = ({ exercise }) => (
    <div className="exercise-section mb-6 bg-white rounded-lg border p-4">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span
          className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-orange-600 transition-colors"
          onClick={() => onExerciseClick?.(exercise.exerciseTemplateId)}
        >
          <ExerciseName exerciseTemplateId={exercise.exerciseTemplateId} />
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">세트</th>
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">이전 세션 기록(시리즈)</th>
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">이번 세션 계획</th>
            </tr>
          </thead>
          <tbody>
            {exercise.sets.map((set, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="py-3 px-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                    {set.setNumber}
                  </span>
                </td>
                <td className="py-3 px-2 text-sm text-gray-600">
                  {set.previousRecords.length > 0 ? set.previousRecords.join(', ') : '-'}
                </td>
                <td className="py-3 px-2 text-sm text-gray-900">{set.currentPlan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* 문서 기준: 운동별 섹션 그룹핑 */}
      {exerciseGroups.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <p className="text-gray-600 font-medium mb-2">운동이 없습니다</p>
          <p className="text-gray-500 text-sm">세션에 운동이 추가되지 않았습니다.</p>
        </div>
      ) : (
        exerciseGroups.map((exercise) => (
          <ExerciseSummaryTable
            key={exercise.exerciseTemplateId}
            exercise={exercise}
          />
        ))
      )}
    </div>
  );
};