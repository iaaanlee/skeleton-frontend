import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { usePrescriptionHistory } from '../../services/prescriptionService';
import { useAccountAuth } from '../../contexts/AccountAuthContext';
import { useProfile } from '../../contexts/ProfileAuthContext';
import { extractAccountIdFromToken } from '../../utils/auth';
import { PrescriptionHistoryContent } from './components/organisms/PrescriptionHistoryContent';

export const PrescriptionHistoryPage = () => {
  const navigate = useNavigate();
  const { token } = useAccountAuth();
  const { selectedProfile } = useProfile();
  
  const accountId = token ? extractAccountIdFromToken(token) : '';
  const profileId = selectedProfile?._id || '';

  console.log('PrescriptionHistoryPage - accountId:', accountId);
  console.log('PrescriptionHistoryPage - profileId:', profileId);

  // 처방 기록 조회
  const { 
    data: prescriptionData, 
    isLoading, 
    error 
  } = usePrescriptionHistory(accountId || '', profileId || '');

  console.log('PrescriptionHistoryPage - prescriptionData:', prescriptionData);
  console.log('PrescriptionHistoryPage - isLoading:', isLoading);
  console.log('PrescriptionHistoryPage - error:', error);

  const handleBack = () => {
    navigate(ROUTES.ANALYZE_EXERCISE);
  };

  const handlePrescriptionClick = (prescriptionId: string) => {
    navigate(ROUTES.ANALYSIS_RESULT.replace(':analysisId', prescriptionId));
  };

  return (
    <PrescriptionHistoryContent
      prescriptions={prescriptionData?.prescriptions || []}
      isLoading={isLoading}
      error={error}
      onPrescriptionClick={handlePrescriptionClick}
      onBack={handleBack}
    />
  );
};
