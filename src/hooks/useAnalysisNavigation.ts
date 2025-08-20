import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnalysisStatus } from '../types/analysis/analysis';
import { ROUTES } from '../constants/routes';
import { getNavigationAction } from '../utils/status-migration';

export const useAnalysisNavigation = (status: AnalysisStatus) => {
  const navigate = useNavigate();

  useEffect(() => {
    const action = getNavigationAction(status);
    
    if (action) {
      console.log(`${action.reason}, 네비게이션 준비`);
      const timer = setTimeout(() => {
        const targetRoute = action.navigate === 'prescription-history' 
          ? ROUTES.PRESCRIPTION_HISTORY 
          : ROUTES.CREATE_PRESCRIPTION;
        console.log(`${targetRoute}로 이동`);
        navigate(targetRoute);
      }, action.delay);
      
      return () => clearTimeout(timer);
    }
  }, [status, navigate]);
};