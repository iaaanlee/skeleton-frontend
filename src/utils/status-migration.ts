// 🔄 상태 마이그레이션 및 호환성 유틸리티 (Frontend)
// 기존 로직과 새로운 통합 상태 시스템 간의 호환성 제공

import { 
  UnifiedAnalysisStatus,
  LEGACY_STATUS_MAPPING, 
  NEW_TO_LEGACY_MAPPING,
  getRestartPoint,
  isCompletedStatus,
  isFailedStatus,
  isRetryableStatus,
  isPoseCompleted,
  isLLMCompleted,
  getAnalysisProgress,
  getStatusMessage,
  shouldNavigateToHistory,
  shouldNavigateToCreatePrescription,
  canStartAnalysis
} from '../types/analysis/unified-status';

import { AnalysisStatus } from '../types/analysis/analysis';
import { 
  DisplayStatus, 
  StatusActionVariant, 
  NavigationTarget, 
  NotificationType 
} from '../types/common/status-types';

/**
 * 🔄 모든 상태를 통합 상태로 정규화
 * (Legacy + New 상태 모두 처리)
 */
export const normalizeToUnifiedStatus = (status: string | AnalysisStatus): UnifiedAnalysisStatus => {
  if (!status) return 'pending';
  
  // 디버깅을 위한 로그 추가
  const mapped = LEGACY_STATUS_MAPPING[status];
  if (!mapped) {
    console.warn(`⚠️ Unknown status mapping: "${status}" -> defaulting to 'pending'`);
    return 'pending'; // 알 수 없는 상태는 pending으로 처리 (analysis_failed 대신)
  }
  
  return mapped;
};

// 하위 호환성을 위한 alias
export const convertLegacyToUnified = normalizeToUnifiedStatus;

/**
 * 🔄 새 통합 상태를 레거시 상태로 변환 (하위 호환성)
 */
export const convertUnifiedToLegacy = (unifiedStatus: UnifiedAnalysisStatus): string => {
  if (!unifiedStatus) return 'pending';
  return NEW_TO_LEGACY_MAPPING[unifiedStatus] || 'failed';
};

/**
 * ✅ 완료 상태 여부 확인 (re-export)
 */
export { isCompletedStatus, isFailedStatus, isRetryableStatus, isPoseCompleted, isLLMCompleted } from '../types/analysis/unified-status';

/**
 * 📊 prescription-history 페이지용 상태 표시
 */
export const getPrescriptionDisplayStatus = (analysisStatus: string): DisplayStatus => {
  const unified = normalizeToUnifiedStatus(analysisStatus);
  
  if (isCompletedStatus(unified)) {
    return 'completed';
  } else if (isFailedStatus(unified)) {
    return 'failed';
  } else {
    return 'processing';
  }
};

/**
 * 🎯 create-prescription 페이지용 분석 시작 정보
 */
interface AnalysisStartInfo {
  canStart: boolean;
  buttonText: string;
  restartFrom: UnifiedAnalysisStatus;
  statusMessage: string;
  showWarning?: boolean;
  warningMessage?: string;
}

export const getAnalysisStartInfo = (
  analysisStatus?: string, 
  prescriptionStatus?: string
): AnalysisStartInfo => {
  const unifiedAnalysisStatus = normalizeToUnifiedStatus(analysisStatus || '');
  const unifiedPrescriptionStatus = normalizeToUnifiedStatus(prescriptionStatus || '');
  
  // 재시작 가능한 상태인지 확인
  const canRestart = isRetryableStatus(unifiedAnalysisStatus) || 
                     isRetryableStatus(unifiedPrescriptionStatus);
  
  // 재시작 지점 결정
  const restartPoint = getRestartPoint(unifiedAnalysisStatus);
  
  // 버튼 텍스트 및 상태 메시지 결정
  let buttonText = '분석 시작';
  let showWarning = false;
  let warningMessage = '';
  
  if (canRestart) {
    if (isPoseCompleted(unifiedAnalysisStatus)) {
      buttonText = '처방 생성 재시작';
      warningMessage = '포즈 분석은 완료되었습니다. 처방 생성만 다시 시도합니다.';
    } else {
      buttonText = '분석 재시작';
      if (unifiedAnalysisStatus === 'pose_detection_failed') {
        showWarning = true;
        warningMessage = '이전에 포즈 감지에 실패했습니다. 더 명확한 포즈의 이미지로 다시 시도해주세요.';
      }
    }
  }
  
  return {
    canStart: canStartAnalysis(unifiedAnalysisStatus),
    buttonText,
    restartFrom: restartPoint,
    statusMessage: getStatusMessage(unifiedAnalysisStatus),
    showWarning,
    warningMessage
  };
};

/**
 * 📈 진행률 계산 (기존 progressUtils 호환)
 */
export const calculateProgress = (analysisStatus: string): number => {
  const unified = normalizeToUnifiedStatus(analysisStatus);
  return getAnalysisProgress(unified);
};

/**
 * 🎯 네비게이션 액션 결정 (useAnalysisNavigation 호환)
 */
interface NavigationAction {
  navigate: NavigationTarget;
  delay: number;
  reason: string;
}

export const getNavigationAction = (analysisStatus: string): NavigationAction | null => {
  const unified = normalizeToUnifiedStatus(analysisStatus);
  
  // 분석 완료 상태: prescription-history로 이동
  if (isCompletedStatus(unified)) {
    return { 
      navigate: 'prescription-history', 
      delay: 2000,
      reason: '분석이 완료되었습니다' 
    };
  }
  
  // 포즈 분석 실패: create-prescription으로 이동
  if (shouldNavigateToCreatePrescription(unified)) {
    return { 
      navigate: 'create-prescription', 
      delay: 3000,
      reason: '포즈 분석에 실패했습니다. 다른 이미지로 다시 시도해주세요' 
    };
  }
  
  // 기타 실패 상태: prescription-history로 이동
  if (shouldNavigateToHistory(unified)) {
    return { 
      navigate: 'prescription-history', 
      delay: 3000,
      reason: '분석 과정에서 문제가 발생했습니다' 
    };
  }
  
  // 진행 중 상태: 현재 페이지에 머물기
  return null;
};

/**
 * 🔄 상태별 UI 컴포넌트 프로퍼티 생성
 */
interface StatusDisplayProps {
  text: string;
  description: string;
  progress: number;
  variant: StatusActionVariant;
  showRetry: boolean;
  retryText: string;
}

export const getStatusDisplayProps = (analysisStatus: string, message?: string): StatusDisplayProps => {
  const unified = normalizeToUnifiedStatus(analysisStatus);
  
  let variant: StatusDisplayProps['variant'] = 'processing';
  let showRetry = false;
  let retryText = '다시 시도';
  
  if (isCompletedStatus(unified)) {
    variant = 'success';
  } else if (isFailedStatus(unified)) {
    variant = 'error';
    showRetry = true;
    
    if (unified === 'pose_detection_failed') {
      retryText = '다른 이미지로 재시도';
    } else if (unified === 'llm_analysis_failed') {
      retryText = '처방 생성 재시도';
    }
  } else if (unified === 'pose_completed') {
    variant = 'warning';
  }
  
  return {
    text: getStatusMessage(unified),
    description: message || '',
    progress: getAnalysisProgress(unified),
    variant,
    showRetry,
    retryText
  };
};

/**
 * 📱 모바일 알림용 상태 요약
 */
export const getNotificationMessage = (analysisStatus: string): { title: string; message: string; type: NotificationType } => {
  const unified = normalizeToUnifiedStatus(analysisStatus);
  
  if (isCompletedStatus(unified)) {
    return {
      title: '분석 완료!',
      message: '운동 처방이 생성되었습니다.',
      type: 'success'
    };
  }
  
  if (unified === 'pose_detection_failed') {
    return {
      title: '포즈 감지 실패',
      message: '더 명확한 포즈의 이미지로 다시 시도해주세요.',
      type: 'error'
    };
  }
  
  if (unified === 'llm_analysis_failed') {
    return {
      title: '처방 생성 실패',
      message: '포즈 분석은 완료되었습니다. 처방 생성을 다시 시도해주세요.',
      type: 'error'
    };
  }
  
  if (isFailedStatus(unified)) {
    return {
      title: '분석 실패',
      message: '분석 중 문제가 발생했습니다.',
      type: 'error'
    };
  }
  
  return {
    title: '분석 진행 중',
    message: getStatusMessage(unified),
    type: 'info'
  };
};

/**
 * 🔍 상태 검증 (개발 및 디버깅용)
 */
export const validateStatus = (status: string): { isValid: boolean; unified: UnifiedAnalysisStatus; warnings: string[] } => {
  const warnings: string[] = [];
  let isValid = true;
  
  if (!status) {
    warnings.push('상태가 정의되지 않았습니다');
    isValid = false;
  }
  
  const unified = normalizeToUnifiedStatus(status);
  
  if (!unified || unified === 'analysis_failed') {
    warnings.push(`알 수 없는 상태입니다: ${status}`);
    isValid = false;
  }
  
  return { isValid, unified, warnings };
};

/**
 * 📊 상태별 아이콘 반환 (UI 컴포넌트용)
 */
export const getStatusIcon = (analysisStatus: string): string => {
  const unified = normalizeToUnifiedStatus(analysisStatus);
  
  switch (unified) {
    case 'pending': return '⏳';
    case 'pose_analyzing': return '🤖';
    case 'pose_completed': return '✅';
    case 'llm_analyzing': return '🧠';
    case 'analysis_completed': return '🎉';
    case 'pose_server_failed': return '🔌';
    case 'pose_detection_failed': return '👤';
    case 'llm_server_failed': return '🌐';
    case 'llm_analysis_failed': return '💭';
    default: return '❌';
  }
};

// 기존 함수들의 호환성 래퍼
export const legacyCompatibility = {
  isStageCompleted: (stage: string, currentStatus: string): boolean => {
    const unified = normalizeToUnifiedStatus(currentStatus);
    
    switch (stage) {
      case 'pending':
        return !['pending'].includes(unified);
      case 'blazepose_processing':
        return isPoseCompleted(unified) || isLLMCompleted(unified);
      case 'blazepose_completed':
        return isLLMCompleted(unified);
      case 'llm_processing':
        return isLLMCompleted(unified);
      case 'llm_completed':
        return isLLMCompleted(unified);
      default:
        return false;
    }
  },
  
  isStageActive: (stage: string, currentStatus: string): boolean => {
    const unified = normalizeToUnifiedStatus(currentStatus);
    const legacyFromUnified = convertUnifiedToLegacy(unified);
    return legacyFromUnified === stage;
  },
  
  isStageFailed: (stage: string, currentStatus: string): boolean => {
    const unified = normalizeToUnifiedStatus(currentStatus);
    
    switch (stage) {
      case 'blazepose_processing':
        return ['pose_server_failed', 'pose_detection_failed'].includes(unified);
      case 'llm_processing':
        return ['llm_server_failed', 'llm_analysis_failed'].includes(unified);
      default:
        return false;
    }
  }
};