import React from 'react';
import { PageLayout } from '../../../../components/common/templates';
import { PageHeader, ContentContainer } from '../../../../components/common/molecules';
import { TestPrescriptionUploadSection } from '../organisms/TestPrescriptionUploadSection';
import { GPTTestSection } from '../organisms/GPTTestSection';
import { ROUTES } from '../../../../constants/routes';

const TestCreatePrescriptionLayout: React.FC = () => {

  return (
    <PageLayout 
      backRoute={ROUTES.ANALYZE_EXERCISE}
      contentClassName="p-4"
    >
      <ContentContainer maxWidth="4xl">
        <div className="bg-red-100 border-2 border-red-400 rounded-lg p-4 mb-4">
          <h2 className="text-xl font-bold text-red-700">🔧 테스트 전용 페이지</h2>
          <p className="text-sm text-red-600">이 페이지는 개발 테스트용입니다. 실제 GPT API는 호출되지 않습니다.</p>
        </div>

        <PageHeader
          title="[TEST] 신규 운동 분석"
          description="테스트 모드로 운동 분석을 진행합니다. 가짜 데이터가 반환됩니다."
        />
        
        <TestPrescriptionUploadSection />
        
        
        {/* GPT 직접 테스트 섹션 */}
        <GPTTestSection />
      </ContentContainer>
    </PageLayout>
  );
};

export default TestCreatePrescriptionLayout;