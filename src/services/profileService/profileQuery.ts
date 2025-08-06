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