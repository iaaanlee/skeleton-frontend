import React from 'react';

export type LoadingStateProps = {
  message?: string;
  className?: string;
};

const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = "분석 결과를 불러오는 중...",
  className = ""
}) => {
  return (
    <div className={`min-h-screen flex flex-col bg-gray-50 ${className}`}>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;