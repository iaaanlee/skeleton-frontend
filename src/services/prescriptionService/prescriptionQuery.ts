import { useQuery } from '@tanstack/react-query'
import { prescriptionService } from './prescriptionService'
import { QUERY_KEYS } from '../common/queryKey'

export const usePrescriptionHistory = (
  accountId: string,
  profileId: string,
  limit: number = 20,
  offset: number = 0
) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.prescriptions, 'history', accountId, profileId, limit, offset],
    queryFn: () => prescriptionService.getPrescriptionHistory(accountId, profileId, limit, offset),
    enabled: !!accountId && !!profileId,
  })
}

export const usePrescriptionHistoryV2 = (
  accountId: string,
  profileId: string,
  limit: number = 20,
  offset: number = 0
) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.prescriptions, 'history-v2', accountId, profileId, limit, offset],
    queryFn: () => prescriptionService.getPrescriptionHistoryV2(accountId, profileId, limit, offset),
    enabled: !!accountId && !!profileId,
  })
}

export const usePrescriptionById = (prescriptionId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.prescriptions, 'detail', prescriptionId],
    queryFn: () => prescriptionService.getPrescriptionById(prescriptionId),
    enabled: !!prescriptionId,
  })
}

export const useCompletedPrescriptions = (
  accountId: string,
  profileId: string,
  limit: number = 20,
  offset: number = 0
) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.prescriptions, 'completed', accountId, profileId, limit, offset],
    queryFn: () => prescriptionService.getCompletedPrescriptions(accountId, profileId, limit, offset),
    enabled: !!accountId && !!profileId,
  })
}
