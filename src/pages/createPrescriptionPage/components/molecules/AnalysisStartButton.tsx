import React from 'react';

type AnalysisStartButtonProps = {
  selectedMediaSetId: string | null;
  description: {
    ans1: string;
    ans2: string;
  };
  onAnalysisStart: (inputs: {
    mediaSetId: string;
    description: {
      ans1: string;
      ans2: string;
    };
    isTest?: boolean;
  }) => void;
  onImageAnalysisStart?: (inputs: {
    mediaSetId: string;
    description: {
      ans1: string;
      ans2: string;
    };
  }) => void;
  isCreating?: boolean;
  isImageAnalyzing?: boolean;
  disabled?: boolean;
  className?: string;
};

export const AnalysisStartButton: React.FC<AnalysisStartButtonProps> = ({
  selectedMediaSetId,
  description,
  onAnalysisStart,
  onImageAnalysisStart,
  isCreating = false,
  isImageAnalyzing = false,
  disabled = false,
  className = ''
}) => {
  const handleAnalysisStart = (isTest: boolean = false) => {
    if (!selectedMediaSetId) {
      alert('미디어 세트를 선택해주세요.');
      return;
    }
    
    onAnalysisStart({
      mediaSetId: selectedMediaSetId,
      description,
      isTest
    });
  };

  const handleImageAnalysisStart = () => {
    if (!selectedMediaSetId) {
      alert('미디어 세트를 선택해주세요.');
      return;
    }

    onImageAnalysisStart?.({
      mediaSetId: selectedMediaSetId,
      description
    });
  };

  const isButtonDisabled = disabled || isCreating || isImageAnalyzing || !selectedMediaSetId;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 전체 분석 시작 버튼 */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-orange-900 mb-1">
              전체 분석 시작
            </h3>
            <p className="text-sm text-orange-700">
              포즈 추정 → LLM 분석까지 전체 분석을 진행합니다.
            </p>
          </div>
          
          <button
            onClick={() => handleAnalysisStart(false)}
            disabled={isButtonDisabled}
            className={`
              px-6 py-3 rounded-md font-medium transition-colors
              ${isButtonDisabled
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-orange-600 text-white hover:bg-orange-700'
              }
            `}
          >
            {isCreating ? (
              <div className="flex items-center space-x-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>전체 분석 중...</span>
              </div>
            ) : (
              '전체 분석 시작'
            )}
          </button>
        </div>
      </div>

      {/* 이미지 분석만 시작 버튼 */}
      {onImageAnalysisStart && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-medium text-blue-900 mb-1">
                이미지 분석 시작
              </h3>
              <p className="text-sm text-blue-700">
                포즈 추정만 진행하고 LLM 분석은 건너뜁니다. (테스트용)
              </p>
            </div>
            
            <button
              onClick={handleImageAnalysisStart}
              disabled={isButtonDisabled}
              className={`
                px-6 py-3 rounded-md font-medium transition-colors
                ${isButtonDisabled
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                }
              `}
            >
              {isImageAnalyzing ? (
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>이미지 분석 중...</span>
                </div>
              ) : (
                '이미지 분석 시작'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
