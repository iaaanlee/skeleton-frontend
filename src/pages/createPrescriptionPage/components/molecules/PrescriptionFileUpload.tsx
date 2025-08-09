import React from 'react'
import FileUpload from '../../../../components/common/molecules/FileUpload'
import { MAX_FILE_MB } from '../../../../constants/upload'

type PrescriptionFileUploadProps = {
  profileId: string
  disabled?: boolean
  className?: string
}

export const PrescriptionFileUpload: React.FC<PrescriptionFileUploadProps> = ({
  profileId,
  disabled = false,
  className = ''
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-blue-900 mb-2">
          운동 이미지 업로드
        </h3>
        <p className="text-sm text-blue-700 mb-4">
          분석하고 싶은 운동 이미지를 업로드해주세요. (최대 {MAX_FILE_MB}MB)
        </p>
        
        <FileUpload
          profileId={profileId}
          multiple={true}
          disabled={disabled}
        />
      </div>
    </div>
  )
}
