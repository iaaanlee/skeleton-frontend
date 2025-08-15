import React from 'react';
import { FileSelector } from '../../../../components/common/molecules/FileSelector';
import { UploadProgress } from '../../../../components/common/molecules/UploadProgress';
import { UploadButton } from '../../../../components/common/atoms/UploadButton';

type UploadContentProps = {
  selectedFiles: File[];
  uploadStatus: 'idle' | 'uploading' | 'success' | 'error';
  progress: number;
  error: string | undefined;
  onFilesSelect: (files: File[]) => void;
  onUpload: () => void;
};

const UploadContent: React.FC<UploadContentProps> = ({
  selectedFiles,
  uploadStatus,
  progress,
  error,
  onFilesSelect,
  onUpload
}) => {
  return (
    <div className="space-y-4">
      {uploadStatus === 'idle' && (
        <FileSelector
          multiple={true}
          disabled={false}
          onFilesSelect={onFilesSelect}
        />
      )}

      {selectedFiles.length > 0 && uploadStatus === 'idle' && (
        <UploadButton
          fileCount={selectedFiles.length}
          disabled={false}
          onClick={onUpload}
        />
      )}

      <UploadProgress
        status={uploadStatus}
        progress={progress}
        error={error}
      />
    </div>
  );
};

export default UploadContent;