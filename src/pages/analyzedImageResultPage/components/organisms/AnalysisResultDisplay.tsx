import React, { useState } from 'react';
import { Prescription } from '../../../../services/prescriptionService';
import { POSE_ENGINES } from '../../../../types/poseEngine';
import { AnalysisSummary } from '../molecules/AnalysisSummary';
import { EngineInfoDisplay } from '../molecules/EngineInfoDisplay';
import { FileResultList } from '../molecules/FileResultList';
import { LandmarksVisualization } from '../molecules/LandmarksVisualization';
import ExpandableSection from '../molecules/ExpandableSection';
import StatisticsGrid from '../molecules/StatisticsGrid';
import ActionButtonGroup from '../molecules/ActionButtonGroup';
import { 
  formatConfidence, 
  calculateAverageConfidence, 
  convertToFileResults 
} from '../../utils/analysisResultUtils';

type AnalysisResultDisplayProps = {
  result: Prescription;
  onSaveResult: () => void;
};

const AnalysisResultDisplay: React.FC<AnalysisResultDisplayProps> = ({
  result,
  onSaveResult
}) => {
  // 사용된 엔진 정보 추출
  const usedEngine = result.poseAnalysis?.engine || result.inputs?.poseEngine || 'blazepose';
  const engineInfo = POSE_ENGINES.find(engine => engine.id === usedEngine);
  const engineName = engineInfo?.name || 'BlazePose';
  
  // 통합 포즈 데이터 또는 레거시 데이터 사용
  const poseData = result.poseAnalysis || result.blazePoseResults;
  
  const [expandedSections, setExpandedSections] = useState<{
    llm: boolean;
    poseAnalysis: boolean;
    landmarks: boolean;
  }>({
    llm: true,
    poseAnalysis: true,
    landmarks: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const fileResults = convertToFileResults(result);
  const averageConfidence = calculateAverageConfidence(result);

  const handlePrint = () => {
    window.print();
  };

  // 엔진별 관절 개수 정보
  const jointCount = usedEngine === 'hybrik' ? 24 : 33;
  
  const poseStatistics = [
    {
      value: poseData?.totalFiles || 0,
      label: '분석된 이미지',
      color: 'blue' as const
    },
    {
      value: formatConfidence(averageConfidence),
      label: '전체 신뢰도',
      color: 'green' as const
    },
    {
      value: jointCount,
      label: '관절 좌표 수',
      color: 'purple' as const
    }
  ];

  const generalStatistics = [
    {
      value: poseData?.totalFiles || 0,
      label: '분석된 파일',
      color: 'blue' as const
    },
    {
      value: formatConfidence(averageConfidence),
      label: '전체 신뢰도',
      color: 'green' as const
    },
    {
      value: result.status,
      label: '분석 상태',
      color: 'purple' as const
    }
  ];

  return (
    <div className="space-y-6">
      {/* 사용된 엔진 정보 */}
      <EngineInfoDisplay engine={usedEngine} />

      {/* 분석 요약 */}
      <AnalysisSummary 
        totalFiles={poseData?.totalFiles || 0}
        totalConfidence={averageConfidence}
        totalLandmarks={jointCount}
      />

      {/* LLM 분석 결과 */}
      {result.llmResults && (
        <ExpandableSection
          title="LLM 분석 결과"
          isExpanded={expandedSections.llm}
          onToggle={() => toggleSection('llm')}
        >
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">
              {result.llmResults.analysisText}
            </p>
          </div>
        </ExpandableSection>
      )}

      {/* 포즈 분석 결과 */}
      {poseData && (
        <ExpandableSection
          title={`${engineName} 분석 결과`}
          isExpanded={expandedSections.poseAnalysis}
          onToggle={() => toggleSection('poseAnalysis')}
        >
          <div className="space-y-4">
            {/* 전체 통계 */}
            <StatisticsGrid items={poseStatistics} />

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
        </ExpandableSection>
      )}

      {/* 관절 좌표 시각화 */}
      {result.blazePoseResults?.results?.[0]?.landmarks && 
       result.blazePoseResults.results[0].landmarks.length > 0 && (
        <ExpandableSection
          title="관절 좌표 상세 정보"
          isExpanded={expandedSections.landmarks}
          onToggle={() => toggleSection('landmarks')}
        >
          <LandmarksVisualization 
            landmarks={result.blazePoseResults.results[0].landmarks}
            confidence={result.blazePoseResults.results[0].confidence[0] || 0}
          />
        </ExpandableSection>
      )}

      {/* 분석 통계 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          분석 통계
        </h3>
        <StatisticsGrid items={generalStatistics} />
      </div>

      {/* 액션 버튼 */}
      <ActionButtonGroup 
        onSave={onSaveResult}
        onPrint={handlePrint}
      />
    </div>
  );
};

export default AnalysisResultDisplay;