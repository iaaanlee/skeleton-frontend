import React from 'react';

const ErrorState: React.FC = () => {
  return (
    <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-center">
      Error creating profile. Please try again.
    </div>
  );
};

export default ErrorState;