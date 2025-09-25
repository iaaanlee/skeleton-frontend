import React, { useState } from 'react';
import { ExerciseSelectionBottomSheet, SetEditCard } from '../molecules';
import type { EffectivePartBlueprint, ModifySessionRequest, PartModification, ExerciseTemplate, EffectiveSetBlueprint, PinState } from '../../../../types/workout';
import { PinWrapper } from '../atoms';

type Props = {
  effectiveBlueprint: EffectivePartBlueprint[];
  sessionId: string;
  onChange: (changes: Partial<ModifySessionRequest>) => void;
};

export const WorkoutPlanEditor: React.FC<Props> = ({ effectiveBlueprint, sessionId, onChange }) => {
  const [expandedParts, setExpandedParts] = useState<Record<number, boolean>>({});
  // TODO: pendingModifications will be used in state management phase
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pendingModifications, setPendingModifications] = useState<PartModification[]>([]);

  // Default Pin State (no pins active) - will be replaced with actual Pin detection in next phase
  const defaultPinState: PinState = {
    sessionPin: false,
    partPin: false,
    setPin: false,
    exercisePin: false
  };

  // Suppress unused variable warning - will be used in state management implementation
  void setPendingModifications;
  const [showExerciseSelection, setShowExerciseSelection] = useState(false);
  const [selectedPartIndex, setSelectedPartIndex] = useState<number | null>(null);

  const togglePartExpansion = (partIndex: number) => {
    setExpandedParts(prev => ({
      ...prev,
      [partIndex]: !prev[partIndex]
    }));
  };

  const handleAddExercise = (partIndex: number) => {
    setSelectedPartIndex(partIndex);
    setShowExerciseSelection(true);
  };

  const handleExerciseSelected = (exercise: ExerciseTemplate) => {
    console.log('Selected exercise:', exercise.exerciseName, 'for part:', selectedPartIndex);
    // For now, just show an alert. The actual modification logic will be implemented in the next task
    alert(`"${exercise.exerciseName}" 운동이 선택되었습니다. 실제 추가 기능은 다음 단계에서 구현됩니다.`);
    setShowExerciseSelection(false);
    setSelectedPartIndex(null);
  };

  const handleCloseExerciseSelection = () => {
    setShowExerciseSelection(false);
    setSelectedPartIndex(null);
  };

  const handleUpdateSet = (partIndex: number, setIndex: number, updatedSet: EffectiveSetBlueprint) => {
    console.log('Updating set:', partIndex, setIndex, updatedSet);
    // For now, just log. The actual modification logic will be implemented in state management
    alert('세트 수정 기능은 상태 관리 구현 후 활성화됩니다.');
  };

  const handleDeleteSet = (partIndex: number, setIndex: number) => {
    console.log('Deleting set:', partIndex, setIndex);
    alert('세트 삭제 기능은 상태 관리 구현 후 활성화됩니다.');
  };

  const handleAddSet = (partIndex: number) => {
    console.log('Adding set to part:', partIndex);
    alert('세트 추가 기능은 상태 관리 구현 후 활성화됩니다.');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">운동 계획</h2>
        <button
          onClick={() => alert('새 파트 추가 기능은 다음 단계에서 구현됩니다.')}
          className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          + 파트 추가
        </button>
      </div>

      <div className="space-y-3">
        {effectiveBlueprint.map((part, partIndex) => (
          <PinWrapper
            key={part.partSeedId}
            pinState={defaultPinState}
            className="bg-white border"
          >
            {/* Part Header */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => togglePartExpansion(partIndex)}
                    className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <svg
                      className={`w-5 h-5 text-gray-600 transition-transform ${
                        expandedParts[partIndex] ? 'rotate-90' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  <div>
                    <h3 className="font-medium text-gray-900">
                      {part.partName} ({part.order}번째)
                    </h3>
                    <p className="text-sm text-gray-600">
                      {part.sets.length}개 세트, 총 {part.sets.reduce((total, set) => total + set.exercises.length, 0)}개 운동
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleAddExercise(partIndex)}
                    className="px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    + 운동
                  </button>
                  <button className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Part Content (Collapsible) */}
            {expandedParts[partIndex] && (
              <div className="p-4 space-y-3">
                {part.sets.map((set, setIndex) => (
                  <SetEditCard
                    key={set.setSeedId}
                    set={set}
                    setIndex={setIndex}
                    pinState={defaultPinState}
                    onUpdateSet={(updatedSet) => handleUpdateSet(partIndex, setIndex, updatedSet)}
                    onDeleteSet={() => handleDeleteSet(partIndex, setIndex)}
                    onAddExercise={() => handleAddExercise(partIndex)}
                  />
                ))}

                {part.sets.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    <p>이 파트에는 세트가 없습니다.</p>
                    <button
                      onClick={() => handleAddSet(partIndex)}
                      className="mt-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      첫 번째 세트 추가
                    </button>
                  </div>
                )}

                {/* Add Set Button */}
                {part.sets.length > 0 && (
                  <div className="text-center pt-2">
                    <button
                      onClick={() => handleAddSet(partIndex)}
                      className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-dashed border-blue-200"
                    >
                      + 세트 추가
                    </button>
                  </div>
                )}
              </div>
            )}
          </PinWrapper>
        ))}

        {effectiveBlueprint.length === 0 && (
          <div className="bg-white rounded-lg border p-8 text-center">
            <div className="text-gray-500 mb-4">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">이 세션에는 운동 계획이 없습니다.</p>
            <button
              onClick={() => alert('첫 번째 파트 추가 기능은 다음 단계에서 구현됩니다.')}
              className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              첫 번째 파트 추가하기
            </button>
          </div>
        )}
      </div>

      {/* Exercise Selection Bottom Sheet */}
      <ExerciseSelectionBottomSheet
        isOpen={showExerciseSelection}
        onClose={handleCloseExerciseSelection}
        onSelectExercise={handleExerciseSelected}
      />
    </div>
  );
};