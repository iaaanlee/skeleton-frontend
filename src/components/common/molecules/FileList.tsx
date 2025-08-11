import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFileList } from '../../../services/fileService'
import { useAccountAuth } from '../../../contexts/AccountAuthContext'
import { useFileSelection, useFileActions } from '../../../hooks'
import { validateAuthState, extractAccountIdFromToken } from '../../../utils/auth'
import { FileListHeader } from './FileListHeader'
import FileGrid from './FileGrid'
import { SelectedFilesActionBar } from './SelectedFilesActionBar'
import { UploadModal } from './UploadModal'

type FileListProps = {
  profileId: string
  className?: string
  showAddButton?: boolean
  onSelectionChange?: (selectedFiles: string[]) => void
}

const FileList: React.FC<FileListProps> = ({
  profileId,
  className = '',
  showAddButton = false,
  onSelectionChange
}) => {
  const navigate = useNavigate()
  const { token } = useAccountAuth()
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  // 토큰에서 accountId 추출 (토큰이 없거나 유효하지 않으면 null 반환)
  const accountId = token ? extractAccountIdFromToken(token) : null

  // React Query로 파일 목록 조회 (Hook은 항상 호출되어야 함)
  const { data: fileListResponse, isLoading, error, refetch } = useFileList(accountId || '', profileId)

  // 커스텀 훅들 (Hook은 항상 호출되어야 함)
  const {
    selectedFiles,
    selectFile,
    clearSelection,
    selectedCount,
    deselectFile,
    selectMultiple
  } = useFileSelection()

  const {
    deleteFile,
    downloadFile,
    deleteMultipleFiles,
    downloadMultipleFiles
  } = useFileActions(profileId, accountId || '')

  // 선택된 파일 변경 시 부모 컴포넌트에 알림 (Hook은 조건문 이전에 호출)
  React.useEffect(() => {
    onSelectionChange?.(selectedFiles)
  }, [selectedFiles, onSelectionChange])

  // 파일 목록이 변경될 때 선택 상태 동기화
  React.useEffect(() => {
    if (fileListResponse?.files) {
      const existingFileIds = fileListResponse.files.map(file => file._id)
      const validSelectedFiles = selectedFiles.filter(fileId => existingFileIds.includes(fileId))
      
      if (validSelectedFiles.length !== selectedFiles.length) {
        // 존재하지 않는 파일들을 선택에서 제거
        selectMultiple(validSelectedFiles)
      }
    }
  }, [fileListResponse?.files, selectedFiles, selectMultiple])

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
      deselectFile(fileId)
    }
  }

  const handleFileDownload = (file: any) => {
    downloadFile(file)
  }

  const handleDownloadSelected = () => {
    const selectedFileObjects = (fileListResponse?.files || []).filter(file => 
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

  const handleUploadSuccess = () => {
    // 파일 목록 새로고침
    refetch()
  }

  const handleAddClick = () => {
    setIsUploadModalOpen(true)
  }

  const handleModalClose = () => {
    setIsUploadModalOpen(false)
    // 모달이 닫힐 때 항상 파일 목록 새로고침
    refetch()
  }

  // 로딩/에러 상태 처리
  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">파일 목록을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center py-8">
          <div className="text-red-500 text-2xl mb-2">⚠️</div>
          <p className="text-gray-600">파일 목록을 불러올 수 없습니다.</p>
          <button 
            onClick={() => refetch()} 
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  const files = fileListResponse?.files || []

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 헤더 */}
      <FileListHeader
        title="운동 자세 이미지"
        fileCount={files.length}
        onAddClick={handleAddClick}
        showAddButton={showAddButton}
      />

      {/* 파일 그리드 */}
      <FileGrid
        files={files}
        onFileSelect={handleFileSelect}
        onFileDelete={handleFileDelete}
        onFileDownload={handleFileDownload}
        selectedFiles={selectedFiles}
      />

      {/* 업로드 모달 */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={handleModalClose}
        onUploadSuccess={handleUploadSuccess}
        profileId={profileId}
      />
    </div>
  )
}

export default FileList
