// backend 요청 시 사용할 service 정의
import { AxiosHttpClient } from "../common/axiosHttpClient";
import { backendHttpClient } from "../common/httpClient";
import { ICreateProfileResponse, IGetAccountResponse, IGetProfileResponse } from "./response";
import { CreateProfileRequest } from "../../types/request";

type IMainService = {
  getProfileByProfileId: ({profileId}: {profileId: string}) => Promise<IGetProfileResponse>;
};

class MainService implements IMainService { 
  constructor(private httpClient: AxiosHttpClient) {}

  // GET 요청
  async getAccount() {
    const { data } = await this.httpClient.request<IGetAccountResponse>({
      method: 'GET',
      url: '/account',
    })
    return data
  }

  async getProfileByProfileId({profileId}: {profileId: string}) {
    const { data } = await this.httpClient.request<IGetProfileResponse>({
      method: 'GET',
      url: `/profile/by-profile-id/${profileId}`,
    })
    return data
  }

  // POST 요청
  async createProfile(input: CreateProfileRequest) {
    const { data } = await this.httpClient.request<ICreateProfileResponse>({
      method: 'POST',
      url: '/create-profile',
      data: input,
    })
    return data
  }
}

export const mainService = new MainService(backendHttpClient);