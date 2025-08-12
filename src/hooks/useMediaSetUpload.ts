import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useInitUpload, useCompleteUpload, useUploadToS3 } from '../services/mediaSetService'
import { mediaSetService } from '../services/mediaSetService/mediaSetService'
import { useAccountAuth } from '../contexts/AccountAuthContext'
import { QUERY_KEYS } from '../services/common/queryKey'
import { validateAuthState, extractAccountIdFromToken } from '../utils/auth'

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'

export const useMediaSetUpload = (profileId: string) => {
  const navigate = useNavigate()
  const { token } = useAccountAuth()
  const queryClient = useQueryClient()
  const initUploadMutation = useInitUpload()
  const completeUploadMutation = useCompleteUpload()
  const uploadToS3Mutation = useUploadToS3()
  
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string>('')

  // 토큰에서 accountId 추출 (토큰이 없거나 유효하지 않으면 null 반환)
  const accountId = token ? extractAccountIdFromToken(token) : null

  // 파일 업로드
  const uploadFiles = useCallback(async (files: File[]) => {
    if (files.length === 0) return

    // 인증 상태 확인
    if (!validateAuthState(token, navigate)) {
      return
    }

    if (!accountId) {
      console.error('Account ID not found in token')
      return
    }

    setUploadStatus('uploading')
    setProgress(0)
    setError('')

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
        setProgress(initProgress)

        // 업로드 초기화
        const uploadInitResponse = await initUploadMutation.mutateAsync({
          profileId,
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
        setProgress(uploadProgress)

        await uploadToS3Mutation.mutateAsync({
          uploadUrl: uploadInfo.uploadUrl,
          file: uploadInfo.file as any
        })
      }

      // 3단계: 모든 파일을 하나의 미디어 세트로 생성
      setProgress(80)
      
      // 여러 파일을 한 번에 미디어 세트로 생성
      const filesData = uploadInfos.map(uploadInfo => ({
        objectKey: uploadInfo.objectKey,
        fileName: uploadInfo.file.name,
        fileSize: uploadInfo.file.size
      }))

      await mediaSetService.completeUploadMultiple({
        profileId,
        files: filesData
      })

      // 업로드 성공 후 상태 초기화
      setProgress(100)
      setUploadStatus('success')
      
      // 미디어 세트 목록 쿼리 무효화하여 자동 갱신
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.mediaSets, 'list', accountId, profileId]
      })

      // 3초 후 idle 상태로 복귀
      setTimeout(() => {
        setUploadStatus('idle')
        setProgress(0)
        setError('')
      }, 3000)

    } catch (error) {
      console.error('Upload error:', error)
      setUploadStatus('error')
      setError(error instanceof Error ? error.message : '업로드 중 오류가 발생했습니다.')
    }
  }, [token, accountId, profileId, navigate, initUploadMutation, uploadToS3Mutation, queryClient])

  return {
    uploadStatus,
    progress,
    error,
    uploadFiles
  }
}
