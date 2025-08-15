import React from 'react';

type LandmarkStatisticsProps = {
  total: number;
  highConfidence: number;
  mediumConfidence: number;
  lowConfidence: number;
  className?: string;
};

const LandmarkStatistics: React.FC<LandmarkStatisticsProps> = ({
  total,
  highConfidence,
  mediumConfidence,
  lowConfidence,
  className = ''
}) => {
  return (
    <div className={`bg-blue-50 rounded-lg p-4 ${className}`}>
      <h5 className="font-medium text-gray-900 mb-3">분석 통계</h5>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="text-center">
          <div className="font-bold text-blue-600">{total}</div>
          <div className="text-gray-600">총 관절 수</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-green-600">{highConfidence}</div>
          <div className="text-gray-600">높은 신뢰도</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-yellow-600">{mediumConfidence}</div>
          <div className="text-gray-600">보통 신뢰도</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-red-600">{lowConfidence}</div>
          <div className="text-gray-600">낮은 신뢰도</div>
        </div>
      </div>
    </div>
  );
};

export default LandmarkStatistics;