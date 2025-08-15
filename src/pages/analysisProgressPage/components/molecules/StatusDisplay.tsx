import React from 'react';
import StatusIcon, { StatusIconType } from '../atoms/StatusIcon';
import { AnalysisStatus } from '../../../../types/analysis/analysis';

export type StatusDisplayProps = {
  status: AnalysisStatus;
  title: string;
  description: string;
  className?: string;
};

const StatusDisplay: React.FC<StatusDisplayProps> = ({
  status,
  title,
  description,
  className = ''
}) => {
  const getIconType = (): StatusIconType => {
    if (status === 'llm_completed') return 'success';
    if (status === 'failed' || status === 'blazepose_server_failed' || status === 'blazepose_pose_failed') {
      return 'error';
    }
    return 'loading';
  };

  const shouldShowIcon = status !== 'pending';

  return (
    <div className={`text-center ${className}`}>
      {shouldShowIcon && (
        <StatusIcon 
          type={getIconType()} 
          size="md" 
          className="mx-auto mb-4"
        />
      )}
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h2>
      <p className="text-gray-600">
        {description}
      </p>
    </div>
  );
};

export default StatusDisplay;