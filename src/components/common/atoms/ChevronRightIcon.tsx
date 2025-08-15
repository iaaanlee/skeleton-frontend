import React from 'react';

type ChevronRightIconProps = {
  className?: string;
  size?: number;
};

const ChevronRightIcon: React.FC<ChevronRightIconProps> = ({ 
  className = 'w-5 h-5 text-gray-400',
  size = 24
}) => {
  return (
    <svg 
      className={className}
      width={size}
      height={size}
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M9 5l7 7-7 7" 
      />
    </svg>
  );
};

export default ChevronRightIcon;