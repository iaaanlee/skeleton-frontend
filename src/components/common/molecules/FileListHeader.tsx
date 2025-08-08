import React from 'react'
import { FileListHeaderProps } from '../../../types/files/components'

const FileListHeader: React.FC<FileListHeaderProps> = ({
  totalCount,
  sortBy = 'date',
  onSortChange,
  className = ''
}) => {
  const handleSortChange = (newSortBy: 'date' | 'name' | 'size') => {
    onSortChange?.(newSortBy)
  }

  const getSortLabel = (type: 'date' | 'name' | 'size') => {
    switch (type) {
      case 'date':
        return '업로드 날짜'
      case 'name':
        return '파일명'
      case 'size':
        return '파일 크기'
      default:
        return ''
    }
  }

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {/* 제목 및 파일 개수 */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          업로드된 파일
        </h2>
        <p className="text-sm text-gray-500">
          총 {totalCount}개의 파일
        </p>
      </div>

      {/* 정렬 옵션 */}
      {onSortChange && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">정렬:</span>
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['date', 'name', 'size'] as const).map((sortType) => (
              <button
                key={sortType}
                onClick={() => handleSortChange(sortType)}
                className={`
                  px-3 py-1 text-xs rounded-md transition-colors
                  ${sortBy === sortType
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                {getSortLabel(sortType)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default FileListHeader
