import { useQuery } from '@tanstack/react-query'
import { prescriptionService } from './prescriptionService'
import { QUERY_KEYS } from '../common/queryKey'


export const usePrescriptionById = (prescriptionId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.prescriptions, 'detail', prescriptionId],
    queryFn: () => prescriptionService.getPrescriptionById(prescriptionId),
    enabled: !!prescriptionId,
  })
}

export const useCompletedPrescriptions = (
  limit: number = 20,
  offset: number = 0
) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.prescriptions, 'completed', limit, offset],
    queryFn: () => prescriptionService.getCompletedPrescriptions(limit, offset),
  })
}

export const usePrescriptionByAnalysisJob = (analysisJobId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.prescriptions, 'by-analysis', analysisJobId],
    queryFn: () => prescriptionService.getPrescriptionByAnalysisJob(analysisJobId),
    enabled: !!analysisJobId,
  })
}
