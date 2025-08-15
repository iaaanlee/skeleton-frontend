import { ProfileInfo } from './profile';

export type GetProfileResponse = {
  success: boolean;
  data: {
    profile: ProfileInfo | null;
  };
};

export type GetProfilesResponse = {
  success: boolean;
  data: ProfileInfo[];
};

export type CreateProfileResponse = {
  success: boolean;
  data: {
    profileId: string;
  };
};

export type UpdateProfileResponse = {
  success: boolean;
  data: {
    profileId: string;
  };
};

// 백워드 호환성을 위한 별칭
export type IGetProfileResponse = GetProfileResponse;
export type IGetProfilesResponse = GetProfilesResponse;
export type ICreateProfileResponse = CreateProfileResponse; 