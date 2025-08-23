// MediaPipe BlazePose complete 33 landmarks constants

export const BLAZE_POSE_JOINT_NAMES: Record<number, string> = {
  // Face (0-10)
  0: '코',
  1: '왼쪽 눈 (안쪽)',
  2: '왼쪽 눈',
  3: '왼쪽 눈 (바깥쪽)',
  4: '오른쪽 눈 (안쪽)',
  5: '오른쪽 눈',
  6: '오른쪽 눈 (바깥쪽)',
  7: '왼쪽 귀',
  8: '오른쪽 귀',
  9: '입 (왼쪽)',
  10: '입 (오른쪽)',
  
  // Upper Body (11-22)
  11: '왼쪽 어깨',
  12: '오른쪽 어깨',
  13: '왼쪽 팔꿈치',
  14: '오른쪽 팔꿈치',
  15: '왼쪽 손목',
  16: '오른쪽 손목',
  17: '왼쪽 새끼손가락',
  18: '오른쪽 새끼손가락',
  19: '왼쪽 검지손가락',
  20: '오른쪽 검지손가락',
  21: '왼쪽 엄지손가락',
  22: '오른쪽 엄지손가락',
  
  // Lower Body (23-32)
  23: '왼쪽 엉덩이',
  24: '오른쪽 엉덩이',
  25: '왼쪽 무릎',
  26: '오른쪽 무릎',
  27: '왼쪽 발목',
  28: '오른쪽 발목',
  29: '왼쪽 발뒤꿈치',
  30: '오른쪽 발뒤꿈치',
  31: '왼쪽 발가락',
  32: '오른쪽 발가락'
};

// MediaPipe POSE_CONNECTIONS - skeletal connections between landmarks
export const BLAZE_POSE_CONNECTIONS: [number, number][] = [
  // Face connections
  [0, 1], [1, 2], [2, 3], [3, 7],
  [0, 4], [4, 5], [5, 6], [6, 8],
  [9, 10],
  
  // Body connections
  [11, 12], // shoulders
  [11, 13], [13, 15], // left arm
  [12, 14], [14, 16], // right arm
  
  // Hand connections
  [15, 17], [15, 19], [15, 21], [17, 19], // left hand
  [16, 18], [16, 20], [16, 22], [18, 20], // right hand
  
  // Torso connections
  [11, 23], [12, 24], [23, 24], // torso
  
  // Leg connections
  [23, 25], [25, 27], // left leg
  [24, 26], [26, 28], // right leg
  
  // Foot connections
  [27, 29], [29, 31], // left foot
  [28, 30], [30, 32], // right foot
  [27, 31], [28, 32]  // additional foot connections
];

export type BlazePoseJointCategory = 'face' | 'upper_body' | 'lower_body';

export const BLAZE_POSE_CATEGORY_NAMES: Record<BlazePoseJointCategory, string> = {
  face: '얼굴',
  upper_body: '상체',
  lower_body: '하체'
};

export const BLAZE_POSE_CATEGORY_COLORS: Record<BlazePoseJointCategory, string> = {
  face: '#FB923C',    // orange-400 (밝은 주황)
  upper_body: '#3B82F6', // blue-500 (파랑)
  lower_body: '#EF4444'  // red-500 (빨강)
};

export const BLAZE_POSE_CATEGORY_RANGES = {
  FACE_MAX: 10,
  UPPER_BODY_MAX: 22,
  LOWER_BODY_MAX: 32
} as const;

export const getBlazePoseJointCategory = (index: number): BlazePoseJointCategory => {
  if (index <= BLAZE_POSE_CATEGORY_RANGES.FACE_MAX) return 'face';
  if (index <= BLAZE_POSE_CATEGORY_RANGES.UPPER_BODY_MAX) return 'upper_body';
  return 'lower_body';
};

export const getBlazePoseJointName = (index: number): string => {
  return BLAZE_POSE_JOINT_NAMES[index] || `관절 ${index}`;
};

export const getBlazePoseCategoryColor = (category: BlazePoseJointCategory): string => {
  return BLAZE_POSE_CATEGORY_COLORS[category];
};

// Graph configuration constants
export const GRAPH_CONFIG = {
  width: 300,
  height: 250,
  margin: { top: 20, right: 20, bottom: 30, left: 40 },
  pointRadius: 3,
  lineWidth: 1.5
} as const;

// Coordinate types for graph titles
export type CoordinateType = 'landmarks' | 'world_landmarks';
export type ProjectionType = 'xy' | 'yz';

export const COORDINATE_TYPE_NAMES: Record<CoordinateType, string> = {
  landmarks: '이미지 좌표',
  world_landmarks: '월드 좌표'
};

export const PROJECTION_TYPE_NAMES: Record<ProjectionType, string> = {
  xy: 'X-Y 평면',
  yz: 'Y-Z 평면'
};