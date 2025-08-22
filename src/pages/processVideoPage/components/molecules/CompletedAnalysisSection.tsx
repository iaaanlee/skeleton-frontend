import React from 'react';
import { CompletedAnalysisMediaCard } from './CompletedAnalysisMediaCard';
import { CompletedPoseAnalysisMediaSet } from '../../../../types/completedPoseAnalysis';

export type CompletedAnalysisSectionProps = {
  mediaSets: CompletedPoseAnalysisMediaSet[];
  selectedMediaSetId: string | null;
  onSelectionChange: (mediaSetId: string | null) => void;
  isLoading?: boolean;
  error?: string | null;
  hasMore?: boolean;
  onLoadMore?: () => void;
  className?: string;
};

export const CompletedAnalysisSection: React.FC<CompletedAnalysisSectionProps> = ({
  mediaSets,
  selectedMediaSetId,
  onSelectionChange,
  isLoading = false,
  error = null,
  hasMore = false,
  onLoadMore,
  className = ''
}) => {
  const handleCardSelect = (mediaSetId: string) => {
    // 같은 카드 클릭 시 선택 해제
    if (selectedMediaSetId === mediaSetId) {
      onSelectionChange(null);
    } else {
      onSelectionChange(mediaSetId);
    }
  };

  const handleClearSelection = () => {
    onSelectionChange(null);
  };

  // 로딩 스켈레톤 렌더링
  const renderSkeletonCards = () => {
    return Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className="bg-white rounded-lg border border-gray-200 animate-pulse">
        <div className="aspect-video w-full bg-gray-200 rounded-t-lg" />
        <div className="p-4">
          <div className="h-4 bg-gray-200 rounded mb-2" />
          <div className="h-3 bg-gray-200 rounded w-2/3 mb-2" />
          <div className="h-2 bg-gray-200 rounded w-1/2 mb-2" />
          <div className="h-1.5 bg-gray-200 rounded" />
        </div>
      </div>
    ));
  };

  // 에러 상태 렌더링
  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            자세 분석 완료 미디어세트
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            BlazePose 분석이 완료된 비디오들을 선택하세요.
          </p>
        </div>
        <div className="p-6">
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h4 className="text-lg font-medium text-gray-900 mb-2">데이터 로드 오류</h4>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* 섹션 헤더 */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              자세 분석 완료 미디어세트
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              BlazePose 분석이 완료된 비디오들을 선택하세요.
              {!isLoading && mediaSets.length > 0 && (
                <span className="ml-2 font-medium text-gray-700">
                  ({mediaSets.length}개)
                </span>
              )}
            </p>
          </div>
          {selectedMediaSetId && (
            <button
              onClick={handleClearSelection}
              className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              선택 해제
            </button>
          )}
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="p-6">
        {isLoading && mediaSets.length === 0 ? (
          // 초기 로딩 상태
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderSkeletonCards()}
          </div>
        ) : mediaSets.length === 0 ? (
          // 빈 상태
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1} 
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" 
              />
            </svg>
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              완료된 자세 분석이 없습니다
            </h4>
            <p className="text-gray-600 mb-4">
              먼저 비디오를 업로드하고 자세 분석을 완료해주세요.
            </p>
          </div>
        ) : (
          // 미디어세트 그리드
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mediaSets.map((mediaSet) => (
                <CompletedAnalysisMediaCard
                  key={mediaSet._id}
                  mediaSet={mediaSet}
                  isSelected={selectedMediaSetId === mediaSet._id}
                  onSelect={handleCardSelect}
                />
              ))}
            </div>

            {/* 더보기 버튼 */}
            {hasMore && (
              <div className="mt-6 text-center">
                <button
                  onClick={onLoadMore}
                  disabled={isLoading}
                  className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500 inline" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      로딩 중...
                    </>
                  ) : (
                    '더보기'
                  )}
                </button>
              </div>
            )}

            {/* 로딩 중 추가 스켈레톤 */}
            {isLoading && mediaSets.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {renderSkeletonCards()}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};