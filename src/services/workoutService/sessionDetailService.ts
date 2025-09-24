import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../common/queryKey';
import { sessionService } from './sessionService';
import type { SessionDetail } from '../../types/workout';

/**
 * 세션 상세 조회 React Query 훅
 */
export const useSessionDetail = (sessionId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.workout.sessionDetail(sessionId),
    queryFn: () => sessionService.getSessionDetails(sessionId),
    enabled: !!sessionId,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000,   // 10분 (이전 cacheTime)
  });
};