import React from 'react';
import { AnalysisStage } from '../../../../types/analysis/analysis';

export type StageItemProps = {
  stage: AnalysisStage;
  title: string;
  isCompleted: boolean;
  isActive: boolean;
  className?: string;
};

const StageItem: React.FC<StageItemProps> = ({
  stage,
  title,
  isCompleted,
  isActive,
  className = ''
}) => {
  const getStageIcon = () => {
    if (isCompleted) {
      return '✓';
    }
    
    if (isActive) {
      return (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
      );
    }
    
    return '';
  };

  const getStageClasses = () => {
    if (isCompleted) {
      return 'bg-green-50 border border-green-200';
    }
    return 'bg-gray-50 border border-gray-200';
  };

  const getIconClasses = () => {
    if (isCompleted) {
      return 'bg-green-500 text-white';
    }
    return 'bg-gray-300 text-gray-600';
  };

  return (
    <div className={`flex items-center p-3 rounded-lg transition-all duration-300 ${getStageClasses()} ${className}`}>
      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 transition-all duration-300 ${getIconClasses()}`}>
        {getStageIcon()}
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-900">{title}</p>
      </div>
    </div>
  );
};

export default StageItem;