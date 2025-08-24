// 🎯 통합 분석 상태 관리 시스템
// Backend와 Frontend 간 완전 동기화된 타입 정의

/**
 * 통합 분석 상태 타입
 * AnalysisJob과 Prescription에서 공통 사용
 */
export type UnifiedAnalysisStatus = 
  // === 진행 상태 ===
  | 'pending'                    // 분석 대기 중
  | 'pose_analyzing'             // 포즈 분석 중 (BlazePose 처리)
  | 'pose_completed'             // 포즈 분석 완료 (LLM 대기)
  | 'llm_analyzing'              // LLM 분석 중
  | 'analysis_completed'         // 전체 분석 완료
  
  // === 실패 상태 ===
  | 'pose_server_failed'         // 포즈 분석 서버 연결 실패
  | 'pose_detection_failed'      // 포즈 감지 실패 (이미지 품질 문제)
  | 'llm_server_failed'          // LLM 서버 연결 실패
  | 'llm_analysis_failed'        // LLM 분석 실패
  | 'analysis_failed'            // 일반적인 분석 실패
  
  // === 재시작 준비 상태 ===
  | 'pose_retry_ready'           // 포즈 분석 재시작 준비
  | 'llm_retry_ready'            // LLM 분석만 재시작 준비

/**
 * 레거시 상태와 새 상태 간 매핑
 */
export const LEGACY_STATUS_MAPPING: Record<string, UnifiedAnalysisStatus> = {
  // 기존 AnalysisJob 상태 매핑
  'pending': 'pending',
  'blazepose_processing': 'pose_analyzing',
  'pose_processing': 'pose_analyzing',
  'blazepose_completed': 'pose_completed',
  'llm_processing': 'llm_analyzing',
  'llm_completed': 'analysis_completed',
  'blazepose_server_failed': 'pose_server_failed',
  'blazepose_pose_failed': 'pose_detection_failed',
  'llm_server_failed': 'llm_server_failed',
  'llm_api_failed': 'llm_analysis_failed',
  'llm_failed': 'llm_analysis_failed',
  'failed': 'analysis_failed',
  
  // 기존 Prescription 상태 매핑
  'processing': 'pose_analyzing',  // 기본적으로 pose 분석 중으로 간주
  'completed': 'analysis_completed',
  
  // ✨ 새로운 통합 상태들 (1:1 매핑)
  'pose_analyzing': 'pose_analyzing',
  'pose_completed': 'pose_completed',
  'llm_analyzing': 'llm_analyzing',
  'analysis_completed': 'analysis_completed',
  'pose_server_failed': 'pose_server_failed',
  'pose_detection_failed': 'pose_detection_failed',
  'llm_analysis_failed': 'llm_analysis_failed',
  'analysis_failed': 'analysis_failed',
  'pose_retry_ready': 'pose_retry_ready',
  'llm_retry_ready': 'llm_retry_ready',
}

/**
 * 새 상태를 레거시 상태로 역매핑 (하위 호환성)
 */
export const NEW_TO_LEGACY_MAPPING: Record<UnifiedAnalysisStatus, string> = {
  'pending': 'pending',
  'pose_analyzing': 'blazepose_processing',
  'pose_completed': 'blazepose_completed',
  'llm_analyzing': 'llm_processing',
  'analysis_completed': 'llm_completed',
  'pose_server_failed': 'blazepose_server_failed',
  'pose_detection_failed': 'blazepose_pose_failed',
  'llm_server_failed': 'llm_server_failed',
  'llm_analysis_failed': 'llm_failed',
  'analysis_failed': 'failed',
  'pose_retry_ready': 'pending',
  'llm_retry_ready': 'blazepose_completed',
}

/**
 * 상태별 진행률 계산
 */
export const getAnalysisProgress = (status: UnifiedAnalysisStatus): number => {
  switch (status) {
    case 'pending': return 5
    case 'pose_analyzing': return 25
    case 'pose_completed': return 50
    case 'llm_analyzing': return 75
    case 'analysis_completed': return 100
    
    // 실패 상태별 진행률
    case 'pose_server_failed':
    case 'pose_detection_failed':
      return 0  // 포즈 분석 실패 시 0%
      
    case 'llm_server_failed':
    case 'llm_analysis_failed':
      return 50  // LLM 실패 시 포즈 분석까지는 완료 (50%)
      
    case 'analysis_failed': return 0
    case 'pose_retry_ready': return 0
    case 'llm_retry_ready': return 50
    
    default: return 5
  }
}

/**
 * 재시작 지점 결정
 */
export const getRestartPoint = (status: UnifiedAnalysisStatus): UnifiedAnalysisStatus => {
  switch (status) {
    case 'pose_server_failed':
    case 'pose_detection_failed':
    case 'pose_retry_ready':
      return 'pending'              // 포즈 분석부터 다시 시작
      
    case 'llm_server_failed':
    case 'llm_analysis_failed':
    case 'llm_retry_ready':
      return 'pose_completed'       // LLM 분석만 다시 시작
      
    case 'analysis_failed':
      return 'pending'              // 전체 다시 시작
      
    default:
      return 'pending'
  }
}

/**
 * 상태별 사용자 친화적 메시지
 */
export const getStatusMessage = (status: UnifiedAnalysisStatus): string => {
  switch (status) {
    case 'pending': return '분석 준비 중입니다'
    case 'pose_analyzing': return '포즈 분석 중입니다'
    case 'pose_completed': return '포즈 분석이 완료되었습니다'
    case 'llm_analyzing': return '운동 처방을 생성하고 있습니다'
    case 'analysis_completed': return '분석이 완료되었습니다'
    
    case 'pose_server_failed': return '포즈 분석 서버 연결에 실패했습니다'
    case 'pose_detection_failed': return '이미지에서 포즈를 감지할 수 없습니다'
    case 'llm_server_failed': return '처방 생성 서버 연결에 실패했습니다'
    case 'llm_analysis_failed': return '운동 처방 생성에 실패했습니다'
    case 'analysis_failed': return '분석 중 오류가 발생했습니다'
    
    case 'pose_retry_ready': return '포즈 분석을 다시 시작할 수 있습니다'
    case 'llm_retry_ready': return '운동 처방 생성을 다시 시작할 수 있습니다'
    
    default: return '상태를 확인할 수 없습니다'
  }
}

/**
 * 완료 상태 여부 확인
 */
export const isCompletedStatus = (status: UnifiedAnalysisStatus): boolean => {
  return status === 'analysis_completed'
}

/**
 * 실패 상태 여부 확인
 */
export const isFailedStatus = (status: UnifiedAnalysisStatus): boolean => {
  return [
    'pose_server_failed',
    'pose_detection_failed', 
    'llm_server_failed',
    'llm_analysis_failed',
    'analysis_failed'
  ].includes(status)
}

/**
 * 재시작 가능 상태 여부 확인
 */
export const isRetryableStatus = (status: UnifiedAnalysisStatus): boolean => {
  return [
    'pose_retry_ready',
    'llm_retry_ready',
    'pose_server_failed',
    'pose_detection_failed',
    'llm_server_failed', 
    'llm_analysis_failed',
    'analysis_failed'
  ].includes(status)
}

/**
 * 특정 단계 완료 여부 확인
 */
export const isPoseCompleted = (status: UnifiedAnalysisStatus): boolean => {
  return [
    'pose_completed',
    'llm_analyzing', 
    'analysis_completed',
    'llm_server_failed',
    'llm_analysis_failed',
    'llm_retry_ready'
  ].includes(status)
}

export const isLLMCompleted = (status: UnifiedAnalysisStatus): boolean => {
  return status === 'analysis_completed'
}

/**
 * 네비게이션 로직을 위한 상태 확인
 */
export const shouldNavigateToHistory = (status: UnifiedAnalysisStatus): boolean => {
  return [
    'analysis_completed',    // 완전 완료
    'llm_server_failed',     // LLM 실패 (포즈는 완료)
    'llm_analysis_failed',   // LLM 실패 (포즈는 완료)
    'analysis_failed'        // 일반 실패
  ].includes(status)
}

export const shouldNavigateToCreatePrescription = (status: UnifiedAnalysisStatus): boolean => {
  return [
    'pose_server_failed',      // 포즈 서버 실패
    'pose_detection_failed'    // 포즈 감지 실패
  ].includes(status)
}

/**
 * 분석 시작 버튼 활성화 여부
 */
export const canStartAnalysis = (status: UnifiedAnalysisStatus): boolean => {
  return [
    'pending',
    'pose_retry_ready',
    'llm_retry_ready',
    'pose_server_failed',
    'pose_detection_failed',
    'llm_server_failed',
    'llm_analysis_failed',
    'analysis_failed'
  ].includes(status)
}