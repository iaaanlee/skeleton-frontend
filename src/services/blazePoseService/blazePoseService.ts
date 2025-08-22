// BlazePose 분석 관련 API service 정의
import { AxiosHttpClient } from "../common/axiosHttpClient";
import { backendHttpClient } from "../common/httpClient";
import { 
  BlazePoseAnalysisRequest, 
  BlazePoseAnalysisResponse,
  BlazePoseResult,
  BlazePoseStatus,
  EstimatedImage
} from "../../types/blazePose";
import { DuplicateAnalysisCheckResponse } from "../../types/mediaSet";
import { selectOptimalImage, getFallbackImage } from "../../utils/imageOptimization";
import { analysisResultCache, AnalysisResultCache } from "../../utils/memoryCache";

type IBlazePoseService = {
  startAnalysis: (request: BlazePoseAnalysisRequest) => Promise<BlazePoseAnalysisResponse['data']>;
  getAnalysisStatus: (analysisId: string) => Promise<BlazePoseStatus['data']>;
  getAnalysisResult: (analysisId: string) => Promise<BlazePoseResult['data']>;
  checkDuplicateAnalysis: (request: { fileIds: string[] }) => Promise<DuplicateAnalysisCheckResponse>;
  getOptimalImage: (images: EstimatedImage[]) => EstimatedImage | null;
  getFallbackImageForError: (images: EstimatedImage[], failedImage: EstimatedImage) => EstimatedImage | null;
};

class BlazePoseService implements IBlazePoseService { 
  constructor(private httpClient: AxiosHttpClient) {}

  // 분석 시작
  async startAnalysis(request: BlazePoseAnalysisRequest) {
    const { data } = await this.httpClient.request<{ success: boolean; data: BlazePoseAnalysisResponse['data'] }>({
      method: 'POST',
      url: '/blazepose/analyze',
      data: request,
    })
    return data.data
  }

  // 분석 상태 조회 (캐시 포함)
  async getAnalysisStatus(analysisId: string) {
    const cacheKey = AnalysisResultCache.createKey(analysisId, 'status');
    
    // 캐시에서 먼저 확인
    const cachedResult = analysisResultCache.get(cacheKey);
    if (cachedResult) {
      console.log(`[BlazePoseService] Status cache hit: ${analysisId}`);
      return cachedResult;
    }

    const { data } = await this.httpClient.request<{ success: boolean; data: BlazePoseStatus['data'] }>({
      method: 'GET',
      url: `/blazepose/status/${analysisId}`,
    })
    
    // 완료되지 않은 상태만 짧게 캐시 (30초)
    const ttl = data.data.status === 'pose_completed' ? 300000 : 30000; // 완료: 5분, 진행중: 30초
    analysisResultCache.set(cacheKey, data.data, ttl);
    
    return data.data
  }

  // 분석 결과 조회 (캐시 포함)
  async getAnalysisResult(analysisId: string) {
    const cacheKey = AnalysisResultCache.createKey(analysisId, 'result');
    
    // 캐시에서 먼저 확인
    const cachedResult = analysisResultCache.get(cacheKey);
    if (cachedResult) {
      console.log(`[BlazePoseService] Result cache hit: ${analysisId}`);
      return cachedResult;
    }

    const { data } = await this.httpClient.request<{ success: boolean; data: BlazePoseResult['data'] }>({
      method: 'GET',
      url: `/blazepose/result/${analysisId}`,
    })
    
    // 완료된 결과는 장기간 캐시 (1시간)
    if (data.data.status === 'completed') {
      analysisResultCache.set(cacheKey, data.data, 3600000);
    }
    
    return data.data
  }

  // 중복 분석 체크
  async checkDuplicateAnalysis(request: { fileIds: string[] }) {
    const { data } = await this.httpClient.request<{ 
      success: boolean; 
      data: DuplicateAnalysisCheckResponse
    }>({
      method: 'POST',
      url: '/blazepose/check-duplicate',
      data: request,
    })
    return data.data
  }

  // 최적 이미지 선택 (브라우저 지원 및 디바이스 기반)
  getOptimalImage(images: EstimatedImage[]): EstimatedImage | null {
    return selectOptimalImage(images);
  }

  // 이미지 로딩 실패시 폴백 이미지 선택
  getFallbackImageForError(images: EstimatedImage[], failedImage: EstimatedImage): EstimatedImage | null {
    return getFallbackImage(images, failedImage);
  }
}

export const blazePoseService = new BlazePoseService(backendHttpClient);
