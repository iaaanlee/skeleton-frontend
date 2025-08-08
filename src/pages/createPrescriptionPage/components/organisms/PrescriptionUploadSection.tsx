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
  className?: string
}

const PrescriptionUploadSection: React.FC<PrescriptionUploadSectionProps> = ({
  profileId,
  onUploadSuccess,
  onUploadError,
  onFileSelect,
  onFileDelete,
  onFileDownload,
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
      />

      {/* 업로드된 파일 개수 표시 */}
      {uploadedFiles.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">
                업로드된 파일: {uploadedFiles.length}개
              </p>
              <p className="text-xs text-gray-500">
                분석 준비가 완료되었습니다.
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  // 분석 시작 로직
                  console.log('Start analysis with files:', uploadedFiles)
                }}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
              >
                분석 시작
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PrescriptionUploadSection
