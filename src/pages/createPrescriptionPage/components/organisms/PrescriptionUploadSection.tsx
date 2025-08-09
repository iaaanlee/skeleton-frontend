import React from 'react'
import { PrescriptionFileUpload } from '../molecules/PrescriptionFileUpload'
import { PrescriptionFileList } from '../molecules/PrescriptionFileList'

type PrescriptionUploadSectionProps = {
  profileId: string
  className?: string
}

export const PrescriptionUploadSection: React.FC<PrescriptionUploadSectionProps> = ({
  profileId,
  className = ''
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* 파일 업로드 섹션 */}
      <PrescriptionFileUpload profileId={profileId} />

      {/* 파일 목록 섹션 */}
      <PrescriptionFileList profileId={profileId} />
    </div>
  )
}
