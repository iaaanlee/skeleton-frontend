// Profile 관련 API service 정의
import { backendHttpClient } from '../common/httpClient';
import { CreateProfileRequest, UpdateProfileRequest } from '../../types/profile/request';
import { ICreateProfileResponse, IGetProfileResponse, IGetProfilesResponse } from '../../types/profile/response';
import { SelectProfileResponse, GetCurrentProfileResponse, ClearProfileResponse } from '../../types/services/profile';

export const profileService = {
  // GET
  getProfileByProfileId: async ({ profileId }: { profileId: string }): Promise<IGetProfileResponse> => {
    const response = await backendHttpClient.request({
      method: 'GET',
      url: `/profile/profile/${profileId}`,
    });
    return response.data as IGetProfileResponse;
  },

  getProfilesByAccountId: async (): Promise<IGetProfilesResponse> => {
    const response = await backendHttpClient.request({
      method: 'GET',
      url: '/profile/profiles',
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

  // 프로필 선택/관리 API (새로 추가)
  selectProfile: async (profileId: string): Promise<SelectProfileResponse> => {
    const response = await backendHttpClient.request<SelectProfileResponse>({
      method: 'POST',
      url: '/auth/select-profile',
      data: { profileId }
    });
    return response.data;
  },

  getCurrentProfile: async (): Promise<GetCurrentProfileResponse> => {
    const response = await backendHttpClient.request<GetCurrentProfileResponse>({
      method: 'GET',
      url: '/auth/current-profile'
    });
    return response.data;
  },

  getCurrentProfileDetails: async (): Promise<IGetProfileResponse> => {
    // 먼저 현재 선택된 프로필 ID를 가져온 후, 상세 정보를 조회
    const currentProfile = await backendHttpClient.request<GetCurrentProfileResponse>({
      method: 'GET',
      url: '/auth/current-profile'
    });
    
    const profileId = currentProfile.data.data.profileId;
    const response = await backendHttpClient.request({
      method: 'GET',
      url: `/profile/profile/${profileId}`
    });
    return response.data as IGetProfileResponse;
  },

  clearProfile: async (): Promise<ClearProfileResponse> => {
    const response = await backendHttpClient.request<ClearProfileResponse>({
      method: 'POST',
      url: '/auth/clear-profile'
    });
    return response.data;
  },
}; 