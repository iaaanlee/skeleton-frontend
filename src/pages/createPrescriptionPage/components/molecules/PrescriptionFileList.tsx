import React from 'react'
import FileList from '../../../../components/common/molecules/FileList'

type PrescriptionFileListProps = {
  profileId: string
  onSelectionChange?: (selectedFiles: string[]) => void
  className?: string
}

export const PrescriptionFileList: React.FC<PrescriptionFileListProps> = ({
  profileId,
  onSelectionChange,
  className = ''
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-green-900 mb-2">
          운동 이미지 선택
        </h3>
        <p className="text-sm text-green-700 mb-4">
          자세를 분석할 이미지를 업로드하고 선택해주세요.
        </p>
        
        <FileList
          profileId={profileId}
          showAddButton={true}
          onSelectionChange={onSelectionChange}
        />
      </div>
    </div>
  )
}
