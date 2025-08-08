// 파일 검증 결과
export type FileValidationResult = {
  isValid: boolean
  error?: string
}

// 이미지 압축 옵션
export type ImageCompressionOptions = {
  quality?: number // 0-100
  maxWidth?: number
  maxHeight?: number
  format?: 'jpeg' | 'png' | 'webp'
}

// BlazePose용 이미지 가공 옵션
export type BlazePoseImageOptions = {
  width: number
  height: number
  quality: number
  format: 'jpeg'
}

// 드래그&드롭 이벤트
export type DragDropEvent = {
  files: File[]
  isDragOver: boolean
}

// 파일 업로드 진행 상황
export type UploadProgress = {
  loaded: number
  total: number
  percentage: number
}

// 이미지 처리 결과
export type ImageProcessingResult = {
  original: File
  processed: Blob
  originalSize: number
  processedSize: number
  compressionRatio: number
  width: number
  height: number
}

// 파일 메타데이터
export type FileMetadata = {
  name: string
  size: number
  type: string
  lastModified: number
  width?: number
  height?: number
}
