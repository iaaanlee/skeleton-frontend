import React from 'react';
import { ModalOverlay } from '../atoms/ModalOverlay';
import { ModalContainer } from '../atoms/ModalContainer';
import { ModalHeader } from '../molecules/ModalHeader';
import { WarningIcon } from '../atoms/WarningIcon';

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
    <ModalOverlay onClick={onCancel}>
      <ModalContainer>
        <ModalHeader title="파일 삭제 확인" onClose={onCancel} />
        
        {/* Content */}
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <WarningIcon />
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

        {/* Actions */}
        <div className="flex justify-end space-x-3 px-6 pb-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            삭제
          </button>
        </div>
      </ModalContainer>
    </ModalOverlay>
  );
};