// API 공통 응답 타입
export type ApiResponse<T = any> = {
  success: boolean
  data?: T
  error?: string
}

// 파일 목록 조회 요청
export type GetFileListRequest = {
  profileId: string
  limit?: number
  offset?: number
}

// 파일 삭제 요청
export type DeleteFileRequest = {
  fileId: string
  profileId: string
}

// 다운로드 URL 요청
export type GetDownloadUrlRequest = {
  fileId: string
  profileId: string
}

// BlazePose 분석 요청
export type BlazePoseAnalysisRequest = {
  imageData: string // base64 encoded image
}

// 이미지 가공 요청
export type ImageProcessingRequest = {
  file: File
  targetWidth?: number
  targetHeight?: number
  quality?: number
  format?: 'jpeg' | 'png' | 'webp'
}

// 파일 업로드 초기화 요청
export type UploadInitRequest = {
  fileName: string
  fileSize: number
  contentType: string
  accountId: string
  profileId: string
}

// 파일 업로드 완료 요청
export type UploadCompleteRequest = {
  fileId: string
  objectKey: string
  thumbnailKey?: string
}
