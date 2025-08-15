import React from 'react';
import ProgressBar from '../atoms/ProgressBar';
import StatusDisplay from '../molecules/StatusDisplay';
import { AnalysisStatus } from '../../../../types/analysis/analysis';

type ProgressHeaderProps = {
  status: AnalysisStatus;
  percentage: number;
  title: string;
  description: string;
  className?: string;
};

const ProgressHeader: React.FC<ProgressHeaderProps> = ({
  status,
  percentage,
  title,
  description,
  className = ''
}) => {
  return (
    <div className={className}>
      <ProgressBar
        percentage={percentage}
        className="mb-8"
      />

      <StatusDisplay
        status={status}
        title={title}
        description={description}
        className="mb-8"
      />
    </div>
  );
};

export default ProgressHeader;