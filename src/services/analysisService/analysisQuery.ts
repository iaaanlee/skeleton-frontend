// 레거시 지원을 위한 query hooks - 새로운 서비스들로 위임
import { useQuery } from '@tanstack/react-query'
import { analysisService } from './analysisService'
import { QUERY_KEYS } from '../common/queryKey'

export const useAnalysisStatus = (analysisJobId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.analysis, 'status', analysisJobId],
    queryFn: () => analysisService.getAnalysisStatus(analysisJobId),
    enabled: !!analysisJobId,
    refetchInterval: 2000, // 고정 2초마다 폴링
    refetchIntervalInBackground: true,
  })
}

export const useAnalysisJob = (analysisJobId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.analysis, 'job', analysisJobId],
    queryFn: () => analysisService.getAnalysisJob(analysisJobId),
    enabled: !!analysisJobId,
  })
}
