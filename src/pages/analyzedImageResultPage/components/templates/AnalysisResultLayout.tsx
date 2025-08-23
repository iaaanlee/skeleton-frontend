import React from 'react';
import { ScrollablePageLayout } from '../../../../components/common/templates';
import { PageHeader, ContentContainer } from '../../../../components/common/molecules';
import { ROUTES } from '../../../../constants/routes';
import { Prescription } from '../../../../services/prescriptionService';
import { POSE_ENGINES } from '../../../../types/poseEngine';
import AnalysisResultDisplay from '../organisms/AnalysisResultDisplay';

type AnalysisResultLayoutProps = {
  result: Prescription;
  onSaveResult: () => void;
};

const AnalysisResultLayout: React.FC<AnalysisResultLayoutProps> = ({
  result,
  onSaveResult
}) => {
  // 사용된 엔진 정보 추출
  const usedEngine = result.poseAnalysis?.engine || result.inputs?.poseEngine || 'blazepose';
  const engineInfo = POSE_ENGINES.find(engine => engine.id === usedEngine);
  const engineName = engineInfo?.name || 'BlazePose';
  
  return (
    <ScrollablePageLayout 
      backRoute={ROUTES.PRESCRIPTION_HISTORY}
      contentClassName="p-4"
    >
      <ContentContainer maxWidth="6xl">
        <PageHeader
          title="운동 분석 결과"
          description={`${engineName}을 통해 분석된 운동 자세 결과입니다.`}
        />

        <AnalysisResultDisplay 
          result={result}
          onSaveResult={onSaveResult}
        />
      </ContentContainer>
    </ScrollablePageLayout>
  );
};

export default AnalysisResultLayout;