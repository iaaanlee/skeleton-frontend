import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useFileList } from '../../../services/fileService'
import { useAccountAuth } from '../../../contexts/AccountAuthContext'
import { useFileSelection, useFileSorting, useFileActions } from '../../../hooks'
import { validateAuthState, extractUserIdFromToken } from '../../../utils/auth'
import FileListHeader from './FileListHeader'
import FileGrid from './FileGrid'
import { SelectedFilesActionBar } from './SelectedFilesActionBar'
import { FileListStatus } from './FileListStatus'

type FileListProps = {
  profileId: string
  className?: string
  showThumbnails?: boolean
  showFileInfo?: boolean
}

const FileList: React.FC<FileListProps> = ({
  profileId,
  className = '',
  showThumbnails = true,
  showFileInfo = true
}) => {
  const navigate = useNavigate()
  const { token } = useAccountAuth()

  // 토큰에서 userId 추출 (토큰이 없거나 유효하지 않으면 null 반환)
  const userId = token ? extractUserIdFromToken(token) : null

  // React Query로 파일 목록 조회 (Hook은 항상 호출되어야 함)
  const { data: fileListResponse, isLoading, error } = useFileList(userId || '', profileId)

  // 커스텀 훅들 (Hook은 항상 호출되어야 함)
  const {
    selectedFiles,
    selectFile,
    clearSelection,
    selectedCount
  } = useFileSelection()

  const {
    sortBy,
    sortedFiles,
    handleSortChange
  } = useFileSorting(fileListResponse?.files || [])

  const {
    deleteFile,
    downloadFile,
    startAnalysis,
    deleteMultipleFiles,
    downloadMultipleFiles,
    isAnalyzing
  } = useFileActions(profileId, userId || '')

  // 인증 상태 확인 (Hook 호출 후에 처리)
  if (!validateAuthState(token, navigate)) {
    return null // 로그아웃 처리 중이므로 아무것도 렌더링하지 않음
  }

  // 이벤트 핸들러들
  const handleFileSelect = (file: any) => {
    selectFile(file._id)
  }

  const handleFileDelete = async (fileId: string) => {
    const success = await deleteFile(fileId)
    if (success) {
      // 선택된 파일에서도 제거
      selectFile(fileId) // 토글하여 제거
    }
  }

  const handleFileDownload = (file: any) => {
    downloadFile(file)
  }

  const handleAnalysisStart = async () => {
    const success = await startAnalysis(selectedFiles)
    if (success) {
      clearSelection()
    }
  }

  const handleDownloadSelected = () => {
    const selectedFileObjects = sortedFiles.filter(file => 
      selectedFiles.includes(file._id)
    )
    downloadMultipleFiles(selectedFileObjects)
  }

  const handleDeleteSelected = async () => {
    if (window.confirm(`선택된 ${selectedCount}개 파일을 삭제하시겠습니까?`)) {
      const success = await deleteMultipleFiles(selectedFiles)
      if (success) {
        clearSelection()
      }
    }
  }

  // 로딩/에러 상태 처리
  if (isLoading || error) {
    return (
      <div className={`space-y-6 ${className}`}>
        <FileListStatus isLoading={isLoading} error={error} />
      </div>
    )
  }

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

      {/* 선택된 파일 액션 바 */}
      <SelectedFilesActionBar
        selectedCount={selectedCount}
        onAnalysisStart={handleAnalysisStart}
        onDownloadSelected={handleDownloadSelected}
        onDeleteSelected={handleDeleteSelected}
        isAnalyzing={isAnalyzing}
      />
    </div>
  )
}

export default FileList
