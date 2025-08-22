import { useMutation, useQueryClient } from '@tanstack/react-query';
import { videoAnalysisService, StartVideoPoseAnalysisRequest } from './videoAnalysisService';
import { QUERY_KEYS } from '../common/queryKey';

export const useStartVideoPoseAnalysis = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (request: StartVideoPoseAnalysisRequest) => 
      videoAnalysisService.startVideoPoseAnalysis(request),
    onSuccess: (data, variables) => {
      // 비디오 분석이 시작되면 관련 쿼리들을 무효화
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.videoAnalysis] });
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.prescriptions] });
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.mediaSets] });
      
      // 특정 mediaSet의 분석 상태 쿼리도 무효화
      queryClient.invalidateQueries({ 
        queryKey: [...QUERY_KEYS.videoAnalysis, 'status', variables.mediaSetId] 
      });
    },
    onError: (error) => {
      console.error('Video analysis start error:', error);
    },
  });
};