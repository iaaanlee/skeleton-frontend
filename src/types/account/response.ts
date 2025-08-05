import { AccountInfo } from './account';

export type IGetAccountResponse = {
  success: boolean;
  data: {
    account: AccountInfo;
  };
};

export type ICreateAccountResponse = {
  success: boolean;
  data: {
    accountId: string;
  };
};

export type ILoginResponse = {
  success: boolean;
  data: {
    token: string;
    account: AccountInfo;
  };
}; 