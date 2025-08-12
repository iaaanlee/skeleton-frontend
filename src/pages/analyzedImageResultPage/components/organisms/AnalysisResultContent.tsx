import React from 'react';
import { AnalysisJob } from '../../../../services/analysisService';
import { AnalysisSummary } from '../molecules/AnalysisSummary';

type AnalysisResultContentProps = {
  result: AnalysisJob;
};

export const AnalysisResultContent: React.FC<AnalysisResultContentProps> = ({
  result
}) => {


  const formatConfidence = (confidence: number) => {
    return `${(confidence * 100).toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* 분석 요약 */}
      <AnalysisSummary 
        totalFiles={result.blazePoseResults?.estimatedImageKeys?.length || 0}
        totalConfidence={result.blazePoseResults?.confidence || 0}
        analysisTime={0} // TODO: 분석 시간 계산 로직 추가
      />

      {/* LLM 분석 결과 */}
      {result.llmResults && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            LLM 분석 결과
          </h3>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">
              {result.llmResults.analysisText}
            </p>
          </div>
        </div>
      )}

      {/* BlazePose 결과 */}
      {result.blazePoseResults && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            BlazePose 분석 결과
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {result.blazePoseResults.estimatedImageKeys.length}
                </div>
                <div className="text-sm text-gray-600">분석된 이미지</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {formatConfidence(result.blazePoseResults.confidence)}
                </div>
                <div className="text-sm text-gray-600">전체 신뢰도</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {result.blazePoseResults.jointPositions.length}
                </div>
                <div className="text-sm text-gray-600">관절 좌표 수</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 분석 통계 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          분석 통계
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {result.blazePoseResults?.estimatedImageKeys?.length || 0}
            </div>
            <div className="text-sm text-gray-600">분석된 파일</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {formatConfidence(result.blazePoseResults?.confidence || 0)}
            </div>
            <div className="text-sm text-gray-600">전체 신뢰도</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {result.status}
            </div>
            <div className="text-sm text-gray-600">분석 상태</div>
          </div>
        </div>
      </div>
    </div>
  );
};
