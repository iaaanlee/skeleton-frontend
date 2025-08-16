import React from 'react';
import { LoadingState, ErrorState } from '../../../../components/common/molecules';
import { Prescription } from '../../../../services/prescriptionService/prescriptionService';
import EmptyState from './EmptyState';
import PrescriptionListContent from './PrescriptionListContent';

type PrescriptionListProps = {
  prescriptions: Prescription[];
  isLoading: boolean;
  error: Error | string | null;
  onPrescriptionClick: (prescriptionId: string) => void;
};

export const PrescriptionList: React.FC<PrescriptionListProps> = ({
  prescriptions,
  isLoading,
  error,
  onPrescriptionClick
}) => {
  if (isLoading) {
    return <LoadingState variant="spinner" message="처방 기록을 불러오는 중..." />;
  }

  if (error) {
    return <ErrorState variant="detailed" title="처방 기록을 불러올 수 없습니다" error={error} />;
  }

  if (prescriptions.length === 0) {
    return <EmptyState />;
  }

  return (
    <PrescriptionListContent 
      prescriptions={prescriptions}
      onPrescriptionClick={onPrescriptionClick}
    />
  );
};
