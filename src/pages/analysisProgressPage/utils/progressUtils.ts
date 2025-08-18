import { AnalysisStatus, AnalysisStage } from '../../../types/analysis/analysis';
import { ANALYSIS_STAGE_TEXT } from '../../../constants/analysis';

export const getProgressPercentage = (currentStatus: AnalysisStatus): number => {
  switch (currentStatus) {
    case 'pending':
      return 10;
    case 'blazepose_processing':
      return 30;
    case 'blazepose_completed':
      return 60;
    case 'llm_processing':
      return 80;
    case 'llm_completed':
      return 100;
    case 'blazepose_server_failed':
    case 'blazepose_pose_failed':
      return 0; // BlazePose 실패 시 진행률 0%
    case 'llm_server_failed':
    case 'llm_api_failed':
    case 'llm_failed':
      return 60; // LLM 실패 시 BlazePose는 완료되었으므로 60%
    case 'failed':
      return 0;
    default:
      return 10;
  }
};

export const getStatusText = (currentStatus: AnalysisStatus): string => {
  switch (currentStatus) {
    case 'pending':
      return ANALYSIS_STAGE_TEXT.PENDING;
    case 'blazepose_processing':
      return ANALYSIS_STAGE_TEXT.BLAZEPOSE_PROCESSING;
    case 'blazepose_completed':
      return ANALYSIS_STAGE_TEXT.BLAZEPOSE_COMPLETED;
    case 'llm_processing':
      return ANALYSIS_STAGE_TEXT.LLM_PROCESSING;
    case 'llm_completed':
      return ANALYSIS_STAGE_TEXT.LLM_COMPLETED;
    case 'blazepose_server_failed':
      return ANALYSIS_STAGE_TEXT.BLAZEPOSE_FAILED;
    case 'blazepose_pose_failed':
      return '포즈 감지 실패';
    case 'llm_server_failed':
    case 'llm_api_failed':
    case 'llm_failed':
      return '분석 서버 연결 실패';
    case 'failed':
      return '분석 실패';
    default:
      return '분석 중...';
  }
};

export const getStatusDescription = (currentStatus: AnalysisStatus, message?: string): string => {
  if (currentStatus === 'blazepose_server_failed') {
    return '자세 분석 서버 연결에 실패했습니다. 잠시 후 운동 처방 페이지로 돌아갑니다.';
  }
  if (currentStatus === 'blazepose_pose_failed') {
    return '업로드하신 이미지에서 포즈를 감지할 수 없습니다. 다른 이미지로 다시 시도해주세요.';
  }
  if (currentStatus === 'llm_server_failed' || currentStatus === 'llm_api_failed' || currentStatus === 'llm_failed') {
    return '자세 분석은 완료되었지만, 분석 서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.';
  }
  return message || '분석이 진행 중입니다. 잠시만 기다려주세요.';
};

export const isStageCompleted = (stage: AnalysisStage, currentStatus: AnalysisStatus): boolean => {
  switch (stage) {
    case 'pending':
      return ['blazepose_processing', 'blazepose_completed', 'llm_processing', 'llm_completed', 'llm_server_failed', 'llm_api_failed', 'llm_failed'].includes(currentStatus);
    case 'blazepose_processing':
      return ['blazepose_completed', 'llm_processing', 'llm_completed', 'llm_server_failed', 'llm_api_failed', 'llm_failed'].includes(currentStatus);
    case 'blazepose_completed':
      return ['llm_processing', 'llm_completed', 'llm_server_failed', 'llm_api_failed', 'llm_failed'].includes(currentStatus);
    case 'llm_processing':
      return ['llm_completed'].includes(currentStatus);
    case 'llm_completed':
      return currentStatus === 'llm_completed';
    default:
      return false;
  }
};

export const isStageActive = (stage: AnalysisStage, currentStatus: AnalysisStatus): boolean => {
  return currentStatus === stage;
};

export const isStageFailed = (stage: AnalysisStage, currentStatus: AnalysisStatus): boolean => {
  switch (stage) {
    case 'blazepose_processing':
      return ['blazepose_server_failed', 'blazepose_pose_failed', 'failed'].includes(currentStatus);
    case 'llm_processing':
      return ['llm_server_failed', 'llm_api_failed', 'llm_failed'].includes(currentStatus);
    default:
      return false;
  }
};