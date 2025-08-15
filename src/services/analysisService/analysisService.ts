// Analysis 관련 API service 정의
import { AxiosHttpClient } from "../common/axiosHttpClient";
import { backendHttpClient } from "../common/httpClient";
import { 
  AnalysisJob, 
  AnalysisStatusInfo, 
  StartAnalysisRequest, 
  StartAnalysisResponse 
} from "../../types/analysis/analysis";

type IAnalysisService = {
  startAnalysis: (request: StartAnalysisRequest) => Promise<StartAnalysisResponse>;
  getAnalysisStatus: (analysisJobId: string, profileId?: string) => Promise<AnalysisStatusInfo>;
  getAnalysisJob: (analysisJobId: string, profileId?: string) => Promise<AnalysisJob>;
  cancelAnalysis: (analysisJobId: string) => Promise<void>;
};

class AnalysisService implements IAnalysisService { 
  constructor(private httpClient: AxiosHttpClient) {}

  // 분석 시작
  async startAnalysis(request: StartAnalysisRequest) {
    const { data } = await this.httpClient.request<{ success: boolean; data: StartAnalysisResponse }>({
      method: 'POST',
      url: '/exerciseAnalysis/start',
      data: request,
    })
    return data.data
  }

  // 분석 상태 조회
  async getAnalysisStatus(analysisJobId: string, profileId?: string) {
    const { data } = await this.httpClient.request<{ success: boolean; data: AnalysisStatusInfo }>({
      method: 'GET',
      url: `/analysisJob/status/${analysisJobId}`,
      params: profileId ? { profileId } : undefined
    })
    return data.data
  }

  // 분석 작업 조회
  async getAnalysisJob(analysisJobId: string, profileId?: string) {
    const { data } = await this.httpClient.request<{ success: boolean; data: AnalysisJob }>({
      method: 'GET',
      url: `/analysisJob/analysisJobById/${analysisJobId}`,
      params: profileId ? { profileId } : undefined
    })
    return data.data
  }

  // 분석 취소
  async cancelAnalysis(analysisJobId: string) {
    const { data } = await this.httpClient.request<void>({
      method: 'POST',
      url: `/analysisJob/cancel/${analysisJobId}`,
    })
    return data
  }
}

export const analysisService = new AnalysisService(backendHttpClient);
