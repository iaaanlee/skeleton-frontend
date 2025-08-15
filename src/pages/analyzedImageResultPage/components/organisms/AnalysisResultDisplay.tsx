import React, { useState } from 'react';
import { Prescription } from '../../../../services/prescriptionService';
import { AnalysisSummary } from '../molecules/AnalysisSummary';
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
  const [expandedSections, setExpandedSections] = useState<{
    llm: boolean;
    blazePose: boolean;
    landmarks: boolean;
  }>({
    llm: true,
    blazePose: true,
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

  const blazePoseStatistics = [
    {
      value: result.blazePoseResults?.totalFiles || 0,
      label: '분석된 이미지',
      color: 'blue' as const
    },
    {
      value: formatConfidence(averageConfidence),
      label: '전체 신뢰도',
      color: 'green' as const
    },
    {
      value: result.blazePoseResults?.results?.[0]?.landmarks?.[0]?.length || 0,
      label: '관절 좌표 수',
      color: 'purple' as const
    }
  ];

  const generalStatistics = [
    {
      value: result.blazePoseResults?.totalFiles || 0,
      label: '분석된 파일',
      color: 'blue' as const
    },
    {
      value: formatConfidence(result.blazePoseResults?.results?.[0]?.confidence?.[0] || 0),
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
      {/* 분석 요약 */}
      <AnalysisSummary 
        totalFiles={result.blazePoseResults?.totalFiles || 0}
        totalConfidence={averageConfidence}
        analysisTime={0}
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

      {/* BlazePose 분석 결과 */}
      {result.blazePoseResults && (
        <ExpandableSection
          title="BlazePose 분석 결과"
          isExpanded={expandedSections.blazePose}
          onToggle={() => toggleSection('blazePose')}
        >
          <div className="space-y-4">
            {/* 전체 통계 */}
            <StatisticsGrid items={blazePoseStatistics} />

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
      {result.blazePoseResults?.results?.[0]?.landmarks?.[0] && 
       result.blazePoseResults.results[0].landmarks[0].length > 0 && (
        <ExpandableSection
          title="관절 좌표 상세 정보"
          isExpanded={expandedSections.landmarks}
          onToggle={() => toggleSection('landmarks')}
        >
          <LandmarksVisualization 
            landmarks={result.blazePoseResults.results[0].landmarks[0]}
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