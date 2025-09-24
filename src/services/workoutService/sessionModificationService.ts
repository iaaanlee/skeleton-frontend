import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { backendHttpClient } from '../common/httpClient';
import { QUERY_KEYS } from '../common/queryKey';
import type {
  ModifySessionRequest,
  ModifySessionResponse,
  ExerciseSearchParams,
  ExerciseSearchResponse,
  ExerciseTemplate,
  ExerciseCategory,
  ApiResponse
} from '../../types/workout';

/**
 * 세션 수정 서비스
 */
export const sessionModificationService = {
  // PATCH /sessions/:sessionId/modify - 세션 수정
  modifySession: async (
    sessionId: string,
    data: ModifySessionRequest
  ): Promise<ModifySessionResponse> => {
    const response = await backendHttpClient.patch<ApiResponse<ModifySessionResponse>>(
      `/sessions/${sessionId}/modify`,
      data
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to modify session');
    }

    return response.data;
  }
};

/**
 * 운동 템플릿 서비스
 */
export const exerciseTemplateService = {
  // GET /exercise-templates - 운동 템플릿 검색
  searchExercises: async (params: ExerciseSearchParams): Promise<ExerciseSearchResponse> => {
    const queryParams = new URLSearchParams();

    if (params.q) queryParams.set('q', params.q);
    if (params.category) queryParams.set('category', params.category);
    if (params.difficulty) queryParams.set('difficulty', params.difficulty);
    if (params.equipment) queryParams.set('equipment', params.equipment);
    if (params.limit) queryParams.set('limit', params.limit.toString());
    if (params.offset) queryParams.set('offset', params.offset.toString());

    const response = await backendHttpClient.get<ApiResponse<ExerciseSearchResponse>>(
      `/exercise-templates?${queryParams}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to search exercises');
    }

    return response.data;
  },

  // GET /exercise-templates/:exerciseId - 운동 템플릿 단일 조회
  getExerciseById: async (exerciseId: string): Promise<ExerciseTemplate> => {
    const response = await backendHttpClient.get<ApiResponse<ExerciseTemplate>>(
      `/exercise-templates/${exerciseId}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to get exercise');
    }

    return response.data;
  },

  // GET /exercise-templates/meta/categories - 카테고리 목록
  getCategories: async (): Promise<ExerciseCategory[]> => {
    const response = await backendHttpClient.get<ApiResponse<ExerciseCategory[]>>(
      `/exercise-templates/meta/categories`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to get categories');
    }

    return response.data;
  },

  // GET /exercise-templates/recent/:profileId - 최근 사용 운동
  getRecentExercises: async (profileId: string): Promise<ExerciseSearchResponse> => {
    const response = await backendHttpClient.get<ApiResponse<ExerciseSearchResponse>>(
      `/exercise-templates/recent/${profileId}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to get recent exercises');
    }

    return response.data;
  }
};

/**
 * React Query 훅들
 */

// 세션 수정 mutation
export const useModifySession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, data }: { sessionId: string; data: ModifySessionRequest }) =>
      sessionModificationService.modifySession(sessionId, data),
    onSuccess: (result) => {
      // 세션 상세 데이터 무효화
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.workout.sessionDetail(result.sessionId)
      });
      // 세션 목록 데이터도 무효화
      queryClient.invalidateQueries({
        queryKey: ['sessions']
      });
    }
  });
};

// 운동 검색 query
export const useSearchExercises = (params: ExerciseSearchParams) => {
  return useQuery({
    queryKey: ['exerciseSearch', params],
    queryFn: () => exerciseTemplateService.searchExercises(params),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000,   // 10분
  });
};

// 운동 단일 조회 query
export const useExerciseTemplate = (exerciseId: string) => {
  return useQuery({
    queryKey: ['exerciseTemplate', exerciseId],
    queryFn: () => exerciseTemplateService.getExerciseById(exerciseId),
    enabled: !!exerciseId,
    staleTime: 10 * 60 * 1000, // 10분
    gcTime: 30 * 60 * 1000,    // 30분
  });
};

// 카테고리 목록 query
export const useExerciseCategories = () => {
  return useQuery({
    queryKey: ['exerciseCategories'],
    queryFn: () => exerciseTemplateService.getCategories(),
    staleTime: 30 * 60 * 1000, // 30분
    gcTime: 60 * 60 * 1000,    // 1시간
  });
};

// 최근 사용 운동 query
export const useRecentExercises = (profileId: string) => {
  return useQuery({
    queryKey: ['recentExercises', profileId],
    queryFn: () => exerciseTemplateService.getRecentExercises(profileId),
    enabled: !!profileId,
    staleTime: 2 * 60 * 1000,  // 2분
    gcTime: 10 * 60 * 1000,    // 10분
  });
};