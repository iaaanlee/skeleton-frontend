import React, { useState } from 'react';
import { Prescription } from '../../../../services/prescriptionService';
import { POSE_ENGINES } from '../../../../types/poseEngine';
import { AnalysisSummary } from '../molecules/AnalysisSummary';
import { EngineInfoDisplay } from '../molecules/EngineInfoDisplay';
import { FileResultList } from '../molecules/FileResultList';
import { LandmarksVisualization } from '../molecules/LandmarksVisualization';
import { HybrIK3DCoordinatesDisplay, HybrIKOverlayDisplay } from '../molecules';
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
  
  // totalFiles 계산: poseData.totalFiles 또는 실제 결과 개수 사용
  const actualTotalFiles = poseData?.totalFiles || fileResults.length;

  const poseStatistics = [
    {
      value: actualTotalFiles,
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
      value: actualTotalFiles,
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
        totalFiles={actualTotalFiles}
        totalConfidence={averageConfidence}
        totalLandmarks={jointCount}
        engineName={engineName}
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

      {/* 관절 좌표 시각화 - 엔진별 분기 처리 */}
      {(() => {
        // BlazePose 데이터가 있는 경우 (기존 방식 유지)
        if (result.blazePoseResults?.results?.[0]?.landmarks && 
            result.blazePoseResults.results[0].landmarks.length > 0) {
          return (
            <ExpandableSection
              title="관절 좌표 상세 정보 (BlazePose - 33개 관절)"
              isExpanded={expandedSections.landmarks}
              onToggle={() => toggleSection('landmarks')}
            >
              <LandmarksVisualization 
                landmarks={result.blazePoseResults.results[0].landmarks}
              />
            </ExpandableSection>
          );
        }
        
        // HybrIK 데이터가 있는 경우 - 3D 좌표 정보만 표시 (그래프는 각 파일별로 표시됨)
        if (result.poseAnalysis?.results?.[0]?.hybrikData && 
            result.poseAnalysis.results[0].hybrikData.joints3d?.length > 0) {
          
          const hybrikData = result.poseAnalysis.results[0].hybrikData;
          
          return (
            <ExpandableSection
              title="HybrIK 3D 관절 좌표 상세 정보 (24개 관절)"
              isExpanded={expandedSections.landmarks}
              onToggle={() => toggleSection('landmarks')}
            >
              <div className="space-y-6">
                {/* HybrIK 오버레이 이미지 (첫 번째 이미지만) */}
                {hybrikData.meta?.debug_visualization && (
                  <HybrIKOverlayDisplay 
                    debugVisualization={hybrikData.meta.debug_visualization}
                    fileName={result.poseAnalysis.results[0].fileName}
                  />
                )}
                
                {/* HybrIK 3D 좌표 표시 */}
                <HybrIK3DCoordinatesDisplay
                  joints3d={hybrikData.joints3d}
                  confidence={hybrikData.confidence || []}
                />
                
                {/* 안내 메시지 추가 */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h6 className="font-medium text-blue-900 mb-2">📊 관절 좌표 그래프 위치 안내</h6>
                  <p className="text-sm text-blue-800">
                    각 이미지별 관절 좌표 그래프는 위의 "파일별 분석 결과" 섹션에서 확인하실 수 있습니다.
                    각 파일마다 2D 이미지 좌표와 3D 월드 좌표 그래프가 표시됩니다.
                  </p>
                </div>
              </div>
            </ExpandableSection>
          );
        }
        
        return null; // 데이터가 없으면 아무것도 표시하지 않음
      })()}

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