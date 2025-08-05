// service 내에서 response들의 type 정의
import { ProfileInfo } from "../../types/profile";
import { AccountInfo } from "../../types/account";

export type IMainResponse = {
  message: string;
  userId: string;
};

export type IGetAccountResponse = {
  message: string;
  data: {
    account: AccountInfo;
  };
};

export type IGetProfileResponse = {
  message: string;
  data: {
    profile: ProfileInfo;
  };
};

export type ICreateProfileResponse = {
  message: string;
  data: {
    profileId: string;
  };
};

