import React from 'react';

export type ErrorStateProps = {
  error?: any;
  onBack: () => void;
  className?: string;
};

const ErrorState: React.FC<ErrorStateProps> = ({ 
  error,
  onBack,
  className = ""
}) => {
  return (
    <div className={`min-h-screen flex flex-col bg-gray-50 ${className}`}>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-2xl mb-2">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            분석 결과를 불러올 수 없습니다
          </h2>
          <p className="text-gray-600 mb-4">
            {error?.message || '알 수 없는 오류가 발생했습니다.'}
          </p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;