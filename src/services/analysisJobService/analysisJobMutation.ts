import { useMutation, useQueryClient } from '@tanstack/react-query'
import { analysisJobService } from './analysisJobService'
import { QUERY_KEYS } from '../common/queryKey'

export const useCancelAnalysisJob = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (analysisJobId: string) => 
      analysisJobService.cancelAnalysis(analysisJobId),
    onSuccess: () => {
      // 분석이 취소되면 관련 쿼리들을 무효화
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.analysisJob] })
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.exerciseAnalysis] })
    },
  })
}