import React from 'react';
import MediaUploadModalContent from '../organisms/MediaUploadModalContent';

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <MediaUploadModalContent 
        onClose={onClose}
        onUploadSuccess={onUploadSuccess}
      />
    </div>
  );
};
