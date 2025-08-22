import { useQuery } from '@tanstack/react-query';
import { videoAnalysisService } from './videoAnalysisService';
import { QUERY_KEYS } from '../common/queryKey';

export const useVideoPoseAnalysisStatus = (mediaSetId: string | null, options?: {
  enabled?: boolean;
  refetchInterval?: number;
}) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.videoAnalysis, 'status', mediaSetId],
    queryFn: () => {
      if (!mediaSetId) {
        throw new Error('mediaSetId is required');
      }
      return videoAnalysisService.getVideoPoseAnalysisStatus(mediaSetId);
    },
    enabled: !!mediaSetId && (options?.enabled !== false),
    refetchInterval: options?.refetchInterval || 2000, // 기본 2초마다 폴링
    refetchIntervalInBackground: true,
  });
};