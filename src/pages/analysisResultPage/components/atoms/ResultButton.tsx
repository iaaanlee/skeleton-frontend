import React from 'react';
import Icon from './Icon';

type ResultButtonProps = {
  type: 'image' | 'analysis';
  title: string;
  description: string;
  onClick: () => void;
  className?: string;
};

const ResultButton: React.FC<ResultButtonProps> = ({
  type,
  title,
  description,
  onClick,
  className = ''
}) => {
  const iconBgColor = type === 'image' ? 'bg-blue-100' : 'bg-green-100';
  const iconTextColor = type === 'image' ? 'text-blue-600' : 'text-green-600';
  const hoverBorderColor = type === 'image' ? 'hover:border-blue-300' : 'hover:border-green-300';

  return (
    <button
      onClick={onClick}
      className={`w-full p-6 bg-white rounded-lg border border-gray-200 ${hoverBorderColor} hover:shadow-md transition-all duration-200 text-left ${className}`}
    >
      <div className="flex items-center space-x-4">
        <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center`}>
          <Icon 
            type={type} 
            className={`w-6 h-6 ${iconTextColor}`} 
          />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <Icon 
          type="chevron" 
          className="w-5 h-5 text-gray-400" 
        />
      </div>
    </button>
  );
};

export default ResultButton;