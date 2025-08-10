import { useQuery } from '@tanstack/react-query';
import { prescriptionService } from './prescriptionService';
import { QUERY_KEYS } from '../common/queryKey';

export const usePrescriptionHistory = (userId: string, profileId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.prescriptions, 'history', userId, profileId],
    queryFn: () => prescriptionService.getPrescriptionHistory(userId, profileId),
    enabled: !!userId && !!profileId,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
};

export const usePrescriptionById = (prescriptionId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.prescriptions, prescriptionId],
    queryFn: () => prescriptionService.getPrescriptionById(prescriptionId),
    enabled: !!prescriptionId,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
};
