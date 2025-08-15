import React from 'react';

type PromptLoadingStateProps = {
  className?: string;
};

const PromptLoadingState: React.FC<PromptLoadingStateProps> = ({ className = '' }) => {
  return (
    <div className={`p-4 ${className}`}>
      <div className="text-center text-gray-500">프롬프트를 불러오는 중...</div>
    </div>
  );
};

export default PromptLoadingState;