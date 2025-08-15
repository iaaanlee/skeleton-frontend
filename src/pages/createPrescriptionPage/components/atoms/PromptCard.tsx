import React from 'react';
import CheckIcon from './CheckIcon';

type PromptCardProps = {
  prompt: {
    _id: string;
    contents: string;
  };
  isSelected: boolean;
  onClick: () => void;
  className?: string;
};

const PromptCard: React.FC<PromptCardProps> = ({ 
  prompt, 
  isSelected, 
  onClick, 
  className = '' 
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        cursor-pointer rounded-lg border-2 p-4 transition-all duration-200
        ${isSelected
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-gray-300 bg-white'
        }
        ${className}
      `}
    >
      <div className="text-sm font-medium text-gray-900 mb-2">
        프롬프트 {prompt._id.substring(0, 8)}...
      </div>
      <div className="text-xs text-gray-600 line-clamp-3">
        {prompt.contents}
      </div>
      
      {isSelected && (
        <div className="mt-2 flex items-center text-blue-600">
          <CheckIcon className="mr-1" />
          <span className="text-xs">선택됨</span>
        </div>
      )}
    </div>
  );
};

export default PromptCard;