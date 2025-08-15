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
  confidence: number;
};

export const LandmarksVisualization: React.FC<LandmarksVisualizationProps> = ({
  landmarks,
  confidence
}) => {
  if (landmarks.length === 0) {
    return <EmptyLandmarksState />;
  }

  const groupedLandmarks = groupLandmarksByCategory(landmarks);
  const statistics = calculateLandmarkStatistics(landmarks);

  return (
    <div className="space-y-6">
      <ConfidenceHeader confidence={confidence} />

      <div className="space-y-4">
        {Object.entries(groupedLandmarks).map(([category, categoryLandmarks]) => (
          <JointCategorySection
            key={category}
            category={category as any}
            landmarks={categoryLandmarks}
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
