// service 내에서 response들의 type 정의
import { UserInfo } from "../../types/user";

export type IMainResponse = {
  message: string;
  userId: string;
};

export type ICreateNewUserResponse = {
  message: string;
  userId: string;
};

export type IGetUserInfoResponse = {
  userInfo: UserInfo;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
};