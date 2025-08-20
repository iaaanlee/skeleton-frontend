import { useMutation } from '@tanstack/react-query';
import { 
  videoUploadService, 
  VideoUploadInitRequest, 
  VideoUploadCompleteRequest 
} from './videoUploadService';

// 비디오 업로드 초기화 (Pre-signed URL 생성)
export const useVideoUploadInit = () => {
  return useMutation({
    mutationFn: (request: VideoUploadInitRequest) => 
      videoUploadService.generateUploadUrl(request),
  });
};

// 비디오 파일 S3 업로드
export const useVideoFileUpload = () => {
  return useMutation({
    mutationFn: ({ file, uploadUrl }: { file: File; uploadUrl: string }) => 
      videoUploadService.uploadVideoFile(file, uploadUrl),
  });
};

// 비디오 업로드 완료 처리 (타임아웃 연장)
export const useVideoUploadComplete = () => {
  return useMutation({
    mutationFn: (request: VideoUploadCompleteRequest) => 
      videoUploadService.completeVideoUpload(request),
  });
};