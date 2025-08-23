import { useMutation, useQueryClient } from '@tanstack/react-query'
import { prescriptionService } from './prescriptionService'
import { QUERY_KEYS } from '../common/queryKey'
import { CreatePrescriptionRequest } from './prescriptionService'

export const useCreatePrescription = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (request: CreatePrescriptionRequest) => prescriptionService.createPrescription(request),
    onSuccess: () => {
      // 처방 목록 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.prescriptions]
      })
    }
  })
}

export const useCreateImageAnalysisOnlyPrescription = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (request: CreatePrescriptionRequest) => prescriptionService.createImageAnalysisOnlyPrescription(request),
    onSuccess: () => {
      // 처방 목록 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.prescriptions]
      })
    }
  })
}

export const useDeletePrescription = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (prescriptionId: string) => prescriptionService.deletePrescription(prescriptionId),
    onSuccess: () => {
      // 처방 목록 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.prescriptions]
      })
    }
  })
}
