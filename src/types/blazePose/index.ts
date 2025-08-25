import { BlazePoseApiStatus, AnalysisResultStatus } from '../common/status-types';

// BlazePose 분석 요청
export type BlazePoseAnalysisRequest = {
  fileIds: string[]
}

// BlazePose 분석 응답
export type BlazePoseAnalysisResponse = {
  success: boolean
  data: {
    analysisId: string
    status: BlazePoseApiStatus
    estimatedTime?: number
    message?: string
  }
}

// BlazePose 분석 상태
export type BlazePoseStatus = {
  success: boolean
  data: {
    analysisId: string
    status: BlazePoseApiStatus
    progress?: number // 0-100
    estimatedTime?: number
    message?: string
    error?: string
  }
}

// BlazePose 분석 결과
export type BlazePoseResult = {
  success: boolean
  data: {
    analysisId: string
    status: AnalysisResultStatus
    totalConfidence: number // 전체 평균 신뢰도
    analysisTime: number // 분석 소요 시간 (ms)
    fileResults: BlazePoseFileResult[]
    completedAt?: string
    error?: string
  }
}

// 통일된 estimated 이미지 타입
export type EstimatedImage = {
  key: string           // S3 키 (영구 저장)
  url?: string         // Pre-signed URL (런타임 생성, 캐시 가능)
  expiresAt?: string   // URL 만료 시간
}

// 개별 파일 분석 결과 (통일된 구조)
export type BlazePoseFileResult = {
  fileId: string
  fileName: string
  landmarks: number[][]
  overlayImageUrl?: string // 기존 호환성을 위해 유지 (deprecated)
  estimatedImages: EstimatedImage[] // 통일된 estimated 이미지 배열
  confidence: number
  analysisTime: number
  error?: string
}

// 실제 백엔드 데이터 구조에 맞는 타입
export type BlazePoseLandmark = {
  x: number
  y: number
  z: number
  visibility: number
}

export type BlazePoseFileResultFromBackend = {
  fileIndex: number
  fileName: string
  landmarks: BlazePoseLandmark[] // 단일 배열 (정규화된 이미지 좌표)
  worldLandmarks?: BlazePoseLandmark[] // 실제 3D 좌표 (미터 단위)
  // 🗑️ confidence 배열 완전 제거 - landmarks[i].visibility 사용
  estimatedKeys: string[] // deprecated - 하위 호환성용
  estimatedImages: EstimatedImage[] // 통일된 estimated 이미지 구조
  estimatedImageUrls?: Array<{downloadUrl: string}> // deprecated - 하위 호환성용
}

export type BlazePoseResultsFromBackend = {
  totalFiles: number
  results: BlazePoseFileResultFromBackend[]
  completedAt: string
}

// 관절 타입 정의
export type JointType = 
  | 'nose' | 'left_eye' | 'right_eye' | 'left_ear' | 'right_ear'
  | 'left_shoulder' | 'right_shoulder' | 'left_elbow' | 'right_elbow'
  | 'left_wrist' | 'right_wrist' | 'left_hip' | 'right_hip'
  | 'left_knee' | 'right_knee' | 'left_ankle' | 'right_ankle'

// 관절 좌표
export type JointCoordinate = {
  x: number
  y: number
  confidence: number
  jointType: JointType
}
