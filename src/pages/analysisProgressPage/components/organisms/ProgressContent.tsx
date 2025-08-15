import React from 'react';
import ProgressCard from './ProgressCard';
import { AnalysisStatus } from '../../../../types/analysis/analysis';

export type ProgressContentProps = {
  status: AnalysisStatus;
  message?: string;
  className?: string;
};

const ProgressContent: React.FC<ProgressContentProps> = ({
  status,
  message,
  className = ""
}) => {
  return (
    <div className={`flex-1 flex items-center justify-center ${className}`}>
      <div className="max-w-2xl mx-auto px-4">
        <ProgressCard 
          status={status}
          message={message}
        />
      </div>
    </div>
  );
};

export default ProgressContent;