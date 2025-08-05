// GET 요청 정의
import { useQuery } from "@tanstack/react-query";
import { mainService } from "./service";
import { queryKeys } from "../common/queryKey";

export const useGetProfileByProfileId = ({profileId}: {profileId: string}) => {
  return useQuery({
    queryKey: queryKeys.profile(profileId),
    queryFn: () => mainService.getProfileByProfileId({profileId}),
    select: (data) => {
      return data;
    },
  });
};