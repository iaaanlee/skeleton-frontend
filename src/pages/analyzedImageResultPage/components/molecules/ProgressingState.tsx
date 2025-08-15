import React from 'react';
import { Header } from '../../../../components/common/templates/Header';
import { BottomBar } from '../../../../components/common/templates/BottomBar';
import { AnalysisProgress } from './AnalysisProgress';
import { ROUTES } from '../../../../constants/routes';

type ProgressingStateProps = {
  status: {
    status: string;
    message?: string;
  };
};

const ProgressingState: React.FC<ProgressingStateProps> = ({ status }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header backRoute={ROUTES.CREATE_PRESCRIPTION} />
      <div className="flex-1 flex items-center justify-center">
        <AnalysisProgress 
          status="processing"
          message={status.message || "분석을 진행 중입니다..."}
        />
      </div>
      <BottomBar />
    </div>
  );
};

export default ProgressingState;