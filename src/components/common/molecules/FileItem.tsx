import React from 'react'
import { FileItemProps } from '../../../types/files/components'
import { formatFileSize } from '../../../utils/imageCompression'
import ImagePreview from './ImagePreview'

const FileItem: React.FC<FileItemProps> = ({
  file,
  onSelect,
  onDelete,
  onDownload,
  isSelected = false,
  className = ''
}) => {
  const handleSelect = () => {
    onSelect?.(file)
  }

  const handleDelete = () => {
    if (window.confirm(`"${file.fileName}" 파일을 삭제하시겠습니까?`)) {
      onDelete?.(file._id)
    }
  }

  const handleDownload = () => {
    onDownload?.(file)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div
      className={`
        relative group bg-white rounded-lg border border-gray-200 overflow-hidden
        hover:border-blue-300 hover:shadow-md transition-all duration-200
        ${isSelected ? 'ring-2 ring-blue-500' : ''}
        ${className}
      `}
    >
      {/* 썸네일 */}
      <div className="relative aspect-square">
        <ImagePreview
          file={file.thumbnailUrl || file.downloadUrl || ''}
          className="w-full h-full"
          alt={file.fileName}
        />
        
        {/* 선택 오버레이 */}
        {isSelected && (
          <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
            <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
              ✓
            </div>
          </div>
        )}

        {/* 액션 버튼들 */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex space-x-1">
            {onSelect && (
              <button
                onClick={handleSelect}
                className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-blue-600 transition-colors"
                title="선택"
              >
                ✓
              </button>
            )}
            {onDownload && (
              <button
                onClick={handleDownload}
                className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-green-600 transition-colors"
                title="다운로드"
              >
                ↓
              </button>
            )}
            {onDelete && (
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                title="삭제"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* BlazePose 가공 표시 */}
        {file.processedForBlazePose && (
          <div className="absolute top-2 left-2">
            <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
              BlazePose
            </span>
          </div>
        )}
      </div>

      {/* 파일 정보 */}
      <div className="p-3">
        <div className="space-y-1">
          {/* 파일명 */}
          <h3 className="text-sm font-medium text-gray-900 truncate" title={file.fileName}>
            {file.fileName}
          </h3>

          {/* 파일 크기 */}
          <p className="text-xs text-gray-500">
            {formatFileSize(file.fileSize)}
            {file.originalSize && file.originalSize !== file.fileSize && (
              <span className="text-gray-400 ml-1">
                (원본: {formatFileSize(file.originalSize)})
              </span>
            )}
          </p>

          {/* 압축 비율 */}
          {file.compressionRatio && (
            <p className="text-xs text-green-600">
              압축률: {file.compressionRatio}%
            </p>
          )}

          {/* 업로드 날짜 */}
          <p className="text-xs text-gray-400">
            {formatDate(file.uploadedAt)}
          </p>
        </div>
      </div>

      {/* 클릭 영역 */}
      {onSelect && (
        <button
          onClick={handleSelect}
          className="absolute inset-0 w-full h-full opacity-0"
          aria-label={`${file.fileName} 선택`}
        />
      )}
    </div>
  )
}

export default FileItem
