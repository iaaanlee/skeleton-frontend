import React from 'react'
import FileList from '../../../../components/common/molecules/FileList'
import { ServerFile } from '../../../../types/files'

type PrescriptionFileListProps = {
  profileId: string
  onFileSelect?: (file: ServerFile) => void
  onFileDelete?: (fileId: string) => void
  onFileDownload?: (file: ServerFile) => void
  className?: string
}

const PrescriptionFileList: React.FC<PrescriptionFileListProps> = ({
  profileId,
  onFileSelect,
  onFileDelete,
  onFileDownload,
  className = ''
}) => {
  const handleFileSelect = (file: ServerFile) => {
    console.log('Prescription file selected:', file)
    onFileSelect?.(file)
  }

  const handleFileDelete = (fileId: string) => {
    console.log('Prescription file deleted:', fileId)
    onFileDelete?.(fileId)
  }

  const handleFileDownload = (file: ServerFile) => {
    console.log('Prescription file download:', file)
    onFileDownload?.(file)
  }

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
          onFileSelect={handleFileSelect}
          onFileDelete={handleFileDelete}
          onFileDownload={handleFileDownload}
          showThumbnails={true}
          showFileInfo={true}
        />
      </div>
    </div>
  )
}

export default PrescriptionFileList
