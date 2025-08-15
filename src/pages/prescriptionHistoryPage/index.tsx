import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useCompletedPrescriptions } from '../../services/prescriptionService';
import { PrescriptionHistoryLayout } from './components';
import { useProfile } from '../../contexts/ProfileContext';

export const PrescriptionHistoryPage = () => {
  const navigate = useNavigate();
  const { currentProfile } = useProfile();

  const handlePrescriptionClick = (prescriptionId: string) => {
    navigate(ROUTES.ANALYSIS_RESULT.replace(':analysisId', prescriptionId));
  };

  // 완료된 처방 기록 조회 - 프로필이 선택된 경우에만 호출
  const { 
    data: prescriptionData, 
    isLoading, 
    error 
  } = useCompletedPrescriptions(20, 0, !!currentProfile);

  return (
    <PrescriptionHistoryLayout
      prescriptions={prescriptionData?.prescriptions || []}
      isLoading={isLoading}
      error={error}
      onPrescriptionClick={handlePrescriptionClick}
    />
  );
};
