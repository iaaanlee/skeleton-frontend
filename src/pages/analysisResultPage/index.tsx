import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useAnalysisStatus } from '../../services/analysisService';
import { 
  LoadingState,
  ErrorState,
  ProgressingState,
  UnexpectedState,
  ResultSelectionLayout
} from './components';

export const AnalysisResultPage = () => {
  const { analysisId } = useParams<{ analysisId: string }>();
  const navigate = useNavigate();

  // 분석 상태 조회
  const { 
    data: status, 
    isLoading: statusLoading, 
    error: statusError 
  } = useAnalysisStatus(analysisId || '');

  // 페이지 로드 시 자동으로 Prescription으로 저장
  useEffect(() => {
    if (status?.status === 'llm_completed' && analysisId) {
      // TODO: Prescription으로 자동 저장 로직 구현
    }
  }, [status?.status, analysisId]);

  const handleBack = () => {
    navigate(ROUTES.PRESCRIPTION_HISTORY);
  };

  const handleAnalyzedImageClick = () => {
    if (analysisId) {
      console.log('Navigating to analyzed image result with analysisId:', analysisId);
      navigate(ROUTES.ANALYZED_IMAGE_RESULT.replace(':analysisId', analysisId));
    } else {
      console.error('analysisId is missing');
    }
  };

  const handleGptAnalysisClick = () => {
    // TODO: GPT 분석 결과 페이지 구현
    console.log('GPT 분석 결과 페이지로 이동 (준비 중)');
  };

  // 조건부 렌더링
  if (statusLoading) {
    return <LoadingState />;
  }

  if (statusError) {
    return <ErrorState error={statusError} onBack={handleBack} />;
  }

  if (status && ['pending', 'blazepose_processing', 'llm_processing'].includes(status.status)) {
    return <ProgressingState status={status} />;
  }

  if (status?.status === 'llm_completed') {
    return (
      <ResultSelectionLayout
        analysisId={analysisId || ''}
        onAnalyzedImageClick={handleAnalyzedImageClick}
        onGptAnalysisClick={handleGptAnalysisClick}
        onBack={handleBack}
      />
    );
  }

  // 예상치 못한 상태
  return <UnexpectedState onBack={handleBack} />;
};