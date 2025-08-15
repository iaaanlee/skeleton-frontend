import React from 'react';
import ResultButton from '../atoms/ResultButton';

type ResultButtonGroupProps = {
  onAnalyzedImageClick: () => void;
  onGptAnalysisClick: () => void;
  className?: string;
};

const ResultButtonGroup: React.FC<ResultButtonGroupProps> = ({
  onAnalyzedImageClick,
  onGptAnalysisClick,
  className = ''
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <ResultButton
        type="image"
        title="자세 분석 사진"
        description="관절 좌표가 분석된 이미지와 상세 정보를 확인하세요."
        onClick={onAnalyzedImageClick}
      />
      
      <ResultButton
        type="analysis"
        title="분석 결과 설명"
        description="AI가 분석한 자세에 대한 상세한 설명을 확인하세요."
        onClick={onGptAnalysisClick}
      />
    </div>
  );
};

export default ResultButtonGroup;