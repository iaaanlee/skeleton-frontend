import React from 'react';
import { Header } from '../../../../components/common/templates/Header';
import { BottomBar } from '../../../../components/common/templates/BottomBar';
import { ROUTES, RouteValue } from '../../../../constants/routes';
import { ResultSelection } from '../organisms';

export type ResultSelectionLayoutProps = {
  analysisId: string;
  onAnalyzedImageClick: () => void;
  onGptAnalysisClick: () => void;
  onBack: () => void;
  backRoute?: RouteValue;
  className?: string;
};

const ResultSelectionLayout: React.FC<ResultSelectionLayoutProps> = ({
  analysisId,
  onAnalyzedImageClick,
  onGptAnalysisClick,
  onBack,
  backRoute = ROUTES.PRESCRIPTION_HISTORY,
  className = ""
}) => {
  return (
    <div className={`min-h-screen flex flex-col bg-gray-50 ${className}`}>
      <Header backRoute={backRoute} />
      
      <div className="flex-1 p-4">
        <ResultSelection
          analysisId={analysisId}
          onAnalyzedImageClick={onAnalyzedImageClick}
          onGptAnalysisClick={onGptAnalysisClick}
        />
      </div>
      
      <BottomBar />
    </div>
  );
};

export default ResultSelectionLayout;