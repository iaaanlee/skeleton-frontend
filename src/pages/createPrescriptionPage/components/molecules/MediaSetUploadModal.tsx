import React, { useState } from 'react';
import { FileSelector } from '../../../../components/common/molecules/FileSelector';
import { UploadProgress } from '../../../../components/common/molecules/UploadProgress';
import { UploadButton } from '../../../../components/common/atoms/UploadButton';
import { useMediaSetUpload } from '../../../../hooks/useMediaSetUpload';

type MediaSetUploadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess?: () => void;
};

export const MediaSetUploadModal: React.FC<MediaSetUploadModalProps> = ({
  isOpen,
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
    // 모달이 닫힐 때 업로드 성공 알림
    if (uploadStatus === 'success') {
      onUploadSuccess?.();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            미디어 세트 업로드
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 컨텐츠 */}
        <div className="p-6">
          <div className="mb-4">
            <p className="text-gray-600 text-sm">
              분석을 위한 미디어 파일들을 업로드하세요. JPEG, JPG, PNG 형식을 지원합니다.
            </p>
          </div>

          <div className="space-y-4">
            {/* 파일 선택 영역 */}
            {uploadStatus === 'idle' && (
              <FileSelector
                multiple={true}
                disabled={false}
                onFilesSelect={handleFilesSelect}
              />
            )}

            {/* 업로드 버튼 */}
            {selectedFiles.length > 0 && uploadStatus === 'idle' && (
              <UploadButton
                fileCount={selectedFiles.length}
                disabled={false}
                onClick={handleUpload}
              />
            )}

            {/* 업로드 진행 상태 */}
            <UploadProgress
              status={uploadStatus}
              progress={progress}
              error={error}
            />
          </div>

          {/* 업로드 완료 안내 */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-blue-800">
                파일을 선택하고 업로드 버튼을 클릭하세요. 업로드가 완료되면 미디어 세트 목록에서 확인할 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <div className="flex justify-end space-x-3 p-6 border-t">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
