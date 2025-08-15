import React from 'react';
import { PageLayout } from '../../../../components/common/templates';
import { ROUTES, RouteValue } from '../../../../constants/routes';
import ContentArea from '../molecules/ContentArea';

type PrescriptionHistoryContentProps = {
  prescriptions: any[];
  isLoading: boolean;
  error: any;
  onPrescriptionClick: (prescriptionId: string) => void;
  onBack: () => void;
  backRoute?: RouteValue;
};

export const PrescriptionHistoryContent: React.FC<PrescriptionHistoryContentProps> = ({
  prescriptions,
  isLoading,
  error,
  onPrescriptionClick,
  onBack,
  backRoute = ROUTES.ANALYZE_EXERCISE
}) => {
  return (
    <PageLayout backRoute={backRoute}>
      <ContentArea
        prescriptions={prescriptions}
        isLoading={isLoading}
        error={error}
        onPrescriptionClick={onPrescriptionClick}
      />
    </PageLayout>
  );
};
