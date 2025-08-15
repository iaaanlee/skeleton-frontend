import React, { useState } from 'react'
import { FileSelector } from './FileSelector'
import { UploadProgress } from './UploadProgress'
import { UploadButton } from '../atoms/UploadButton'
import { useFileUpload } from '../../../hooks/useFileUpload'

type FileUploadProps = {
  multiple?: boolean
  className?: string
  disabled?: boolean
}

const FileUpload: React.FC<FileUploadProps> = ({
  multiple = false,
  className = '',
  disabled = false
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const { uploadStatus, progress, error, uploadFiles } = useFileUpload()

  const handleFilesSelect = (files: File[]) => {
    setSelectedFiles(files)
  }

  const handleUpload = () => {
    uploadFiles(selectedFiles)
    setSelectedFiles([])
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 파일 선택 영역 */}
      {uploadStatus === 'idle' && (
        <FileSelector
          multiple={multiple}
          disabled={disabled}
          onFilesSelect={handleFilesSelect}
        />
      )}

      {/* 업로드 버튼 */}
      {selectedFiles.length > 0 && uploadStatus === 'idle' && (
        <UploadButton
          fileCount={selectedFiles.length}
          disabled={disabled}
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
  )
}

export default FileUpload
