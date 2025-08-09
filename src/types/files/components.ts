// 파일 업로드 컴포넌트 Props
export type FileUploadProps = {
  profileId: string
  multiple?: boolean
  className?: string
  disabled?: boolean
}

// 파일 선택 컴포넌트 Props
export type FileSelectorProps = {
  multiple?: boolean
  disabled?: boolean
  onFilesSelect: (files: File[]) => void
  className?: string
}

// 업로드 진행 상태 컴포넌트 Props
export type UploadProgressProps = {
  status: 'idle' | 'uploading' | 'success' | 'error'
  progress: number
  error?: string
  className?: string
}

// 업로드 버튼 컴포넌트 Props
export type UploadButtonProps = {
  fileCount: number
  disabled?: boolean
  onClick: () => void
  className?: string
}

// 파일 목록 컴포넌트 Props
export type FileListProps = {
  profileId: string
  className?: string
  showThumbnails?: boolean
  showFileInfo?: boolean
}

// 선택된 파일 액션 바 컴포넌트 Props
export type SelectedFilesActionBarProps = {
  selectedCount: number
  onAnalysisStart: () => void
  onDownloadSelected: () => void
  onDeleteSelected: () => void
  isAnalyzing?: boolean
  className?: string
}

// 파일 목록 상태 컴포넌트 Props
export type FileListStatusProps = {
  isLoading?: boolean
  error?: any
  className?: string
}

// 파일 그리드 컴포넌트 Props
export type FileGridProps = {
  files: any[]
  onFileSelect: (file: any) => void
  onFileDelete: (fileId: string) => void
  onFileDownload: (file: any) => void
  selectedFiles: string[]
  className?: string
}

// 파일 아이템 컴포넌트 Props
export type FileItemProps = {
  file: any
  isSelected?: boolean
  onSelect?: (file: any) => void
  onDelete?: (fileId: string) => void
  onDownload?: (file: any) => void
  showThumbnail?: boolean
  showInfo?: boolean
  className?: string
}

// 파일 목록 헤더 컴포넌트 Props
export type FileListHeaderProps = {
  totalCount: number
  sortBy?: 'date' | 'name' | 'size'
  onSortChange?: (sortBy: 'date' | 'name' | 'size') => void
  className?: string
}

// 드래그 드롭 영역 컴포넌트 Props
export type DragDropAreaProps = {
  onFilesDrop: (files: File[]) => void
  onDragOver?: () => void
  onDragLeave?: () => void
  disabled?: boolean
  className?: string
  children?: React.ReactNode
}

// 이미지 미리보기 컴포넌트 Props
export type ImagePreviewProps = {
  file: File | string
  width?: number
  height?: number
  className?: string
  alt?: string
}

// 진행률 바 컴포넌트 Props
export type ProgressBarProps = {
  progress: number
  type?: 'linear' | 'circular'
  size?: number
  showPercentage?: boolean
  color?: string
  className?: string
}
