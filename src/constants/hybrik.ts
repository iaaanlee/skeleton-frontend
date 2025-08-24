// HybrIK 관절 정의 및 매핑 상수

export type HybrIKJointName = 
  | 'pelvis' | 'left_hip' | 'right_hip' | 'spine1' | 'left_knee' | 'right_knee'
  | 'spine2' | 'left_ankle' | 'right_ankle' | 'spine3' | 'left_foot' | 'right_foot'
  | 'neck' | 'left_collar' | 'right_collar' | 'jaw' | 'left_shoulder' | 'right_shoulder'
  | 'left_elbow' | 'right_elbow' | 'left_wrist' | 'right_wrist' | 'left_thumb' | 'right_thumb';

/**
 * HybrIK 24개 관절 이름 순서 (hybrik_runner.py와 동일)
 */
export const HYBRIK_JOINT_NAMES: HybrIKJointName[] = [
  'pelvis',         // 0
  'left_hip',       // 1
  'right_hip',      // 2
  'spine1',         // 3
  'left_knee',      // 4
  'right_knee',     // 5
  'spine2',         // 6
  'left_ankle',     // 7
  'right_ankle',    // 8
  'spine3',         // 9
  'left_foot',      // 10
  'right_foot',     // 11
  'neck',           // 12
  'left_collar',    // 13
  'right_collar',   // 14
  'jaw',            // 15
  'left_shoulder',  // 16
  'right_shoulder', // 17
  'left_elbow',     // 18
  'right_elbow',    // 19
  'left_wrist',     // 20
  'right_wrist',    // 21
  'left_thumb',     // 22
  'right_thumb'     // 23
];

/**
 * HybrIK 관절 연결 구조 (스켈레톤 그래프용)
 */
export const HYBRIK_SKELETON_CONNECTIONS: Array<[number, number]> = [
  // 척추 연결: pelvis -> spine1 -> spine2 -> spine3 -> neck -> jaw
  [0, 3], [3, 6], [6, 9], [9, 12], [12, 15],
  
  // 왼팔: neck -> left_collar -> left_shoulder -> left_elbow -> left_wrist -> left_thumb
  [12, 13], [13, 16], [16, 18], [18, 20], [20, 22],
  
  // 오른팔: neck -> right_collar -> right_shoulder -> right_elbow -> right_wrist -> right_thumb
  [12, 14], [14, 17], [17, 19], [19, 21], [21, 23],
  
  // 왼다리: pelvis -> left_hip -> left_knee -> left_ankle -> left_foot
  [0, 1], [1, 4], [4, 7], [7, 10],
  
  // 오른다리: pelvis -> right_hip -> right_knee -> right_ankle -> right_foot
  [0, 2], [2, 5], [5, 8], [8, 11]
];

/**
 * HybrIK 관절별 표시 색상 (시각화용)
 */
export const HYBRIK_JOINT_COLORS: Record<string, string> = {
  // 몸통 중심부
  pelvis: '#FF0000',      // 빨간색 - 중심점
  spine1: '#FFFF00',      // 노란색 - 척추
  spine2: '#FFFF00',
  spine3: '#FFFF00',
  neck: '#00FFFF',        // 시안색
  jaw: '#0000FF',         // 파란색 - 머리

  // 팔 관절
  left_collar: '#FF00FF',    // 마젠타
  right_collar: '#FF00FF',
  left_shoulder: '#FF00FF',
  right_shoulder: '#FF00FF',
  left_elbow: '#FF00FF',
  right_elbow: '#FF00FF',
  left_wrist: '#FF00FF',
  right_wrist: '#FF00FF',
  left_thumb: '#FF00FF',
  right_thumb: '#FF00FF',

  // 다리 관절  
  left_hip: '#00FF00',       // 초록색
  right_hip: '#00FF00',
  left_knee: '#00FF00',
  right_knee: '#00FF00',
  left_ankle: '#00FF00',
  right_ankle: '#00FF00',
  left_foot: '#00FF00',
  right_foot: '#00FF00'
};

/**
 * 관절별 한글 표시명
 */
export const HYBRIK_JOINT_DISPLAY_NAMES: Record<HybrIKJointName, string> = {
  pelvis: '골반',
  left_hip: '왼쪽 엉덩이',
  right_hip: '오른쪽 엉덩이',
  spine1: '척추1',
  left_knee: '왼쪽 무릎',
  right_knee: '오른쪽 무릎',
  spine2: '척추2',
  left_ankle: '왼쪽 발목',
  right_ankle: '오른쪽 발목',
  spine3: '척추3',
  left_foot: '왼쪽 발',
  right_foot: '오른쪽 발',
  neck: '목',
  left_collar: '왼쪽 쇄골',
  right_collar: '오른쪽 쇄골',
  jaw: '턱',
  left_shoulder: '왼쪽 어깨',
  right_shoulder: '오른쪽 어깨',
  left_elbow: '왼쪽 팔꿈치',
  right_elbow: '오른쪽 팔꿈치',
  left_wrist: '왼쪽 손목',
  right_wrist: '오른쪽 손목',
  left_thumb: '왼쪽 엄지',
  right_thumb: '오른쪽 엄지'
};

/**
 * 관절 카테고리별 분류
 */
export const HYBRIK_JOINT_CATEGORIES = {
  core: [0, 3, 6, 9, 12, 15], // 몸통 중심부
  arms: [13, 14, 16, 17, 18, 19, 20, 21, 22, 23], // 팔
  legs: [1, 2, 4, 5, 7, 8, 10, 11] // 다리
} as const;