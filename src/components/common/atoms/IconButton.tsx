import React from 'react';

type IconButtonProps = {
  onClick: () => void;
  icon: React.ReactNode;
  ariaLabel?: string;
  className?: string;
};

export const IconButton: React.FC<IconButtonProps> = ({ 
  onClick, 
  icon, 
  ariaLabel,
  className = "text-gray-400 hover:text-gray-600 transition-colors" 
}) => {
  return (
    <button
      onClick={onClick}
      className={className}
      aria-label={ariaLabel}
    >
      {icon}
    </button>
  );
};