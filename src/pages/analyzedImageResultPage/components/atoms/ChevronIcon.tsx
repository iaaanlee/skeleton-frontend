import React from 'react';

type ChevronIconProps = {
  isExpanded: boolean;
  className?: string;
};

const ChevronIcon: React.FC<ChevronIconProps> = ({ 
  isExpanded, 
  className = '' 
}) => {
  return (
    <svg
      className={`w-5 h-5 text-gray-500 transition-transform ${
        isExpanded ? 'rotate-180' : ''
      } ${className}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
};

export default ChevronIcon;