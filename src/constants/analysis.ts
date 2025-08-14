// 분석 진행 단계별 최소 대기 시간 (밀리초)
export const ANALYSIS_STAGE_MIN_DURATION = {
  PENDING: 1000, // 1초
  BLAZEPOSE_PROCESSING: 1000, // 1초
  BLAZEPOSE_COMPLETED: 1000, // 1초
  LLM_PROCESSING: 1000, // 1초
  LLM_COMPLETED: 2000, // 2초
  BLAZEPOSE_FAILED: 500, // 0.5초 - BlazePose 실패 시 대기 시간
} as const;

// 분석 단계별 텍스트
export const ANALYSIS_STAGE_TEXT = {
  PENDING: '작업을 준비하고 있어요',
  BLAZEPOSE_PROCESSING: '운동 자세를 분석하고 있어요',
  BLAZEPOSE_COMPLETED: '주요 관절과 근육을 자세히 판별하고 있어요',
  LLM_PROCESSING: '취약 부위와 원인을 파악하고 있어요',
  LLM_COMPLETED: '처방을 진행하고 있어요',
  BLAZEPOSE_FAILED: '운동 분석 서버 연결에 실패했습니다',
} as const;

// 분석 단계 순서
export const ANALYSIS_STAGES = [
  'pending',
  'blazepose_processing',
  'blazepose_completed',
  'llm_processing',
  'llm_completed',
] as const;
