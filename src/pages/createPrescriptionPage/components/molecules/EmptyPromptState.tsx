import React from 'react';

type EmptyPromptStateProps = {
  className?: string;
};

const EmptyPromptState: React.FC<EmptyPromptStateProps> = ({ className = '' }) => {
  return (
    <div className={`p-4 ${className}`}>
      <div className="text-center text-gray-500">사용 가능한 프롬프트가 없습니다.</div>
    </div>
  );
};

export default EmptyPromptState;