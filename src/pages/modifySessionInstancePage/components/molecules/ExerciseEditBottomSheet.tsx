/**
 * ExerciseEditBottomSheet - 운동 정보 편집 전용 바텀시트 모달
 *
 * Phase 3: PRD 참조 이미지 ::c.png 구현
 * "중량 턱걸이" + 휴지통 아이콘 + 최근 기록 힌트 + 운동 정보 편집 + 일괄적용 토글
 */

import React, { useState, useEffect } from 'react';
import { BaseEditBottomSheet } from './BaseEditBottomSheet';
import type { ExerciseEditBottomSheetProps } from '../../../../types/editBottomSheet';
import type { ExerciseSpec } from '../../../../types/workout';
import { ExerciseName } from '../../../sessionInstanceDetailsPage/components/molecules/ExerciseName';

export const ExerciseEditBottomSheet: React.FC<ExerciseEditBottomSheetProps> = ({
  isOpen,
  onClose,
  exercise,
  onSave,
  onDelete,
  recentRecord
}) => {
  // 기존 ExerciseEditCard 편집 로직 100% 이전
  const [editingSpec, setEditingSpec] = useState<ExerciseSpec>(exercise.spec);
  // 기존 ExerciseEditCard 일괄 적용 로직 100% 이전
  const [applyToSameExercise, setApplyToSameExercise] = useState(false);

  // 모달이 열릴 때마다 현재값으로 초기화
  useEffect(() => {
    if (isOpen) {
      setEditingSpec(exercise.spec);
      setApplyToSameExercise(false);
    }
  }, [isOpen, exercise.spec]);

  // 기존 ExerciseEditCard 패턴 완전 보존
  const handleSave = () => {
    // 상위 컴포넌트로 결과 전달 (기존 인터페이스 100% 유지)
    onSave(editingSpec, applyToSameExercise);
    onClose();
  };

  const handleCancel = () => {
    // 변경사항 취소 후 모달 닫기
    setEditingSpec(exercise.spec);
    setApplyToSameExercise(false);
    onClose();
  };

  // PRD ::c.png 기준 제목: 운동명 (예: "중량 턱걸이")
  // ExerciseName 컴포넌트를 사용해서 실제 운동명 표시

  return (
    <BaseEditBottomSheet
      isOpen={isOpen}
      onClose={handleCancel} // backdrop 클릭시 취소
      title="운동 편집"
      showDeleteIcon={true} // PRD 요구사항: 휴지통 아이콘 표시
      onDelete={onDelete}
    >
      <div className="space-y-6">
        {/* 운동명 표시 */}
        <div className="text-center border-b pb-4">
          <h3 className="text-xl font-bold text-gray-900">
            <ExerciseName exerciseTemplateId={exercise.exerciseTemplateId} />
          </h3>
          <p className="text-sm text-gray-500 mt-1">운동 설정을 변경할 수 있습니다</p>
        </div>

        {/* PRD ::c.png: 최근 기록 힌트 */}
        {recentRecord && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start space-x-2">
              <div className="w-5 h-5 text-blue-600 mt-0.5">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">최근 기록</p>
                <p className="text-sm text-blue-600">{recentRecord}</p>
              </div>
            </div>
          </div>
        )}

        {/* PRD ::c.png 기준 운동 강도 편집 */}
        <div className="space-y-6">
          {/* 운동 강도 (부하) 설정 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
              운동 강도
            </label>

            {/* 부하 타입 선택 */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                { value: 'none', label: '없음' },
                { value: 'bodyweight', label: '체중' },
                { value: 'weight', label: '중량' },
                { value: 'resistance', label: '저항' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setEditingSpec(prev => ({
                    ...prev,
                    load: {
                      ...prev.load,
                      type: option.value as ExerciseSpec['load']['type'],
                      value: option.value === 'weight' ? (prev.load.value || 10) : null
                    }
                  }))}
                  className={`py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                    editingSpec.load.type === option.value
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* 중량 설정 (PRD ::c.png 스타일 +/- 버튼) */}
            {editingSpec.load.type === 'weight' && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-center space-x-6">
                  {/* - 버튼 */}
                  <button
                    onClick={() => setEditingSpec(prev => ({
                      ...prev,
                      load: {
                        ...prev.load,
                        value: Math.max(0, (prev.load.value || 10) - 2.5)
                      }
                    }))}
                    className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>

                  {/* 중량 표시 */}
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {editingSpec.load.value || 10} kg
                    </div>
                  </div>

                  {/* + 버튼 */}
                  <button
                    onClick={() => setEditingSpec(prev => ({
                      ...prev,
                      load: {
                        ...prev.load,
                        value: (prev.load.value || 10) + 2.5
                      }
                    }))}
                    className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
                <div className="text-center mt-2">
                  <span className="text-sm text-gray-500">2.5kg 단위</span>
                </div>
              </div>
            )}
          </div>

          {/* 목표 설정 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
              목표
            </label>

            {/* 목표 타입 선택 */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                { value: 'reps', label: '횟수' },
                { value: 'time', label: '시간' },
                { value: 'distance', label: '거리' },
                { value: 'weight', label: '중량' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setEditingSpec(prev => ({
                    ...prev,
                    goal: {
                      ...prev.goal,
                      type: option.value as ExerciseSpec['goal']['type'],
                      value: prev.goal.value || 10
                    }
                  }))}
                  className={`py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                    editingSpec.goal.type === option.value
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* 목표 값 설정 (PRD ::c.png 스타일 +/- 버튼) */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-center space-x-6">
                {/* - 버튼 */}
                <button
                  onClick={() => setEditingSpec(prev => ({
                    ...prev,
                    goal: {
                      ...prev.goal,
                      value: Math.max(1, (prev.goal.value || 10) - 1)
                    }
                  }))}
                  className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>

                {/* 목표 값 표시 */}
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {editingSpec.goal.value || 10} {editingSpec.goal.type === 'reps' ? '회' :
                      editingSpec.goal.type === 'time' ? '초' :
                      editingSpec.goal.type === 'distance' ? 'm' : 'kg'}
                  </div>
                </div>

                {/* + 버튼 */}
                <button
                  onClick={() => setEditingSpec(prev => ({
                    ...prev,
                    goal: {
                      ...prev.goal,
                      value: (prev.goal.value || 10) + 1
                    }
                  }))}
                  className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
              <div className="text-center mt-2">
                <span className="text-sm text-gray-500">1 단위</span>
              </div>
            </div>
          </div>
        </div>

        {/* PRD 핵심 요구사항: 일괄 적용 토글 */}
        <div className="border-t pt-4">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="applyToSameExercise"
              checked={applyToSameExercise}
              onChange={(e) => setApplyToSameExercise(e.target.checked)}
              className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <div className="flex-1">
              <label htmlFor="applyToSameExercise" className="text-sm font-medium text-gray-700">
                이 세션 내 모든 동일한 운동에 변경 사항 적용
              </label>
              {applyToSameExercise && (
                <p className="mt-1 text-xs text-gray-500">
                  이 세션의 모든 "<ExerciseName exerciseTemplateId={exercise.exerciseTemplateId} />" 운동이 동일한 설정으로 변경됩니다
                </p>
              )}
            </div>
          </div>
        </div>

        {/* PRD 요구사항: 취소/완료 버튼 */}
        <div className="flex space-x-3 pt-4">
          <button
            onClick={handleCancel}
            className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            완료
          </button>
        </div>
      </div>
    </BaseEditBottomSheet>
  );
};