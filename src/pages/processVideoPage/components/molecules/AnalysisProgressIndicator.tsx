import React from 'react';

type AnalysisProgressIndicatorProps = {
  isVisible: boolean;
  analysisJobId?: string;
  progress?: number;
  message?: string;
  onCancel?: () => void;
  className?: string;
};

export const AnalysisProgressIndicator: React.FC<AnalysisProgressIndicatorProps> = ({
  isVisible,
  analysisJobId,
  progress = 0,
  message = '자세 분석 진행 중...',
  onCancel,
  className = ''
}) => {
  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm z-50 ${className}`}>
      <div className="flex items-start space-x-3">
        {/* 로딩 스피너 */}
        <div className="flex-shrink-0 mt-1">
          <div className="animate-spin w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full" />
        </div>
        
        {/* 분석 정보 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-900">비디오 자세 분석</h4>
            {onCancel && (
              <button
                onClick={onCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="취소"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          <p className="text-sm text-gray-600 mb-3">
            {message}
          </p>
          
          {/* 진행률 바 */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          
          {/* 진행률 텍스트 */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{Math.round(progress)}% 완료</span>
            {analysisJobId && (
              <span className="font-mono">ID: {analysisJobId.substring(0, 8)}...</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};