import React from 'react';
import { PageLayout } from '../../../../components/common/templates';
import { PageHeader, ContentContainer } from '../../../../components/common/molecules';
import { ProcessVideoContent } from '../organisms/ProcessVideoContent';
import { ROUTES } from '../../../../constants/routes';

const ProcessVideoLayout: React.FC = () => {
  return (
    <PageLayout 
      backRoute={ROUTES.ANALYZE_EXERCISE}
      contentClassName="p-4"
    >
      <ContentContainer maxWidth="4xl" className="min-h-0">
        <PageHeader
          title="비디오 가공"
          description="운동 영상을 업로드하여 피크 지점 분석을 수행하세요."
        />
        
        <ProcessVideoContent />
      </ContentContainer>
    </PageLayout>
  );
};

export default ProcessVideoLayout;