// MediaSet 관련 API service 정의
import { AxiosHttpClient } from "../common/axiosHttpClient";
import { backendHttpClient } from "../common/httpClient";
import { preSignedUrlService } from "../preSignedUrlService";

export type MediaSet = {
  _id: string;
  accountId: string;
  profileId: string;
  name?: string;
  poseDescription?: string;
  mediaType?: 'image' | 'video';
  files: MediaFile[];
  thumbnailUrls?: string[];
  status: 'active' | 'deleted';
  createdAt: string;
  updatedAt: string;
}

export type VideoInfo = {
  startTime: number;
  endTime: number;
  duration: number;
  frameCount: number;
}

export type MediaFile = {
  originalKey: string;
  thumbnailKey?: string;
  thumbnailUrl?: string; // 백엔드에서 생성하는 pre-signed URL
  preProcessedKeys: string[];
  estimatedImages: Array<{
    key: string;
    url?: string;
    expiresAt?: string;
  }>;
  fileName: string;
  fileSize: number;
  originalSize: number;
  contentType: string;
  processedForBlazePose: boolean;
  compressionRatio: string;
  fileHash: string;
  s3Path: {
    bucket: string;
    key: string;
    region: string;
  };
  fileType: 'media_set_file';
  uploadedAt: string;
  videoInfo?: VideoInfo;
}

export type MediaSetListResponse = {
  mediaSets: MediaSet[];
  total: number;
}

export type CreateMediaSetRequest = {
  objectKey: string;
  fileName: string;
  fileSize: number;
}

export type CreateMediaSetResponse = {
  mediaSet: MediaSet;
}

export type UploadInitRequest = {
  fileName: string;
  fileSize: number;
  contentType: string;
}

export type UploadInitResponse = {
  uploadUrl: string;
  objectKey: string;
}

export type UploadCompleteRequest = {
  objectKey: string;
  fileName: string;
  fileSize: number;
}

export type UploadCompleteResponse = {
  mediaSet: MediaSet;
}

export type UploadCompleteMultipleRequest = {
  files: Array<{
    objectKey: string;
    fileName: string;
    fileSize: number;
  }>;
  poseDescription: string;
}

export type UploadCompleteMultipleResponse = {
  mediaSet: MediaSet;
}

type IMediaSetService = {
  initUpload: (request: UploadInitRequest) => Promise<UploadInitResponse>;
  createMediaSet: (request: CreateMediaSetRequest) => Promise<CreateMediaSetResponse>;
  completeUpload: (request: UploadCompleteRequest) => Promise<UploadCompleteResponse>;
  completeUploadMultiple: (request: UploadCompleteMultipleRequest) => Promise<UploadCompleteMultipleResponse>;
  getMediaSetList: (limit?: number, offset?: number, mediaType?: string) => Promise<MediaSetListResponse>;
  getMediaSetById: (mediaSetId: string) => Promise<MediaSet>;
  deleteMediaSet: (mediaSetId: string) => Promise<void>;
  uploadToS3: (uploadUrl: string, file: File) => Promise<void>;
};

class MediaSetService implements IMediaSetService { 
  constructor(private httpClient: AxiosHttpClient) {}

  // 파일 업로드 초기화 (Pre-signed URL 생성)
  async initUpload(request: UploadInitRequest) {
    const { data } = await this.httpClient.request<{ success: boolean; data: UploadInitResponse }>({
      method: 'POST',
      url: '/mediaSet/upload/init',
      data: request,
    })
    return data.data
  }

  // 미디어 세트 생성
  async createMediaSet(request: CreateMediaSetRequest) {
    const { data } = await this.httpClient.request<{ success: boolean; data: CreateMediaSetResponse }>({
      method: 'POST',
      url: '/mediaSet/create',
      data: request,
    })
    return data.data
  }

  // 파일 업로드 완료
  async completeUpload(request: UploadCompleteRequest) {
    const { data } = await this.httpClient.request<{ success: boolean; data: UploadCompleteResponse }>({
      method: 'POST',
      url: '/mediaSet/upload/complete',
      data: request,
    })
    return data.data
  }

  // 여러 파일 업로드 완료 (하나의 미디어 세트로)
  async completeUploadMultiple(request: UploadCompleteMultipleRequest) {
    const { data } = await this.httpClient.request<{ success: boolean; data: UploadCompleteMultipleResponse }>({
      method: 'POST',
      url: '/mediaSet/upload/complete-multiple',
      data: request,
    })
    return data.data
  }

  // 미디어 세트 목록 조회
  async getMediaSetList(limit: number = 20, offset: number = 0, mediaType?: string) {
    const params: { limit: number; offset: number; mediaType?: string } = { limit, offset };
    if (mediaType) {
      params.mediaType = mediaType;
    }
    
    const { data } = await this.httpClient.request<{ success: boolean; data: MediaSetListResponse }>({
      method: 'GET',
      url: '/mediaSet/list',
      params
    })
    return data.data
  }

  // 미디어 세트 상세 조회
  async getMediaSetById(mediaSetId: string) {
    const { data } = await this.httpClient.request<{ success: boolean; data: MediaSet }>({
      method: 'GET',
      url: `/mediaSet/by-id/${mediaSetId}`,
    })
    return data.data
  }

  // 미디어 세트 삭제
  async deleteMediaSet(mediaSetId: string) {
    const { data } = await this.httpClient.request<void>({
      method: 'DELETE',
      url: `/mediaSet/by-id/${mediaSetId}`
    })
    return data
  }

  // S3에 직접 파일 업로드 (Pre-signed URL 사용) - 공용 서비스 사용
  async uploadToS3(uploadUrl: string, file: File): Promise<void> {
    return preSignedUrlService.uploadToS3(uploadUrl, file)
  }
}

export const mediaSetService = new MediaSetService(backendHttpClient);
