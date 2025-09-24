import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../common/queryKey';
import { sessionScheduleService, seriesService, sessionService } from './';

// Session Schedule Hooks
export const useSessionSchedule = (params: {
  profileId: string;
  startDate: string;
  endDate: string;
  includeCompleted?: boolean;
  seriesId?: string;
}) => {
  return useQuery({
    queryKey: QUERY_KEYS.workout.sessionSchedule(params.profileId, params.startDate, params.endDate),
    queryFn: () => sessionScheduleService.getSchedule(params),
    enabled: !!params.profileId && !!params.startDate && !!params.endDate,
    staleTime: 1000 * 60 * 5, // 5분
  });
};

export const useCalendarDots = (params: {
  profileId: string;
  startDate: string;
  endDate: string;
}) => {
  return useQuery({
    queryKey: QUERY_KEYS.workout.calendarDots(params.profileId, params.startDate, params.endDate),
    queryFn: () => sessionScheduleService.getCalendarDots(params),
    enabled: !!params.profileId && !!params.startDate && !!params.endDate,
    staleTime: 1000 * 60 * 2, // 2분
  });
};

export const useDailySchedule = (params: {
  profileId: string;
  date: string;
}) => {
  return useQuery({
    queryKey: QUERY_KEYS.workout.dailySchedule(params.profileId, params.date),
    queryFn: () => sessionScheduleService.getDailySchedule(params),
    enabled: !!params.profileId && !!params.date,
    staleTime: 1000 * 60 * 2, // 2분
  });
};

// Series Hooks
export const useSeriesByProfile = (params: {
  profileId: string;
  includeDeleted?: boolean;
  status?: string;
  limit?: number;
  offset?: number;
}) => {
  return useQuery({
    queryKey: QUERY_KEYS.workout.series(params.profileId),
    queryFn: () => seriesService.getSeriesByProfile(params),
    enabled: !!params.profileId,
    staleTime: 1000 * 60 * 10, // 10분
  });
};

// Session Hooks
export const useSessionsByProfile = (params: {
  profileId: string;
  includeDeleted?: boolean;
  status?: string;
  creationType?: string;
  seriesId?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}) => {
  return useQuery({
    queryKey: QUERY_KEYS.workout.sessions(params.profileId),
    queryFn: () => sessionService.getSessionsByProfile(params),
    enabled: !!params.profileId,
    staleTime: 1000 * 60 * 5, // 5분
  });
};