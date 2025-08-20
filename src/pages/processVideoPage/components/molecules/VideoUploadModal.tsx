import React from 'react';
import { VideoUploadModalContent } from '../organisms/VideoUploadModalContent';

type VideoUploadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess?: () => void;
};

export const VideoUploadModal: React.FC<VideoUploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <VideoUploadModalContent 
        onClose={onClose}
        onUploadSuccess={onUploadSuccess}
      />
    </div>
  );
};