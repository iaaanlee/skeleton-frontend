import React from 'react';
import { BlazePoseResult, JointType } from '../../../../types/blazePose';
import { AnalysisSummary } from '../molecules/AnalysisSummary';
import { FileResultList } from '../molecules/FileResultList';
import { LandmarksVisualization } from '../molecules/LandmarksVisualization';

type AnalysisResultContentProps = {
  result: BlazePoseResult['data'];
  onSaveResult: () => void;
};

export const AnalysisResultContent: React.FC<AnalysisResultContentProps> = ({
  result,
  onSaveResult
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

  return (
    <div className="space-y-6">
      {/* 분석 요약 */}
      <AnalysisSummary 
        totalFiles={result.fileResults.length}
        totalConfidence={result.totalConfidence}
        analysisTime={result.analysisTime}
        onSaveResult={onSaveResult}
      />

      {/* 관절 좌표 시각화 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          관절 좌표 분석
        </h3>
        <LandmarksVisualization 
          landmarks={result.fileResults[0]?.landmarks?.map((landmark, index) => {
            // BlazePose의 33개 관절 순서에 맞게 매핑
            const jointTypes: JointType[] = [
              'nose', 'left_eye', 'right_eye', 'left_ear', 'right_ear',
              'left_shoulder', 'right_shoulder', 'left_elbow', 'right_elbow',
              'left_wrist', 'right_wrist', 'left_hip', 'right_hip',
              'left_knee', 'right_knee', 'left_ankle', 'right_ankle'
            ];
            
            return {
              x: landmark[0],
              y: landmark[1],
              confidence: landmark[2],
              jointType: jointTypes[index] || 'nose'
            };
          }) || []}
          confidence={result.fileResults[0]?.confidence || 0}
        />
      </div>

      {/* 개별 파일 결과 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          파일별 분석 결과
        </h3>
        <FileResultList fileResults={result.fileResults} />
      </div>

      {/* 분석 통계 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          분석 통계
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {result.fileResults.length}
            </div>
            <div className="text-sm text-gray-600">분석된 파일</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {formatConfidence(result.totalConfidence)}
            </div>
            <div className="text-sm text-gray-600">전체 신뢰도</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {formatTime(result.analysisTime)}
            </div>
            <div className="text-sm text-gray-600">분석 소요 시간</div>
          </div>
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={onSaveResult}
          className="px-8 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
        >
          결과 저장
        </button>
        <button
          onClick={() => window.print()}
          className="px-8 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors font-medium"
        >
          결과 출력
        </button>
      </div>
    </div>
  );
};
