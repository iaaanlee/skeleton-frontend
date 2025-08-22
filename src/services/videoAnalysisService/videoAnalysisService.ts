import { axiosHttpClient } from '../common/axiosHttpClient';
import { CompletedPoseAnalysisApiResponse, PoseAnalysisDetailApiResponse } from '../../types/completedPoseAnalysis';

// 비디오 분석 시작 요청
export type StartVideoPoseAnalysisRequest = {
  mediaSetId: string;
};

// 비디오 분석 시작 응답
export type StartVideoPoseAnalysisResponse = {
  status: 'success' | 'already_exists' | 'reanalysis_blocked' | 'error';
  message: string;
  analysisJobId?: string;
  prescription?: any;
};

// 비디오 분석 상태 응답
export type VideoPoseAnalysisStatusResponse = {
  status: 'not_found' | 'pending' | 'blazepose_processing' | 'blazepose_completed' | 'pose_completed' | 'analysis_completed' | 'failed' | 'blazepose_server_failed' | 'blazepose_pose_failed';
  message: string;
  analysisJobId?: string;
  prescription?: any;
  progress?: {
    total: number;
    completed: number;
    failed: number;
    percentage: number;
  };
  errorDetails?: {
    failedImages: string[];
    errorMessages: string[];
  };
};

// 완료된 자세 분석 조회 요청
export type GetCompletedPoseAnalysisRequest = {
  limit?: number;
  offset?: number;
  mediaType?: 'video' | 'image';
};

type IVideoAnalysisService = {
  startVideoPoseAnalysis: (request: StartVideoPoseAnalysisRequest) => Promise<StartVideoPoseAnalysisResponse>;
  getVideoPoseAnalysisStatus: (mediaSetId: string) => Promise<VideoPoseAnalysisStatusResponse>;
  getCompletedPoseAnalysisMediaSets: (request?: GetCompletedPoseAnalysisRequest) => Promise<CompletedPoseAnalysisApiResponse>;
  getPoseAnalysisDetail: (mediaSetId: string) => Promise<PoseAnalysisDetailApiResponse>;
};

class VideoAnalysisService implements IVideoAnalysisService {
  // 비디오 자세 분석 시작
  async startVideoPoseAnalysis(request: StartVideoPoseAnalysisRequest): Promise<StartVideoPoseAnalysisResponse> {
    const response = await axiosHttpClient.post<{ success: boolean; data: StartVideoPoseAnalysisResponse }>(
      '/video-analysis/start-pose-analysis',
      request
    );
    return response.data;
  }

  // 비디오 자세 분석 상태 조회
  async getVideoPoseAnalysisStatus(mediaSetId: string): Promise<VideoPoseAnalysisStatusResponse> {
    const response = await axiosHttpClient.get<{ success: boolean; data: VideoPoseAnalysisStatusResponse }>(
      `/video-analysis/pose-analysis-status/${mediaSetId}`
    );
    return response.data;
  }

  // 완료된 자세 분석 미디어세트 조회
  async getCompletedPoseAnalysisMediaSets(request: GetCompletedPoseAnalysisRequest = {}): Promise<CompletedPoseAnalysisApiResponse> {
    const params = new URLSearchParams();
    
    if (request.limit !== undefined) params.append('limit', request.limit.toString());
    if (request.offset !== undefined) params.append('offset', request.offset.toString());
    if (request.mediaType) params.append('mediaType', request.mediaType);

    const response = await axiosHttpClient.get<CompletedPoseAnalysisApiResponse>(
      `/mediaSet/completed-pose-analysis?${params.toString()}`
    );
    
    return response;
  }

  // 자세 분석 상세 정보 조회
  async getPoseAnalysisDetail(mediaSetId: string): Promise<PoseAnalysisDetailApiResponse> {
    const response = await axiosHttpClient.get<PoseAnalysisDetailApiResponse>(
      `/mediaSet/pose-analysis-detail/${mediaSetId}`
    );
    return response;
  }
}

export const videoAnalysisService = new VideoAnalysisService();