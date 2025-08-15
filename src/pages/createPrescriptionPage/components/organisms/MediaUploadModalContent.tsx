import React, { useState } from 'react';
import { useMediaSetUpload } from '../../../../hooks/useMediaSetUpload';
import { ModalLayout } from '../../../../components/common/templates';
import UploadInstructions from '../molecules/UploadInstructions';
import UploadContent from '../molecules/UploadContent';
import InfoPanel from '../molecules/InfoPanel';

type MediaUploadModalContentProps = {
  onClose: () => void;
  onUploadSuccess?: () => void;
};

const MediaUploadModalContent: React.FC<MediaUploadModalContentProps> = ({
  onClose,
  onUploadSuccess
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { uploadStatus, progress, error, uploadFiles } = useMediaSetUpload();

  const handleFilesSelect = (files: File[]) => {
    setSelectedFiles(files);
  };

  const handleUpload = () => {
    uploadFiles(selectedFiles);
    setSelectedFiles([]);
  };

  const handleClose = () => {
    setSelectedFiles([]);
    onClose();
    if (uploadStatus === 'success') {
      onUploadSuccess?.();
    }
  };

  return (
    <ModalLayout 
      title="미디어 세트 업로드"
      onClose={handleClose}
    >
      <UploadInstructions 
        description="분석을 위한 미디어 파일들을 업로드하세요. JPEG, JPG, PNG 형식을 지원합니다." 
      />

      <UploadContent
        selectedFiles={selectedFiles}
        uploadStatus={uploadStatus}
        progress={progress}
        error={error || undefined}
        onFilesSelect={handleFilesSelect}
        onUpload={handleUpload}
      />

      <InfoPanel 
        message="파일을 선택하고 업로드 버튼을 클릭하세요. 업로드가 완료되면 미디어 세트 목록에서 확인할 수 있습니다." 
      />
    </ModalLayout>
  );
};

export default MediaUploadModalContent;