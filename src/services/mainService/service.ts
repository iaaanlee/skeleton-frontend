// backend 요청 시 사용할 service 정의
import { AxiosHttpClient } from "../common/axiosHttpClient";
import { backendHttpClient } from "../common/httpClient";
import { IMainResponse, ICreateNewUserResponse } from "./response";
import { UserInfo } from "../../types/mainType";

type IMainService = {
  createNewUser: (userInfo: UserInfo) => Promise<IMainResponse>;
};

class MainService implements IMainService { 
  constructor(private httpClient: AxiosHttpClient) {}

  // GET 요청
  async getMain() {
    const { data } = await this.httpClient.request<IMainResponse>({
      method: 'GET',
      url: '/main',
    })
    return data
  }

  // POST 요청
  async createNewUser({userBasicInfo, bodyStatus}: UserInfo) {
    const { data } = await this.httpClient.request<ICreateNewUserResponse>({
      method: 'POST',
      url: '/create-new-user',
      data: {
        userBasicInfo,
        bodyStatus,
      },
    })
    return data
  }
}

export const mainService = new MainService(backendHttpClient);