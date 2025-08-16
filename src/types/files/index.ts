// MediaFile 타입 import
import type { MediaFile } from '../../services/mediaSetService/mediaSetService';

// 기본 파일 정보
export type FileInfo = {
  id: string
  name: string
  size: number
  type: string
  lastModified: number
}

// 업로드 요청 데이터
export type UploadInitRequest = {
  fileName: string
  contentType: string
  fileSize: number
}

// 업로드 응답 데이터
export type UploadInitResponse = {
  uploadUrl: string
  objectKey: string
  expiresIn: number
}

// 업로드 완료 요청
export type UploadCompleteRequest = {
  objectKey: string
  fileName: string
  fileSize: number
}

// 업로드 완료 응답
export type UploadCompleteResponse = {
  fileId: string
  accountId: string
  profileId: string
  objectKey: string
  fileName: string
  fileSize: number
  contentType: string
  uploadedAt: string
  status: 'active'
}

// 서버 파일 정보
export type ServerFile = {
  _id: string
  accountId: string
  profileId: string
  objectKey: string
  fileName: string
  fileSize: number
  originalSize?: number
  contentType: string
  uploadedAt: string
  status: 'active' | 'deleted'
  processedForBlazePose?: boolean
  compressionRatio?: string
  downloadUrl?: string
  thumbnailUrl?: string
}

// 파일 목록 응답
export type FileListResponse = {
  files: ServerFile[]
  totalCount: number
  hasMore: boolean
}

// 다운로드 URL 응답
export type DownloadUrlResponse = {
  downloadUrl: string
  expiresIn: number
}

// BlazePose Result는 blazePose/index.ts에서 import

// 이미지 가공 결과
export type ProcessedImage = {
  original: File
  processed: Blob
  size: number
  width: number
  height: number
}

// 타입 가드 헬퍼 함수들
export const isServerFile = (file: ServerFile | any): file is ServerFile => {
  return file && typeof file === 'object' && '_id' in file && 'accountId' in file;
}

export const isMediaFile = (file: any): file is MediaFile => {
  return file && typeof file === 'object' && 'originalKey' in file && !('_id' in file);
}

// 파일 ID 추출 헬퍼 함수
export const getFileId = (file: ServerFile | MediaFile | any): string => {
  if (isServerFile(file)) return file._id;
  if (isMediaFile(file)) return file.originalKey;
  return (file as any)?.fileName || '';
}
