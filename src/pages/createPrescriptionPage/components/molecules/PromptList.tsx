import React from 'react';
import PromptCard from '../atoms/PromptCard';

type PromptListProps = {
  prompts: Array<{
    _id: string;
    contents: string;
  }>;
  selectedPromptId: string | null | undefined;
  onPromptClick: (promptId: string) => void;
  className?: string;
};

const PromptList: React.FC<PromptListProps> = ({ 
  prompts, 
  selectedPromptId, 
  onPromptClick, 
  className = '' 
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {prompts.map((prompt) => (
        <PromptCard
          key={prompt._id}
          prompt={prompt}
          isSelected={selectedPromptId === prompt._id}
          onClick={() => onPromptClick(prompt._id)}
        />
      ))}
    </div>
  );
};

export default PromptList;