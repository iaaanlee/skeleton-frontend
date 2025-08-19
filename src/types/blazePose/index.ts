// BlazePose 분석 요청
export type BlazePoseAnalysisRequest = {
  fileIds: string[]
}

// BlazePose 분석 응답
export type BlazePoseAnalysisResponse = {
  success: boolean
  data: {
    analysisId: string
    status: 'pending' | 'processing' | 'completed' | 'failed'
    estimatedTime?: number
    message?: string
  }
}

// BlazePose 분석 상태
export type BlazePoseStatus = {
  success: boolean
  data: {
    analysisId: string
    status: 'pending' | 'processing' | 'completed' | 'failed'
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
    status: 'completed' | 'failed'
    totalConfidence: number // 전체 평균 신뢰도
    analysisTime: number // 분석 소요 시간 (ms)
    fileResults: BlazePoseFileResult[]
    completedAt?: string
    error?: string
  }
}

// 개별 파일 분석 결과
export type BlazePoseFileResult = {
  fileId: string
  fileName: string
  landmarks: number[][]
  overlayImageUrl?: string // 기존 호환성을 위해 유지
  estimatedImageUrl?: string // 새로운 estimated 이미지 URL
  estimatedImageKey?: string // S3에서의 estimated 파일 경로
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
  confidence: number[]
  estimatedKeys: string[]
  estimatedImageUrls?: Array<{downloadUrl: string}> // pre-signed URL 배열 (expiresIn 제거)
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
