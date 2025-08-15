// AnalysisJob 관련 API service 정의 (분석 작업 관리 전용)
import { AxiosHttpClient } from "../common/axiosHttpClient";
import { backendHttpClient } from "../common/httpClient";
import { 
  AnalysisJob, 
  AnalysisStatusInfo
} from "../../types/analysis/analysis";

type IAnalysisJobService = {
  getAnalysisStatus: (analysisJobId: string) => Promise<AnalysisStatusInfo>;
  getAnalysisJob: (analysisJobId: string) => Promise<AnalysisJob>;
  cancelAnalysis: (analysisJobId: string) => Promise<void>;
};

class AnalysisJobService implements IAnalysisJobService { 
  constructor(private httpClient: AxiosHttpClient) {}

  // 분석 상태 조회
  async getAnalysisStatus(analysisJobId: string) {
    const { data } = await this.httpClient.request<{ success: boolean; data: AnalysisStatusInfo }>({
      method: 'GET',
      url: `/analysisJob/status/${analysisJobId}`
    })
    return data.data
  }

  // 분석 작업 조회
  async getAnalysisJob(analysisJobId: string) {
    const { data } = await this.httpClient.request<{ success: boolean; data: AnalysisJob }>({
      method: 'GET',
      url: `/analysisJob/${analysisJobId}`
    })
    return data.data
  }

  // 분석 취소
  async cancelAnalysis(analysisJobId: string) {
    const { data } = await this.httpClient.request<void>({
      method: 'POST',
      url: `/analysisJob/cancel/${analysisJobId}`
    })
    return data
  }
}

export const analysisJobService = new AnalysisJobService(backendHttpClient);