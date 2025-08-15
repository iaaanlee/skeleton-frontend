import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="text-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">처방 기록을 불러오는 중...</p>
    </div>
  );
};

export default LoadingState;