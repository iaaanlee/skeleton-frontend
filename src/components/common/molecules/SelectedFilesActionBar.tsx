import React from 'react'

type SelectedFilesActionBarProps = {
  selectedCount: number
  onAnalysisStart: () => void
  onDownloadSelected: () => void
  onDeleteSelected: () => void
  isAnalyzing?: boolean
  className?: string
}

export const SelectedFilesActionBar: React.FC<SelectedFilesActionBarProps> = ({
  selectedCount,
  onAnalysisStart,
  onDownloadSelected,
  onDeleteSelected,
  isAnalyzing = false,
  className = ''
}) => {
  if (selectedCount === 0) return null

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-blue-900">
            {selectedCount}개 파일 선택됨
          </p>
          <p className="text-xs text-blue-700">
            선택된 파일에 대한 작업을 수행할 수 있습니다.
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onAnalysisStart}
            disabled={isAnalyzing}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              isAnalyzing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isAnalyzing ? '분석 중...' : '분석 시작'}
          </button>
          <button
            onClick={onDownloadSelected}
            className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            선택 다운로드
          </button>
          <button
            onClick={onDeleteSelected}
            className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            선택 삭제
          </button>
        </div>
      </div>
    </div>
  )
}
