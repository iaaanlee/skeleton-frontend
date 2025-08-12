import { useQuery } from '@tanstack/react-query'
import { analysisService } from './analysisService'
import { QUERY_KEYS } from '../common/queryKey'

export const useAnalysisStatus = (analysisJobId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.analysis, 'status', analysisJobId],
    queryFn: () => analysisService.getAnalysisStatus(analysisJobId),
    enabled: !!analysisJobId,
    refetchInterval: (data: any) => {
      // 분석이 진행 중일 때만 폴링
      if (data?.status === 'pending' || data?.status === 'blazepose_processing' || data?.status === 'llm_processing') {
        return 2000 // 2초마다 폴링
      }
      return false // 완료되면 폴링 중단
    },
  })
}

export const useAnalysisJob = (analysisJobId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.analysis, 'job', analysisJobId],
    queryFn: () => analysisService.getAnalysisJob(analysisJobId),
    enabled: !!analysisJobId,
  })
}
