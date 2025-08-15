import React from 'react';
import { AnalysisStatusInfo } from '../../../../types/analysis/analysis';

export type ProgressingStateProps = {
  status: AnalysisStatusInfo;
  className?: string;
};

const ProgressingState: React.FC<ProgressingStateProps> = ({ 
  status,
  className = ""
}) => {
  return (
    <div className={`min-h-screen flex flex-col bg-gray-50 ${className}`}>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            분석을 진행 중입니다
          </h2>
          <p className="text-gray-600">
            {status.message || '잠시만 기다려주세요...'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProgressingState;