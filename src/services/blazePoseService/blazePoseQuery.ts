import { useQuery } from '@tanstack/react-query'
import { blazePoseService } from './blazePoseService'
import { QUERY_KEYS } from '../common/queryKey'
import { normalizeToUnifiedStatus } from '../../utils/status-migration'

export const useAnalysisStatus = (analysisId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.blazePose, 'status', analysisId],
    queryFn: () => blazePoseService.getAnalysisStatus(analysisId),
    enabled: enabled && !!analysisId,
    refetchInterval: (query) => {
      // 분석이 진행 중일 때만 폴링
      const data = query.state.data;
      if (data?.status) {
        const unified = normalizeToUnifiedStatus(data.status);
        if (['pending', 'pose_analyzing', 'llm_analyzing'].includes(unified)) {
          return 2000; // 2초마다 폴링
        }
      }
      return false; // 완료되면 폴링 중단
    },
    staleTime: 1000, // 1초
    gcTime: 5 * 60 * 1000, // 5분
  })
}

// Axios 에러 타입 정의
type AxiosError = Error & {
  response?: {
    status: number;
    data?: {
      error?: string;
      message?: string;
    };
  };
}

export const useAnalysisResult = (analysisId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.blazePose, 'result', analysisId],
    queryFn: () => blazePoseService.getAnalysisResult(analysisId),
    enabled: enabled && !!analysisId,
    retry: (failureCount, error: AxiosError) => {
      // 400 에러(분석 미완료)는 재시도하지 않음
      if (error?.response?.status === 400) {
        return false
      }
      // 다른 에러는 3번까지 재시도
      return failureCount < 3
    },
    retryDelay: 2000, // 2초 후 재시도
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  })
}
