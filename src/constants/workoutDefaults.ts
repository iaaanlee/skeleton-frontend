/**
 * 운동 관련 기본값 상수
 *
 * 🔮 향후 개선 예정:
 * - 유저별로 기본값을 설정할 수 있도록 User Preferences API와 연동
 * - 백엔드에서 유저 설정을 가져와서 이 값들을 override
 */

/**
 * 세트 기본값
 */
export const DEFAULT_SET_VALUES = {
  /**
   * 운동 시간 제한 기본값
   * - null: 시간 제한 없음
   * - number: 시간 제한(초)
   */
  TIME_LIMIT: null as number | null,

  /**
   * 운동 후 휴식 시간 기본값
   * - 단위: 초
   * - 기본값: 120초 (2분)
   */
  REST_TIME: 120,
} as const;

/**
 * 운동(Exercise) 기본값
 */
export const DEFAULT_EXERCISE_VALUES = {
  /**
   * 목표 기본값
   */
  GOAL: {
    TYPE: 'rep' as const,
    VALUE: 10,
    RULE: 'exact' as const,
  },

  /**
   * 부하 기본값
   */
  LOAD: {
    TYPE: 'free' as const,
    VALUE: null,
    TEXT: '',
  },
} as const;
