import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useAnalysisStatus } from '../../services/analysisService/analysisQuery';
import { useProfile } from '../../contexts/ProfileAuthContext';
import { useAnalysisNavigation } from '../../hooks';
import { 
  LoadingState, 
  ErrorState, 
  ProgressPageLayout 
} from './components';
import { AnalysisStatus } from '../../types/analysis/analysis';

export const AnalysisProgressPage = () => {
  const { analysisJobId } = useParams<{ analysisJobId: string }>();
  const navigate = useNavigate();
  const { selectedProfile } = useProfile();
  
  // 현재 표시 상태 관리
  const [displayStatus, setDisplayStatus] = useState<AnalysisStatus>('pending');

  // 분석 상태 조회
  const { 
    data: status, 
    isLoading, 
    error 
  } = useAnalysisStatus(analysisJobId || '', selectedProfile?._id);

  // 상태에 따른 네비게이션 처리
  useAnalysisNavigation(displayStatus);

  // 페이지 마운트 시 상태 초기화
  useEffect(() => {
    console.log('AnalysisProgressPage 마운트됨, 상태 초기화');
    setDisplayStatus('pending');
  }, []);

  // 서버 상태에 따른 표시 상태 업데이트
  useEffect(() => {
    if (!status?.status) return;

    console.log('서버 상태:', status.status, '현재 표시 상태:', displayStatus);

    // 이미 완료된 분석이라면 바로 prescription-history로 이동
    if (status.status === 'llm_completed') {
      console.log('이미 완료된 분석 발견, prescription-history로 즉시 이동');
      navigate(ROUTES.PRESCRIPTION_HISTORY);
      return;
    }

    // 서버 상태가 변경되면 바로 표시 상태도 업데이트
    if (status.status !== displayStatus) {
      console.log('상태 업데이트:', displayStatus, '→', status.status);
      setDisplayStatus(status.status);
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