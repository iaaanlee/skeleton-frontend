import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useCompletedPrescriptions } from '../../services/prescriptionService';
import { PrescriptionHistoryLayout } from './components';

export const PrescriptionHistoryPage = () => {
  const navigate = useNavigate();

  const handlePrescriptionClick = (prescriptionId: string) => {
    navigate(ROUTES.ANALYSIS_RESULT.replace(':analysisId', prescriptionId));
  };

  // 완료된 처방 기록 조회
  const { 
    data: prescriptionData, 
    isLoading, 
    error 
  } = useCompletedPrescriptions();

  return (
    <PrescriptionHistoryLayout
      prescriptions={prescriptionData?.prescriptions || []}
      isLoading={isLoading}
      error={error}
      onPrescriptionClick={handlePrescriptionClick}
    />
  );
};
