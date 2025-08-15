import React, { useState } from 'react';
import { ModalOverlay } from '../atoms/ModalOverlay';
import { ModalContainer } from '../atoms/ModalContainer';
import { ModalHeader } from '../molecules/ModalHeader';
import FileUpload from '../organisms/FileUpload';

type UploadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess?: () => void;
};

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  const handleClose = () => {
    setUploadedFiles([]);
    onClose();
    // 모달이 닫힐 때 업로드 성공 알림
    if (uploadedFiles.length > 0) {
      onUploadSuccess?.();
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContainer className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <ModalHeader title="운동 이미지 업로드" onClose={handleClose} />
        
        {/* 컨텐츠 */}
        <div className="p-6">
          <div className="mb-4">
            <p className="text-gray-600 text-sm">
              운동 분석을 위한 이미지를 업로드하세요. JPEG, JPG, PNG 형식을 지원합니다.
            </p>
          </div>
          
          <FileUpload
            multiple={true}
            className="mb-4"
          />
        </div>
      </ModalContainer>
    </ModalOverlay>
  );
};