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
  const [poseDescription, setPoseDescription] = useState<string>('');
  const { uploadStatus, progress, error, uploadFiles } = useMediaSetUpload();

  const handleFilesSelect = (files: File[]) => {
    setSelectedFiles(files);
  };

  const handleUpload = () => {
    if (!poseDescription.trim()) {
      alert('자세 설명을 입력해주세요.');
      return;
    }
    uploadFiles(selectedFiles, poseDescription.trim());
    setSelectedFiles([]);
    setPoseDescription('');
  };

  const handleClose = () => {
    setSelectedFiles([]);
    setPoseDescription('');
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

      {/* 자세 설명 입력 필드 */}
      <div className="mb-6">
        <label htmlFor="pose-description" className="block text-sm font-medium text-gray-700 mb-2">
          자세 설명 *
        </label>
        <input
          id="pose-description"
          type="text"
          value={poseDescription}
          onChange={(e) => setPoseDescription(e.target.value)}
          placeholder="예: 스쿼트, 데드리프트, 벤치프레스 등"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          maxLength={100}
        />
        <p className="text-xs text-gray-500 mt-1">
          어떤 자세인지 간단히 설명해주세요. (최대 100자)
        </p>
      </div>

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