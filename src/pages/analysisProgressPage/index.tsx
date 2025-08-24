import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useAnalysisStatus } from '../../services/analysisService/analysisQuery';
import { useAnalysisNavigation } from '../../hooks';
import { 
  LoadingState, 
  ErrorState, 
  ProgressPageLayout 
} from './components';
import { AnalysisStatus } from '../../types/analysis/analysis';
import { isCompletedStatus, normalizeToUnifiedStatus, convertUnifiedToLegacy } from '../../utils/status-migration';

export const AnalysisProgressPage = () => {
  const { analysisJobId } = useParams<{ analysisJobId: string }>();
  const navigate = useNavigate();
  
  // 현재 표시 상태 관리 (레거시 상태로 정규화)
  const [displayStatus, setDisplayStatus] = useState<AnalysisStatus>('pending');
  
  // 초기 로딩 완료 여부 추적
  const [hasInitialData, setHasInitialData] = useState(false);

  // 분석 상태 조회
  const { 
    data: status, 
    isLoading, 
    error 
  } = useAnalysisStatus(analysisJobId || '');

  // 상태에 따른 네비게이션 처리 - 초기 데이터가 있을 때만 실행
  useAnalysisNavigation(hasInitialData ? displayStatus : 'pending');

  // 페이지 마운트 시 상태 초기화 - 서버 응답을 기다리는 동안 안전한 상태로 설정
  useEffect(() => {
    if (!status?.status) {
      setDisplayStatus('pending');
    }
  }, [status?.status]);

  // 서버 상태에 따른 표시 상태 업데이트 (통합 상태 정규화)
  useEffect(() => {
    if (!status?.status) return;

    // 초기 데이터 로딩 완료 표시
    setHasInitialData(true);

    // 1. 서버 상태를 통합 상태로 정규화
    const unifiedStatus = normalizeToUnifiedStatus(status.status);
    
    // 2. 완료된 분석이라면 바로 prescription-history로 이동
    if (isCompletedStatus(unifiedStatus)) {
      navigate(ROUTES.PRESCRIPTION_HISTORY);
      return;
    }

    // 3. 통합 상태를 레거시 상태로 변환 (progressUtils 호환성)
    const legacyStatus = convertUnifiedToLegacy(unifiedStatus);
    
    // 4. 표시 상태 업데이트 (레거시 상태로)
    if (legacyStatus !== displayStatus) {
      setDisplayStatus(legacyStatus as AnalysisStatus);
    }
  }, [status?.status, displayStatus, navigate]);

  // 조건부 렌더링
  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState />;
  }

  return (
    <ProgressPageLayout 
      status={displayStatus}
      message={status?.message}
    />
  );
};