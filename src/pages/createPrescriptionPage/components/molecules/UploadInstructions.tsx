import React from 'react';

type UploadInstructionsProps = {
  description: string;
  className?: string;
};

const UploadInstructions: React.FC<UploadInstructionsProps> = ({ 
  description, 
  className = '' 
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <p className="text-gray-600 text-sm">
        {description}
      </p>
    </div>
  );
};

export default UploadInstructions;