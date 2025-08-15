import React from 'react';
import CloseButton from '../atoms/CloseButton';

type ModalHeaderProps = {
  title: string;
  onClose: () => void;
  className?: string;
};

const ModalHeader: React.FC<ModalHeaderProps> = ({ title, onClose, className = '' }) => {
  return (
    <div className={`flex items-center justify-between p-6 border-b ${className}`}>
      <h2 className="text-xl font-semibold text-gray-900">
        {title}
      </h2>
      <CloseButton onClick={onClose} />
    </div>
  );
};

export default ModalHeader;