/**
 * TimeLimitEditBottomSheet - 운동 시간 제한 편집 전용 바텀시트 모달
 *
 * Phase 4: PRD 참조 이미지 ::d.png 구현
 * "운동 시간 제한" + ON/OFF 토글 + 시간 설정 + 일괄적용 토글 + 완료 버튼
 */

import React, { useState, useEffect } from 'react';
import { BaseEditBottomSheet } from './BaseEditBottomSheet';
import type { TimeLimitEditBottomSheetProps } from '../../../../types/editBottomSheet';

export const TimeLimitEditBottomSheet: React.FC<TimeLimitEditBottomSheetProps> = ({
  isOpen,
  onClose,
  currentTimeLimit,
  onSave
}) => {
  // 기존 SetEditCard.editingTimeLimit 로직 100% 이전
  const [editingTimeLimit, setEditingTimeLimit] = useState<number | null>(currentTimeLimit);
  // 기존 SetEditCard.applyToSimilarSets 로직 100% 이전 (시간제한용)
  const [applyToAllTimeLimit, setApplyToAllTimeLimit] = useState(false);

  // 모달이 열릴 때마다 현재값으로 초기화
  useEffect(() => {
    if (isOpen) {
      setEditingTimeLimit(currentTimeLimit);
      setApplyToAllTimeLimit(false);
    }
  }, [isOpen, currentTimeLimit]);

  // 기존 SetEditCard.handleSaveSettings 패턴 완전 보존
  const handleSave = () => {
    // 상위 컴포넌트로 결과 전달 (기존 인터페이스 100% 유지)
    onSave(editingTimeLimit, applyToAllTimeLimit);
    onClose();
  };

  const handleCancel = () => {
    // 변경사항 취소 후 모달 닫기
    setEditingTimeLimit(currentTimeLimit);
    setApplyToAllTimeLimit(false);
    onClose();
  };

  // 시간 포맷팅 함수 (기존 SetEditCard와 동일 패턴)
  const formatTimeLimit = (seconds: number | null) => {
    if (seconds === null || seconds === 0) {
      return "제한 없음";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes > 0 && remainingSeconds > 0) {
      return `${minutes}분 ${remainingSeconds}초`;
    } else if (minutes > 0) {
      return `${minutes}분`;
    } else {
      return `${remainingSeconds}초`;
    }
  };

  // PRD ::d.png 기준 제목: "운동 시간 제한"
  const modalTitle = "운동 시간 제한";

  return (
    <BaseEditBottomSheet
      isOpen={isOpen}
      onClose={handleCancel} // backdrop 클릭시 취소
      title={modalTitle}
      showDeleteIcon={true} // PRD ::d.png 요구사항: 휴지통 아이콘 표시
      onDelete={() => {
        // 시간 제한 삭제 = null로 설정
        setEditingTimeLimit(null);
        onSave(null, applyToAllTimeLimit);
        onClose();
      }}
    >
      <div className="space-y-6">
        {/* PRD ::d.png: 설명 텍스트 */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start space-x-2">
            <div className="w-5 h-5 text-blue-600 mt-0.5">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-800">시간 제한</p>
              <p className="text-sm text-blue-600">
                시간 제한이 끝나면 다음 휴식 시간으로 넘어가요
              </p>
            </div>
          </div>
        </div>

        {/* 현재 시간제한 표시 */}
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {formatTimeLimit(editingTimeLimit)}
          </div>
          <p className="text-sm text-gray-500">현재 설정된 시간 제한</p>
        </div>

        {/* PRD 핵심 요구사항: 시간 제한 ON/OFF 토글 */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">시간 제한 활성화</p>
              <p className="text-sm text-gray-500">운동에 시간 제한을 설정합니다</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={editingTimeLimit !== null && editingTimeLimit > 0}
                onChange={(e) => {
                  if (e.target.checked) {
                    setEditingTimeLimit(120); // PRD ::d.png 기본값: 120초
                  } else {
                    setEditingTimeLimit(null); // 제한 없음
                  }
                }}
                className="sr-only"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {/* 시간 설정 (활성화된 경우만) */}
        {editingTimeLimit !== null && editingTimeLimit > 0 && (
          <div className="space-y-4">
            {/* +/- 버튼 컨트롤 (30초 단위) */}
            <div className="flex items-center justify-center space-x-6">
              {/* - 버튼 (30초 감소) */}
              <button
                onClick={() => setEditingTimeLimit(prev => Math.max(30, (prev || 120) - 30))}
                className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>

              {/* 30초 단위 표시 */}
              <div className="px-6 py-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600 font-medium text-center">30초 단위</p>
              </div>

              {/* + 버튼 (30초 증가) */}
              <button
                onClick={() => setEditingTimeLimit(prev => (prev || 0) + 30)}
                className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>

            {/* 직접 입력 옵션 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                직접 입력 (초)
              </label>
              <input
                type="number"
                value={editingTimeLimit || 120}
                onChange={(e) => setEditingTimeLimit(Math.max(1, parseInt(e.target.value) || 120))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                step="30"
              />
            </div>
          </div>
        )}

        {/* PRD 핵심 요구사항: 일괄 적용 토글 */}
        <div className="border-t pt-4">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="applyToAllTimeLimit"
              checked={applyToAllTimeLimit}
              onChange={(e) => setApplyToAllTimeLimit(e.target.checked)}
              className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <div className="flex-1">
              <label htmlFor="applyToAllTimeLimit" className="text-sm font-medium text-gray-700">
                이 세션 내 모든 시간 제한에 변경 사항 적용
              </label>
              {applyToAllTimeLimit && (
                <p className="mt-1 text-xs text-gray-500">
                  이 세션의 모든 운동 시간 제한이 {formatTimeLimit(editingTimeLimit)}로 변경됩니다
                </p>
              )}
            </div>
          </div>
        </div>

        {/* PRD 요구사항: 완료 버튼 */}
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