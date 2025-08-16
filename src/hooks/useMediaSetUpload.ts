import { useCallback } from 'react'
import { useInitUpload, useUploadToS3 } from '../services/mediaSetService'
import { mediaSetService } from '../services/mediaSetService/mediaSetService'
import { QUERY_KEYS } from '../services/common/queryKey'
import { useUploadBase } from './useUploadBase'

type UseMediaSetUploadConfig = {
  onSuccess?: () => void
  onError?: (error: string) => void
}

export const useMediaSetUpload = (config: UseMediaSetUploadConfig = {}) => {
  const uploadBase = useUploadBase(config)
  const initUploadMutation = useInitUpload()
  const uploadToS3Mutation = useUploadToS3()

  // 미디어 세트 업로드 (여러 파일을 하나의 세트로)
  const uploadFiles = useCallback(async (files: File[]) => {
    if (files.length === 0) return

    // 업로드 시작 체크
    if (!uploadBase.startUpload()) return

    try {
      // 모든 파일의 업로드 정보를 저장할 배열
      const uploadInfos: Array<{
        uploadUrl: string;
        objectKey: string;
        file: File;
      }> = [];

      // 1단계: 모든 파일의 업로드 초기화 (Pre-signed URL 발급)
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        // 진행률 업데이트 (초기화 단계: 30%)
        const initProgress = (i / files.length) * 30
        uploadBase.updateProgress(initProgress)

        // 업로드 초기화
        const uploadInitResponse = await initUploadMutation.mutateAsync({
          fileName: file.name,
          contentType: file.type,
          fileSize: file.size
        })

        uploadInfos.push({
          uploadUrl: uploadInitResponse.uploadUrl,
          objectKey: uploadInitResponse.objectKey,
          file: file
        })
      }

      // 2단계: 모든 파일을 S3에 업로드
      for (let i = 0; i < uploadInfos.length; i++) {
        const uploadInfo = uploadInfos[i]
        
        // 진행률 업데이트 (S3 업로드 단계: 30% ~ 80%)
        const uploadProgress = 30 + (i / uploadInfos.length) * 50
        uploadBase.updateProgress(uploadProgress)

        await uploadToS3Mutation.mutateAsync({
          uploadUrl: uploadInfo.uploadUrl,
          file: uploadInfo.file
        })
      }

      // 3단계: 모든 파일을 하나의 미디어 세트로 생성
      uploadBase.updateProgress(80)
      
      // 여러 파일을 한 번에 미디어 세트로 생성
      const filesData = uploadInfos.map(uploadInfo => ({
        objectKey: uploadInfo.objectKey,
        fileName: uploadInfo.file.name,
        fileSize: uploadInfo.file.size
      }))

      await mediaSetService.completeUploadMultiple({
        files: filesData
      })

      // 업로드 성공 처리
      uploadBase.handleSuccess([[...QUERY_KEYS.mediaSets, 'list']])

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '업로드 중 오류가 발생했습니다.'
      uploadBase.handleError(errorMessage)
    }
  }, [uploadBase, initUploadMutation, uploadToS3Mutation])

  return {
    ...uploadBase,
    uploadFiles
  }
}
