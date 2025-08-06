import { ProfileInfo } from './profile';

export type IGetProfileResponse = {
  success: boolean;
  data: {
    profile: ProfileInfo | null;
  };
};

export type IGetProfilesResponse = {
  success: boolean;
  data: ProfileInfo[];
};

export type ICreateProfileResponse = {
  success: boolean;
  data: {
    profileId: string;
  };
}; 