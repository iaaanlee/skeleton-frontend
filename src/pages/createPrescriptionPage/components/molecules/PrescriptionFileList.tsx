import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFileList } from '../../../../services/fileService'
import { useAccountAuth } from '../../../../contexts/AccountAuthContext'
import { useSingleFileSelection, useFileActions } from '../../../../hooks'
import { validateAuthState, extractAccountIdFromToken } from '../../../../utils/auth'
import { UploadModal } from '../../../../components/common/molecules/UploadModal'

type PrescriptionFileListProps = {
  profileId: string
  onSelectionChange?: (selectedFiles: string[]) => void
  className?: string
}

export const PrescriptionFileList: React.FC<PrescriptionFileListProps> = ({
  profileId,
  onSelectionChange,
  className = ''
}) => {
  const navigate = useNavigate()
  const { token } = useAccountAuth()
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  // 토큰에서 accountId 추출
  const accountId = token ? extractAccountIdFromToken(token) : null

  // React Query로 파일 목록 조회
  const { data: fileListResponse, isLoading, error, refetch } = useFileList(accountId || '', profileId)

  // 단일 선택 훅 사용
  const {
    selectedFile,
    selectedFiles,
    selectFile,
    clearSelection,
    isSelected,
    selectedCount
  } = useSingleFileSelection()

  // clearSelection 함수를 ref로 저장
  const clearSelectionRef = useRef(clearSelection)
  clearSelectionRef.current = clearSelection

  const {
    deleteFile
  } = useFileActions(profileId, accountId || '')

  // 선택된 파일 변경 시 부모 컴포넌트에 알림
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedFiles)
    }
  }, [selectedFiles]) // onSelectionChange 의존성 제거

  // 파일 목록이 변경될 때 선택 상태 동기화
  useEffect(() => {
    if (fileListResponse?.files && selectedFile) {
      const existingFileIds = fileListResponse.files.map(file => file._id)
      if (!existingFileIds.includes(selectedFile)) {
        clearSelectionRef.current()
      }
    }
  }, [fileListResponse?.files, selectedFile])

  // 인증 상태 확인
  if (!validateAuthState(token, navigate)) {
    return null
  }

  const handleFileSelect = (file: any) => {
    selectFile(file._id)
  }

  const handleFileDelete = async (fileId: string) => {
    const success = await deleteFile(fileId)
    if (success && selectedFile === fileId) {
      clearSelectionRef.current()
    }
  }



  const handleUploadSuccess = () => {
    setIsUploadModalOpen(false)
    refetch()
  }

  const handleAddClick = () => {
    setIsUploadModalOpen(true)
  }

  const handleModalClose = () => {
    setIsUploadModalOpen(false)
  }

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-green-900 mb-2">
            운동 이미지 선택
          </h3>
          <p className="text-sm text-green-700 mb-4">
            자세를 분석할 이미지를 업로드하고 선택해주세요.
          </p>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-red-900 mb-2">
            오류 발생
          </h3>
          <p className="text-sm text-red-700">
            파일 목록을 불러오는 중 오류가 발생했습니다.
          </p>
        </div>
      </div>
    )
  }

  const files = fileListResponse?.files || []

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-green-900 mb-2">
          운동 이미지 선택
        </h3>
        <p className="text-sm text-green-700 mb-4">
          자세를 분석할 이미지를 업로드하고 선택해주세요. (하나만 선택 가능)
        </p>
        
        {/* 업로드 버튼 */}
        <div className="mb-4">
          <button
            onClick={handleAddClick}
            className="inline-flex items-center px-4 py-2 border border-green-300 rounded-md shadow-sm text-sm font-medium text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            이미지 추가
          </button>
        </div>

        {/* 파일 그리드 */}
        {files.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2">업로드된 이미지가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {files.map((file) => (
              <div
                key={file._id}
                className={`
                  relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200
                  ${isSelected(file._id)
                    ? 'border-green-500 ring-2 ring-green-200'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
                onClick={() => handleFileSelect(file)}
              >
                {/* 썸네일 */}
                <div className="aspect-square bg-gray-100">
                  {file.thumbnailUrl ? (
                    <img
                      src={file.thumbnailUrl}
                      alt={file.fileName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* 삭제 버튼 - 우상단 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (window.confirm('이 파일을 삭제하시겠습니까?')) {
                      handleFileDelete(file._id)
                    }
                  }}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10 opacity-0 group-hover:opacity-100"
                  title="삭제"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* 선택 표시 - 중앙에 체크 표시 */}
                {isSelected(file._id) && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
                    <div className="bg-green-500 text-white rounded-full p-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}

                {/* 파일명 */}
                <div className="p-2 bg-white">
                  <p className="text-xs text-gray-600 truncate" title={file.fileName}>
                    {file.fileName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 선택된 파일 정보 */}
        {selectedFile && (
          <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
            <p className="text-sm text-green-800">
              <span className="font-medium">선택된 파일:</span> {files.find(f => f._id === selectedFile)?.fileName}
            </p>
          </div>
        )}
      </div>

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
