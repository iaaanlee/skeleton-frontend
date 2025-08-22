import { useQuery } from '@tanstack/react-query';
import { videoAnalysisService, GetCompletedPoseAnalysisRequest } from './videoAnalysisService';
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

// 완료된 자세 분석 미디어세트 조회 훅
export const useCompletedPoseAnalysisMediaSets = (
  request: GetCompletedPoseAnalysisRequest = {},
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.videoAnalysis, 'completedPoseAnalysis', request],
    queryFn: () => videoAnalysisService.getCompletedPoseAnalysisMediaSets(request),
    enabled: options?.enabled !== false,
    staleTime: 30 * 1000, // 30초간 캐시 유지 (분석 완료 후 빠른 업데이트를 위해 단축)
    gcTime: 5 * 60 * 1000, // 5분
  });
};

// 자세 분석 상세 데이터 조회 훅 (지연 로딩)
export const usePoseAnalysisDetail = (
  mediaSetId: string | null,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.videoAnalysis, 'poseAnalysisDetail', mediaSetId],
    queryFn: () => {
      if (!mediaSetId) {
        throw new Error('mediaSetId is required');
      }
      return videoAnalysisService.getPoseAnalysisDetail(mediaSetId);
    },
    enabled: !!mediaSetId && (options?.enabled !== false),
    staleTime: 30 * 60 * 1000, // 30분간 캐시 유지 (분석 데이터는 변경되지 않으므로)
    gcTime: 60 * 60 * 1000, // 1시간
  });
};