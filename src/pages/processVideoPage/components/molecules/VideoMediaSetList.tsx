import React, { forwardRef, useImperativeHandle } from 'react';
import { useMediaSetList } from '../../../../services/mediaSetService';
import { useDeleteMediaSet } from '../../../../services/mediaSetService';
import { useToast } from '../../../../contexts/ToastContext';

type VideoMediaSetListProps = {
  selectedMediaSetId?: string | null;
  onSelectionChange?: (mediaSetId: string | null) => void;
  className?: string;
};

export type VideoMediaSetListRef = {
  refetch: () => void;
};

export const VideoMediaSetList = forwardRef<VideoMediaSetListRef, VideoMediaSetListProps>(({
  selectedMediaSetId,
  onSelectionChange,
  className = ''
}, ref) => {
  const { showSuccess, showError } = useToast();
  
  // 비디오 타입의 미디어셋만 조회
  const { data: mediaSetListResponse, isLoading, error, refetch } = useMediaSetList(20, 0, 'video');

  // ref를 통해 refetch 함수 노출
  useImperativeHandle(ref, () => ({
    refetch
  }));
  const deleteMediaSetMutation = useDeleteMediaSet();

  const handleDelete = async (mediaSetId: string) => {
    if (window.confirm('이 비디오 미디어셋을 삭제하시겠습니까?')) {
      try {
        await deleteMediaSetMutation.mutateAsync(mediaSetId);
        refetch(); // 목록 다시 로드
        showSuccess('비디오 미디어셋이 삭제되었습니다.');
      } catch (error) {
        console.error('Delete media set error:', error);
        showError('비디오 미디어셋 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleCardClick = (mediaSetId: string) => {
    if (onSelectionChange) {
      const newSelectedId = selectedMediaSetId === mediaSetId ? null : mediaSetId;
      onSelectionChange(newSelectedId);
    }
  };

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-purple-900 mb-2">
            업로드된 비디오 미디어셋
          </h3>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-red-900 mb-2">
            오류 발생
          </h3>
          <p className="text-sm text-red-700">
            비디오 미디어셋 목록을 불러오는 중 오류가 발생했습니다.
          </p>
        </div>
      </div>
    );
  }

  const mediaSets = mediaSetListResponse?.mediaSets || [];

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-purple-900 mb-2">
          업로드된 비디오 미디어셋
        </h3>
        <p className="text-sm text-purple-700 mb-4">
          업로드된 운동 비디오들을 확인하고 관리할 수 있습니다.
        </p>
        
        {mediaSets.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p className="mt-2">업로드된 비디오 미디어셋이 없습니다.</p>
            <p className="text-xs text-gray-400 mt-1">위에서 비디오를 업로드해보세요.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mediaSets.map((mediaSet) => {
              const isSelected = selectedMediaSetId === mediaSet._id;
              
              return (
                <div
                  key={mediaSet._id}
                  onClick={() => handleCardClick(mediaSet._id)}
                  className={`
                    relative group rounded-lg overflow-hidden cursor-pointer transition-all duration-200
                    ${isSelected 
                      ? 'bg-purple-50 border-2 border-purple-500 shadow-lg' 
                      : 'bg-white border border-gray-200 hover:shadow-lg hover:border-gray-300'
                    }
                  `}
                >
                {/* 비디오 썸네일 */}
                <div className="aspect-video bg-gray-100 relative">
                  {mediaSet.thumbnailUrls && mediaSet.thumbnailUrls.length > 0 ? (
                    <img
                      src={mediaSet.thumbnailUrls[0]}
                      alt={`비디오 미디어셋 ${mediaSet.name || mediaSet._id}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  
                  {/* 비디오 아이콘 오버레이 */}
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="bg-white bg-opacity-90 rounded-full p-3">
                      <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.68L9.54 5.98C8.87 5.55 8 6.03 8 6.82z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* 미디어셋 정보 */}
                <div className="p-4">
                  <h4 className="font-medium text-gray-900 text-sm mb-1 truncate" title={mediaSet.poseDescription || mediaSet.name || mediaSet._id}>
                    {mediaSet.poseDescription || mediaSet.name || `${mediaSet._id.substring(0, 10)}...`}
                  </h4>
                  
                  {/* 비디오 정보 */}
                  {mediaSet.files[0]?.videoInfo && (
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>
                        구간: {mediaSet.files[0].videoInfo.startTime.toFixed(1)}초 ~ {mediaSet.files[0].videoInfo.endTime.toFixed(1)}초
                      </p>
                      <p>
                        길이: {mediaSet.files[0].videoInfo.duration.toFixed(1)}초 ({mediaSet.files[0].videoInfo.frameCount}프레임)
                      </p>
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(mediaSet.createdAt).toLocaleDateString('ko-KR')}
                  </p>
                </div>

                {/* 삭제 버튼 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(mediaSet._id);
                  }}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  title="삭제"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* 타입 뱃지 */}
                {/* 선택 표시 */}
                {isSelected && (
                  <div className="absolute top-2 right-8 bg-purple-500 text-white rounded-full p-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  </div>
                )}

                {/* 타입 뱃지 */}
                <div className={`absolute top-2 left-2 text-xs px-2 py-1 rounded-full ${
                  isSelected 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  비디오
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
});