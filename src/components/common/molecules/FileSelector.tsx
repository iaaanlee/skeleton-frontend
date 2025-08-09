import React, { useState, useCallback } from 'react'
import { validateImageFile, compressImage, formatFileSize } from '../../../utils/imageCompression'
import DragDropArea from './DragDropArea'
import ImagePreview from './ImagePreview'

type FileSelectorProps = {
  multiple?: boolean
  disabled?: boolean
  onFilesSelect: (files: File[]) => void
  className?: string
}

export const FileSelector: React.FC<FileSelectorProps> = ({
  multiple = false,
  disabled = false,
  onFilesSelect,
  className = ''
}) => {
  const [previewFiles, setPreviewFiles] = useState<{ file: File; preview: string }[]>([])
  const [error, setError] = useState<string>('')

  // 파일 검증 및 처리
  const handleFilesSelect = useCallback(async (files: File[]) => {
    setError('')

    // 파일 검증
    const validFiles: File[] = []
    const errors: string[] = []

    for (const file of files) {
      const validation = validateImageFile(file)
      if (validation.isValid) {
        validFiles.push(file)
      } else {
        errors.push(`${file.name}: ${validation.error}`)
      }
    }

    if (errors.length > 0) {
      setError(errors.join('\n'))
      return
    }

    if (validFiles.length === 0) {
      setError('유효한 파일이 없습니다.')
      return
    }

    // 단일 파일만 허용하는 경우
    if (!multiple && validFiles.length > 1) {
      setError('하나의 파일만 선택할 수 있습니다.')
      return
    }

    // 미리보기 생성
    const previews = await Promise.all(
      validFiles.map(async (file) => {
        try {
          const compressed = await compressImage(file, { quality: 80 })
          const preview = URL.createObjectURL(compressed.processed)
          return { file, preview }
        } catch (error) {
          const preview = URL.createObjectURL(file)
          return { file, preview }
        }
      })
    )

    setPreviewFiles(previews)
    onFilesSelect(validFiles)
  }, [multiple, onFilesSelect])

  // 파일 제거
  const handleRemoveFile = useCallback((index: number) => {
    setPreviewFiles(prev => prev.filter((_, i) => i !== index))
  }, [])

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 드래그&드롭 영역 */}
      <DragDropArea
        onFilesDrop={handleFilesSelect}
        disabled={disabled}
        className="min-h-[200px]"
      />

      {/* 선택된 파일 미리보기 */}
      {previewFiles.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700">
            선택된 파일 ({previewFiles.length}개)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {previewFiles.map((preview, index) => (
              <div key={index} className="relative group">
                <ImagePreview
                  file={preview.file}
                  width={150}
                  height={150}
                  className="w-full h-32"
                />
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  <p className="font-medium truncate">{preview.file.name}</p>
                  <p>{formatFileSize(preview.file.size)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 오류 메시지 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-700 text-sm whitespace-pre-line">{error}</p>
        </div>
      )}
    </div>
  )
}
