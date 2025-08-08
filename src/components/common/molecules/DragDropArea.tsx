import React, { useState, useRef, useCallback } from 'react'
import { DragDropAreaProps } from '../../../types/files/components'

const DragDropArea: React.FC<DragDropAreaProps> = ({
  onFilesDrop,
  onDragOver,
  onDragLeave,
  className = '',
  disabled = false,
  children
}) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragOver(true)
      onDragOver?.()
    }
  }, [disabled, onDragOver])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragOver(false)
      onDragLeave?.()
    }
  }, [disabled, onDragLeave])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (disabled) return

    setIsDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    onFilesDrop(files)
  }, [disabled, onFilesDrop])

  const handleClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }, [disabled])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      onFilesDrop(files)
    }
  }, [onFilesDrop])

  return (
    <div
      className={`
        relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200
        ${isDragOver 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-300 hover:border-gray-400'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      {/* 드래그 오버 상태 표시 */}
      {isDragOver && (
        <div className="absolute inset-0 bg-blue-500 bg-opacity-10 rounded-lg flex items-center justify-center">
          <div className="text-blue-600 font-medium">
            파일을 여기에 놓으세요
          </div>
        </div>
      )}

      {/* 기본 콘텐츠 */}
      {children || (
        <div className="space-y-2">
          <div className="text-gray-400">
            <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium text-blue-600 hover:text-blue-500">
              파일을 클릭하여 선택
            </span>
            {' '}또는 드래그하여 놓기
          </div>
          <p className="text-xs text-gray-500">
            PNG, JPG, JPEG 파일 (최대 10MB)
          </p>
        </div>
      )}
    </div>
  )
}

export default DragDropArea
