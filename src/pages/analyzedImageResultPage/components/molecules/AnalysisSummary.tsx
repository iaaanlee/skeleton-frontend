import React from 'react';

type AnalysisSummaryProps = {
  totalFiles: number;
  totalConfidence: number;
  analysisTime: number;
};

export const AnalysisSummary: React.FC<AnalysisSummaryProps> = ({
  totalFiles,
  totalConfidence,
  analysisTime
}) => {
  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}분 ${remainingSeconds}초`;
    }
    return `${remainingSeconds}초`;
  };

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
          BlazePose 분석이 성공적으로 완료되었습니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {totalFiles}
          </div>
          <div className="text-sm text-gray-600">분석된 파일</div>
        </div>

        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className={`text-3xl font-bold mb-2 ${getConfidenceColor(totalConfidence)}`}>
            {formatConfidence(totalConfidence)}
          </div>
          <div className="text-sm text-gray-600">
            전체 신뢰도 ({getConfidenceText(totalConfidence)})
          </div>
        </div>

        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {formatTime(analysisTime)}
          </div>
          <div className="text-sm text-gray-600">분석 소요 시간</div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">분석 결과 요약</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• 총 {totalFiles}개의 파일이 성공적으로 분석되었습니다.</li>
          <li>• 전체 신뢰도는 {formatConfidence(totalConfidence)}입니다.</li>
          <li>• 분석에 {formatTime(analysisTime)}이 소요되었습니다.</li>
          <li>• 각 파일별 상세 결과는 아래에서 확인할 수 있습니다.</li>
        </ul>
      </div>
    </div>
  );
};
