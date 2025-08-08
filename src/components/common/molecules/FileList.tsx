import React, { useState } from 'react'
import { FileListProps } from '../../../types/files/components'
import { useFileList, useDeleteFile } from '../../../services/fileService'
import { useAccountAuth } from '../../../contexts/AccountAuthContext'
import FileListHeader from './FileListHeader'
import FileGrid from './FileGrid'

const FileList: React.FC<FileListProps> = ({
  profileId,
  onFileSelect,
  onFileDelete,
  onFileDownload,
  className = '',
  showThumbnails = true,
  showFileInfo = true
}) => {
  const { token } = useAccountAuth()
  const deleteFileMutation = useDeleteFile()
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date')
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])

  // 토큰에서 userId 추출
  const userId = token ? (() => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.sub || payload.id || payload.accountId
    } catch {
      return null
    }
  })() : null

  // React Query로 파일 목록 조회
  const { data: fileListResponse, isLoading, error } = useFileList(userId || '', profileId)

  // 파일 목록
  const files = fileListResponse?.files || []

  const handleSortChange = (newSortBy: 'date' | 'name' | 'size') => {
    setSortBy(newSortBy)
  }

  const handleFileSelect = (file: any) => {
    setSelectedFiles(prev => {
      if (prev.includes(file._id)) {
        return prev.filter(id => id !== file._id)
      } else {
        return [...prev, file._id]
      }
    })
    onFileSelect?.(file)
  }

  const handleFileDelete = async (fileId: string) => {
    try {
      await deleteFileMutation.mutateAsync(fileId)
      onFileDelete?.(fileId)
    } catch (error) {
      console.error('Delete file error:', error)
    }
  }

  const handleFileDownload = (file: any) => {
    // 실제로는 다운로드 URL 생성 후 다운로드
    console.log('Download file:', file)
    onFileDownload?.(file)
  }

  // 정렬된 파일 목록
  const sortedFiles = [...files].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      case 'name':
        return a.fileName.localeCompare(b.fileName)
      case 'size':
        return b.fileSize - a.fileSize
      default:
        return 0
    }
  })

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 헤더 */}
      <FileListHeader
        totalCount={sortedFiles.length}
        sortBy={sortBy}
        onSortChange={handleSortChange}
      />

      {/* 파일 그리드 */}
      <FileGrid
        files={sortedFiles}
        onFileSelect={handleFileSelect}
        onFileDelete={handleFileDelete}
        onFileDownload={handleFileDownload}
        selectedFiles={selectedFiles}
      />

      {/* 선택된 파일 정보 */}
      {selectedFiles.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900">
                {selectedFiles.length}개 파일 선택됨
              </p>
              <p className="text-xs text-blue-700">
                선택된 파일에 대한 작업을 수행할 수 있습니다.
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  // 선택된 파일들 다운로드
                  selectedFiles.forEach(fileId => {
                    const file = sortedFiles.find(f => f._id === fileId)
                    if (file) handleFileDownload(file)
                  })
                }}
                className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                선택 다운로드
              </button>
              <button
                onClick={() => {
                  // 선택된 파일들 삭제
                  if (window.confirm(`선택된 ${selectedFiles.length}개 파일을 삭제하시겠습니까?`)) {
                    selectedFiles.forEach(fileId => handleFileDelete(fileId))
                    setSelectedFiles([])
                  }
                }}
                className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                선택 삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FileList
