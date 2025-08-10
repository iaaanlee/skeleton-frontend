// Account 관련 API service 정의
import { AxiosHttpClient } from "../common/axiosHttpClient";
import { backendHttpClient } from "../common/httpClient";
import { ICreateAccountResponse, IGetAccountResponse, ILoginResponse } from "../../types/account/response";
import { CreateAccountRequest, LoginRequest } from "../../types/account/request";

type IAccountService = {
  getAccount: () => Promise<IGetAccountResponse>;
  login: (input: LoginRequest) => Promise<ILoginResponse>;
  createAccount: (input: CreateAccountRequest) => Promise<ICreateAccountResponse>;
};

class AccountService implements IAccountService { 
  constructor(private httpClient: AxiosHttpClient) {}

  // GET 요청
  async getAccount() {
    const { data } = await this.httpClient.request<{ success: boolean; data: IGetAccountResponse }>({
      method: 'GET',
      url: '/account/account',
    })
    return data.data
  }

  // POST 요청
  async login(input: LoginRequest) {
    const { data } = await this.httpClient.request<{ success: boolean; data: ILoginResponse }>({
      method: 'POST',
      url: '/account/login',
      data: input,
    })
    return data.data
  }

  async createAccount(input: CreateAccountRequest) {
    const { data } = await this.httpClient.request<{ success: boolean; data: ICreateAccountResponse }>({
      method: 'POST',
      url: '/account/create-account',
      data: input,
    })
    return data.data
  }
}

export const accountService = new AccountService(backendHttpClient); 