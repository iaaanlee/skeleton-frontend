import React from 'react';
import ProgressHeader from '../molecules/ProgressHeader';
import StageList from '../molecules/StageList';
import EstimatedTime from '../atoms/EstimatedTime';
import { AnalysisStatus } from '../../../../types/analysis/analysis';
import { 
  getProgressPercentage, 
  getStatusText, 
  getStatusDescription 
} from '../../utils/progressUtils';

export type ProgressCardProps = {
  status: AnalysisStatus;
  message?: string;
  className?: string;
};

const ProgressCard: React.FC<ProgressCardProps> = ({
  status,
  message,
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-lg p-8 ${className}`}>
      <ProgressHeader
        status={status}
        percentage={getProgressPercentage(status)}
        title={getStatusText(status)}
        description={getStatusDescription(status, message)}
      />

      <StageList status={status} />

      <EstimatedTime />
    </div>
  );
};

export default ProgressCard;