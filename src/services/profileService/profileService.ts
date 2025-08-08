// Profile 관련 API service 정의
import { backendHttpClient } from '../common/httpClient';
import { CreateProfileRequest, UpdateProfileRequest } from '../../types/profile/request';
import { ICreateProfileResponse, IGetProfileResponse, IGetProfilesResponse } from '../../types/profile/response';

export const profileService = {
  // GET
  getProfileByProfileId: async ({ profileId }: { profileId: string }): Promise<IGetProfileResponse> => {
    const response = await backendHttpClient.request({
      method: 'GET',
      url: `/profile/by-profile-id/${profileId}`,
    });
    return response.data as IGetProfileResponse;
  },

  getProfilesByAccountId: async (): Promise<IGetProfilesResponse> => {
    const response = await backendHttpClient.request({
      method: 'GET',
      url: '/profile/profiles/by-account-id',
    });
    return response.data as IGetProfilesResponse;
  },

  // POST
  createProfile: async (data: CreateProfileRequest): Promise<ICreateProfileResponse> => {
    const response = await backendHttpClient.request({
      method: 'POST',
      url: '/profile/create-profile',
      data,
    });
    return response.data as ICreateProfileResponse;
  },

  // PUT
  updateProfile: async ({ profileId, ...data }: UpdateProfileRequest & { profileId: string }): Promise<IGetProfileResponse> => {
    const response = await backendHttpClient.request({
      method: 'PUT',
      url: `/profile/update-profile/${profileId}`,
      data,
    });
    return response.data as IGetProfileResponse;
  },
}; 