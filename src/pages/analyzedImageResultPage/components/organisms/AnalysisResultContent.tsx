import React, { useState } from 'react';
import { Prescription } from '../../../../services/prescriptionService';
import { BlazePoseFileResultFromBackend } from '../../../../types/blazePose';
import { AnalysisSummary } from '../molecules/AnalysisSummary';
import { FileResultList } from '../molecules/FileResultList';
import { LandmarksVisualization } from '../molecules/LandmarksVisualization';


type AnalysisResultContentProps = {
  result: Prescription;
};

export const AnalysisResultContent: React.FC<AnalysisResultContentProps> = ({
  result
}) => {
  
  const [expandedSections, setExpandedSections] = useState<{
    llm: boolean;
    blazePose: boolean;
    landmarks: boolean;
  }>({
    llm: true,
    blazePose: true,
    landmarks: false
  });

  const formatConfidence = (confidence: number) => {
    return `${(confidence * 100).toFixed(1)}%`;
  };

  // 전체 신뢰도 계산 (모든 관절의 평균 visibility)
  const calculateAverageConfidence = () => {
    if (!result.blazePoseResults?.results?.[0]?.landmarks?.[0]) return 0;
    
    const landmarks = result.blazePoseResults.results[0].landmarks[0];
    const totalVisibility = landmarks.reduce((sum, landmark) => sum + landmark.visibility, 0);
    return totalVisibility / landmarks.length;
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // BlazePose 결과를 FileResultList 형식으로 변환
  const convertToFileResults = () => {
    if (!result.blazePoseResults?.results) return [];
    
    return result.blazePoseResults.results.map((fileResult: BlazePoseFileResultFromBackend, index: number) => {
      // 신뢰도 계산 (해당 파일의 모든 관절 평균 visibility)
      const landmarks = fileResult.landmarks?.[0] || [];
      const averageConfidence = landmarks.length > 0 
        ? landmarks.reduce((sum, landmark) => sum + landmark.visibility, 0) / landmarks.length
        : 0;

      // pre-signed URL 사용 (백엔드에서 생성된 URL)
      const estimatedImageUrl = fileResult.estimatedImageUrls?.[0]?.downloadUrl || undefined;

      return {
        fileId: `file_${index}`,
        fileName: fileResult.fileName || `파일 ${index + 1}`,
        confidence: averageConfidence,
        analysisTime: 0, // TODO: 실제 분석 시간 추가
        landmarks: landmarks,
        estimatedImageUrl: estimatedImageUrl,
        overlayImageUrl: undefined,
        error: undefined
      };
    });
  };

  const fileResults = convertToFileResults();

  return (
    <div className="space-y-6">
      {/* 분석 요약 */}
      <AnalysisSummary 
        totalFiles={result.blazePoseResults?.totalFiles || 0}
        totalConfidence={calculateAverageConfidence()}
        analysisTime={0}
      />

      {/* LLM 분석 결과 */}
      {result.llmResults && (
        <div className="bg-white rounded-lg shadow-sm">
          <button
            onClick={() => toggleSection('llm')}
            className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              LLM 분석 결과
            </h3>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${
                expandedSections.llm ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {expandedSections.llm && (
            <div className="px-6 pb-6">
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {result.llmResults.analysisText}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* BlazePose 분석 결과 */}
      {result.blazePoseResults && (
        <div className="bg-white rounded-lg shadow-sm">
          <button
            onClick={() => toggleSection('blazePose')}
            className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              BlazePose 분석 결과
            </h3>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${
                expandedSections.blazePose ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {expandedSections.blazePose && (
            <div className="px-6 pb-6">
              <div className="space-y-4">
                {/* 전체 통계 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {result.blazePoseResults.totalFiles || 0}
                    </div>
                    <div className="text-sm text-gray-600">분석된 이미지</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {formatConfidence(calculateAverageConfidence())}
                    </div>
                    <div className="text-sm text-gray-600">전체 신뢰도</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {result.blazePoseResults.results?.[0]?.landmarks?.[0]?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">관절 좌표 수</div>
                  </div>
                </div>

                {/* 파일별 상세 결과 */}
                {fileResults.length > 0 && (
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-4">
                      파일별 분석 결과
                    </h4>
                    <FileResultList fileResults={fileResults} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 관절 좌표 시각화 */}
      {result.blazePoseResults?.results?.[0]?.landmarks?.[0] && result.blazePoseResults.results[0].landmarks[0].length > 0 && (
        <div className="bg-white rounded-lg shadow-sm">
          <button
            onClick={() => toggleSection('landmarks')}
            className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              관절 좌표 상세 정보
            </h3>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${
                expandedSections.landmarks ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {expandedSections.landmarks && (
            <div className="px-6 pb-6">
              <LandmarksVisualization 
                landmarks={result.blazePoseResults.results[0].landmarks[0]}
                confidence={result.blazePoseResults.results[0].confidence[0] || 0}
              />
            </div>
          )}
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
              {result.blazePoseResults?.totalFiles || 0}
            </div>
            <div className="text-sm text-gray-600">분석된 파일</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {formatConfidence(result.blazePoseResults?.results?.[0]?.confidence?.[0] || 0)}
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
