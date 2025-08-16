// Profile 관련 queries
import { useQuery } from "@tanstack/react-query";
import { profileService } from "./profileService";
import { queryKeys } from "../common/queryKey";

export const useGetProfileByProfileId = ({profileId}: {profileId: string}) => {
  return useQuery({
    queryKey: queryKeys.profile(profileId),
    queryFn: () => profileService.getProfileByProfileId({profileId}),
    select: (data) => {
      return data;
    },
  });
};

export const useGetProfilesByAccountId = (enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.profiles(),
    queryFn: () => profileService.getProfilesByAccountId(),
    select: (data) => {
      return data;
    },
    enabled: enabled, // 인증된 상태에서만 API 호출
  });
};

// 현재 선택된 프로필 조회 (새로 추가)
export const useGetCurrentProfile = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['currentProfile'],
    queryFn: () => profileService.getCurrentProfile(),
    select: (data) => {
      return data.data; // { profileId, profileName, accountId }
    },
    enabled: enabled,
    retry: (failureCount, error: Error) => {
      // PROFILE_NOT_SELECTED 에러는 재시도하지 않음
      if ((error as any)?.response?.data?.error === 'PROFILE_NOT_SELECTED') {
        return false;
      }
      return failureCount < 3;
    },
  });
};

// 현재 선택된 프로필의 상세 정보 조회
export const useGetCurrentProfileDetails = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['currentProfileDetails'],
    queryFn: () => profileService.getCurrentProfileDetails(),
    select: (data) => {
      return data;
    },
    enabled: enabled,
    retry: (failureCount, error: Error) => {
      // PROFILE_NOT_SELECTED 에러는 재시도하지 않음
      if ((error as any)?.response?.data?.error === 'PROFILE_NOT_SELECTED') {
        return false;
      }
      return failureCount < 3;
    },
    staleTime: 0, // 항상 stale로 간주
    gcTime: 0, // 캐시하지 않음 (v5에서는 cacheTime이 gcTime으로 변경)
    refetchOnMount: true, // 마운트 시 항상 다시 가져오기
    refetchOnWindowFocus: true, // 윈도우 포커스 시 다시 가져오기
  });
}; 