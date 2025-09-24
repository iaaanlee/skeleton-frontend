import { backendHttpClient } from '../common/httpClient';
import { SessionListResponse, SessionSummary, SessionDetail, ApiResponse } from '../../types/workout';

export const sessionService = {
  // GET /sessions - 프로필별 세션 목록 조회
  getSessionsByProfile: async (params: {
    profileId: string;
    includeDeleted?: boolean;
    status?: string;
    creationType?: string;
    seriesId?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  }): Promise<SessionListResponse> => {
    const queryParams = new URLSearchParams({
      profileId: params.profileId,
      ...(params.includeDeleted !== undefined && { includeDeleted: params.includeDeleted.toString() }),
      ...(params.status && { status: params.status }),
      ...(params.creationType && { creationType: params.creationType }),
      ...(params.seriesId && { seriesId: params.seriesId }),
      ...(params.startDate && { startDate: params.startDate }),
      ...(params.endDate && { endDate: params.endDate }),
      ...(params.limit && { limit: params.limit.toString() }),
      ...(params.offset && { offset: params.offset.toString() })
    });

    const response = await backendHttpClient.get<ApiResponse<SessionListResponse>>(
      `/sessions?${queryParams}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to get sessions');
    }

    return response.data;
  },

  // GET /sessions/:sessionId - 세션 단일 조회
  getSessionById: async (sessionId: string): Promise<SessionSummary> => {
    const response = await backendHttpClient.get<ApiResponse<{
      session: SessionSummary;
      canStart: boolean;
      canEdit: boolean;
    }>>(
      `/sessions/${sessionId}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to get session');
    }

    return response.data.session;
  },

  // GET /sessions/:sessionId/details - 세션 상세 조회 (Blueprint-Overlay 병합)
  getSessionDetails: async (sessionId: string): Promise<SessionDetail> => {
    const response = await backendHttpClient.get<ApiResponse<SessionDetail>>(
      `/sessions/${sessionId}/details`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to get session details');
    }

    return response.data;
  }
};