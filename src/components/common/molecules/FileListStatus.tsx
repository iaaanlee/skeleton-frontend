import React from 'react'

type FileListStatusProps = {
  isLoading?: boolean
  error?: Error | string | null
  className?: string
}

export const FileListStatus: React.FC<FileListStatusProps> = ({
  isLoading = false,
  error = null,
  className = ''
}) => {
  if (isLoading) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-gray-400 text-4xl mb-4">📁</div>
        <p className="text-gray-600">파일 목록을 불러오는 중...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-red-400 text-4xl mb-4">⚠️</div>
        <p className="text-red-600">파일 목록을 불러올 수 없습니다.</p>
      </div>
    )
  }

  return null
}
