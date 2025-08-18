import React from 'react';
import { BlazePoseLandmark } from '../../../../types/blazePose';
import { JointCategory } from '../../constants/landmarkConstants';
import { getJointName, formatConfidence, formatCoordinate } from '../../utils/landmarkUtils';
import ConfidenceBadge from './ConfidenceBadge';

type JointCardProps = {
  landmark: BlazePoseLandmark;
  category: JointCategory;
  index: number; // 배열 인덱스 추가
  className?: string;
};

const JointCard: React.FC<JointCardProps> = ({
  landmark,
  category,
  index,
  className = ''
}) => {
  return (
    <div className={`p-3 border border-gray-200 rounded-lg ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-sm text-gray-900">
          {getJointName(index)}
        </span>
        <ConfidenceBadge 
          confidence={landmark.visibility}
          category={category}
        />
      </div>
      
      <div className="space-y-1 text-xs text-gray-600">
        <div>X: {formatCoordinate(landmark.x)}</div>
        <div>Y: {formatCoordinate(landmark.y)}</div>
        <div>신뢰도: {formatConfidence(landmark.visibility)}</div>
      </div>
    </div>
  );
};

export default JointCard;