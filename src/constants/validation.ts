// 유효성 검사 관련 상수 정의
export const VALIDATION_CONSTANTS = {
  // 출생년도 관련
  BIRTH_YEAR: {
    MIN: 1900,
    MAX: 2024,
    MIN_MESSAGE: '1900년 이후여야 합니다',
    MAX_MESSAGE: '2024년 이전이어야 합니다',
    RANGE_MESSAGE: '출생년도는 1900년부터 2024년 사이여야 합니다.'
  },

  // 키 관련 (cm)
  HEIGHT: {
    MIN: 100,
    MAX: 250,
    MIN_MESSAGE: '키는 100cm 이상이어야 합니다',
    MAX_MESSAGE: '키는 250cm 이하여야 합니다',
    RANGE_MESSAGE: '키는 100cm부터 250cm 사이여야 합니다.'
  },

  // 몸무게 관련 (kg)
  WEIGHT: {
    MIN: 30,
    MAX: 300,
    MIN_MESSAGE: '몸무게는 30kg 이상이어야 합니다',
    MAX_MESSAGE: '몸무게는 300kg 이하여야 합니다',
    RANGE_MESSAGE: '몸무게는 30kg부터 300kg 사이여야 합니다.'
  },

  // 체지방률 관련 (%)
  BODY_FAT_RATIO: {
    MIN: 0,
    MAX: 100,
    MIN_MESSAGE: '체지방률은 0 이상이어야 합니다',
    MAX_MESSAGE: '체지방률은 100 이하여야 합니다',
    RANGE_MESSAGE: '체지방률은 0%부터 100% 사이여야 합니다.'
  },

  // 골격근량 관련 (kg)
  SKELETAL_MUSCLE_MASS: {
    MIN: 0,
    MAX: 200,
    MIN_MESSAGE: '골격근량은 0kg 이상이어야 합니다',
    MAX_MESSAGE: '골격근량은 200kg 이하여야 합니다',
    RANGE_MESSAGE: '골격근량은 0kg부터 200kg 사이여야 합니다.'
  },

  // 운동 경력 관련 (년)
  TRAINING_YEAR: {
    MIN: 0,
    MAX: 50,
    MIN_MESSAGE: '운동 경력은 0년 이상이어야 합니다',
    MAX_MESSAGE: '운동 경력은 50년 이하여야 합니다',
    RANGE_MESSAGE: '운동 경력은 0년부터 50년 사이여야 합니다.'
  }
} as const;

// 타입 정의
export type ValidationConstants = typeof VALIDATION_CONSTANTS;
