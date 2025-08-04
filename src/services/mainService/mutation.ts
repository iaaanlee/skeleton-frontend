// POST PUT
import { useMutation } from "@tanstack/react-query";
import { mainService } from "./service";
import { UserInfo } from "../../types/mainType";

export const useCreateNewUser = () => {
  return useMutation({
    mutationFn: ({userBasicInfo, bodyStatus}: UserInfo) => {
      return mainService.createNewUser({userBasicInfo, bodyStatus});
    }
  });
};