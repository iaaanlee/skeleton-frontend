import React, { useState, useRef, useEffect } from 'react'
import { useMediaSetList } from '../../../../services/mediaSetService'
import { useSingleFileSelection } from '../../../../hooks'
import { useDeleteMediaSet } from '../../../../services/mediaSetService'
import { MediaSetUploadModal } from './MediaSetUploadModal'
import { MediaSet } from '../../../../services/mediaSetService/mediaSetService'

type MediaSetListProps = {
  profileId: string
  onSelectionChange?: (selectedMediaSetId: string | null) => void
  className?: string
}

export const MediaSetList: React.FC<MediaSetListProps> = ({
  profileId,
  onSelectionChange,
  className = ''
}) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  // React Query로 미디어 세트 목록 조회
  const { data: mediaSetListResponse, isLoading, error, refetch } = useMediaSetList()

  // 단일 선택 훅 사용
  const {
    selectedFile: selectedMediaSetId,
    selectFile: selectMediaSet,
    clearSelection,
    isSelected,
  } = useSingleFileSelection()

  // clearSelection 함수를 ref로 저장
  const clearSelectionRef = useRef(clearSelection)
  clearSelectionRef.current = clearSelection

  const deleteMediaSetMutation = useDeleteMediaSet()

  // 선택된 미디어 세트 변경 시 부모 컴포넌트에 알림
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedMediaSetId)
    }
  }, [selectedMediaSetId, onSelectionChange])

  // 미디어 세트 목록이 변경될 때 선택 상태 동기화
  useEffect(() => {
    if (mediaSetListResponse?.mediaSets && selectedMediaSetId) {
      const existingMediaSetIds = mediaSetListResponse.mediaSets.map(mediaSet => mediaSet._id)
      if (!existingMediaSetIds.includes(selectedMediaSetId)) {
        clearSelectionRef.current()
      }
    }
  }, [mediaSetListResponse?.mediaSets, selectedMediaSetId])

  // 인증은 상위 컴포넌트에서 처리됨

  const handleMediaSetSelect = (mediaSet: MediaSet) => {
    selectMediaSet(mediaSet._id)
  }

  const handleMediaSetDelete = async (mediaSetId: string) => {
    try {
      await deleteMediaSetMutation.mutateAsync(mediaSetId)
      if (selectedMediaSetId === mediaSetId) {
        clearSelectionRef.current()
      }
    } catch (error) {
      console.error('Delete media set error:', error)
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
            미디어 세트 선택
          </h3>
          <p className="text-sm text-green-700 mb-4">
            분석할 미디어 세트를 업로드하고 선택해주세요.
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
            미디어 세트 목록을 불러오는 중 오류가 발생했습니다.
          </p>
        </div>
      </div>
    )
  }

  const mediaSets = mediaSetListResponse?.mediaSets || []

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-green-900 mb-2">
          미디어 세트 선택
        </h3>
        <p className="text-sm text-green-700 mb-4">
          분석할 미디어 세트를 업로드하고 선택해주세요. (하나만 선택 가능)
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
            미디어 세트 추가
          </button>
        </div>

        {/* 미디어 세트 그리드 */}
        {mediaSets.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2">업로드된 미디어 세트가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {mediaSets.map((mediaSet) => (
              <div
                key={mediaSet._id}
                className={`
                  relative group rounded-lg overflow-hidden border-2 transition-all duration-200
                  ${isSelected(mediaSet._id)
                    ? 'border-green-500 ring-2 ring-green-200'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                {/* 썸네일 */}
                <div className="aspect-square bg-gray-100 relative">
                  {mediaSet.thumbnailUrls && mediaSet.thumbnailUrls.length > 0 ? (
                    <img
                      src={mediaSet.thumbnailUrls[0]}
                      alt={`미디어 세트 ${mediaSet._id}`}
                      className="w-full h-full object-cover pointer-events-none"
                      draggable={false}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  
                  {/* 선택 버튼 - 이미지 위에 투명 오버레이 */}
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleMediaSetSelect(mediaSet)
                    }}
                    className="absolute inset-0 bg-transparent hover:bg-black hover:bg-opacity-10 transition-all duration-200 cursor-pointer"
                    title={isSelected(mediaSet._id) ? '선택 해제' : '선택'}
                  />
                </div>

                {/* 삭제 버튼 - 우상단 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (window.confirm('이 미디어 세트를 삭제하시겠습니까?')) {
                      handleMediaSetDelete(mediaSet._id)
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
                {isSelected(mediaSet._id) && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
                    <div className="bg-green-500 text-white rounded-full p-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}

                {/* 미디어 세트 정보 */}
                <div className="p-2 bg-white">
                  <p className="text-xs text-gray-600 truncate" title={mediaSet.poseDescription || mediaSet._id}>
                    {mediaSet.poseDescription || `${mediaSet._id.substring(0, 10)}...`}
                  </p>
                  <p className="text-xs text-gray-500">
                    파일 {mediaSet.files.length}개
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 선택된 미디어 세트 정보 */}
        {selectedMediaSetId && (
          <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
            <p className="text-sm text-green-800">
              <span className="font-medium">선택된 미디어 세트:</span> {
                mediaSets.find(ms => ms._id === selectedMediaSetId)?.poseDescription || 
                `${mediaSets.find(ms => ms._id === selectedMediaSetId)?._id.substring(0, 10)}...`
              }
            </p>
          </div>
        )}
      </div>

      {/* 업로드 모달 */}
      <MediaSetUploadModal
        isOpen={isUploadModalOpen}
        onClose={handleModalClose}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  )
}
