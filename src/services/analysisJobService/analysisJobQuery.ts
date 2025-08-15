import { useQuery } from '@tanstack/react-query'
import { analysisJobService } from './analysisJobService'
import { QUERY_KEYS } from '../common/queryKey'

export const useAnalysisJobStatus = (analysisJobId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.analysisJob, 'status', analysisJobId],
    queryFn: () => analysisJobService.getAnalysisStatus(analysisJobId),
    enabled: !!analysisJobId,
    refetchInterval: 2000, // 고정 2초마다 폴링
    refetchIntervalInBackground: true,
  })
}

export const useAnalysisJobData = (analysisJobId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.analysisJob, 'job', analysisJobId],
    queryFn: () => analysisJobService.getAnalysisJob(analysisJobId),
    enabled: !!analysisJobId,
  })
}