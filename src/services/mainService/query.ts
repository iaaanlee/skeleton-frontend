// GET 요청 정의
import { useQuery } from "@tanstack/react-query";
import { mainService } from "./service";
import { queryKeys } from "../common/queryKey";

export const useGetUserProfileInfo = ({profileId}: {profileId: string}) => {
  return useQuery({
    queryKey: queryKeys.userProfile(profileId),
    queryFn: () => mainService.getUserProfileInfo({profileId}),
    select: (data) => {
      return data;
    },
  });
};