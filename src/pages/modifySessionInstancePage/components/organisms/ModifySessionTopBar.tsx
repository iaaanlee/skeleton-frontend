import React from 'react';

type Props = {
  sessionName: string;
  isModified: boolean;
  isSaving: boolean;
  onBack: () => void;
  onSave: () => void;
};

export const ModifySessionTopBar: React.FC<Props> = ({
  sessionName,
  isModified,
  isSaving,
  onBack,
  onSave
}) => {
  return (
    <div className="bg-white border-b">
      <div className="flex items-center justify-between p-4">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
          disabled={isSaving}
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Title */}
        <div className="flex-1 text-center">
          <h1 className="text-lg font-semibold text-gray-900 truncate px-4">
            {sessionName} 수정
          </h1>
          {isModified && (
            <p className="text-sm text-amber-600 mt-1">
              저장되지 않은 변경사항이 있습니다
            </p>
          )}
        </div>

        {/* 우측 여백 유지를 위한 빈 공간 */}
        <div className="w-10"></div>
      </div>
    </div>
  );
};