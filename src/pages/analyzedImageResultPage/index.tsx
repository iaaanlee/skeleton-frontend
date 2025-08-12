import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useAnalysisStatus, useAnalysisJob } from '../../services/analysisService';
import { AnalysisLoadingState, AnalysisErrorState, AnalysisNoResultState, AnalysisUnexpectedState } from './components/molecules';
import { AnalysisResultDisplay } from './components/organisms';

export const AnalyzedImageResultPage = () => {
  const { analysisId } = useParams<{ analysisId: string }>();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(ROUTES.CREATE_PRESCRIPTION);
  };

  // 분석 상태 조회 - analysisId가 없어도 호출하되 enabled: false로 설정
  const { 
    data: status, 
    isLoading: statusLoading, 
    error: statusError 
  } = useAnalysisStatus(analysisId || '');

  // 분석이 완료된 경우에만 결과 요청
  const isCompleted = status?.status === 'llm_completed';
  const { 
    data: result, 
    isLoading: resultLoading, 
    error: resultError 
  } = useAnalysisJob(analysisId || '');

  // analysisId가 없으면 에러 상태로 처리
  if (!analysisId) {
    return (
      <AnalysisErrorState 
        title="분석 ID가 없습니다"
        message="올바르지 않은 분석 페이지입니다."
        onBack={handleBack}
      />
    );
  }

  const handleSaveResult = () => {
    // TODO: 분석 결과 저장 로직 구현
    console.log('분석 결과 저장:', result);
    alert('분석 결과가 저장되었습니다.');
  };

  // 1. 로딩 중 (상태 확인 중)
  if (statusLoading) {
    return (
      <AnalysisLoadingState 
        message="분석 상태를 확인하는 중..."
      />
    );
  }

  // 2. 상태 확인 에러
  if (statusError) {
    return (
      <AnalysisErrorState 
        title="분석 상태를 확인할 수 없습니다"
        message={statusError.message || '알 수 없는 오류가 발생했습니다.'}
        onBack={handleBack}
      />
    );
  }

  // 3. 분석 진행 중 (pending, blazepose_processing, llm_processing)
  if (status && ['pending', 'blazepose_processing', 'llm_processing'].includes(status.status)) {
    return (
      <AnalysisLoadingState 
        status="processing"
        message={status.message || "분석을 진행 중입니다..."}
      />
    );
  }

  // 4. 분석 완료되었지만 결과 로딩 중
  if (isCompleted && resultLoading) {
    return (
      <AnalysisLoadingState 
        status="completed"
        message="분석 결과를 불러오는 중..."
      />
    );
  }

  // 5. 분석 완료되었지만 결과 요청 에러
  if (isCompleted && resultError) {
    return (
      <AnalysisErrorState 
        title="분석 결과를 불러올 수 없습니다"
        message={resultError.message || '알 수 없는 오류가 발생했습니다.'}
        onBack={handleBack}
      />
    );
  }

  // 6. 분석 완료되었지만 결과가 없음
  if (isCompleted && !result) {
    return (
      <AnalysisNoResultState 
        onBack={handleBack}
      />
    );
  }

  // 7. 분석 완료되고 결과 있음 - 결과 표시
  if (isCompleted && result) {
    return (
      <AnalysisResultDisplay 
        result={result}
        onSaveResult={handleSaveResult}
      />
    );
  }

  // 8. 예상치 못한 상태 (fallback)
  return (
    <AnalysisUnexpectedState 
      onBack={handleBack}
    />
  );
};
