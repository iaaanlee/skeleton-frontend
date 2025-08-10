// File 관련 API service 정의
import { AxiosHttpClient } from "../common/axiosHttpClient";
import { backendHttpClient } from "../common/httpClient";
import { 
  UploadInitRequest, 
  UploadInitResponse,
  UploadCompleteRequest,
  UploadCompleteResponse,
  FileListResponse,
  DownloadUrlResponse
} from "../../types/files";

type IFileService = {
  initUpload: (request: UploadInitRequest) => Promise<UploadInitResponse>;
  completeUpload: (request: UploadCompleteRequest) => Promise<UploadCompleteResponse>;
  getFileList: (userId: string, profileId: string) => Promise<FileListResponse>;
  getDownloadUrl: (fileId: string, profileId: string) => Promise<DownloadUrlResponse>;
  deleteFile: (fileId: string, profileId: string) => Promise<void>;
  uploadToS3: (uploadUrl: string, file: File) => Promise<void>;
};

class FileService implements IFileService { 
  constructor(private httpClient: AxiosHttpClient) {}

  // 파일 업로드 초기화 (Pre-signed URL 생성)
  async initUpload(request: UploadInitRequest) {
    const { data } = await this.httpClient.request<{ success: boolean; data: UploadInitResponse }>({
      method: 'POST',
      url: '/files/upload/init',
      data: request,
    })
    return data.data
  }

  // 파일 업로드 완료
  async completeUpload(request: UploadCompleteRequest) {
    const { data } = await this.httpClient.request<{ success: boolean; data: UploadCompleteResponse }>({
      method: 'POST',
      url: '/files/upload/complete',
      data: request,
    })
    return data.data
  }

  // 파일 목록 조회
  async getFileList(userId: string, profileId: string) {
    const { data } = await this.httpClient.request<{ success: boolean; data: FileListResponse }>({
      method: 'GET',
      url: '/files/list',
      params: { userId, profileId }
    })
    return data.data
  }

  // 파일 다운로드 URL 생성
  async getDownloadUrl(fileId: string, profileId: string) {
    const { data } = await this.httpClient.request<{ success: boolean; data: DownloadUrlResponse }>({
      method: 'GET',
      url: `/files/${fileId}/download`,
      params: { profileId }
    })
    return data.data
  }

  // 파일 삭제
  async deleteFile(fileId: string, profileId: string) {
    const { data } = await this.httpClient.request<void>({
      method: 'DELETE',
      url: `/files/${fileId}`,
      params: { profileId }
    })
    return data
  }

  // S3에 직접 파일 업로드 (Pre-signed URL 사용)
  async uploadToS3(uploadUrl: string, file: File): Promise<void> {
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
        'Content-Length': file.size.toString()
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to upload file to S3: ${response.statusText}`)
    }
  }
}

export const fileService = new FileService(backendHttpClient);
