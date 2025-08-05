// backend 요청 시 사용할 service 정의
import { AxiosHttpClient } from "../common/axiosHttpClient";
import { backendHttpClient } from "../common/httpClient";
import { ICreateProfileResponse, IGetProfileResponse } from "../../types/profile/response";
import { ICreateAccountResponse, IGetAccountResponse, ILoginResponse } from "../../types/account/response";
import { CreateProfileRequest } from "../../types/profile/request";
import { CreateAccountRequest, LoginRequest } from "../../types/account/request";

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
  async login(input: LoginRequest) {
    const { data } = await this.httpClient.request<ILoginResponse>({
      method: 'POST',
      url: '/login',
      data: input,
    })
    return data
  }

  async createProfile(input: CreateProfileRequest) {
    const { data } = await this.httpClient.request<ICreateProfileResponse>({
      method: 'POST',
      url: '/create-profile',
      data: input,
    })
    return data
  }

  async createAccount(input: CreateAccountRequest) {
    const { data } = await this.httpClient.request<ICreateAccountResponse>({
      method: 'POST',
      url: '/create-account',
      data: input,
    })
    return data
  }
}

export const mainService = new MainService(backendHttpClient);