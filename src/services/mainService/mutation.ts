// POST PUT
import { useMutation } from "@tanstack/react-query";
import { mainService } from "./service";
import { UserInfo } from "../../types/user";

export const useCreateNewUser = () => {
  return useMutation({
    mutationFn: ({contactInfo, bodyStatus, exerciseInfoList, cautions, preferences}: UserInfo) => {
      return mainService.createNewUser({contactInfo, bodyStatus, exerciseInfoList, cautions, preferences});
    }
  });
};