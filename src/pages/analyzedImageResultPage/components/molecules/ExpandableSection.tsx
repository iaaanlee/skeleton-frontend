import React from 'react';
import ChevronIcon from '../atoms/ChevronIcon';

type ExpandableSectionProps = {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  className?: string;
};

const ExpandableSection: React.FC<ExpandableSectionProps> = ({
  title,
  isExpanded,
  onToggle,
  children,
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm ${className}`}>
      <button
        onClick={onToggle}
        className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <h3 className="text-lg font-semibold text-gray-900">
          {title}
        </h3>
        <ChevronIcon isExpanded={isExpanded} />
      </button>
      
      {isExpanded && (
        <div className="px-6 pb-6">
          {children}
        </div>
      )}
    </div>
  );
};

export default ExpandableSection;