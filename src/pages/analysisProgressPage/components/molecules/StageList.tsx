import React from 'react';
import StageItem from '../molecules/StageItem';
import { AnalysisStatus } from '../../../../types/analysis/analysis';
import { ANALYSIS_STAGES, ANALYSIS_STAGE_TEXT } from '../../../../constants/analysis';
import { isStageCompleted, isStageActive } from '../../utils/progressUtils';

type StageListProps = {
  status: AnalysisStatus;
  className?: string;
};

const StageList: React.FC<StageListProps> = ({
  status,
  className = ''
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {ANALYSIS_STAGES.map((stage) => (
        <StageItem
          key={stage}
          stage={stage}
          title={ANALYSIS_STAGE_TEXT[stage.toUpperCase() as keyof typeof ANALYSIS_STAGE_TEXT] || stage}
          isCompleted={isStageCompleted(stage, status)}
          isActive={isStageActive(stage, status)}
        />
      ))}
    </div>
  );
};

export default StageList;