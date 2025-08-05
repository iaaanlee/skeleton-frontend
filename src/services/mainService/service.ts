// backend 요청 시 사용할 service 정의
import { AxiosHttpClient } from "../common/axiosHttpClient";
import { backendHttpClient } from "../common/httpClient";
import { ICreateNewUserProfileResponse, IGetUserProfileInfoResponse } from "./response";
import { CreateUserProfileRequest } from "../../types/request";

type IMainService = {
  getUserProfileInfo: ({profileId}: {profileId: string}) => Promise<IGetUserProfileInfoResponse>;
};

class MainService implements IMainService { 
  constructor(private httpClient: AxiosHttpClient) {}

  // GET 요청
  async getUserProfileInfo({profileId}: {profileId: string}) {
    const { data } = await this.httpClient.request<IGetUserProfileInfoResponse>({
      method: 'GET',
      url: `/user/get-profile-info`,
      params: {
        profileId,
      },
    })
    return data
  }

  // POST 요청
  async createNewUserProfile({profileName, bodyStatus, exerciseInfoList, cautions, preferences}: CreateUserProfileRequest) {
    const { data } = await this.httpClient.request<ICreateNewUserProfileResponse>({
      method: 'POST',
      url: '/user/create-new-profile',
      data: {
        profileName,
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