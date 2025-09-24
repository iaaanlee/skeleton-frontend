import React, { useState } from 'react';
import { ExerciseEditCard } from './ExerciseEditCard';
import type { EffectiveSetBlueprint, EffectiveExerciseBlueprint } from '../../../../types/workout';

type Props = {
  set: EffectiveSetBlueprint;
  setIndex: number;
  onUpdateSet: (updatedSet: EffectiveSetBlueprint) => void;
  onDeleteSet: () => void;
  onAddExercise: () => void;
};

export const SetEditCard: React.FC<Props> = ({
  set,
  setIndex,
  onUpdateSet,
  onDeleteSet,
  onAddExercise
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [editingRestTime, setEditingRestTime] = useState(set.restTime);
  const [editingTimeLimit, setEditingTimeLimit] = useState(set.timeLimit);

  const handleSaveSettings = () => {
    onUpdateSet({
      ...set,
      restTime: editingRestTime,
      timeLimit: editingTimeLimit
    });
    setIsEditingSettings(false);
  };

  const handleCancelSettings = () => {
    setEditingRestTime(set.restTime);
    setEditingTimeLimit(set.timeLimit);
    setIsEditingSettings(false);
  };

  const handleUpdateExercise = (exerciseIndex: number, updatedExercise: EffectiveExerciseBlueprint) => {
    const updatedExercises = [...set.exercises];
    updatedExercises[exerciseIndex] = updatedExercise;

    onUpdateSet({
      ...set,
      exercises: updatedExercises
    });
  };

  const handleDeleteExercise = (exerciseIndex: number) => {
    if (window.confirm('이 운동을 삭제하시겠습니까?')) {
      const updatedExercises = set.exercises.filter((_, index) => index !== exerciseIndex);
      onUpdateSet({
        ...set,
        exercises: updatedExercises
      });
    }
  };

  const handleDeleteSet = () => {
    if (window.confirm('이 세트를 삭제하시겠습니까? 포함된 모든 운동이 함께 삭제됩니다.')) {
      onDeleteSet();
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-3">
      {/* Set Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <svg
              className={`w-5 h-5 text-gray-600 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div>
            <h4 className="font-medium text-gray-900">
              세트 {set.order}
            </h4>
            <p className="text-sm text-gray-600">
              {set.exercises.length}개 운동
              {set.restTime > 0 && (
                <span className="ml-2">
                  • 휴식: {Math.floor(set.restTime / 60)}분 {set.restTime % 60}초
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsEditingSettings(!isEditingSettings)}
            className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
          >
            {isEditingSettings ? '취소' : '설정'}
          </button>
          <button
            onClick={onAddExercise}
            className="px-2 py-1 text-xs font-medium text-green-600 bg-green-50 rounded hover:bg-green-100 transition-colors"
          >
            + 운동
          </button>
          <button
            onClick={handleDeleteSet}
            className="flex items-center justify-center w-8 h-8 rounded hover:bg-red-100 transition-colors text-red-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Set Settings Editor */}
      {isEditingSettings && (
        <div className="bg-white rounded-lg p-3 mb-3 border">
          <div className="space-y-3">
            <h5 className="text-sm font-medium text-gray-900">세트 설정</h5>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">휴식 시간 (초)</label>
                <input
                  type="number"
                  value={editingRestTime}
                  onChange={(e) => setEditingRestTime(parseInt(e.target.value) || 0)}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">시간 제한 (초, 선택사항)</label>
                <input
                  type="number"
                  value={editingTimeLimit || ''}
                  onChange={(e) => setEditingTimeLimit(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                  placeholder="제한 없음"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCancelSettings}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleSaveSettings}
                className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exercises List */}
      {(isExpanded || set.exercises.length > 0) && (
        <div className="space-y-2">
          {set.exercises.map((exercise, exerciseIndex) => (
            <ExerciseEditCard
              key={`${exercise.exerciseTemplateId}-${exerciseIndex}`}
              exercise={exercise}
              exerciseIndex={exerciseIndex}
              onUpdate={(updatedExercise) => handleUpdateExercise(exerciseIndex, updatedExercise)}
              onDelete={() => handleDeleteExercise(exerciseIndex)}
            />
          ))}

          {set.exercises.length === 0 && (
            <div className="text-center py-4 text-gray-500 bg-white rounded-lg border border-dashed">
              <p className="text-sm mb-2">이 세트에는 운동이 없습니다.</p>
              <button
                onClick={onAddExercise}
                className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                첫 번째 운동 추가
              </button>
            </div>
          )}
        </div>
      )}

      {!isExpanded && set.exercises.length > 0 && (
        <div className="mt-2">
          <button
            onClick={() => setIsExpanded(true)}
            className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            운동 {set.exercises.length}개 보기
          </button>
        </div>
      )}
    </div>
  );
};