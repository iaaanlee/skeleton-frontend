import React from 'react';

type PromptErrorStateProps = {
  className?: string;
};

const PromptErrorState: React.FC<PromptErrorStateProps> = ({ className = '' }) => {
  return (
    <div className={`p-4 ${className}`}>
      <div className="text-center text-red-500">프롬프트 목록을 불러오는데 실패했습니다.</div>
    </div>
  );
};

export default PromptErrorState;