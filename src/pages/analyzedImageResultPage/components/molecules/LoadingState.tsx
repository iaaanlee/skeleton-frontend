import React from 'react';
import { Header } from '../../../../components/common/templates/Header';
import { BottomBar } from '../../../../components/common/templates/BottomBar';
import { AnalysisProgress } from './AnalysisProgress';
import { ROUTES } from '../../../../constants/routes';

type LoadingStateProps = {
  status?: 'pending' | 'processing' | 'completed' | 'failed';
  message?: string;
};

const LoadingState: React.FC<LoadingStateProps> = ({
  status = "processing",
  message = "분석 결과를 불러오는 중..."
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header backRoute={ROUTES.CREATE_PRESCRIPTION} />
      <div className="flex-1 flex items-center justify-center">
        <AnalysisProgress 
          status={status}
          message={message}
        />
      </div>
      <BottomBar />
    </div>
  );
};

export default LoadingState;