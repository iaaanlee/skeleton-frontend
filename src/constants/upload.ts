// 파일 크기 제한 (10MB)
export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

// 지원 이미지 형식
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png'
] as const

// 지원 파일 확장자
export const ALLOWED_FILE_EXTENSIONS = [
  '.jpg',
  '.jpeg',
  '.png'
] as const

// 업로드 상태
export const UPLOAD_STATUS = {
  IDLE: 'idle',
  UPLOADING: 'uploading',
  SUCCESS: 'success',
  ERROR: 'error'
} as const

// 프로그레스 바 타입
export const PROGRESS_TYPE = {
  CIRCULAR: 'circular',
  LINEAR: 'linear'
} as const

// BlazePose용 이미지 가공 상수
export const BLAZEPOSE_IMAGE_CONFIG = {
  RESIZE_WIDTH: 640,
  RESIZE_HEIGHT: 640,
  IMAGE_QUALITY: 90,
  FORMAT: 'jpeg' as const
} as const

// 이미지 압축 옵션
export const IMAGE_COMPRESSION = {
  QUALITY: 80,
  MAX_WIDTH: 1920,
  MAX_HEIGHT: 1080,
  FORMAT: 'jpeg' as const
} as const

// 썸네일 설정
export const THUMBNAIL_CONFIG = {
  WIDTH: 200,
  HEIGHT: 200,
  QUALITY: 80,
  FORMAT: 'jpeg' as const
} as const
