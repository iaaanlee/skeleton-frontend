import React from 'react';
import { PageLayout } from '../../../../components/common/templates';
import { PageHeader, ContentContainer } from '../../../../components/common/molecules';
import { PrescriptionUploadSection } from '../organisms/PrescriptionUploadSection';
import { ROUTES } from '../../../../constants/routes';

const CreatePrescriptionLayout: React.FC = () => {
  return (
    <PageLayout 
      backRoute={ROUTES.ANALYZE_EXERCISE}
      contentClassName="p-4"
    >
      <ContentContainer maxWidth="4xl">
        <PageHeader
          title="신규 운동 분석"
          description="분석하고 싶은 운동 이미지를 업로드하고 분석을 시작하세요."
        />
        
        <PrescriptionUploadSection />
      </ContentContainer>
    </PageLayout>
  );
};

export default CreatePrescriptionLayout;