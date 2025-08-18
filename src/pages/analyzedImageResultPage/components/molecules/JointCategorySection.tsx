import React from 'react';
import { BlazePoseLandmark } from '../../../../types/blazePose';
import { JointCategory, CATEGORY_NAMES } from '../../constants/landmarkConstants';
import JointCard from '../atoms/JointCard';

type JointCategorySectionProps = {
  category: JointCategory;
  landmarks: BlazePoseLandmark[];
  originalIndices: number[]; // 원래 배열에서의 인덱스들 추가
  className?: string;
};

const JointCategorySection: React.FC<JointCategorySectionProps> = ({
  category,
  landmarks,
  originalIndices,
  className = ''
}) => {
  return (
    <div className={`border border-gray-200 rounded-lg p-4 ${className}`}>
      <h5 className="font-medium text-gray-900 mb-3 capitalize">
        {CATEGORY_NAMES[category]} 관절
      </h5>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {landmarks.map((landmark, idx) => (
          <JointCard
            key={`${originalIndices[idx]}-${idx}`}
            landmark={landmark}
            category={category}
            index={originalIndices[idx]}
          />
        ))}
      </div>
    </div>
  );
};

export default JointCategorySection;