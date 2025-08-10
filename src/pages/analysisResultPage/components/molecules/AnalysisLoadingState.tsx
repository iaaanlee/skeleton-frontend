import React from 'react';
import { Header } from '../../../../components/common/templates/Header';
import { BottomBar } from '../../../../components/common/templates/BottomBar';
import { AnalysisProgress } from './AnalysisProgress';
import { ROUTES, RouteValue } from '../../../../constants/routes';

type AnalysisLoadingStateProps = {
  status?: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  message?: string;
  backRoute?: RouteValue;
};

export const AnalysisLoadingState: React.FC<AnalysisLoadingStateProps> = ({
  status = "processing",
  progress = 0,
  message = "분석 결과를 불러오는 중...",
  backRoute = ROUTES.CREATE_PRESCRIPTION
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header backRoute={backRoute} />
      <div className="flex-1 flex items-center justify-center">
        <AnalysisProgress 
          status={status}
          progress={progress}
          message={message}
        />
      </div>
      <BottomBar />
    </div>
  );
};
