import React from 'react';

type AnalysisStartButtonProps = {
  selectedMediaSetId: string | null;
  description: {
    ans1: string;
    ans2: string;
  };
  selectedPromptId: string | null;
  onAnalysisStart: (inputs: {
    mediaSetId: string;
    description: {
      ans1: string;
      ans2: string;
    };
    promptId: string;
  }) => void;
  isCreating?: boolean;
  disabled?: boolean;
  className?: string;
};

export const AnalysisStartButton: React.FC<AnalysisStartButtonProps> = ({
  selectedMediaSetId,
  description,
  selectedPromptId,
  onAnalysisStart,
  isCreating = false,
  disabled = false,
  className = ''
}) => {
  const handleAnalysisStart = () => {
    if (!selectedMediaSetId) {
      alert('미디어 세트를 선택해주세요.');
      return;
    }
    
    if (!description.ans1.trim() || !description.ans2.trim()) {
      alert('운동 분석 요청사항을 모두 입력해주세요.');
      return;
    }
    
    if (!selectedPromptId) {
      alert('분석 프롬프트를 선택해주세요.');
      return;
    }
    
    onAnalysisStart({
      mediaSetId: selectedMediaSetId,
      description,
      promptId: selectedPromptId
    });
  };

  const isButtonDisabled = disabled || isCreating || !selectedMediaSetId || !description.ans1.trim() || !description.ans2.trim() || !selectedPromptId;

  return (
    <div className={`bg-orange-50 border border-orange-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-orange-900 mb-1">
            운동 분석 시작
          </h3>
          <p className="text-sm text-orange-700">
            선택된 미디어 세트와 요청사항으로 분석을 시작합니다.
          </p>
        </div>
        
        <button
          onClick={handleAnalysisStart}
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
              <span>처방 생성 중...</span>
            </div>
          ) : (
            '분석 시작'
          )}
        </button>
      </div>
    </div>
  );
};
