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
import { isCompletedStatus, normalizeToUnifiedStatus } from '../../utils/status-migration';

export const AnalysisResultPage = () => {
  const { analysisId } = useParams<{ analysisId: string }>();
  const navigate = useNavigate();

  // 분석 상태 조회
  const { 
    data: status, 
    isLoading: statusLoading, 
    error: statusError 
  } = useAnalysisStatus(analysisId || '');

  const handleBack = () => {
    navigate(ROUTES.PRESCRIPTION_HISTORY);
  };

  const handleAnalyzedImageClick = () => {
    if (analysisId) {
      navigate(ROUTES.ANALYZED_IMAGE_RESULT.replace(':analysisId', analysisId));
    } else {
      console.error('analysisId is missing');
    }
  };

  const handleLLMAnalysisClick = () => {
    // TODO: LLM 분석 결과 페이지 구현
    console.log('LLM 분석 결과 페이지로 이동 (준비 중)');
  };

  // 조건부 렌더링
  if (statusLoading) {
    return <LoadingState />;
  }

  if (statusError) {
    return <ErrorState error={statusError} onBack={handleBack} />;
  }

  const unifiedStatus = status?.status ? normalizeToUnifiedStatus(status.status) : null;
  
  if (status && unifiedStatus && ['pending', 'pose_analyzing', 'llm_analyzing'].includes(unifiedStatus)) {
    return <ProgressingState status={status} />;
  }

  if (status && unifiedStatus && isCompletedStatus(unifiedStatus)) {
    return (
      <ResultSelectionLayout
        analysisId={analysisId || ''}
        onAnalyzedImageClick={handleAnalyzedImageClick}
        onLLMAnalysisClick={handleLLMAnalysisClick}
        onBack={handleBack}
      />
    );
  }

  // 예상치 못한 상태
  return <UnexpectedState onBack={handleBack} />;
};