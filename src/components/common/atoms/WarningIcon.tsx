import React from 'react';

type WarningIconProps = {
  className?: string;
};

export const WarningIcon: React.FC<WarningIconProps> = ({ 
  className = "text-red-500 text-2xl" 
}) => {
  return (
    <div className={className}>
      ⚠️
    </div>
  );
};