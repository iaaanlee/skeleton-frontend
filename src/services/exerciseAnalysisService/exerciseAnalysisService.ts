// ExerciseAnalysis 관련 API service 정의 (운동 분석 실행 전용)
import { AxiosHttpClient } from "../common/axiosHttpClient";
import { backendHttpClient } from "../common/httpClient";
import { 
  StartAnalysisRequest, 
  StartAnalysisResponse 
} from "../../types/analysis/analysis";

type IExerciseAnalysisService = {
  startAnalysis: (request: StartAnalysisRequest) => Promise<StartAnalysisResponse>;
  restartAnalysis: (analysisJobId: string) => Promise<StartAnalysisResponse>;
};

class ExerciseAnalysisService implements IExerciseAnalysisService { 
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

  // 실패한 분석 재시작
  async restartAnalysis(analysisJobId: string) {
    const { data } = await this.httpClient.request<{ success: boolean; data: StartAnalysisResponse }>({
      method: 'POST',
      url: `/exerciseAnalysis/restart/by-analysis-job/${analysisJobId}`
    })
    return data.data
  }
}

export const exerciseAnalysisService = new ExerciseAnalysisService(backendHttpClient);