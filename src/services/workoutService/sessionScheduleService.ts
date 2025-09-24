import { backendHttpClient } from '../common/httpClient';
import {
  ScheduleResponse,
  CalendarDotsResponse,
  DateSessionSummary,
  ApiResponse
} from '../../types/workout';

export const sessionScheduleService = {
  // GET /session-schedule - 세션 일정 조회 (캘린더용)
  getSchedule: async (params: {
    profileId: string;
    startDate: string;
    endDate: string;
    includeCompleted?: boolean;
    seriesId?: string;
  }): Promise<ScheduleResponse> => {
    const queryParams = new URLSearchParams({
      profileId: params.profileId,
      startDate: params.startDate,
      endDate: params.endDate,
      ...(params.includeCompleted !== undefined && { includeCompleted: params.includeCompleted.toString() }),
      ...(params.seriesId && { seriesId: params.seriesId })
    });

    const response = await backendHttpClient.get<ApiResponse<ScheduleResponse>>(
      `/session-schedule?${queryParams}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to get session schedule');
    }

    return response.data;
  },

  // GET /session-schedule/calendar-dots - 캘린더 도트 정보만 조회 (최적화된 엔드포인트)
  getCalendarDots: async (params: {
    profileId: string;
    startDate: string;
    endDate: string;
  }): Promise<CalendarDotsResponse> => {
    const queryParams = new URLSearchParams({
      profileId: params.profileId,
      startDate: params.startDate,
      endDate: params.endDate
    });

    const response = await backendHttpClient.get<ApiResponse<CalendarDotsResponse>>(
      `/session-schedule/calendar-dots?${queryParams}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to get calendar dots');
    }

    return response.data;
  },

  // GET /session-schedule/daily/:date - 특정 날짜의 세션 상세 조회
  getDailySchedule: async (params: {
    date: string; // YYYY-MM-DD
    profileId: string;
  }): Promise<DateSessionSummary> => {
    const queryParams = new URLSearchParams({
      profileId: params.profileId
    });

    const response = await backendHttpClient.get<ApiResponse<DateSessionSummary>>(
      `/session-schedule/daily/${params.date}?${queryParams}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to get daily schedule');
    }

    return response.data;
  }
};