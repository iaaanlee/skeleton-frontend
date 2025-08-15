import { BlazePoseLandmark } from '../../../types/blazePose';
import { 
  JOINT_NAMES, 
  JointCategory, 
  CATEGORY_COLORS, 
  CONFIDENCE_COLORS, 
  CONFIDENCE_THRESHOLDS,
  JOINT_CATEGORY_RANGES,
  COORDINATE_DECIMAL_PLACES,
  CONFIDENCE_DECIMAL_PLACES
} from '../constants/landmarkConstants';

export const formatConfidence = (confidence: number): string => {
  return `${(confidence * 100).toFixed(CONFIDENCE_DECIMAL_PLACES)}%`;
};

export const getConfidenceColor = (confidence: number): string => {
  if (confidence >= CONFIDENCE_THRESHOLDS.HIGH) return CONFIDENCE_COLORS.HIGH;
  if (confidence >= CONFIDENCE_THRESHOLDS.MEDIUM) return CONFIDENCE_COLORS.MEDIUM;
  return CONFIDENCE_COLORS.LOW;
};

export const getJointName = (index: number): string => {
  return JOINT_NAMES[index] || `관절 ${index}`;
};

export const getJointCategory = (index: number): JointCategory => {
  if (index <= JOINT_CATEGORY_RANGES.HEAD_MAX) return 'head';
  if (index <= JOINT_CATEGORY_RANGES.UPPER_BODY_MAX) return 'upper_body';
  if (index <= JOINT_CATEGORY_RANGES.LOWER_BODY_MAX) return 'lower_body';
  return 'other';
};

export const getCategoryColor = (category: JointCategory): string => {
  return CATEGORY_COLORS[category];
};

export const formatCoordinate = (coordinate: number): string => {
  return coordinate.toFixed(COORDINATE_DECIMAL_PLACES);
};

export const groupLandmarksByCategory = (landmarks: BlazePoseLandmark[]): Record<JointCategory, BlazePoseLandmark[]> => {
  return landmarks.reduce((acc, landmark) => {
    const category = getJointCategory(landmark.index);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(landmark);
    return acc;
  }, {} as Record<JointCategory, BlazePoseLandmark[]>);
};

export const calculateLandmarkStatistics = (landmarks: BlazePoseLandmark[]) => {
  return {
    total: landmarks.length,
    highConfidence: landmarks.filter(l => l.visibility >= CONFIDENCE_THRESHOLDS.HIGH).length,
    mediumConfidence: landmarks.filter(l => l.visibility >= CONFIDENCE_THRESHOLDS.MEDIUM && l.visibility < CONFIDENCE_THRESHOLDS.HIGH).length,
    lowConfidence: landmarks.filter(l => l.visibility < CONFIDENCE_THRESHOLDS.MEDIUM).length
  };
};