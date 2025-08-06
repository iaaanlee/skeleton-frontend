// Account 관련 queries
import { useQuery } from "@tanstack/react-query";
import { accountService } from "./accountService";
import { queryKeys } from "../common/queryKey";

export const useGetAccount = () => {
  return useQuery({
    queryKey: queryKeys.account(),
    queryFn: () => accountService.getAccount(),
    select: (data) => {
      return data;
    },
  });
}; 