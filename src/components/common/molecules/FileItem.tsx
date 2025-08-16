import React, { useState } from 'react'
import { FileItemProps } from '../../../types/files/components'
import { ServerFile, getFileId, isServerFile, isMediaFile } from '../../../types/files'
import { MediaFile } from '../../../services/mediaSetService/mediaSetService'
import ImagePreview from './ImagePreview'
import { DeleteConfirmModal } from '../templates/DeleteConfirmModal'

const FileItem: React.FC<FileItemProps> = ({
  file,
  onSelect,
  onDelete,
  onDownload,
  isSelected = false,
  className = ''
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  
  // 썸네일 URL 추출 헬퍼 함수
  const getThumbnailUrl = (file: ServerFile | MediaFile) => {
    if (isServerFile(file)) {
      return file.thumbnailUrl || file.downloadUrl || '';
    }
    if (isMediaFile(file)) {
      return file.thumbnailKey || '';
    }
    return '';
  };

  const handleSelect = () => {
    onSelect?.(file)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation() // 이벤트 전파 방지
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = () => {
    onDelete?.(getFileId(file))
    setShowDeleteModal(false)
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
  }

  // const handleDownload = () => {
  //   onDownload?.(file)
  // }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <>
      <div
        className={`
          bg-white rounded-lg border border-gray-200 overflow-hidden
          hover:border-blue-300 hover:shadow-md transition-all duration-200
          ${isSelected ? 'ring-2 ring-blue-500' : ''}
          w-32
          ${className}
        `}
      >
        {/* 상단: 정사각형 썸네일 컨테이너 - 고정 크기 */}
        <div className="relative w-full h-32">
          <ImagePreview
            file={getThumbnailUrl(file)}
            className="w-full h-full object-cover object-center"
            width={128}
            height={128}
            alt={file.fileName}
          />
          
          {/* 선택 오버레이 */}
          {isSelected && (
            <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
              <div className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                ✓
              </div>
            </div>
          )}

          {/* 액션 버튼들 */}
          <div className="absolute top-1 right-1 z-10">
            {onDelete && (
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700 transition-colors"
                title="삭제"
              >
                ×
              </button>
            )}
          </div>

          {/* BlazePose 가공 표시 */}
          {((isServerFile(file) && file.processedForBlazePose) || 
            (isMediaFile(file) && file.processedForBlazePose)) && (
            <div className="absolute top-1 left-1">
              <span className="bg-purple-500 text-white text-xs px-1 py-0.5 rounded-full">
                BP
              </span>
            </div>
          )}

          {/* 썸네일 클릭 영역 - 삭제 버튼 영역 제외 */}
          {onSelect && (
            <button
              onClick={handleSelect}
              className="absolute inset-0 w-full h-full opacity-0"
              aria-label={`${file.fileName} 선택`}
            />
          )}
        </div>

        {/* 하단: 파일 정보 */}
        <div className="p-2">
          <div className="space-y-1">
            {/* 파일명 */}
            <h3 className="text-xs font-medium text-gray-900 truncate" title={file.fileName}>
              {file.fileName}
            </h3>

            {/* 압축 비율 */}
            {isMediaFile(file) && file.compressionRatio && (
              <p className="text-xs text-green-600">
                압축: {file.compressionRatio}%
              </p>
            )}

            {/* 업로드 날짜 */}
            <p className="text-xs text-gray-400">
              {formatDate(file.uploadedAt)}
            </p>
          </div>
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        fileName={file.fileName}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </>
  )
}

export default FileItem
