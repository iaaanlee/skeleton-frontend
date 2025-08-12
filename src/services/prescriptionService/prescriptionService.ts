// Prescription 관련 API service 정의
import { AxiosHttpClient } from "../common/axiosHttpClient";
import { backendHttpClient } from "../common/httpClient";

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
    promptId: string;
  };
  analysisJobId: string;
  blazePoseResults?: {
    estimatedImageKeys: string[];
    jointPositions: any[];
    confidence: number;
  };
  llmResults?: {
    analysisText: string;
  };
  status: 'processing' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export type PrescriptionListResponse = {
  prescriptions: Prescription[];
  total: number;
}

export type CreatePrescriptionRequest = {
  profileId: string;
  inputs: {
    mediaSetId: string;
    description: {
      ans1: string;
      ans2: string;
    };
    promptId: string;
  };
}

export type CreatePrescriptionResponse = {
  prescriptionId: string;
  analysisJobId: string;
  status: string;
  message: string;
}

export type UpdatePrescriptionStatusRequest = {
  status: 'processing' | 'completed' | 'failed';
  message?: string;
}

export type SaveBlazePoseResultsRequest = {
  estimatedImageKeys: string[];
  jointPositions: any[];
  confidence: number;
}

export type SaveLLMResultsRequest = {
  analysisText: string;
}

type IPrescriptionService = {
  createPrescription: (request: CreatePrescriptionRequest) => Promise<CreatePrescriptionResponse>;
  getPrescriptionById: (prescriptionId: string, profileId: string) => Promise<Prescription>;
  getPrescriptionHistory: (accountId: string, profileId: string, limit?: number, offset?: number) => Promise<PrescriptionListResponse>;
  getPrescriptionHistoryV2: (accountId: string, profileId: string, limit?: number, offset?: number) => Promise<PrescriptionListResponse>;
  getCompletedPrescriptions: (accountId: string, profileId: string, limit?: number, offset?: number) => Promise<PrescriptionListResponse>;
  getPrescriptionsByMediaSet: (mediaSetId: string) => Promise<PrescriptionListResponse>;
  getPrescriptionByAnalysisJob: (analysisJobId: string, profileId: string) => Promise<Prescription>;
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
  async getPrescriptionById(prescriptionId: string, profileId: string) {
    const { data } = await this.httpClient.request<{ success: boolean; data: Prescription }>({
      method: 'GET',
      url: `/prescription/prescriptionById/${prescriptionId}`,
      params: { profileId }
    })
    return data.data
  }

  // 처방 기록 조회 (기존 호환성)
  async getPrescriptionHistory(accountId: string, profileId: string, limit: number = 20, offset: number = 0) {
    const { data } = await this.httpClient.request<{ success: boolean; data: PrescriptionListResponse }>({
      method: 'GET',
      url: '/prescription/history',
      params: { accountId, profileId, limit, offset }
    })
    return data.data
  }

  // 처방 기록 조회 (새로운 버전)
  async getPrescriptionHistoryV2(accountId: string, profileId: string, limit: number = 20, offset: number = 0) {
    const { data } = await this.httpClient.request<{ success: boolean; data: PrescriptionListResponse }>({
      method: 'GET',
      url: '/prescription/history/v2',
      params: { accountId, profileId, limit, offset }
    })
    return data.data
  }

  // 완료된 처방 조회
  async getCompletedPrescriptions(accountId: string, profileId: string, limit: number = 20, offset: number = 0) {
    const { data } = await this.httpClient.request<{ success: boolean; data: PrescriptionListResponse }>({
      method: 'GET',
      url: '/prescription/completed',
      params: { accountId, profileId, limit, offset }
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
      url: `/prescription/by-analysis/${analysisJobId}`,
    })
    return data.data
  }

  // 처방 상태 업데이트
  async updatePrescriptionStatus(prescriptionId: string, request: UpdatePrescriptionStatusRequest) {
    const { data } = await this.httpClient.request<void>({
      method: 'PATCH',
      url: `/prescription/prescriptionById/${prescriptionId}/status`,
      data: request,
    })
    return data
  }

  // BlazePose 결과 저장
  async saveBlazePoseResults(prescriptionId: string, request: SaveBlazePoseResultsRequest) {
    const { data } = await this.httpClient.request<void>({
      method: 'POST',
      url: `/prescription/prescriptionById/${prescriptionId}/blazepose-results`,
      data: request,
    })
    return data
  }

  // LLM 결과 저장
  async saveLLMResults(prescriptionId: string, request: SaveLLMResultsRequest) {
    const { data } = await this.httpClient.request<void>({
      method: 'POST',
      url: `/prescription/prescriptionById/${prescriptionId}/llm-results`,
      data: request,
    })
    return data
  }

  // 처방 완료
  async completePrescription(prescriptionId: string) {
    const { data } = await this.httpClient.request<void>({
      method: 'POST',
      url: `/prescription/prescriptionById/${prescriptionId}/complete`,
    })
    return data
  }

  // 처방 실패
  async failPrescription(prescriptionId: string, error?: string) {
    const { data } = await this.httpClient.request<void>({
      method: 'POST',
      url: `/prescription/prescriptionById/${prescriptionId}/fail`,
      data: { error },
    })
    return data
  }

  // 처방 삭제
  async deletePrescription(prescriptionId: string) {
    const { data } = await this.httpClient.request<void>({
      method: 'DELETE',
      url: `/prescription/prescriptionById/${prescriptionId}`,
    })
    return data
  }
}

export const prescriptionService = new PrescriptionService(backendHttpClient);
