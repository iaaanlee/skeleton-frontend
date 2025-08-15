import React from 'react';
import ChevronRightIcon from './ChevronRightIcon';

type MainButtonVariant = 'default' | 'compact';

type MainButtonProps = {
  title: string;
  onClick: () => void;
  variant?: MainButtonVariant;
  showIcon?: boolean;
  className?: string;
};

const MainButton: React.FC<MainButtonProps> = ({ 
  title, 
  onClick, 
  variant = 'default',
  showIcon = true,
  className = ''
}) => {
  const baseClasses = "w-full bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200";
  
  const variantClasses = {
    default: "p-6 text-left hover:border-gray-300",
    compact: "p-4 hover:shadow-md transition-shadow"
  };

  const contentClasses = {
    default: "flex items-center justify-between",
    compact: "flex justify-between items-center"
  };

  const titleClasses = {
    default: "text-lg font-semibold text-gray-900",
    compact: "text-lg font-medium text-gray-900"
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      <div className={contentClasses[variant]}>
        <span className={titleClasses[variant]}>
          {title}
        </span>
        {showIcon && <ChevronRightIcon />}
      </div>
    </button>
  );
};

export default MainButton;