import React from 'react';
import InfoIcon from '../atoms/InfoIcon';

type InfoPanelProps = {
  message: string;
  className?: string;
};

const InfoPanel: React.FC<InfoPanelProps> = ({ message, className = '' }) => {
  return (
    <div className={`mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg ${className}`}>
      <div className="flex items-center space-x-2">
        <InfoIcon />
        <p className="text-sm text-blue-800">
          {message}
        </p>
      </div>
    </div>
  );
};

export default InfoPanel;