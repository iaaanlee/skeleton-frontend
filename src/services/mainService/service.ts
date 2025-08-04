// backend 요청 시 사용할 service 정의
import { AxiosHttpClient } from "../common/axiosHttpClient";
import { backendHttpClient } from "../common/httpClient";
import { IMainResponse, ICreateNewUserResponse, IGetUserInfoResponse } from "./response";
import { UserInfo } from "../../types/user";

type IMainService = {
  createNewUser: (userInfo: UserInfo) => Promise<IMainResponse>;
};

class MainService implements IMainService { 
  constructor(private httpClient: AxiosHttpClient) {}

  // GET 요청
  async getUserInfo() {
    const { data } = await this.httpClient.request<IGetUserInfoResponse>({
      method: 'GET',
      url: `/user/get-user-info`,
    })
    return data
  }

  // POST 요청
  async createNewUser({contactInfo, bodyStatus, exerciseInfoList, cautions, preferences}: UserInfo) {
    const { data } = await this.httpClient.request<ICreateNewUserResponse>({
      method: 'POST',
      url: '/user/create-new-user',
      data: {
        contactInfo,
        bodyStatus,
        exerciseInfoList,
        cautions,
        preferences,
      },
    })
    return data
  }
}

export const mainService = new MainService(backendHttpClient);