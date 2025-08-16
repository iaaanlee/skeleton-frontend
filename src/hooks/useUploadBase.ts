import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useAccountAuth } from '../contexts/AccountAuthContext'
import { extractAccountIdFromToken } from '../utils/auth'

export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'

type UseUploadBaseConfig = {
  successTimeout?: number
  onSuccess?: () => void
  onError?: (error: string) => void
}

export const useUploadBase = (config: UseUploadBaseConfig = {}) => {
  const navigate = useNavigate()
  const { token } = useAccountAuth()
  const queryClient = useQueryClient()
  
  const {
    successTimeout = 3000,
    onSuccess,
    onError
  } = config

  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string>('')

  // 토큰에서 accountId 추출
  const accountId = token ? extractAccountIdFromToken(token) : null

  // 인증 상태 확인
  const checkAuth = useCallback(() => {
    if (!token) {
      console.error('No authentication token found')
      navigate('/login')
      return false
    }

    if (!accountId) {
      console.error('Account ID not found in token')
      return false
    }

    return true
  }, [token, accountId, navigate])

  // 업로드 시작
  const startUpload = useCallback(() => {
    if (!checkAuth()) return false

    setUploadStatus('uploading')
    setProgress(0)
    setError('')
    return true
  }, [checkAuth])

  // 진행률 업데이트
  const updateProgress = useCallback((newProgress: number) => {
    setProgress(Math.min(100, Math.max(0, newProgress)))
  }, [])

  // 업로드 성공 처리
  const handleSuccess = useCallback((queryKeys?: string[][]) => {
    setUploadStatus('success')
    setProgress(100)

    // 지정된 쿼리 무효화
    if (queryKeys) {
      queryKeys.forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey })
      })
    }

    // 성공 콜백 실행
    onSuccess?.()

    // 지정된 시간 후 상태 초기화
    setTimeout(() => {
      setUploadStatus('idle')
      setProgress(0)
      setError('')
    }, successTimeout)
  }, [queryClient, onSuccess, successTimeout])

  // 업로드 실패 처리
  const handleError = useCallback((errorMessage: string) => {
    console.error('Upload error:', errorMessage)
    setUploadStatus('error')
    setError(errorMessage)
    onError?.(errorMessage)
  }, [onError])

  // 상태 초기화
  const reset = useCallback(() => {
    setUploadStatus('idle')
    setProgress(0)
    setError('')
  }, [])

  return {
    // 상태
    uploadStatus,
    progress,
    error,
    accountId,
    
    // 상태 확인
    isUploading: uploadStatus === 'uploading',
    isSuccess: uploadStatus === 'success',
    isError: uploadStatus === 'error',
    isIdle: uploadStatus === 'idle',
    
    // 메서드
    checkAuth,
    startUpload,
    updateProgress,
    handleSuccess,
    handleError,
    reset
  }
}