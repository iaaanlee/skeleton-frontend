import React from 'react';

const EmptyState: React.FC = () => {
  return (
    <div className="text-center py-12">
      <div className="text-gray-400 text-2xl mb-2">📋</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        처방 기록이 없습니다
      </h3>
      <p className="text-gray-500">
        완료된 처방이 없습니다. 운동 분석을 시작해보세요.
      </p>
    </div>
  );
};

export default EmptyState;