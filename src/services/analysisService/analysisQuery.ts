import { useQuery } from '@tanstack/react-query'
import { analysisService } from './analysisService'
import { QUERY_KEYS } from '../common/queryKey'

export const useAnalysisStatus = (analysisJobId: string, profileId?: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.analysis, 'status', analysisJobId, profileId],
    queryFn: async () => {
      const result = await analysisService.getAnalysisStatus(analysisJobId, profileId);
      console.log('queryFn 반환값:', result);
      return result;
    },
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
