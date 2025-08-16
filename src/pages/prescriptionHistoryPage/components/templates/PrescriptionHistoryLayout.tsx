import React from 'react';
import { PrescriptionHistoryContent } from '../organisms/PrescriptionHistoryContent';
import { ROUTES } from '../../../../constants/routes';
import { Prescription } from '../../../../services/prescriptionService/prescriptionService';

type PrescriptionHistoryLayoutProps = {
  prescriptions: Prescription[];
  isLoading: boolean;
  error: Error | string | null;
  onPrescriptionClick: (prescriptionId: string) => void;
};

const PrescriptionHistoryLayout: React.FC<PrescriptionHistoryLayoutProps> = ({
  prescriptions,
  isLoading,
  error,
  onPrescriptionClick
}) => {
  const handleBack = () => {
    // 뒤로가기 로직 (필요시 구현)
  };

  return (
    <PrescriptionHistoryContent
      prescriptions={prescriptions}
      isLoading={isLoading}
      error={error}
      onPrescriptionClick={onPrescriptionClick}
      onBack={handleBack}
      backRoute={ROUTES.ANALYZE_EXERCISE}
    />
  );
};

export default PrescriptionHistoryLayout;