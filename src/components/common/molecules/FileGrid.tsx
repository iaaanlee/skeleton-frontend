import React from 'react'
import { FileGridProps } from '../../../types/files/components'
import FileItem from './FileItem'

const FileGrid: React.FC<FileGridProps> = ({
  files,
  onFileSelect,
  onFileDelete,
  onFileDownload,
  selectedFiles = [],
  className = ''
}) => {
  if (files.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          업로드된 파일이 없습니다
        </h3>
        <p className="text-gray-500">
          파일을 업로드하면 여기에 표시됩니다.
        </p>
      </div>
    )
  }

  // 파일 ID 추출 헬퍼 함수
  const getFileId = (file: any) => {
    return file._id || file.originalKey || file.fileName;
  };

  return (
    <div className={`grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 ${className}`}>
      {files.map((file, index) => {
        const fileId = getFileId(file);
        return (
          <FileItem
            key={fileId || index}
            file={file}
            onSelect={onFileSelect}
            onDelete={onFileDelete}
            onDownload={onFileDownload}
            isSelected={selectedFiles.includes(fileId)}
          />
        );
      })}
    </div>
  )
}

export default FileGrid
