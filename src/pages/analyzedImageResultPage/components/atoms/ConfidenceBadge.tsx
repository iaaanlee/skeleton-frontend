import React from 'react';
import { JointCategory } from '../../constants/landmarkConstants';
import { formatConfidence, getCategoryColor } from '../../utils/landmarkUtils';

type ConfidenceBadgeProps = {
  confidence: number;
  category: JointCategory;
  className?: string;
};

const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({
  confidence,
  category,
  className = ''
}) => {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(category)} ${className}`}>
      {formatConfidence(confidence)}
    </span>
  );
};

export default ConfidenceBadge;