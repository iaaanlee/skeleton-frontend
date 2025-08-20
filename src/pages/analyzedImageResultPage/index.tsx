import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useAnalysisStatus } from '../../services/analysisService';
import { usePrescriptionByAnalysisJob } from '../../services/prescriptionService';
import {
  LoadingState,
  ErrorState,
  ProgressingState,
  UnexpectedState,
  NoResultState,
  AnalysisResultLayout
} from './components';
import { useToast } from '../../contexts/ToastContext';
import { isCompletedStatus, normalizeToUnifiedStatus } from '../../utils/status-migration';

export const AnalyzedImageResultPage = () => {
  const { analysisId } = useParams<{ analysisId: string }>();
  const { showSuccess } = useToast();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(ROUTES.CREATE_PRESCRIPTION);
  };

  const handleSaveResult = () => {
    // TODO: 분석 결과 저장 로직 구현
    showSuccess('분석 결과가 저장되었습니다.');
  };

  // 분석 상태 조회
  const { 
    data: status, 
    isLoading: statusLoading, 
    error: statusError 
  } = useAnalysisStatus(analysisId || '');

  // 분석이 완료된 경우에만 prescription 결과 요청
  const unifiedStatus = status?.status ? normalizeToUnifiedStatus(status.status) : null;
  const isCompleted = unifiedStatus ? isCompletedStatus(unifiedStatus) : false;
  const { 
    data: prescription, 
    isLoading: prescriptionLoading, 
    error: prescriptionError 
  } = usePrescriptionByAnalysisJob(analysisId || '');

  // 조건부 렌더링
  if (!analysisId) {
    return (
      <ErrorState 
        title="분석 ID가 없습니다"
        message="올바르지 않은 분석 페이지입니다."
        onBack={handleBack}
      />
    );
  }

  if (statusLoading) {
    return <LoadingState message="분석 상태를 확인하는 중..." />;
  }

  if (statusError) {
    return (
      <ErrorState 
        title="분석 상태를 확인할 수 없습니다"
        message={statusError.message || '알 수 없는 오류가 발생했습니다.'}
        onBack={handleBack}
      />
    );
  }

  if (status && unifiedStatus && ['pending', 'pose_analyzing', 'llm_analyzing'].includes(unifiedStatus)) {
    return <ProgressingState status={status} />;
  }

  if (isCompleted && prescriptionLoading) {
    return <LoadingState status="completed" message="분석 결과를 불러오는 중..." />;
  }

  if (isCompleted && prescriptionError) {
    return (
      <ErrorState 
        title="분석 결과를 불러올 수 없습니다"
        message={prescriptionError.message || '알 수 없는 오류가 발생했습니다.'}
        onBack={handleBack}
      />
    );
  }

  if (isCompleted && !prescription) {
    return <NoResultState onBack={handleBack} />;
  }

  if (isCompleted && prescription) {
    return (
      <AnalysisResultLayout 
        result={prescription}
        onSaveResult={handleSaveResult}
      />
    );
  }

  // 예상치 못한 상태
  return <UnexpectedState onBack={handleBack} />;
};
