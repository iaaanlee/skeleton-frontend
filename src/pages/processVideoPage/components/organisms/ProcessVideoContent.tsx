import React, { useState, useRef, useEffect } from 'react';
import { VideoMediaSetList, VideoMediaSetListRef, PostureAnalysisButton, AnalysisProgressIndicator, CompletedAnalysisSection } from '../molecules';
import { VideoUploadModal } from '../molecules/VideoUploadModal';
import { useStartVideoPoseAnalysis, useVideoPoseAnalysisStatus, useCompletedPoseAnalysisMediaSets } from '../../../../services/videoAnalysisService';
import { useToast } from '../../../../contexts/ToastContext';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../../../services/common/queryKey';

type ProcessVideoContentProps = {
  className?: string;
};

export const ProcessVideoContent: React.FC<ProcessVideoContentProps> = ({
  className = ''
}) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedMediaSetId, setSelectedMediaSetId] = useState<string | null>(null);
  const [selectedCompletedMediaSetId, setSelectedCompletedMediaSetId] = useState<string | null>(null);
  const mediaSetListRef = useRef<VideoMediaSetListRef | null>(null);
  const queryClient = useQueryClient();
  const completionHandledRef = useRef<Set<string>>(new Set());

  // 비디오 분석 관련 hooks
  const startVideoPoseAnalysisMutation = useStartVideoPoseAnalysis();
  const { data: analysisStatus } = useVideoPoseAnalysisStatus(
    selectedMediaSetId,
    {
      enabled: !!selectedMediaSetId,
    }
  );
  
  // 완료된 자세 분석 미디어세트 조회
  const { 
    data: completedMediaSetsResponse, 
    isLoading: isCompletedLoading, 
    error: completedError,
    refetch: refetchCompleted
  } = useCompletedPoseAnalysisMediaSets({ 
    mediaType: 'video', 
    limit: 12 
  });

  const { showSuccess, showError } = useToast();

  const handleUploadSuccess = () => {
    // 업로드 성공 시 미디어셋 목록 새로고침
    mediaSetListRef.current?.refetch();
    // 완료된 분석 목록도 새로고침 (새로 분석 완료된 항목이 있을 수 있음)
    refetchCompleted();
  };

  const handleMediaSetSelectionChange = (mediaSetId: string | null) => {
    setSelectedMediaSetId(mediaSetId);
    // 새로운 미디어셋 선택 시 완료 처리 기록 초기화
    completionHandledRef.current.clear();
    console.log('선택된 미디어셋:', mediaSetId);
  };

  const handleCompletedMediaSetSelectionChange = (mediaSetId: string | null) => {
    setSelectedCompletedMediaSetId(mediaSetId);
    console.log('선택된 완료 분석 미디어셋:', mediaSetId);
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

  // 분석 완료 감지 → 즉시 완료된 분석 목록 새로고침
  useEffect(() => {
    console.log('🔍 analysisStatus 변화 감지:', analysisStatus);
    
    if (!analysisStatus) {
      console.log('❌ analysisStatus가 null/undefined');
      return;
    }
    
    const currentStatus = analysisStatus.status;
    const analysisJobId = analysisStatus.analysisJobId;
    
    console.log('📊 상태 정보:', { 
      currentStatus, 
      analysisJobId,
      progress: analysisStatus.progress,
      fullAnalysisStatus: analysisStatus  // 전체 객체 확인
    });
    
    // 상태 확인
    const isCompleted = currentStatus === 'blazepose_completed' || currentStatus === 'analysis_completed' || currentStatus === 'pose_completed';
    const isFailed = currentStatus === 'failed';
    const isProcessing = currentStatus === 'blazepose_processing' || currentStatus === 'pending';
    
    console.log('✅ 상태 체크:', { isCompleted, isFailed, isProcessing });
    
    // analysisJobId가 있고, 완료/실패 상태이며, 아직 처리하지 않은 경우에만 실행
    if (analysisJobId && (isCompleted || isFailed)) {
      const handledSet = completionHandledRef.current;
      const handledKey = `${analysisJobId}-${currentStatus}`;
      
      console.log('🔑 중복 체크:', { 
        handledKey, 
        hasHandled: handledSet.has(handledKey),
        handledKeys: Array.from(handledSet)
      });
      
      if (!handledSet.has(handledKey)) {
        handledSet.add(handledKey);
        
        if (isCompleted) {
          console.log('🎯 분석 완료 감지 - 처리 시작:', { analysisJobId, status: currentStatus });
          
          // 즉시 완료된 분석 목록 새로고침
          queryClient.invalidateQueries({ 
            queryKey: [...QUERY_KEYS.videoAnalysis, 'completedPoseAnalysis']
          });
          refetchCompleted();
          
          // 완료 메시지 표시
          const message = currentStatus === 'analysis_completed' 
            ? '비디오 자세 분석 및 운동 처방이 완료되었습니다!'
            : '비디오 자세 분석이 완료되었습니다!';
          showSuccess(message);
          
          console.log('✨ 완료 처리 완료');
        } else if (isFailed) {
          console.log('❌ 분석 실패 감지:', { analysisJobId, status: currentStatus });
          showError('비디오 자세 분석 중 오류가 발생했습니다.');
        }
      } else {
        console.log('⚠️ 이미 처리된 완료 상태 - 스킵');
      }
    } else {
      if (isProcessing) {
        console.log('🔄 분석 진행 중:', { analysisJobId, currentStatus, progress: analysisStatus.progress });
      } else {
        console.log('⏸️ 처리 조건 불만족:', { analysisJobId, isCompleted, isFailed, currentStatus });
      }
    }
  }, [analysisStatus, queryClient, refetchCompleted, showSuccess, showError]);

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
          analysisStatus?.progress?.total 
            ? `자세 분석 진행 중... (${analysisStatus?.progress?.completed || 0}/${analysisStatus?.progress?.total || 0} 이미지 완료)`
            : '자세 분석 진행 중...'
        }
      />

      {/* 자세 분석 완료 미디어세트 섹션 */}
      <CompletedAnalysisSection
        mediaSets={completedMediaSetsResponse?.data.mediaSets || []}
        selectedMediaSetId={selectedCompletedMediaSetId}
        onSelectionChange={handleCompletedMediaSetSelectionChange}
        isLoading={isCompletedLoading}
        error={completedError?.message || null}
        hasMore={completedMediaSetsResponse?.data.hasMore || false}
      />
      
      {/* 추후 피크 지점 분석 결과 표시 섹션이 여기에 추가될 예정 */}
    </div>
  );
};