export const JOINT_NAMES: Record<number, string> = {
  0: '코',
  1: '왼쪽 눈',
  2: '오른쪽 눈',
  3: '왼쪽 귀',
  4: '오른쪽 귀',
  5: '왼쪽 어깨',
  6: '오른쪽 어깨',
  7: '왼쪽 팔꿈치',
  8: '오른쪽 팔꿈치',
  9: '왼쪽 손목',
  10: '오른쪽 손목',
  11: '왼쪽 엉덩이',
  12: '오른쪽 엉덩이',
  13: '왼쪽 무릎',
  14: '오른쪽 무릎',
  15: '왼쪽 발목',
  16: '오른쪽 발목'
};

export type JointCategory = 'head' | 'upper_body' | 'lower_body' | 'other';

export const CATEGORY_NAMES: Record<JointCategory, string> = {
  head: '머리',
  upper_body: '상체',
  lower_body: '하체',
  other: '기타'
};

export const CATEGORY_DISPLAY_NAMES: Record<JointCategory, string> = {
  head: '머리',
  upper_body: '상체',
  lower_body: '하체',
  other: '기타'
};

export const CATEGORY_COLORS: Record<JointCategory, string> = {
  head: 'bg-blue-100 text-blue-800',
  upper_body: 'bg-green-100 text-green-800',
  lower_body: 'bg-purple-100 text-purple-800',
  other: 'bg-gray-100 text-gray-800'
};

export const CONFIDENCE_COLORS = {
  HIGH: 'text-green-600',
  MEDIUM: 'text-yellow-600', 
  LOW: 'text-red-600'
};

export const CONFIDENCE_THRESHOLDS = {
  HIGH: 0.8,
  MEDIUM: 0.6
} as const;

export const JOINT_CATEGORY_RANGES = {
  HEAD_MAX: 4,
  UPPER_BODY_MAX: 10,
  LOWER_BODY_MAX: 16
} as const;

export const COORDINATE_DECIMAL_PLACES = 2;
export const CONFIDENCE_DECIMAL_PLACES = 1;