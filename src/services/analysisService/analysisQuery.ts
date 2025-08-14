import { useQuery } from '@tanstack/react-query'
import { analysisService } from './analysisService'
import { QUERY_KEYS } from '../common/queryKey'

export const useAnalysisStatus = (analysisJobId: string, profileId?: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.analysis, 'status', analysisJobId, profileId],
    queryFn: () => analysisService.getAnalysisStatus(analysisJobId, profileId),
    enabled: !!analysisJobId,
    refetchInterval: 2000, // 고정 2초마다 폴링
    refetchIntervalInBackground: true,
  })
}

export const useAnalysisJob = (analysisJobId: string, profileId?: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.analysis, 'job', analysisJobId, profileId],
    queryFn: () => analysisService.getAnalysisJob(analysisJobId, profileId),
    enabled: !!analysisJobId,
  })
}
