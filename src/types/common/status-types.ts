// 🎯 공통 상태 타입 정의
// 프로젝트 전체에서 사용하는 상태 타입들을 중앙화하여 관리

import { UnifiedAnalysisStatus } from '../analysis/unified-status';

/**
 * 분석 관련 상태 타입들
 */
export type { UnifiedAnalysisStatus } from '../analysis/unified-status';

/**
 * API 응답에서 사용하는 기본 상태 타입
 * (레거시 호환성을 위해 유지)
 */
export type LegacyAnalysisStatus = 'pending' | 'blazepose_processing' | 'blazepose_completed' | 'llm_processing' | 'llm_completed' | 'processing' | 'completed' | 'failed';

/**
 * BlazePose 관련 상태 타입
 */
export type BlazePoseApiStatus = 'pending' | 'pose_analyzing' | 'pose_completed' | 'pose_server_failed' | 'pose_detection_failed';

/**
 * Prescription 관련 상태 타입  
 */
export type PrescriptionStatus = 'pose_analyzing' | 'analysis_completed' | 'analysis_failed';

/**
 * UI 표시용 상태 타입
 */
export type DisplayStatus = 'completed' | 'failed' | 'processing';

/**
 * 상태 변화 액션 타입
 */
export type StatusActionVariant = 'success' | 'error' | 'warning' | 'info' | 'processing';

/**
 * 네비게이션 대상 타입
 */
export type NavigationTarget = 'prescription-history' | 'create-prescription' | null;

/**
 * 분석 결과 상태 타입 (UI용)
 */
export type AnalysisResultStatus = 'completed' | 'failed' | 'pending' | 'processing';

/**
 * 알림 타입
 */
export type NotificationType = 'success' | 'error' | 'info';