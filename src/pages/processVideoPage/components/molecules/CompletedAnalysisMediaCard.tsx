import React from 'react';
import { CompletedPoseAnalysisMediaSet } from '../../../../types/completedPoseAnalysis';

export type CompletedAnalysisMediaCardProps = {
  mediaSet: CompletedPoseAnalysisMediaSet;
  isSelected: boolean;
  onSelect: (mediaSetId: string) => void;
  className?: string;
};

export const CompletedAnalysisMediaCard: React.FC<CompletedAnalysisMediaCardProps> = ({
  mediaSet,
  isSelected,
  onSelect,
  className = ''
}) => {
  const handleClick = () => {
    onSelect(mediaSet._id);
  };

  // 완료 시간을 간단한 형태로 포맷팅
  const formatCompletedTime = (dateString: string | null | undefined) => {
    if (!dateString) return '완료 시간 정보 없음';
    
    const date = new Date(dateString);
    // Invalid Date 체크
    if (isNaN(date.getTime())) return '완료 시간 정보 없음';
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return '방금 전';
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;
    return date.toLocaleDateString('ko-KR');
  };

  // 완료 시간 우선순위: finalCompletedAt -> completedAt (backwards compatibility)
  const completedTime = formatCompletedTime(
    mediaSet.analysisJob.timestamps?.finalCompletedAt || mediaSet.analysisJob.completedAt
  );
  
  // 단계별 완료 시간 정보
  const poseCompletedTime = mediaSet.analysisJob.timestamps?.poseCompletedAt 
    ? formatCompletedTime(mediaSet.analysisJob.timestamps.poseCompletedAt)
    : null;
  const llmCompletedTime = mediaSet.analysisJob.timestamps?.llmCompletedAt
    ? formatCompletedTime(mediaSet.analysisJob.timestamps.llmCompletedAt) 
    : null;
    
  // 분석 소요 시간 계산 (포즈 분석 완료부터 전체 완료까지)
  const getAnalysisDuration = () => {
    if (!mediaSet.analysisJob.timestamps?.poseCompletedAt || !mediaSet.analysisJob.timestamps?.finalCompletedAt) {
      return null;
    }
    const poseTime = new Date(mediaSet.analysisJob.timestamps.poseCompletedAt);
    const finalTime = new Date(mediaSet.analysisJob.timestamps.finalCompletedAt);
    const diffMs = finalTime.getTime() - poseTime.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    
    if (diffSec < 60) return `${diffSec}초`;
    const diffMin = Math.floor(diffSec / 60);
    return `${diffMin}분 ${diffSec % 60}초`;
  };

  const progressText = `${mediaSet.analysisJob.progress.completed}/${mediaSet.analysisJob.progress.total}`;
  const hasFailures = mediaSet.analysisJob.progress.failed > 0;

  return (
    <div
      className={`
        relative bg-white rounded-lg border-2 transition-all duration-200 cursor-pointer
        hover:shadow-md hover:border-gray-300
        ${isSelected 
          ? 'border-blue-500 shadow-lg ring-2 ring-blue-200' 
          : 'border-gray-200'
        }
        ${className}
      `}
      onClick={handleClick}
    >
      {/* 선택 표시 */}
      <div className="absolute top-3 right-3 z-10">
        <div
          className={`
            w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
            ${isSelected 
              ? 'bg-blue-500 border-blue-500' 
              : 'bg-white border-gray-300 hover:border-blue-400'
            }
          `}
        >
          {isSelected && (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>

      {/* 썸네일 */}
      <div className="aspect-video w-full bg-gray-100 rounded-t-lg overflow-hidden">
        {mediaSet.thumbnailUrl ? (
          <img
            src={mediaSet.thumbnailUrl}
            alt={mediaSet.poseDescription || '비디오 썸네일'}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1} 
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" 
              />
            </svg>
          </div>
        )}
      </div>

      {/* 콘텐츠 */}
      <div className="p-4">
        {/* 자세 설명 */}
        <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
          {mediaSet.poseDescription || '자세 설명 없음'}
        </h4>

        {/* 분석 상태 */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <div className="flex items-center">
            <div 
              className={`
                w-2 h-2 rounded-full mr-2
                ${mediaSet.analysisJob.status === 'analysis_completed' 
                  ? 'bg-green-500' 
                  : 'bg-blue-500'
                }
              `} 
            />
            <span>
              {mediaSet.analysisJob.status === 'analysis_completed' 
                ? '전체 분석 완료' 
                : '자세 분석 완료'
              }
            </span>
          </div>
          <div className="group relative">
            <span className="cursor-help">{completedTime}</span>
            {/* 상세 시간 정보 툴팁 */}
            <div className="invisible group-hover:visible absolute right-0 bottom-full mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
              <div className="space-y-1">
                {poseCompletedTime && (
                  <div>포즈 분석: {poseCompletedTime}</div>
                )}
                {llmCompletedTime && (
                  <div>LLM 분석: {llmCompletedTime}</div>
                )}
                {getAnalysisDuration() && (
                  <div className="border-t border-gray-600 pt-1 mt-1">
                    총 소요시간: {getAnalysisDuration()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 진행률 */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">
            이미지 {progressText}개 처리
            {hasFailures && (
              <span className="text-amber-600 ml-1">
                ({mediaSet.analysisJob.progress.failed}개 실패)
              </span>
            )}
          </span>
          <span className="font-medium text-gray-900">
            {Math.round(mediaSet.analysisJob.progress.percentage)}%
          </span>
        </div>

        {/* 진행률 바 */}
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className={`
                h-1.5 rounded-full transition-all
                ${hasFailures ? 'bg-amber-500' : 'bg-blue-500'}
              `}
              style={{ width: `${mediaSet.analysisJob.progress.percentage}%` }}
            />
          </div>
        </div>

        {/* Estimated 이미지 개수 표시 */}
        {mediaSet.analysisJob.estimatedImageUrls.length > 0 && (
          <div className="mt-3 text-xs text-gray-500 flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
            자세 오버레이 {mediaSet.analysisJob.estimatedImageUrls.length}개
          </div>
        )}
      </div>
    </div>
  );
};