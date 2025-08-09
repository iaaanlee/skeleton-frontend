import { ServerFile } from './index'

// 파일 업로드 컴포넌트 Props
export type FileUploadProps = {
  profileId: string
  onUploadSuccess?: (file: ServerFile) => void
  onUploadError?: (error: string) => void
  onUploadProgress?: (progress: number) => void
  multiple?: boolean
  accept?: string
  maxSize?: number
  className?: string
  disabled?: boolean
}

// 파일 목록 컴포넌트 Props
export type FileListProps = {
  profileId: string
  onFileSelect?: (file: ServerFile) => void
  onFileDelete?: (fileId: string) => void
  onFileDownload?: (file: ServerFile) => void
  onAnalysisStart?: (fileIds: string[]) => void
  className?: string
  showThumbnails?: boolean
  showFileInfo?: boolean
}

// 프로그레스 바 Props
export type ProgressBarProps = {
  progress: number // 0-100
  type?: 'circular' | 'linear'
  size?: number
  className?: string
  showPercentage?: boolean
  color?: string
}

// 드래그&드롭 영역 Props
export type DragDropAreaProps = {
  onFilesDrop: (files: File[]) => void
  onDragOver?: () => void
  onDragLeave?: () => void
  className?: string
  disabled?: boolean
  children?: React.ReactNode
}

// 이미지 미리보기 Props
export type ImagePreviewProps = {
  file: File | string // File 객체 또는 URL
  className?: string
  width?: number
  height?: number
  alt?: string
}

// 파일 정보 표시 Props
export type FileInfoProps = {
  file: ServerFile
  className?: string
  showSize?: boolean
  showDate?: boolean
  showActions?: boolean
}

// 파일 아이템 Props
export type FileItemProps = {
  file: ServerFile
  onSelect?: (file: ServerFile) => void
  onDelete?: (fileId: string) => void
  onDownload?: (file: ServerFile) => void
  isSelected?: boolean
  className?: string
}

// 파일 목록 헤더 Props
export type FileListHeaderProps = {
  totalCount: number
  sortBy?: 'date' | 'name' | 'size'
  onSortChange?: (sortBy: 'date' | 'name' | 'size') => void
  className?: string
}

// 파일 그리드 Props
export type FileGridProps = {
  files: ServerFile[]
  onFileSelect?: (file: ServerFile) => void
  onFileDelete?: (fileId: string) => void
  onFileDownload?: (file: ServerFile) => void
  selectedFiles?: string[]
  className?: string
}
