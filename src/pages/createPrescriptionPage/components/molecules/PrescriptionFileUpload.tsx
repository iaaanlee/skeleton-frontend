import React from 'react'
import FileUpload from '../../../../components/common/molecules/FileUpload'
import { ServerFile } from '../../../../types/files'

type PrescriptionFileUploadProps = {
  profileId: string
  onUploadSuccess?: (file: ServerFile) => void
  onUploadError?: (error: string) => void
  onUploadProgress?: (progress: number) => void
  disabled?: boolean
  className?: string
}

const PrescriptionFileUpload: React.FC<PrescriptionFileUploadProps> = ({
  profileId,
  onUploadSuccess,
  onUploadError,
  onUploadProgress,
  disabled = false,
  className = ''
}) => {
  const handleUploadSuccess = (file: ServerFile) => {
    console.log('Prescription file uploaded:', file)
    onUploadSuccess?.(file)
  }

  const handleUploadError = (error: string) => {
    console.error('Prescription upload error:', error)
    onUploadError?.(error)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-blue-900 mb-2">
          운동 분석 이미지 업로드
        </h3>
        <p className="text-sm text-blue-700 mb-4">
          분석하고 싶은 운동 이미지를 업로드해주세요. 
          BlazePose를 통해 관절 좌표를 분석합니다.
        </p>
        
        <FileUpload
          profileId={profileId}
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
          onUploadProgress={onUploadProgress}
          multiple={true}
          accept="image/*"
          maxSize={10 * 1024 * 1024} // 10MB
          disabled={disabled}
        />
      </div>
    </div>
  )
}

export default PrescriptionFileUpload
