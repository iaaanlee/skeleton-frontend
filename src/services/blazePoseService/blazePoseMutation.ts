import { useMutation, useQueryClient } from '@tanstack/react-query'
import { blazePoseService } from './blazePoseService'
import { QUERY_KEYS } from '../common/queryKey'
import { BlazePoseAnalysisRequest } from '../../types/blazePose'

export const useStartAnalysis = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (request: BlazePoseAnalysisRequest) => blazePoseService.startAnalysis(request),
    onSuccess: (data) => {
      // 분석 상태 쿼리 무효화하여 실시간 업데이트 시작
      queryClient.invalidateQueries({ 
        queryKey: [...QUERY_KEYS.blazePose, 'status', data.analysisId] 
      })
    },
    onError: (error) => {
      console.error('Start analysis error:', error)
    }
  })
}

export const useCheckDuplicateAnalysis = () => {
  return useMutation({
    mutationFn: (request: { profileId: string; fileIds: string[] }) => 
      blazePoseService.checkDuplicateAnalysis(request),
    onError: (error) => {
      console.error('Check duplicate analysis error:', error)
    }
  })
}
