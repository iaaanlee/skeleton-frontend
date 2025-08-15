import React from 'react';
import { Header } from '../../../../components/common/templates/Header';
import { BottomBar } from '../../../../components/common/templates/BottomBar';
import { PrescriptionUploadSection } from '../organisms/PrescriptionUploadSection';
import { ROUTES } from '../../../../constants/routes';

type CreatePrescriptionLayoutProps = {
  profileId: string;
};

const CreatePrescriptionLayout: React.FC<CreatePrescriptionLayoutProps> = ({
  profileId
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header backRoute={ROUTES.ANALYZE_EXERCISE} />
      
      <div className="flex-1 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">신규 운동 분석</h1>
            <p className="text-gray-600">분석하고 싶은 운동 이미지를 업로드하고 분석을 시작하세요.</p>
          </div>
          
          <PrescriptionUploadSection profileId={profileId} />
        </div>
      </div>
      
      <BottomBar />
    </div>
  );
};

export default CreatePrescriptionLayout;