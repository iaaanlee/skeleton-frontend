import React from 'react';

export type StatusIconType = 'loading' | 'success' | 'error';

export type StatusIconProps = {
  type: StatusIconType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
};

const StatusIcon: React.FC<StatusIconProps> = ({ 
  type, 
  size = 'md', 
  className = '' 
}) => {
  const baseClasses = `${sizeClasses[size]} ${className}`;

  if (type === 'loading') {
    return (
      <div className={`${baseClasses} animate-spin rounded-full border-b-2 border-blue-600`} />
    );
  }

  if (type === 'success') {
    return (
      <div className={`${baseClasses} bg-green-500 rounded-full flex items-center justify-center`}>
        <svg className="w-1/2 h-1/2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    );
  }

  if (type === 'error') {
    return (
      <div className={`${baseClasses} bg-red-500 rounded-full flex items-center justify-center`}>
        <svg className="w-1/2 h-1/2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    );
  }

  return null;
};

export default StatusIcon;