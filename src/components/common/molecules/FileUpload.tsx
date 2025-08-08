import React, { useState, useCallback } from 'react'
import { FileUploadProps } from '../../../types/files/components'
import { validateImageFile, compressImage, formatFileSize } from '../../../utils/imageCompression'
import { useInitUpload, useCompleteUpload, useUploadToS3 } from '../../../services/fileService'
import { useAccountAuth } from '../../../contexts/AccountAuthContext'
import DragDropArea from './DragDropArea'
import ProgressBar from './ProgressBar'
import ImagePreview from './ImagePreview'

const FileUpload: React.FC<FileUploadProps> = ({
  profileId,
  onUploadSuccess,
  onUploadError,
  onUploadProgress,
  multiple = false,
  accept = 'image/*',
  maxSize = 10 * 1024 * 1024, // 10MB
  className = '',
  disabled = false
}) => {
  const { token } = useAccountAuth()
  const initUploadMutation = useInitUpload()
  const completeUploadMutation = useCompleteUpload()
  const uploadToS3Mutation = useUploadToS3()
  
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [progress, setProgress] = useState(0)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewFiles, setPreviewFiles] = useState<{ file: File; preview: string }[]>([])
  const [error, setError] = useState<string>('')

  // 파일 검증 및 처리
  const handleFilesSelect = useCallback(async (files: File[]) => {
    setError('')
    setUploadStatus('idle')

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
      onUploadError?.(errors.join('\n'))
      return
    }

    if (validFiles.length === 0) {
      setError('유효한 파일이 없습니다.')
      onUploadError?.('유효한 파일이 없습니다.')
      return
    }

    // 단일 파일만 허용하는 경우
    if (!multiple && validFiles.length > 1) {
      setError('하나의 파일만 선택할 수 있습니다.')
      onUploadError?.('하나의 파일만 선택할 수 있습니다.')
      return
    }

    setSelectedFiles(validFiles)

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
  }, [multiple, onUploadError])

  // 파일 업로드
  const handleUpload = useCallback(async () => {
    if (selectedFiles.length === 0 || !token) return

    setUploadStatus('uploading')
    setProgress(0)

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]
        
        // 진행률 업데이트
        const fileProgress = ((i + 1) / selectedFiles.length) * 100
        setProgress(fileProgress)
        onUploadProgress?.(fileProgress)

        // 파일 압축
        const compressed = await compressImage(file, { quality: 80 })
        
        // 토큰에서 userId 추출
        const payload = JSON.parse(atob(token.split('.')[1]))
        const userId = payload.sub || payload.id || payload.accountId

        // 업로드 초기화 (Pre-signed URL 발급)
        const initResponse = await initUploadMutation.mutateAsync({
          profileId,
          fileName: file.name,
          fileSize: compressed.processed.size,
          contentType: file.type
        })

        // S3에 직접 업로드
        await uploadToS3Mutation.mutateAsync({
          uploadUrl: initResponse.uploadUrl,
          file: compressed.processed as File
        })

        // 업로드 완료 알림
        const completeResponse = await completeUploadMutation.mutateAsync({
          profileId,
          objectKey: initResponse.objectKey,
          fileName: file.name,
          fileSize: compressed.processed.size
        })

        // 성공 콜백
        onUploadSuccess?.({
          _id: completeResponse.fileId,
          userId,
          profileId,
          objectKey: initResponse.objectKey,
          fileName: file.name,
          fileSize: compressed.processed.size,
          contentType: file.type,
          uploadedAt: new Date().toISOString(),
          status: 'active'
        })
      }

      setUploadStatus('success')
      setProgress(100)
      
      // 상태 초기화
      setTimeout(() => {
        setSelectedFiles([])
        setPreviewFiles([])
        setUploadStatus('idle')
        setProgress(0)
      }, 2000)

    } catch (error) {
      console.error('Upload error:', error)
      setError(error instanceof Error ? error.message : '업로드에 실패했습니다.')
      setUploadStatus('error')
      onUploadError?.(error instanceof Error ? error.message : '업로드에 실패했습니다.')
    }
  }, [selectedFiles, token, profileId, initUploadMutation, completeUploadMutation, uploadToS3Mutation, onUploadSuccess, onUploadError, onUploadProgress])

  // 파일 제거
  const handleRemoveFile = useCallback((index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    setPreviewFiles(prev => prev.filter((_, i) => i !== index))
  }, [])

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 드래그&드롭 영역 */}
      {uploadStatus === 'idle' && (
        <DragDropArea
          onFilesDrop={handleFilesSelect}
          disabled={disabled}
          className="min-h-[200px]"
        />
      )}

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

      {/* 업로드 버튼 */}
      {selectedFiles.length > 0 && uploadStatus === 'idle' && (
        <button
          onClick={handleUpload}
          disabled={disabled}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {selectedFiles.length}개 파일 업로드
        </button>
      )}

      {/* 업로드 진행률 */}
      {uploadStatus === 'uploading' && (
        <div className="space-y-3">
          <div className="flex items-center justify-center">
            <ProgressBar
              progress={progress}
              type="circular"
              size={80}
              showPercentage={true}
            />
          </div>
          <p className="text-center text-sm text-gray-600">
            파일을 업로드하고 있습니다...
          </p>
        </div>
      )}

      {/* 성공 메시지 */}
      {uploadStatus === 'success' && (
        <div className="text-center py-4">
          <div className="text-green-500 text-lg font-medium">
            업로드 완료!
          </div>
          <p className="text-sm text-gray-600 mt-1">
            파일이 성공적으로 업로드되었습니다.
          </p>
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

export default FileUpload
