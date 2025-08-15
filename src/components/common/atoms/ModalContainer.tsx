import React from 'react';

type ModalContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export const ModalContainer: React.FC<ModalContainerProps> = ({ 
  children, 
  className = "max-w-md w-full" 
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-xl mx-4 ${className}`}>
      {children}
    </div>
  );
};