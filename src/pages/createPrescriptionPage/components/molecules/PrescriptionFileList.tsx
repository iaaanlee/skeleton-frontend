import React from 'react'
import FileList from '../../../../components/common/molecules/FileList'

type PrescriptionFileListProps = {
  profileId: string
  className?: string
}

export const PrescriptionFileList: React.FC<PrescriptionFileListProps> = ({
  profileId,
  className = ''
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-green-900 mb-2">
          업로드된 분석 이미지
        </h3>
        <p className="text-sm text-green-700 mb-4">
          업로드된 이미지들을 확인하고 관리할 수 있습니다.
        </p>
        
        <FileList
          profileId={profileId}
          showThumbnails={true}
          showFileInfo={true}
        />
      </div>
    </div>
  )
}
