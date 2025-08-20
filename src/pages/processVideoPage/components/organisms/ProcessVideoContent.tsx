import React, { useState, useRef } from 'react';
import { VideoMediaSetList, VideoMediaSetListRef } from '../molecules';
import { VideoUploadModal } from '../molecules/VideoUploadModal';

type ProcessVideoContentProps = {
  className?: string;
};

export const ProcessVideoContent: React.FC<ProcessVideoContentProps> = ({
  className = ''
}) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const mediaSetListRef = useRef<VideoMediaSetListRef | null>(null);

  const handleUploadSuccess = () => {
    // 업로드 성공 시 미디어셋 목록 새로고침
    mediaSetListRef.current?.refetch();
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 비디오 미디어셋 선택 섹션 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                비디오 미디어셋 선택
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                분석할 비디오를 선택하거나 새로운 비디오를 업로드하세요.
              </p>
            </div>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              미디어셋 추가
            </button>
          </div>
        </div>
        
        {/* 업로드된 비디오 미디어셋 목록 */}
        <div className="p-6">
          <VideoMediaSetList ref={mediaSetListRef} />
        </div>
      </div>

      {/* 비디오 업로드 모달 */}
      <VideoUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
      
      {/* 추후 피크 지점 분석 결과 표시 섹션이 여기에 추가될 예정 */}
    </div>
  );
};