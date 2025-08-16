// Pre-signed URL 공용 서비스
import { AxiosHttpClient } from "../common/axiosHttpClient";
import { backendHttpClient } from "../common/httpClient";

export type PreSignedUploadInitRequest = {
  fileName: string;
  contentType: string;
  fileSize: number;
}

export type PreSignedUploadInitResponse = {
  uploadUrl: string;
  objectKey: string;
  expiresIn: number;
}

export type S3UploadOptions = {
  onProgress?: (progress: number) => void;
  signal?: AbortSignal;
}

type IPreSignedUrlService = {
  // S3 직접 업로드
  uploadToS3: (uploadUrl: string, file: File, options?: S3UploadOptions) => Promise<void>;
}

class PreSignedUrlService implements IPreSignedUrlService {
  constructor(private httpClient: AxiosHttpClient) {}

  // S3에 직접 파일 업로드 (Pre-signed URL 사용)
  async uploadToS3(uploadUrl: string, file: File, options?: S3UploadOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // 진행률 추적
      if (options?.onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            options.onProgress!(progress);
          }
        });
      }

      // 중단 신호 처리
      if (options?.signal) {
        options.signal.addEventListener('abort', () => {
          xhr.abort();
          reject(new Error('Upload aborted'));
        });
      }

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Failed to upload file to S3: ${xhr.statusText}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Network error during S3 upload'));
      });

      xhr.open('PUT', uploadUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });
  }
}

export const preSignedUrlService = new PreSignedUrlService(backendHttpClient);