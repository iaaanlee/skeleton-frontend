// Profile 관련 API service 정의
import { AxiosHttpClient } from "../common/axiosHttpClient";
import { backendHttpClient } from "../common/httpClient";
import { ICreateProfileResponse, IGetProfileResponse, IGetProfilesResponse } from "../../types/profile/response";
import { CreateProfileRequest } from "../../types/profile/request";

type IProfileService = {
  getProfileByProfileId: ({profileId}: {profileId: string}) => Promise<IGetProfileResponse>;
  getProfilesByAccountId: () => Promise<IGetProfilesResponse>;
  createProfile: (input: CreateProfileRequest) => Promise<ICreateProfileResponse>;
};

class ProfileService implements IProfileService { 
  constructor(private httpClient: AxiosHttpClient) {}

  // GET 요청
  async getProfileByProfileId({profileId}: {profileId: string}) {
    const { data } = await this.httpClient.request<IGetProfileResponse>({
      method: 'GET',
      url: `/profile/by-profile-id/${profileId}`,
    })
    return data
  }

  async getProfilesByAccountId() {
    const { data } = await this.httpClient.request<IGetProfilesResponse>({
      method: 'GET',
      url: '/profile/profiles/by-account-id',
    })
    return data
  }

  // POST 요청
  async createProfile(input: CreateProfileRequest) {
    const { data } = await this.httpClient.request<ICreateProfileResponse>({
      method: 'POST',
      url: '/profile/create-profile',
      data: input,
    })
    return data
  }
}

export const profileService = new ProfileService(backendHttpClient); 