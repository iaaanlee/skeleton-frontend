import React from 'react';

type AnalysisIdInfoProps = {
  analysisId: string;
  className?: string;
};

const AnalysisIdInfo: React.FC<AnalysisIdInfoProps> = ({ 
  analysisId, 
  className = '' 
}) => {
  return (
    <div className={`mt-8 p-4 bg-gray-50 rounded-lg ${className}`}>
      <p className="text-xs text-gray-500 text-center">
        분석 ID: {analysisId}
      </p>
    </div>
  );
};

export default AnalysisIdInfo;