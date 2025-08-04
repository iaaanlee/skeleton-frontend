export type UserInfo = {
  userBasicInfo: UserBasicInfo;
  bodyStatus: BodyStatus;
};

export type UserBasicInfo = {
  name: string;
  contactNumber: string;
};

export type BodyStatus = {
  gender: 'male' | 'female'
  birthYear: number;
  height: number;
  weight: number;
};