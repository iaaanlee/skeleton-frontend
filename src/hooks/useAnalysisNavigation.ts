import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnalysisStatus } from '../types/analysis/analysis';
import { ROUTES } from '../constants/routes';
import { ANALYSIS_STAGE_MIN_DURATION } from '../constants/analysis';

export const useAnalysisNavigation = (status: AnalysisStatus) => {
  const navigate = useNavigate();

  useEffect(() => {
    // 완료 시 처방 기록 페이지로 이동
    if (status === 'llm_completed') {
      console.log('분석 완료, 네비게이션 준비');
      const timer = setTimeout(() => {
        console.log('처방 기록 페이지로 이동');
        navigate(ROUTES.PRESCRIPTION_HISTORY);
      }, ANALYSIS_STAGE_MIN_DURATION.LLM_COMPLETED);
      
      return () => clearTimeout(timer);
    }

    // BlazePose 서버 실패 시 create-prescription 페이지로 돌아가기
    if (status === 'blazepose_server_failed') {
      console.log('BlazePose 서버 실패 감지, create-prescription 페이지로 돌아가기 준비');
      
      const timer = setTimeout(() => {
        console.log('create-prescription 페이지로 이동');
        navigate(ROUTES.CREATE_PRESCRIPTION);
      }, ANALYSIS_STAGE_MIN_DURATION.BLAZEPOSE_FAILED);
      
      return () => clearTimeout(timer);
    }

    // BlazePose 포즈 감지 실패 시 create-prescription 페이지로 돌아가기
    if (status === 'blazepose_pose_failed') {
      console.log('BlazePose 포즈 감지 실패 감지, create-prescription 페이지로 돌아가기 준비');
      
      const timer = setTimeout(() => {
        console.log('create-prescription 페이지로 이동');
        navigate(ROUTES.CREATE_PRESCRIPTION);
      }, ANALYSIS_STAGE_MIN_DURATION.BLAZEPOSE_FAILED);
      
      return () => clearTimeout(timer);
    }

    // 기타 실패 시 처방 기록 페이지로 이동
    if (status === 'failed') {
      console.log('분석 실패, 처방 기록 페이지로 이동');
      const timer = setTimeout(() => {
        navigate(ROUTES.PRESCRIPTION_HISTORY);
      }, ANALYSIS_STAGE_MIN_DURATION.BLAZEPOSE_FAILED);
      
      return () => clearTimeout(timer);
    }
  }, [status, navigate]);
};