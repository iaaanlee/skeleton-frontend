/**
 * RestTimeEditBottomSheet - 휴식시간 편집 전용 바텀시트 모달
 *
 * Phase 2: PRD 참조 이미지 ::b.png 구현
 * "파트1 - 세트 1 | 휴식 시간" + +/- 버튼 + 일괄적용 토글 + 완료 버튼
 */

import React, { useState, useEffect } from 'react';
import { BaseEditBottomSheet } from './BaseEditBottomSheet';
import type { RestTimeEditBottomSheetProps } from '../../../../types/editBottomSheet';

export const RestTimeEditBottomSheet: React.FC<RestTimeEditBottomSheetProps> = ({
  isOpen,
  onClose,
  currentRestTime,
  partName,
  setIndex,
  onSave
}) => {
  // 기존 SetEditCard.editingRestTime 로직 100% 이전
  const [editingRestTime, setEditingRestTime] = useState(currentRestTime);
  // 기존 SetEditCard.applyToSimilarSets 로직 100% 이전
  const [applyToAllRest, setApplyToAllRest] = useState(false);

  // 모달이 열릴 때마다 현재값으로 초기화
  useEffect(() => {
    if (isOpen) {
      setEditingRestTime(currentRestTime);
      setApplyToAllRest(false);
    }
  }, [isOpen, currentRestTime]);

  // PRD 요구사항: +/- 버튼으로 30초 단위 조절
  const incrementRestTime = () => {
    setEditingRestTime(prev => prev + 30);
  };

  const decrementRestTime = () => {
    setEditingRestTime(prev => Math.max(0, prev - 30)); // 0초 이하로 내려가지 않음
  };

  // 기존 SetEditCard.handleSaveSettings 패턴 완전 보존
  const handleSave = () => {
    // 상위 컴포넌트로 결과 전달 (기존 인터페이스 100% 유지)
    onSave(editingRestTime, applyToAllRest);
    onClose();
  };

  const handleCancel = () => {
    // 변경사항 취소 후 모달 닫기
    setEditingRestTime(currentRestTime);
    setApplyToAllRest(false);
    onClose();
  };

  // 시간 포맷팅 함수 (기존 SetEditCard와 동일 패턴)
  const formatRestTime = (seconds: number) => {
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

  // PRD ::b.png 기준 제목: "파트1 - 세트 1 | 휴식 시간"
  const modalTitle = `${partName} - 세트 ${setIndex + 1} | 휴식 시간`;

  return (
    <BaseEditBottomSheet
      isOpen={isOpen}
      onClose={handleCancel} // backdrop 클릭시 취소
      title={modalTitle}
      showDeleteIcon={false} // 휴식시간 편집에는 삭제 아이콘 없음
    >
      <div className="space-y-6">
        {/* 현재 휴식시간 표시 */}
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {formatRestTime(editingRestTime)}
          </div>
          <p className="text-sm text-gray-500">현재 설정된 휴식시간</p>
        </div>

        {/* PRD 요구사항: +/- 버튼 컨트롤 */}
        <div className="flex items-center justify-center space-x-6">
          {/* - 버튼 (30초 감소) */}
          <button
            onClick={decrementRestTime}
            disabled={editingRestTime <= 0}
            className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
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
            onClick={incrementRestTime}
            className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>

        {/* 직접 입력 옵션 (추가 편의성) */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            직접 입력 (초)
          </label>
          <input
            type="number"
            value={editingRestTime}
            onChange={(e) => setEditingRestTime(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
            step="30"
          />
        </div>

        {/* PRD 핵심 요구사항: 일괄 적용 토글 */}
        <div className="border-t pt-4">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="applyToAllRest"
              checked={applyToAllRest}
              onChange={(e) => setApplyToAllRest(e.target.checked)}
              className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <div className="flex-1">
              <label htmlFor="applyToAllRest" className="text-sm font-medium text-gray-700">
                이 세션 내 모든 휴식에 변경 사항 적용
              </label>
              {applyToAllRest && (
                <p className="mt-1 text-xs text-gray-500">
                  이 세션의 모든 세트 휴식시간이 {formatRestTime(editingRestTime)}로 변경됩니다
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