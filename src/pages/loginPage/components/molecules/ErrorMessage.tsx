import React from 'react';

const ErrorMessage: React.FC = () => {
  return (
    <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-center">
      Login failed. Please check your credentials.
    </div>
  );
};

export default ErrorMessage;