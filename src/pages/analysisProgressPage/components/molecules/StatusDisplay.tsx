import React from 'react';
import StatusIcon, { StatusIconType } from '../atoms/StatusIcon';
import { AnalysisStatus } from '../../../../types/analysis/analysis';
import { getStatusDisplayProps } from '../../../../utils/status-migration';

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
  const statusProps = getStatusDisplayProps(status);
  
  const getIconType = (): StatusIconType => {
    switch (statusProps.variant) {
      case 'success': return 'success';
      case 'error': return 'error';
      case 'warning': return 'loading'; // warning을 loading으로 매핑
      default: return 'loading';
    }
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