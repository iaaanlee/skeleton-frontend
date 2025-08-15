import React from 'react';

const EmptyLandmarksState: React.FC = () => {
  return (
    <div className="text-center py-8">
      <div className="text-gray-400 text-4xl mb-4">🦴</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        관절 좌표가 없습니다
      </h3>
      <p className="text-gray-600">
        분석된 관절 좌표가 없거나 데이터를 불러올 수 없습니다.
      </p>
    </div>
  );
};

export default EmptyLandmarksState;