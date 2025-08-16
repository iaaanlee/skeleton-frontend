import React from 'react';
import PageHeader from '../molecules/PageHeader';
import ResultButtonGroup from '../molecules/ResultButtonGroup';
import AnalysisIdInfo from '../atoms/AnalysisIdInfo';

type ResultSelectionProps = {
  analysisId: string;
  onAnalyzedImageClick: () => void;
  onLLMAnalysisClick: () => void;
  className?: string;
};

const ResultSelection: React.FC<ResultSelectionProps> = ({
  analysisId,
  onAnalyzedImageClick,
  onLLMAnalysisClick,
  className = ''
}) => {
  return (
    <div className={`max-w-md mx-auto ${className}`}>
      <PageHeader />
      
      <ResultButtonGroup
        onAnalyzedImageClick={onAnalyzedImageClick}
        onLLMAnalysisClick={onLLMAnalysisClick}
      />
      
      <AnalysisIdInfo analysisId={analysisId} />
    </div>
  );
};

export default ResultSelection;