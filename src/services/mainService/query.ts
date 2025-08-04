// GET 요청 정의
import { useQuery } from "@tanstack/react-query";
import { mainService } from "./service";
import { queryKeys } from "../common/queryKey";

export const useGetMain = () => {
  return useQuery({
    queryKey: queryKeys.main(),
    queryFn: () => mainService.getMain(),
    select: (data) => {
      return data;
    },
  });
};