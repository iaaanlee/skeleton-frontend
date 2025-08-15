import React from 'react';

export type ProgressBarProps = {
  percentage: number;
  showLabel?: boolean;
  className?: string;
};

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  percentage, 
  showLabel = true,
  className = '' 
}) => {
  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">분석 진행률</span>
          <span className="text-sm text-gray-500">{percentage}%</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-blue-600 h-3 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;