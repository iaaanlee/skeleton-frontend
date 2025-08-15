import { useMutation, useQueryClient } from '@tanstack/react-query'
import { exerciseAnalysisService } from './exerciseAnalysisService'
import { QUERY_KEYS } from '../common/queryKey'

export const useStartExerciseAnalysis = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: exerciseAnalysisService.startAnalysis,
    onSuccess: (data) => {
      // 분석 작업이 시작되면 관련 쿼리들을 무효화
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.exerciseAnalysis] })
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.analysisJob] })
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.prescriptions] })
    },
  })
}

export const useRestartExerciseAnalysis = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (analysisJobId: string) => 
      exerciseAnalysisService.restartAnalysis(analysisJobId),
    onSuccess: (data) => {
      // 분석 재시작이 성공하면 관련 쿼리들을 무효화
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.exerciseAnalysis] })
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.analysisJob] })
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.prescriptions] })
    },
  })
}