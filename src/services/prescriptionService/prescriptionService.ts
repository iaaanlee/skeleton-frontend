// Prescription 관련 API service 정의
import { AxiosHttpClient } from "../common/axiosHttpClient";
import { backendHttpClient } from "../common/httpClient";
import { BlazePoseLandmark } from "../../types/blazePose";
import { PrescriptionStatus } from "../../types/common/status-types";

export type Prescription = {
  _id: string;
  accountId: string;
  profileId: string;
  inputs: {
    mediaSetId: string;
    description: {
      ans1: string;
      ans2: string;
    };
  };
  analysisJobId: string;
  blazePoseResults?: {
    totalFiles: number;
    results: Array<{
      fileIndex: number;
      fileName: string;
      landmarks: Array<{
        x: number;
        y: number;
        z: number;
        visibility: number;
      }>; // 단일 배열로 수정, index 필드 제거
      confidence: number[];
      estimatedKeys: string[]; // deprecated - 하위 호환성용
      estimatedImages: Array<{
        key: string;
        url?: string;
        expiresAt?: string;
      }>;
    }>;
    completedAt: string;
  };
  llmResults?: {
    analysisText: string;
  };
  status: PrescriptionStatus;
  createdAt: string;
  updatedAt: string;
  // PrescriptionHistory용 추가 필드들 (getCompletedPrescriptions에서 생성)
  id?: string;
  title?: string;
  description?: string;
  fileCount?: number;
  mediaType?: 'image' | 'video'; // 미디어 타입 추가
  analysisId?: string;
  thumbnailUrl?: string;
}

export type PrescriptionListResponse = {
  prescriptions: Prescription[];
  total: number;
}

export type CreatePrescriptionRequest = {
  inputs: {
    mediaSetId: string;
    description: {
      ans1: string;
      ans2: string;
    };
    isTest?: boolean;
  };
}

export type CreatePrescriptionResponse = {
  prescriptionId: string;
  analysisJobId: string;
  status: string;
  message: string;
  redirectTo?: string; // 리다이렉트 경로 (예: 'prescription-history')
}

export type UpdatePrescriptionStatusRequest = {
  status: PrescriptionStatus;
  message?: string;
}

export type SaveBlazePoseResultsRequest = {
  estimatedImageKeys: string[];
  jointPositions: BlazePoseLandmark[]; // 단일 배열로 수정
  confidence: number;
}

export type SaveLLMResultsRequest = {
  analysisText: string;
}


type IPrescriptionService = {
  createPrescription: (request: CreatePrescriptionRequest) => Promise<CreatePrescriptionResponse>;
  getPrescriptionById: (prescriptionId: string) => Promise<Prescription>;
  getCompletedPrescriptions: (limit?: number, offset?: number) => Promise<PrescriptionListResponse>;
  getPrescriptionsByMediaSet: (mediaSetId: string) => Promise<PrescriptionListResponse>;
  getPrescriptionByAnalysisJob: (analysisJobId: string) => Promise<Prescription>;
  updatePrescriptionStatus: (prescriptionId: string, request: UpdatePrescriptionStatusRequest) => Promise<void>;
  saveBlazePoseResults: (prescriptionId: string, request: SaveBlazePoseResultsRequest) => Promise<void>;
  saveLLMResults: (prescriptionId: string, request: SaveLLMResultsRequest) => Promise<void>;
  completePrescription: (prescriptionId: string) => Promise<void>;
  failPrescription: (prescriptionId: string, error?: string) => Promise<void>;
  deletePrescription: (prescriptionId: string) => Promise<void>;
};

class PrescriptionService implements IPrescriptionService { 
  constructor(private httpClient: AxiosHttpClient) {}

  // 처방 생성
  async createPrescription(request: CreatePrescriptionRequest) {
    const { data } = await this.httpClient.request<{ success: boolean; data: CreatePrescriptionResponse }>({
      method: 'POST',
      url: '/prescription',
      data: request,
    })
    return data.data
  }

  // 처방 상세 조회
  async getPrescriptionById(prescriptionId: string) {
    const { data } = await this.httpClient.request<{ success: boolean; data: Prescription }>({
      method: 'GET',
      url: `/prescription/by-id/${prescriptionId}`
    })
    return data.data
  }


  // 완료된 처방 조회
  async getCompletedPrescriptions(limit: number = 20, offset: number = 0) {
    const { data } = await this.httpClient.request<{ success: boolean; data: PrescriptionListResponse }>({
      method: 'GET',
      url: '/prescription/completed',
      params: { limit, offset }
    })
    
    // 🔍 디버깅: 받은 데이터 구조 로깅
    console.log('🔍 [FRONTEND DEBUG] getCompletedPrescriptions 응답:', {
      success: data.success,
      totalPrescriptions: data.data?.prescriptions?.length || 0,
      total: data.data?.total || 0,
      firstPrescription: data.data?.prescriptions?.[0] ? {
        id: data.data.prescriptions[0].id,
        title: data.data.prescriptions[0].title,
        thumbnailUrl: data.data.prescriptions[0].thumbnailUrl,
        fileCount: data.data.prescriptions[0].fileCount,
        mediaType: data.data.prescriptions[0].mediaType
      } : null
    })
    
    return data.data
  }

  // 미디어 세트별 처방 조회
  async getPrescriptionsByMediaSet(mediaSetId: string) {
    const { data } = await this.httpClient.request<{ success: boolean; data: PrescriptionListResponse }>({
      method: 'GET',
      url: `/prescription/by-media-set/${mediaSetId}`,
    })
    return data.data
  }

  // 분석 작업별 처방 조회
  async getPrescriptionByAnalysisJob(analysisJobId: string) {
    const { data } = await this.httpClient.request<{ success: boolean; data: Prescription }>({
      method: 'GET',
      url: `/prescription/by-analysis/${analysisJobId}`
    })
    
    // 🔍 디버깅: 받은 prescription 데이터 구조 로깅
    console.log('🔍 [FRONTEND DEBUG] getPrescriptionByAnalysisJob 응답:', {
      success: data.success,
      prescriptionId: data.data?._id,
      analysisJobId: data.data?.analysisJobId,
      hasBlazePoseResults: !!data.data?.blazePoseResults,
      blazePoseResultsStructure: data.data?.blazePoseResults ? {
        totalFiles: data.data.blazePoseResults.totalFiles,
        resultsCount: data.data.blazePoseResults.results?.length || 0,
        firstResult: data.data.blazePoseResults.results?.[0] ? {
          fileName: data.data.blazePoseResults.results[0].fileName,
          landmarksCount: data.data.blazePoseResults.results[0].landmarks?.length || 0,
          confidenceCount: data.data.blazePoseResults.results[0].confidence?.length || 0,
          estimatedKeysCount: data.data.blazePoseResults.results[0].estimatedKeys?.length || 0,
          hasEstimatedImages: !!data.data.blazePoseResults.results[0].estimatedImages
        } : null
      } : null,
      hasLLMResults: !!data.data?.llmResults,
      llmText: data.data?.llmResults?.analysisText ? 'LLM 텍스트 있음' : 'LLM 텍스트 없음'
    })
    
    return data.data
  }

  // 처방 상태 업데이트
  async updatePrescriptionStatus(prescriptionId: string, request: UpdatePrescriptionStatusRequest) {
    const { data } = await this.httpClient.request<void>({
      method: 'PATCH',
      url: `/prescription/by-id/${prescriptionId}/status`,
      data: request,
    })
    return data
  }

  // BlazePose 결과 저장
  async saveBlazePoseResults(prescriptionId: string, request: SaveBlazePoseResultsRequest) {
    const { data } = await this.httpClient.request<void>({
      method: 'POST',
      url: `/prescription/by-id/${prescriptionId}/blazepose-results`,
      data: request,
    })
    return data
  }

  // LLM 결과 저장
  async saveLLMResults(prescriptionId: string, request: SaveLLMResultsRequest) {
    const { data } = await this.httpClient.request<void>({
      method: 'POST',
      url: `/prescription/by-id/${prescriptionId}/llm-results`,
      data: request,
    })
    return data
  }

  // 처방 완료
  async completePrescription(prescriptionId: string) {
    const { data } = await this.httpClient.request<void>({
      method: 'POST',
      url: `/prescription/by-id/${prescriptionId}/complete`,
    })
    return data
  }

  // 처방 실패
  async failPrescription(prescriptionId: string, error?: string) {
    const { data } = await this.httpClient.request<void>({
      method: 'POST',
      url: `/prescription/by-id/${prescriptionId}/fail`,
      data: { error },
    })
    return data
  }


  // 처방 삭제
  async deletePrescription(prescriptionId: string) {
    const { data } = await this.httpClient.request<void>({
      method: 'DELETE',
      url: `/prescription/by-id/${prescriptionId}`,
    })
    return data
  }
}

export const prescriptionService = new PrescriptionService(backendHttpClient);
