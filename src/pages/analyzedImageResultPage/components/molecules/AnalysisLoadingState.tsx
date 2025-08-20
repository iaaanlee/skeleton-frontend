import React from 'react';
import { Header } from '../../../../components/common/templates/Header';
import { BottomBar } from '../../../../components/common/templates/BottomBar';
import { AnalysisProgress } from './AnalysisProgress';
import { ROUTES, RouteValue } from '../../../../constants/routes';
import { AnalysisResultStatus } from '../../../../types/common/status-types';

type AnalysisLoadingStateProps = {
  status?: AnalysisResultStatus;
  message?: string;
  backRoute?: RouteValue;
};

export const AnalysisLoadingState: React.FC<AnalysisLoadingStateProps> = ({
  status = "processing",
  message = "분석 결과를 불러오는 중...",
  backRoute = ROUTES.CREATE_PRESCRIPTION
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header backRoute={backRoute} />
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
