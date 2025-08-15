import React from 'react';
import { PrescriptionList } from './PrescriptionList';
import { PageHeader, ContentContainer } from '../../../../components/common/molecules';

type ContentAreaProps = {
  prescriptions: any[];
  isLoading: boolean;
  error: any;
  onPrescriptionClick: (prescriptionId: string) => void;
};

const ContentArea: React.FC<ContentAreaProps> = ({
  prescriptions,
  isLoading,
  error,
  onPrescriptionClick
}) => {
  return (
    <div className="flex-1 p-4">
      <ContentContainer maxWidth="4xl">
        <PageHeader
          title="처방 기록"
          description="완료된 처방 기록을 확인할 수 있습니다."
        />

        <PrescriptionList
          prescriptions={prescriptions}
          isLoading={isLoading}
          error={error}
          onPrescriptionClick={onPrescriptionClick}
        />
      </ContentContainer>
    </div>
  );
};

export default ContentArea;