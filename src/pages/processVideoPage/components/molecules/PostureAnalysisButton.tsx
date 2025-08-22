import React from 'react';

type PostureAnalysisButtonProps = {
  selectedMediaSetId: string | null;
  onAnalysisStart: (mediaSetId: string) => Promise<void>;
  isAnalyzing?: boolean;
  disabled?: boolean;
  className?: string;
};

export const PostureAnalysisButton: React.FC<PostureAnalysisButtonProps> = ({
  selectedMediaSetId,
  onAnalysisStart,
  isAnalyzing = false,
  disabled = false,
  className = ''
}) => {
  const handleAnalysisStart = async () => {
    if (!selectedMediaSetId) {
      alert('분석할 비디오 미디어셋을 선택해주세요.');
      return;
    }
    
    try {
      await onAnalysisStart(selectedMediaSetId);
    } catch (error) {
      console.error('Analysis start error:', error);
    }
  };

  const isButtonDisabled = disabled || isAnalyzing || !selectedMediaSetId;

  return (
    <div className={`bg-green-50 border border-green-200 rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-green-900 mb-2">
            자세 분석 시작
          </h3>
          <p className="text-sm text-green-700 mb-1">
            선택된 비디오에서 BlazePose 분석을 수행합니다.
          </p>
          <div className="text-xs text-green-600">
            {selectedMediaSetId 
              ? '✓ 미디어셋이 선택되었습니다' 
              : '⚠ 미디어셋을 먼저 선택해주세요'
            }
          </div>
        </div>
        
        <button
          onClick={handleAnalysisStart}
          disabled={isButtonDisabled}
          className={`
            px-6 py-3 rounded-md font-medium transition-all duration-200
            ${isButtonDisabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-md transform hover:scale-105'
            }
          `}
        >
          {isAnalyzing ? (
            <div className="flex items-center space-x-2">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>분석 중...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>분석 시작</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};