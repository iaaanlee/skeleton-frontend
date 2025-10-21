/**
 * BaseEditBottomSheet - 바텀시트 모달 편집 시스템 공통 기반 컴포넌트
 *
 * Phase 1: 모든 편집 모달의 기본 구조 제공
 * 기반: ExerciseSelectionBottomSheet.tsx 패턴
 * PRD 맞춤: X 버튼 제거, 휴지통 조건부, 완료 버튼 영역
 */

import React from 'react';
import type { BaseEditBottomSheetProps } from '../../../../types/editBottomSheet';

export const BaseEditBottomSheet: React.FC<BaseEditBottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  showDeleteIcon = false,
  onDelete,
  children
}) => {
  // 모달이 닫혀있으면 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-end">
      {/* Backdrop - 클릭시 바텀시트 닫기 */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Bottom Sheet Container - 95vh로 높이 증가하여 스크롤 최소화 */}
      <div className="relative w-full max-h-[95vh] bg-white rounded-t-xl flex flex-col">
        {/* Handle - 드래그 시각적 표시 */}
        <div className="flex justify-center py-2 flex-shrink-0">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header - PRD 맞춤 수정 */}
        <div className="px-4 pb-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            {/* 제목 */}
            <h2 className="text-lg font-semibold text-gray-900">
              {title}
            </h2>

            {/* 우측 액션 영역 */}
            <div className="flex items-center space-x-2">
              {/* 휴지통 아이콘 - ::c.png 운동 편집 전용 */}
              {showDeleteIcon && onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('이 운동을 삭제하시겠습니까?')) {
                      onDelete();
                    }
                  }}
                  className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-red-50 transition-colors text-red-600"
                  title="운동 삭제"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}

              {/* PRD 요구사항: X 버튼 제거 (참조 이미지에 없음) */}
              {/* 대신 backdrop 클릭 또는 완료 버튼으로 닫기 */}
            </div>
          </div>
        </div>

        {/* Content Area - 스크롤 가능한 영역 */}
        <div className="flex-1 overflow-y-auto px-4 pb-6">
          {children}
        </div>
      </div>
    </div>
  );
};