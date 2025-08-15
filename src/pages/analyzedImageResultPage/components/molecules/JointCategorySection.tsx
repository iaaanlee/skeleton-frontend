import React from 'react';
import { BlazePoseLandmark } from '../../../../types/blazePose';
import { JointCategory, CATEGORY_NAMES } from '../../constants/landmarkConstants';
import { getJointCategory } from '../../utils/landmarkUtils';
import JointCard from '../atoms/JointCard';

type JointCategorySectionProps = {
  category: JointCategory;
  landmarks: BlazePoseLandmark[];
  className?: string;
};

const JointCategorySection: React.FC<JointCategorySectionProps> = ({
  category,
  landmarks,
  className = ''
}) => {
  return (
    <div className={`border border-gray-200 rounded-lg p-4 ${className}`}>
      <h5 className="font-medium text-gray-900 mb-3 capitalize">
        {CATEGORY_NAMES[category]} 관절
      </h5>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {landmarks.map((landmark, index) => (
          <JointCard
            key={`${landmark.index}-${index}`}
            landmark={landmark}
            category={getJointCategory(landmark.index)}
          />
        ))}
      </div>
    </div>
  );
};

export default JointCategorySection;