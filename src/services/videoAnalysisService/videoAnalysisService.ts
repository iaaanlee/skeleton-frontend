import { axiosHttpClient } from '../common/axiosHttpClient';

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
  status: 'not_found' | 'pending' | 'blazepose_processing' | 'blazepose_completed' | 'failed' | 'blazepose_server_failed' | 'blazepose_pose_failed';
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

type IVideoAnalysisService = {
  startVideoPoseAnalysis: (request: StartVideoPoseAnalysisRequest) => Promise<StartVideoPoseAnalysisResponse>;
  getVideoPoseAnalysisStatus: (mediaSetId: string) => Promise<VideoPoseAnalysisStatusResponse>;
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
}

export const videoAnalysisService = new VideoAnalysisService();