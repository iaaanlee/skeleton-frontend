import React from 'react';
import { BlazePoseLandmark } from '../../../../types/blazePose';
import { 
  groupLandmarksByCategory,
  calculateLandmarkStatistics
} from '../../utils/landmarkUtils';
import ConfidenceHeader from '../atoms/ConfidenceHeader';
import JointCategorySection from '../molecules/JointCategorySection';
import LandmarkStatistics from '../molecules/LandmarkStatistics';
import EmptyLandmarksState from '../atoms/EmptyLandmarksState';

type LandmarksVisualizationProps = {
  landmarks: BlazePoseLandmark[];
};

export const LandmarksVisualization: React.FC<LandmarksVisualizationProps> = ({
  landmarks
}) => {
  if (landmarks.length === 0) {
    return <EmptyLandmarksState />;
  }

  // 모든 landmarks의 visibility를 평균내서 전체 신뢰도 계산
  const overallConfidence = landmarks.length > 0 
    ? landmarks.reduce((sum, landmark) => sum + (landmark.visibility || 0), 0) / landmarks.length
    : 0;

  const groupedLandmarks = groupLandmarksByCategory(landmarks);
  const statistics = calculateLandmarkStatistics(landmarks);

  return (
    <div className="space-y-6">
      <ConfidenceHeader confidence={overallConfidence} />

      <div className="space-y-4">
        {Object.entries(groupedLandmarks).map(([category, categoryLandmarks]) => (
          <JointCategorySection
            key={category}
            category={category as any}
            landmarks={categoryLandmarks.landmarks}
            originalIndices={categoryLandmarks.indices}
          />
        ))}
      </div>

      <LandmarkStatistics
        total={statistics.total}
        highConfidence={statistics.highConfidence}
        mediumConfidence={statistics.mediumConfidence}
        lowConfidence={statistics.lowConfidence}
      />
    </div>
  );
};
