// BlazePose 분석 관련 API service 정의
import { AxiosHttpClient } from "../common/axiosHttpClient";
import { backendHttpClient } from "../common/httpClient";
import { 
  BlazePoseAnalysisRequest, 
  BlazePoseAnalysisResponse,
  BlazePoseResult,
  BlazePoseStatus
} from "../../types/blazePose";

type IBlazePoseService = {
  startAnalysis: (request: BlazePoseAnalysisRequest) => Promise<BlazePoseAnalysisResponse['data']>;
  getAnalysisStatus: (analysisId: string) => Promise<BlazePoseStatus['data']>;
  getAnalysisResult: (analysisId: string) => Promise<BlazePoseResult['data']>;
  checkDuplicateAnalysis: (request: { profileId: string; fileIds: string[] }) => Promise<{
    hasDuplicate: boolean;
    duplicateAnalysis: any | null;
    duplicateFiles: any[];
  }>;
};

class BlazePoseService implements IBlazePoseService { 
  constructor(private httpClient: AxiosHttpClient) {}

  // 분석 시작
  async startAnalysis(request: BlazePoseAnalysisRequest) {
    const { data } = await this.httpClient.request<{ success: boolean; data: BlazePoseAnalysisResponse['data'] }>({
      method: 'POST',
      url: '/blazePose/analyze',
      data: request,
    })
    return data.data
  }

  // 분석 상태 조회
  async getAnalysisStatus(analysisId: string) {
    const { data } = await this.httpClient.request<{ success: boolean; data: BlazePoseStatus['data'] }>({
      method: 'GET',
      url: `/blazePose/status/${analysisId}`,
    })
    return data.data
  }

  // 분석 결과 조회
  async getAnalysisResult(analysisId: string) {
    const { data } = await this.httpClient.request<{ success: boolean; data: BlazePoseResult['data'] }>({
      method: 'GET',
      url: `/blazePose/result/${analysisId}`,
    })
    return data.data
  }

  // 중복 분석 체크
  async checkDuplicateAnalysis(request: { profileId: string; fileIds: string[] }) {
    const { data } = await this.httpClient.request<{ 
      success: boolean; 
      data: {
        hasDuplicate: boolean;
        duplicateAnalysis: any | null;
        duplicateFiles: any[];
      }
    }>({
      method: 'POST',
      url: '/blazePose/check-duplicate',
      data: request,
    })
    return data.data
  }
}

export const blazePoseService = new BlazePoseService(backendHttpClient);
