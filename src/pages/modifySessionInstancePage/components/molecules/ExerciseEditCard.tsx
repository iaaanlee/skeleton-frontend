import React, { useState } from 'react';
import type { EffectiveExerciseBlueprint, ExerciseSpec, PinState } from '../../../../types/workout';
import { PinWrapper } from '../atoms';

type Props = {
  exercise: EffectiveExerciseBlueprint;
  exerciseIndex: number;
  pinState?: PinState;
  onUpdate: (updatedExercise: EffectiveExerciseBlueprint) => void;
  onDelete: () => void;
};

export const ExerciseEditCard: React.FC<Props> = ({ exercise, exerciseIndex, pinState, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingSpec, setEditingSpec] = useState<ExerciseSpec>(exercise.spec);
  // PRD PAGES 요구사항: "모든 동일한 운동에 일괄 적용" 토글
  const [applyToAllSame, setApplyToAllSame] = useState(false);

  // Default Pin State (no pins active)
  const defaultPinState: PinState = {
    sessionPin: false,
    partPin: false,
    setPin: false,
    exercisePin: false
  };
  const activePinState = pinState || defaultPinState;

  const handleSave = () => {
    const updatedExercise = {
      ...exercise,
      spec: editingSpec
    };

    // PRD PAGES 요구사항: 일괄 적용 토글 처리
    if (applyToAllSame) {
      // TODO: Stage 4B 고급 구현에서 세션 내 동일한 exerciseTemplateId를 가진 모든 운동에 스펙 적용
      console.log('일괄 적용 모드: 동일한 운동에 스펙 적용 예정', {
        exerciseTemplateId: exercise.exerciseTemplateId,
        newSpec: editingSpec
      });
      // 실제 구현은 상위 컴포넌트에서 전체 세션 데이터에 접근해서 처리해야 함
    }

    onUpdate(updatedExercise);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditingSpec(exercise.spec);
    setApplyToAllSame(false); // 토글도 초기화
    setIsEditing(false);
  };

  const updateGoal = (updates: Partial<ExerciseSpec['goal']>) => {
    setEditingSpec(prev => ({
      ...prev,
      goal: { ...prev.goal, ...updates }
    }));
  };

  const updateLoad = (updates: Partial<ExerciseSpec['load']>) => {
    setEditingSpec(prev => ({
      ...prev,
      load: { ...prev.load, ...updates }
    }));
  };

  if (!isEditing) {
    return (
      <PinWrapper
        pinState={activePinState}
        onClick={() => setIsEditing(true)}
        className="bg-white p-3 border"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h5 className="font-medium text-gray-900 mb-1">
              {exercise.exerciseTemplateId} ({exercise.order}번째)
            </h5>
            <div className="text-sm text-gray-600 space-y-1">
              <div>
                목표: {exercise.spec.goal.rule === 'exact' ? '' : exercise.spec.goal.rule === 'min' ? '최소 ' : '최대 '}
                {exercise.spec.goal.value}
                {exercise.spec.goal.type === 'reps' ? '회' :
                 exercise.spec.goal.type === 'time' ? '초' :
                 exercise.spec.goal.type === 'distance' ? 'm' : 'kg'}
              </div>
              {exercise.spec.load.type !== 'none' && (
                <div>부하: {exercise.spec.load.text}</div>
              )}
              {exercise.spec.timeLimit && (
                <div>시간 제한: {exercise.spec.timeLimit}초</div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100 transition-colors text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button
              onClick={onDelete}
              className="flex items-center justify-center w-8 h-8 rounded hover:bg-red-100 transition-colors text-red-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </PinWrapper>
    );
  }

  return (
    <PinWrapper
      pinState={activePinState}
      className="bg-white p-4 border border-blue-200"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h5 className="font-medium text-gray-900">
            {exercise.exerciseTemplateId} 편집
          </h5>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCancel}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              저장
            </button>
            {/* PRD PAGES 요구사항: 삭제 버튼 (우상단 휴지통) */}
            <button
              onClick={onDelete}
              className="flex items-center justify-center w-8 h-8 rounded hover:bg-red-100 transition-colors text-red-600"
              title="운동 삭제"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Goal Settings */}
        <div className="space-y-3">
          <h6 className="text-sm font-medium text-gray-700">목표 설정</h6>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs text-gray-600 mb-1">목표 타입</label>
              <select
                value={editingSpec.goal.type}
                onChange={(e) => updateGoal({ type: e.target.value as ExerciseSpec['goal']['type'] })}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="reps">횟수</option>
                <option value="time">시간</option>
                <option value="distance">거리</option>
                <option value="weight">무게</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">기준</label>
              <select
                value={editingSpec.goal.rule}
                onChange={(e) => updateGoal({ rule: e.target.value as ExerciseSpec['goal']['rule'] })}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="exact">정확히</option>
                <option value="min">최소</option>
                <option value="max">최대</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">값</label>
              <input
                type="number"
                value={editingSpec.goal.value}
                onChange={(e) => updateGoal({ value: parseInt(e.target.value) || 0 })}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Load Settings */}
        <div className="space-y-3">
          <h6 className="text-sm font-medium text-gray-700">부하 설정</h6>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-600 mb-1">부하 타입</label>
              <select
                value={editingSpec.load.type}
                onChange={(e) => updateLoad({
                  type: e.target.value as ExerciseSpec['load']['type'],
                  value: e.target.value === 'none' ? null : editingSpec.load.value || 0,
                  text: e.target.value === 'none' ? '없음' : editingSpec.load.text
                })}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="none">없음</option>
                <option value="bodyweight">체중</option>
                <option value="weight">중량</option>
                <option value="resistance">저항</option>
              </select>
            </div>

            {editingSpec.load.type !== 'none' && (
              <div>
                <label className="block text-xs text-gray-600 mb-1">설명</label>
                <input
                  type="text"
                  value={editingSpec.load.text}
                  onChange={(e) => updateLoad({ text: e.target.value })}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="예: 10kg, 중간 저항 등"
                />
              </div>
            )}
          </div>
        </div>

        {/* Time Limit */}
        <div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="timeLimit"
              checked={editingSpec.timeLimit !== null}
              onChange={(e) => setEditingSpec(prev => ({
                ...prev,
                timeLimit: e.target.checked ? 60 : null
              }))}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label htmlFor="timeLimit" className="text-sm text-gray-700">시간 제한 설정</label>
          </div>

          {editingSpec.timeLimit !== null && (
            <div className="mt-2">
              <input
                type="number"
                value={editingSpec.timeLimit}
                onChange={(e) => setEditingSpec(prev => ({
                  ...prev,
                  timeLimit: parseInt(e.target.value) || 60
                }))}
                className="w-24 px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
              />
              <span className="ml-2 text-sm text-gray-600">초</span>
            </div>
          )}
        </div>

        {/* PRD PAGES 요구사항: 일괄 적용 토글 */}
        <div className="border-t pt-3">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="applyToAllSame"
              checked={applyToAllSame}
              onChange={(e) => setApplyToAllSame(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label htmlFor="applyToAllSame" className="text-sm text-gray-700">
              이 세션 내 모든 동일한 운동에 일괄 적용
            </label>
          </div>
          {applyToAllSame && (
            <p className="mt-1 text-xs text-gray-500">
              같은 운동({exercise.exerciseTemplateId})의 모든 강도와 목표가 함께 수정됩니다
            </p>
          )}
        </div>
      </div>
    </PinWrapper>
  );
};