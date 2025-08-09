import React from 'react'

type UploadButtonProps = {
  fileCount: number
  disabled?: boolean
  onClick: () => void
  className?: string
}

export const UploadButton: React.FC<UploadButtonProps> = ({
  fileCount,
  disabled = false,
  onClick,
  className = ''
}) => {
  if (fileCount === 0) return null

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
    >
      {fileCount}개 파일 업로드
    </button>
  )
}
