import { useCallback } from 'react'
import { useInitUpload, useCompleteUpload, useUploadToS3 } from '../services/fileService'
import { QUERY_KEYS } from '../services/common/queryKey'
import { useUploadBase } from './useUploadBase'

type UseFileUploadConfig = {
  onSuccess?: () => void
  onError?: (error: string) => void
}

export const useFileUpload = (config: UseFileUploadConfig = {}) => {
  const uploadBase = useUploadBase(config)
  const initUploadMutation = useInitUpload()
  const completeUploadMutation = useCompleteUpload()
  const uploadToS3Mutation = useUploadToS3()

  // 개별 파일 업로드
  const uploadFiles = useCallback(async (files: File[]) => {
    if (files.length === 0) return

    // 업로드 시작 체크
    if (!uploadBase.startUpload()) return

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        // 진행률 업데이트
        const fileProgress = ((i + 1) / files.length) * 100
        uploadBase.updateProgress(fileProgress)

        // 1. 업로드 초기화 (Pre-signed URL 발급)
        const uploadInitResponse = await initUploadMutation.mutateAsync({
          fileName: file.name,
          contentType: file.type,
          fileSize: file.size
        })

        // 2. S3에 직접 업로드
        await uploadToS3Mutation.mutateAsync({
          uploadUrl: uploadInitResponse.uploadUrl,
          file: file as any
        })

        // 3. 업로드 완료 알림
        await completeUploadMutation.mutateAsync({
          objectKey: uploadInitResponse.objectKey,
          fileName: file.name,
          fileSize: file.size
        })
      }

      // 업로드 성공 처리
      uploadBase.handleSuccess([[...QUERY_KEYS.files, 'list']])

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '업로드 중 오류가 발생했습니다.'
      uploadBase.handleError(errorMessage)
    }
  }, [uploadBase, initUploadMutation, uploadToS3Mutation, completeUploadMutation])

  return {
    ...uploadBase,
    uploadFiles
  }
}
