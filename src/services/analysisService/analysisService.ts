// Analysis 관련 API service 정의
import { AxiosHttpClient } from "../common/axiosHttpClient";
import { backendHttpClient } from "../common/httpClient";
import { BlazePoseResultsFromBackend } from "../../types/blazePose";

export type AnalysisJob = {
  _id: string;
  accountId: string;
  profileId: string;
  mediaSetId: string;
  description: {
    ans1: string;
    ans2: string;
  };
  promptId: string;
  status: 'pending' | 'blazepose_processing' | 'blazepose_completed' | 'llm_processing' | 'llm_completed' | 'failed';
  blazePoseResults?: BlazePoseResultsFromBackend;
  llmResults?: {
    analysisText: string;
  };
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export type AnalysisStatus = {
  analysisJobId: string;
  status: 'pending' | 'blazepose_processing' | 'blazepose_completed' | 'llm_processing' | 'llm_completed' | 'failed';
  message: string;
  completedSteps: Array<{
    step: string;
    completedAt: string;
    description: string;
  }>;
  error: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
}

export type StartAnalysisRequest = {
  mediaSetId: string;
  description: {
    ans1: string;
    ans2: string;
  };
  promptId: string;
}

export type StartAnalysisResponse = {
  analysisJob: AnalysisJob;
}

type IAnalysisService = {
  startAnalysis: (request: StartAnalysisRequest) => Promise<StartAnalysisResponse>;
  getAnalysisStatus: (analysisJobId: string, profileId?: string) => Promise<AnalysisStatus>;
  getAnalysisJob: (analysisJobId: string, profileId?: string) => Promise<AnalysisJob>;
  cancelAnalysis: (analysisJobId: string) => Promise<void>;
};

class AnalysisService implements IAnalysisService { 
  constructor(private httpClient: AxiosHttpClient) {}

  // 분석 시작
  async startAnalysis(request: StartAnalysisRequest) {
    const { data } = await this.httpClient.request<{ success: boolean; data: StartAnalysisResponse }>({
      method: 'POST',
      url: '/analysis/start',
      data: request,
    })
    return data.data
  }

  // 분석 상태 조회
  async getAnalysisStatus(analysisJobId: string, profileId?: string) {
    const { data } = await this.httpClient.request<{ success: boolean; data: AnalysisStatus }>({
      method: 'GET',
      url: `/analysis/status/${analysisJobId}`,
      params: profileId ? { profileId } : undefined
    })
    return data.data
  }

  // 분석 작업 조회
  async getAnalysisJob(analysisJobId: string, profileId?: string) {
    const { data } = await this.httpClient.request<{ success: boolean; data: AnalysisJob }>({
      method: 'GET',
      url: `/analysis/analysisJobById/${analysisJobId}`,
      params: profileId ? { profileId } : undefined
    })
    return data.data
  }

  // 분석 취소
  async cancelAnalysis(analysisJobId: string) {
    const { data } = await this.httpClient.request<void>({
      method: 'POST',
      url: `/analysis/cancel/${analysisJobId}`,
    })
    return data
  }
}

export const analysisService = new AnalysisService(backendHttpClient);
