// Profile service related types

export type SelectProfileResponse = {
  success: boolean;
  data: {
    profileId: string;
    profileName: string;
    message: string;
  };
}

export type GetCurrentProfileResponse = {
  success: boolean;
  data: {
    profileId: string;
    profileName: string;
    accountId: string;
  };
}

export type ClearProfileResponse = {
  success: boolean;
  message: string;
}