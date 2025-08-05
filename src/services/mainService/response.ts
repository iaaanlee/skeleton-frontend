// service 내에서 response들의 type 정의
import { UserProfileInfo } from "../../types/userProfile";

export type IMainResponse = {
  message: string;
  userId: string;
};

export type IGetUserProfileInfoResponse = {
  message: string;
  data: {
    userProfileInfo: UserProfileInfo;
  };
};

export type ICreateNewUserProfileResponse = {
  message: string;
  data: {
    userId: string;
  };
};

