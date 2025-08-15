import React from 'react';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import EmptyState from './EmptyState';
import PrescriptionListContent from './PrescriptionListContent';

type PrescriptionListProps = {
  prescriptions: any[];
  isLoading: boolean;
  error: any;
  onPrescriptionClick: (prescriptionId: string) => void;
};

export const PrescriptionList: React.FC<PrescriptionListProps> = ({
  prescriptions,
  isLoading,
  error,
  onPrescriptionClick
}) => {
  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
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
