import React from 'react';
import { IconButton } from '../atoms/IconButton';
import { CloseIcon } from '../atoms/CloseIcon';

type ModalHeaderProps = {
  title: string;
  onClose: () => void;
};

export const ModalHeader: React.FC<ModalHeaderProps> = ({ title, onClose }) => {
  return (
    <div className="flex items-center justify-between p-6 border-b">
      <h2 className="text-xl font-semibold text-gray-900">
        {title}
      </h2>
      <IconButton
        onClick={onClose}
        icon={<CloseIcon />}
        ariaLabel="Close modal"
      />
    </div>
  );
};