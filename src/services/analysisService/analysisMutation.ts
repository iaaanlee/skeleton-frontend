import { useMutation, useQueryClient } from '@tanstack/react-query'
import { analysisService } from './analysisService'
import { QUERY_KEYS } from '../common/queryKey'

export const useStartAnalysis = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: analysisService.startAnalysis,
    onSuccess: (data) => {
      // 분석 작업이 시작되면 관련 쿼리들을 무효화
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.analysis] })
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.prescriptions] })
    },
  })
}

export const useCancelAnalysis = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: analysisService.cancelAnalysis,
    onSuccess: () => {
      // 분석이 취소되면 관련 쿼리들을 무효화
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.analysis] })
    },
  })
}
