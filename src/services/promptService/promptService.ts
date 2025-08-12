// Prompt 관련 API service 정의
import { AxiosHttpClient } from "../common/axiosHttpClient";
import { backendHttpClient } from "../common/httpClient";

export type Prompt = {
  _id: string;
  contents: string;
  status: 'active' | 'inactive' | 'deleted';
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export type PromptListResponse = {
  prompts: Prompt[];
  total: number;
}

export type CreatePromptRequest = {
  contents: string;
}

export type CreatePromptResponse = {
  prompt: Prompt;
}

export type UpdatePromptRequest = {
  contents?: string;
  status?: 'active' | 'inactive' | 'deleted';
}

export type UpdatePromptResponse = {
  prompt: Prompt;
}

type IPromptService = {
  createPrompt: (request: CreatePromptRequest) => Promise<CreatePromptResponse>;
  getPromptById: (promptId: string) => Promise<Prompt>;
  getActivePrompts: () => Promise<PromptListResponse>;
  getAllPrompts: () => Promise<PromptListResponse>;
  updatePrompt: (promptId: string, request: UpdatePromptRequest) => Promise<UpdatePromptResponse>;
  deletePrompt: (promptId: string) => Promise<void>;
  permanentlyDeletePrompt: (promptId: string) => Promise<void>;
  restorePrompt: (promptId: string) => Promise<UpdatePromptResponse>;
  getDeletedPrompts: () => Promise<PromptListResponse>;
};

class PromptService implements IPromptService { 
  constructor(private httpClient: AxiosHttpClient) {}

  // 프롬프트 생성
  async createPrompt(request: CreatePromptRequest) {
    const { data } = await this.httpClient.request<{ success: boolean; data: CreatePromptResponse }>({
      method: 'POST',
      url: '/prompt',
      data: request,
    })
    return data.data
  }

  // 프롬프트 상세 조회
  async getPromptById(promptId: string) {
    const { data } = await this.httpClient.request<{ success: boolean; data: Prompt }>({
      method: 'GET',
      url: `/prompt/${promptId}`,
    })
    return data.data
  }

  // 활성 프롬프트 목록 조회
  async getActivePrompts() {
    const { data } = await this.httpClient.request<{ success: boolean; data: PromptListResponse }>({
      method: 'GET',
      url: '/prompt/list/active',
    })
    return data.data
  }

  // 모든 프롬프트 목록 조회
  async getAllPrompts() {
    const { data } = await this.httpClient.request<{ success: boolean; data: PromptListResponse }>({
      method: 'GET',
      url: '/prompt/list/all',
    })
    return data.data
  }

  // 프롬프트 수정
  async updatePrompt(promptId: string, request: UpdatePromptRequest) {
    const { data } = await this.httpClient.request<{ success: boolean; data: UpdatePromptResponse }>({
      method: 'PUT',
      url: `/prompt/${promptId}`,
      data: request,
    })
    return data.data
  }

  // 프롬프트 삭제 (소프트 삭제)
  async deletePrompt(promptId: string) {
    const { data } = await this.httpClient.request<void>({
      method: 'DELETE',
      url: `/prompt/${promptId}`,
    })
    return data
  }

  // 프롬프트 영구 삭제
  async permanentlyDeletePrompt(promptId: string) {
    const { data } = await this.httpClient.request<void>({
      method: 'DELETE',
      url: `/prompt/${promptId}/permanent`,
    })
    return data
  }

  // 프롬프트 복원
  async restorePrompt(promptId: string) {
    const { data } = await this.httpClient.request<{ success: boolean; data: UpdatePromptResponse }>({
      method: 'POST',
      url: `/prompt/${promptId}/restore`,
    })
    return data.data
  }

  // 삭제된 프롬프트 목록 조회
  async getDeletedPrompts() {
    const { data } = await this.httpClient.request<{ success: boolean; data: PromptListResponse }>({
      method: 'GET',
      url: '/prompt/list/deleted',
    })
    return data.data
  }
}

export const promptService = new PromptService(backendHttpClient);
