import React, { useState, useRef, useEffect } from 'react';
import { VideoMediaSetList, VideoMediaSetListRef, PostureAnalysisButton, AnalysisProgressIndicator } from '../molecules';
import { VideoUploadModal } from '../molecules/VideoUploadModal';
import { useStartVideoPoseAnalysis, useVideoPoseAnalysisStatus } from '../../../../services/videoAnalysisService';
import { useToast } from '../../../../contexts/ToastContext';

type ProcessVideoContentProps = {
  className?: string;
};

export const ProcessVideoContent: React.FC<ProcessVideoContentProps> = ({
  className = ''
}) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedMediaSetId, setSelectedMediaSetId] = useState<string | null>(null);
  const mediaSetListRef = useRef<VideoMediaSetListRef | null>(null);

  // 비디오 분석 관련 hooks
  const startVideoPoseAnalysisMutation = useStartVideoPoseAnalysis();
  const { data: analysisStatus, isLoading: isStatusLoading } = useVideoPoseAnalysisStatus(
    selectedMediaSetId,
    {
      enabled: !!selectedMediaSetId,
    }
  );
  const { showSuccess, showError } = useToast();

  const handleUploadSuccess = () => {
    // 업로드 성공 시 미디어셋 목록 새로고침
    mediaSetListRef.current?.refetch();
  };

  const handleMediaSetSelectionChange = (mediaSetId: string | null) => {
    setSelectedMediaSetId(mediaSetId);
    console.log('선택된 미디어셋:', mediaSetId);
  };

  const handleAnalysisStart = async (mediaSetId: string) => {
    try {
      const result = await startVideoPoseAnalysisMutation.mutateAsync({
        mediaSetId
      });

      if (result.status === 'success') {
        showSuccess('비디오 자세 분석이 시작되었습니다.');
      } else if (result.status === 'already_exists') {
        showSuccess('이미 완료된 분석이 있습니다.');
      } else if (result.status === 'reanalysis_blocked') {
        showError(result.message || '재분석이 제한되어 있습니다.');
      } else {
        showError(result.message || '분석 시작 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Analysis start error:', error);
      showError('분석 시작 중 오류가 발생했습니다.');
    }
  };

  // 분석 완료 시 부분 실패 알림 처리
  useEffect(() => {
    if (analysisStatus?.status === 'blazepose_completed' || analysisStatus?.status === 'failed') {
      const progress = analysisStatus?.progress;
      const errorDetails = analysisStatus?.errorDetails;

      if (progress && errorDetails && errorDetails.failedImages?.length > 0) {
        const totalImages = progress.total;
        const failedCount = progress.failed;
        const successCount = progress.completed;
        
        if (successCount > 0 && failedCount > 0) {
          // 부분 성공 케이스
          showSuccess(
            `자세 분석이 완료되었습니다. (성공: ${successCount}/${totalImages}, 실패: ${failedCount}개 이미지)`
          );
          
          // 실패한 이미지들 상세 정보 (콘솔에 로그)
          console.warn('Failed images during analysis:', {
            failedImages: errorDetails.failedImages,
            errorMessages: errorDetails.errorMessages,
          });
        } else if (failedCount === totalImages) {
          // 전체 실패 케이스
          showError(`자세 분석에 실패했습니다. 모든 ${totalImages}개 이미지 처리 실패`);
        }
      } else if (analysisStatus?.status === 'blazepose_completed') {
        // 완전 성공 케이스
        showSuccess('비디오 자세 분석이 성공적으로 완료되었습니다!');
      } else if (analysisStatus?.status === 'failed') {
        // 일반 실패 케이스
        showError('비디오 자세 분석 중 오류가 발생했습니다.');
      }
    }
  }, [analysisStatus?.status, analysisStatus?.progress, analysisStatus?.errorDetails, showSuccess, showError]);

  // 분석 진행 상태 계산
  const isAnalyzing = analysisStatus?.status === 'blazepose_processing' || startVideoPoseAnalysisMutation.isPending;
  const analysisProgress = analysisStatus?.progress?.percentage || 0;
  const analysisJobId = analysisStatus?.analysisJobId;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 비디오 미디어셋 선택 섹션 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                비디오 미디어셋 선택
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                분석할 비디오를 선택하거나 새로운 비디오를 업로드하세요.
              </p>
            </div>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              미디어셋 추가
            </button>
          </div>
        </div>
        
        {/* 업로드된 비디오 미디어셋 목록 */}
        <div className="p-6">
          <VideoMediaSetList 
            ref={mediaSetListRef}
            selectedMediaSetId={selectedMediaSetId}
            onSelectionChange={handleMediaSetSelectionChange}
          />
        </div>
      </div>

      {/* 자세 분석 시작 버튼 */}
      <PostureAnalysisButton
        selectedMediaSetId={selectedMediaSetId}
        onAnalysisStart={handleAnalysisStart}
        isAnalyzing={isAnalyzing}
        disabled={startVideoPoseAnalysisMutation.isPending}
      />

      {/* 비디오 업로드 모달 */}
      <VideoUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      {/* 분석 진행 표시 */}
      <AnalysisProgressIndicator
        isVisible={isAnalyzing}
        analysisJobId={analysisJobId}
        progress={analysisProgress}
        message={
          analysisStatus?.status === 'blazepose_processing' 
            ? `자세 분석 진행 중... (${analysisStatus?.progress?.completed || 0}/${analysisStatus?.progress?.total || 0} 이미지 완료)`
            : '자세 분석 진행 중...'
        }
      />
      
      {/* 추후 피크 지점 분석 결과 표시 섹션이 여기에 추가될 예정 */}
    </div>
  );
};