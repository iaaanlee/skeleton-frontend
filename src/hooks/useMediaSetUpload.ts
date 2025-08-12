import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useInitUpload, useCompleteUpload, useUploadToS3 } from '../services/mediaSetService'
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
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        // 진행률 업데이트
        const fileProgress = ((i + 1) / files.length) * 100
        setProgress(fileProgress)

        // 1. 업로드 초기화 (Pre-signed URL 발급)
        const uploadInitResponse = await initUploadMutation.mutateAsync({
          profileId,
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
          profileId,
          objectKey: uploadInitResponse.objectKey,
          fileName: file.name,
          fileSize: file.size
        })
      }

      // 업로드 성공 후 상태 초기화
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
  }, [token, accountId, profileId, navigate, initUploadMutation, uploadToS3Mutation, completeUploadMutation, queryClient])

  return {
    uploadStatus,
    progress,
    error,
    uploadFiles
  }
}
