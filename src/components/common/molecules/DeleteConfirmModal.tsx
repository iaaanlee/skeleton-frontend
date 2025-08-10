import React from 'react';

type DeleteConfirmModalProps = {
  isOpen: boolean;
  fileName: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  fileName,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            파일 삭제 확인
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="text-red-500 text-2xl">⚠️</div>
            <div>
              <p className="text-gray-900 font-medium">
                "{fileName}" 파일을 삭제하시겠습니까?
              </p>
              <p className="text-gray-600 text-sm mt-1">
                이 작업은 되돌릴 수 없습니다.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};
