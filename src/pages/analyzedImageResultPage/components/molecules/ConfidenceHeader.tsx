import React from 'react';
import { formatConfidence, getConfidenceColor } from '../../utils/landmarkUtils';

type ConfidenceHeaderProps = {
  confidence: number;
  className?: string;
};

const ConfidenceHeader: React.FC<ConfidenceHeaderProps> = ({
  confidence,
  className = ''
}) => {
  return (
    <div className={`text-center p-4 bg-gray-50 rounded-lg ${className}`}>
      <h4 className="font-medium text-gray-900 mb-2">전체 신뢰도</h4>
      <div className={`text-2xl font-bold ${getConfidenceColor(confidence)}`}>
        {formatConfidence(confidence)}
      </div>
    </div>
  );
};

export default ConfidenceHeader;