// MediaSet 관련 타입 정의

// S3 경로 정보
export type S3Path = {
  bucket: string
  key: string
  region: string
}

// 비디오 정보 (비디오 파일에만 적용)
export type VideoInfo = {
  startTime: number
  endTime: number
  duration: number
  frameCount: number
}

// 미디어 파일 정보
export type MediaFile = {
  originalKey: string
  thumbnailKey?: string
  preProcessedKeys: string[]
  estimatedKeys: string[]
  fileName: string
  fileSize: number
  originalSize: number
  contentType: string
  processedForBlazePose: boolean
  compressionRatio: string
  fileHash: string
  s3Path: S3Path
  fileType: 'media_set_file'
  uploadedAt: string
  videoInfo?: VideoInfo
}

// 미디어 세트
export type MediaSet = {
  _id: string
  accountId: string
  profileId: string
  name: string
  files: MediaFile[]
  status: 'active' | 'deleted'
  mediaType: 'image' | 'video'
  poseDescription?: string
  thumbnailUrls?: string[]
  createdAt: string
  updatedAt: string
}

// 분석 작업 단계 정보
export type AnalysisStep = {
  step: string
  completedAt: string
  description: string
}

// 분석 작업 시도 로그
export type AnalysisAttempt = {
  status: string
  timestamp: string
  reason: string
}

// 분석 작업 (MongoDB 스키마에 맞춤)
export type AnalysisJob = {
  _id: string
  accountId: string
  profileId: string
  mediaSetId: string
  status: string
  message: string
  completedSteps: AnalysisStep[]
  attemptLog: AnalysisAttempt[]
  startedAt: string
  completedAt?: string
  createdAt: string
  updatedAt: string
  progress: number
}

// 중복 분석 체크 응답
export type DuplicateAnalysisCheckResponse = {
  hasDuplicate: boolean
  duplicateAnalysis: AnalysisJob | null
  duplicateFiles: MediaFile[]
}