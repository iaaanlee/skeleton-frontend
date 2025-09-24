import { backendHttpClient } from '../common/httpClient';
import { SeriesSummary, ApiResponse } from '../../types/workout';

export const seriesService = {
  // GET /series - 프로필별 시리즈 목록 조회
  getSeriesByProfile: async (params: {
    profileId: string;
    includeDeleted?: boolean;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<{
    series: SeriesSummary[];
    totalCount: number;
    hasMore: boolean;
  }> => {
    const queryParams = new URLSearchParams({
      profileId: params.profileId,
      ...(params.includeDeleted !== undefined && { includeDeleted: params.includeDeleted.toString() }),
      ...(params.status && { status: params.status }),
      ...(params.limit && { limit: params.limit.toString() }),
      ...(params.offset && { offset: params.offset.toString() })
    });

    const response = await backendHttpClient.get<ApiResponse<{
      series: SeriesSummary[];
      totalCount: number;
      hasMore: boolean;
    }>>(
      `/series?${queryParams}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to get series list');
    }

    return response.data;
  },

  // GET /series/:seriesId - 시리즈 단일 조회
  getSeriesById: async (seriesId: string): Promise<SeriesSummary> => {
    const response = await backendHttpClient.get<ApiResponse<SeriesSummary>>(
      `/series/${seriesId}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to get series');
    }

    return response.data;
  }
};