import React from 'react';
import { VideoUploadSection } from '../molecules/VideoUploadSection';

type VideoUploadModalContentProps = {
  onClose: () => void;
  onUploadSuccess?: () => void;
};

export const VideoUploadModalContent: React.FC<VideoUploadModalContentProps> = ({
  onClose,
  onUploadSuccess
}) => {
  const handleUploadSuccess = () => {
    onUploadSuccess?.();
    onClose();
  };

  return (
    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      {/* Modal Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            비디오 미디어셋 업로드
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="모달 닫기"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Modal Content */}
      <div className="px-6 py-6">
        <VideoUploadSection onUploadSuccess={handleUploadSuccess} />
      </div>
    </div>
  );
};