// Video upload service for process-video functionality
import { AxiosHttpClient } from "../common/axiosHttpClient";
import { backendHttpClient } from "../common/httpClient";

export type VideoUploadInitRequest = {
  fileName: string;
  fileSize: number;
  contentType: string;
};

export type VideoUploadInitResponse = {
  uploadUrl: string;
  objectKey: string;
  expiresIn: number;
};

export type VideoUploadCompleteRequest = {
  objectKey: string;
  fileName: string;
  fileSize: number;
  poseDescription: string;
  startTime: number;
  endTime: number;
};

export type VideoUploadCompleteResponse = {
  mediaSetId: string;
  accountId: string;
  profileId: string;
  name: string;
  poseDescription: string;
  mediaType: string;
  files: Array<{
    originalKey: string;
    thumbnailKey: string;
    fileName: string;
    fileSize: number;
    contentType: string;
    videoInfo: {
      startTime: number;
      endTime: number;
      duration: number;
      frameInterval: number;
      frameCount: number;
    };
    extractedFrames: Array<{
      frameIndex: number;
      frameTime: number;
      frameKey: string;
    }>;
  }>;
  createdAt: string;
  updatedAt: string;
};

type IVideoUploadService = {
  generateUploadUrl: (request: VideoUploadInitRequest) => Promise<VideoUploadInitResponse>;
  uploadVideoFile: (file: File, uploadUrl: string) => Promise<void>;
  completeVideoUpload: (request: VideoUploadCompleteRequest) => Promise<VideoUploadCompleteResponse>;
};

class VideoUploadService implements IVideoUploadService {
  constructor(private httpClient: AxiosHttpClient) {}

  // 비디오 파일 업로드를 위한 Pre-signed URL 생성
  async generateUploadUrl(request: VideoUploadInitRequest) {
    const { data } = await this.httpClient.request<{ success: boolean; data: VideoUploadInitResponse }>({
      method: 'POST',
      url: '/mediaSet/upload/init',
      data: request,
    });
    return data.data;
  }

  // S3에 비디오 파일 직접 업로드
  async uploadVideoFile(file: File, uploadUrl: string) {
    await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });
  }

  // 비디오 업로드 완료 처리 (트리밍 정보 포함)
  async completeVideoUpload(request: VideoUploadCompleteRequest) {
    const { data } = await this.httpClient.request<{ success: boolean; data: VideoUploadCompleteResponse }>({
      method: 'POST',
      url: '/mediaSet/upload/video-complete',
      data: request,
      timeout: 60000, // 60초 타임아웃 (비디오 처리 시간 고려)
    });
    return data.data;
  }
}

export const videoUploadService = new VideoUploadService(backendHttpClient);