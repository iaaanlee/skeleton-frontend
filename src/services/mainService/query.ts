// GET 요청 정의
import { useQuery } from "@tanstack/react-query";
import { mainService } from "./service";
import { queryKeys } from "../common/queryKey";

export const useGetUserInfo = () => {
  return useQuery({
    queryKey: queryKeys.main(),
    queryFn: () => mainService.getUserInfo(),
    select: (data) => {
      return data;
    },
  });
};