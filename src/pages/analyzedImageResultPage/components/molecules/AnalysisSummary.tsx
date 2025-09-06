import React from 'react';

type AnalysisSummaryProps = {
  totalFiles: number;
  totalConfidence: number;
  totalLandmarks?: number; // 감지된 관절 수 추가
  engineName?: string; // 엔진 이름 추가 (예: "HybrIK", "BlazePose")
};

export const AnalysisSummary: React.FC<AnalysisSummaryProps> = ({
  totalFiles,
  totalConfidence,
  totalLandmarks = 33,
  engineName = "BlazePose"
}) => {
  // formatTime 함수 제거됨

  const formatConfidence = (confidence: number) => {
    return `${(confidence * 100).toFixed(1)}%`;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return '매우 좋음';
    if (confidence >= 0.6) return '보통';
    return '개선 필요';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          분석 완료
        </h2>
        <p className="text-gray-600">
          {engineName} 분석이 성공적으로 완료되었습니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {totalFiles}
          </div>
          <div className="text-sm text-gray-600">분석된 이미지</div>
        </div>

        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className={`text-3xl font-bold mb-2 ${getConfidenceColor(totalConfidence)}`}>
            {formatConfidence(totalConfidence)}
          </div>
          <div className="text-sm text-gray-600">
            포즈 감지 신뢰도 ({getConfidenceText(totalConfidence)})
          </div>
        </div>

        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {totalLandmarks}
          </div>
          <div className="text-sm text-gray-600">감지된 관절 수</div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">분석 결과 요약</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• 총 {totalFiles}개의 이미지에서 운동 자세가 성공적으로 분석되었습니다.</li>
          <li>• {engineName} 포즈 감지 신뢰도: {formatConfidence(totalConfidence)} ({getConfidenceText(totalConfidence)})</li>
          <li>• 총 {totalLandmarks}개의 인체 관절 좌표가 감지되었습니다.</li>
          <li>• 상세 분석 결과 및 개선 제안사항을 아래에서 확인하세요.</li>
        </ul>
      </div>
    </div>
  );
};
