import React from 'react';

type ModalOverlayProps = {
  onClick?: () => void;
  children: React.ReactNode;
};

export const ModalOverlay: React.FC<ModalOverlayProps> = ({ onClick, children }) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClick}
    >
      <div onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};