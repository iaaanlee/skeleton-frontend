import React from 'react';

type ModalFooterProps = {
  onClose: () => void;
  className?: string;
};

const ModalFooter: React.FC<ModalFooterProps> = ({ onClose, className = '' }) => {
  return (
    <div className={`flex justify-end space-x-3 p-6 border-t ${className}`}>
      <button
        onClick={onClose}
        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
      >
        닫기
      </button>
    </div>
  );
};

export default ModalFooter;