import React, { useState } from 'react'
import PrescriptionFileUpload from '../molecules/PrescriptionFileUpload'
import PrescriptionFileList from '../molecules/PrescriptionFileList'
import { ServerFile } from '../../../../types/files'

type PrescriptionUploadSectionProps = {
  profileId: string
  onUploadSuccess?: (file: ServerFile) => void
  onUploadError?: (error: string) => void
  onFileSelect?: (file: ServerFile) => void
  onFileDelete?: (fileId: string) => void
  onFileDownload?: (file: ServerFile) => void
  onAnalysisStart?: (fileIds: string[]) => void
  className?: string
}

const PrescriptionUploadSection: React.FC<PrescriptionUploadSectionProps> = ({
  profileId,
  onUploadSuccess,
  onUploadError,
  onFileSelect,
  onFileDelete,
  onFileDownload,
  onAnalysisStart,
  className = ''
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<ServerFile[]>([])

  const handleUploadSuccess = (file: ServerFile) => {
    setUploadedFiles(prev => [...prev, file])
    onUploadSuccess?.(file)
  }

  const handleFileDelete = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file._id !== fileId))
    onFileDelete?.(fileId)
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 파일 업로드 섹션 */}
      <PrescriptionFileUpload
        profileId={profileId}
        onUploadSuccess={handleUploadSuccess}
        onUploadError={onUploadError}
      />

      {/* 파일 목록 섹션 */}
      <PrescriptionFileList
        profileId={profileId}
        onFileSelect={onFileSelect}
        onFileDelete={handleFileDelete}
        onFileDownload={onFileDownload}
        onAnalysisStart={onAnalysisStart}
      />


    </div>
  )
}

export default PrescriptionUploadSection
