import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useCreatePrescription, useCreateImageAnalysisOnlyPrescription } from '../services/prescriptionService'
import { QUERY_KEYS } from '../services/common/queryKey'
import { ROUTES } from '../constants/routes'
import { useToast } from '../contexts/ToastContext'
import { PoseEngineType } from '../types/poseEngine'

export const usePrescriptionActions = (accountId: string) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const createPrescriptionMutation = useCreatePrescription()
  const createImageAnalysisOnlyMutation = useCreateImageAnalysisOnlyPrescription()
  const { showError, showSuccess, showInfo } = useToast()
  
  const [isCreating, setIsCreating] = useState(false)
  const [isImageAnalyzing, setIsImageAnalyzing] = useState(false)

  const createPrescription = useCallback(async (inputs: {
    mediaSetId: string;
    description: {
      ans1: string;
      ans2: string;
    };
    isTest?: boolean;
    poseEngine?: PoseEngineType;
  }) => {
    if (!accountId) {
      showError('로그인이 필요합니다.')
      return false
    }

    if (!inputs.mediaSetId) {
      showError('미디어 세트를 선택해주세요.')
      return false
    }

    // if (!inputs.description.ans1 || !inputs.description.ans2) {
    //   showError('운동 분석 요청사항을 모두 입력해주세요.')
    //   return false
    // }


    setIsCreating(true)
    try {
      const response = await createPrescriptionMutation.mutateAsync({
        inputs
      })
      
      console.log('Prescription created:', response)
      
      // 이미 완료된 분석인지 확인
      if (response && response.redirectTo === 'prescription-history') {
        showInfo(response.message || '이미 완료된 분석입니다. 처방 기록에서 확인하세요.')
        navigate(ROUTES.PRESCRIPTION_HISTORY)
      } else if (response && response.analysisJobId) {
        // 새로운 분석 또는 재시도 - 분석 진행 페이지로 이동
        navigate(ROUTES.ANALYSIS_PROGRESS.replace(':analysisJobId', response.analysisJobId))
      } else {
        showSuccess('처방이 생성되었습니다!')
      }
      
      // 미디어 세트 목록 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.mediaSets, 'list']
      })
      
      return true
    } catch (error) {
      console.error('Create prescription error:', error)
      showError('처방 생성 중 오류가 발생했습니다.')
      return false
    } finally {
      setIsCreating(false)
    }
  }, [createPrescriptionMutation, accountId, navigate, queryClient, showError, showInfo, showSuccess])

  const createImageAnalysisOnly = useCallback(async (inputs: {
    mediaSetId: string;
    description: {
      ans1: string;
      ans2: string;
    };
    poseEngine?: PoseEngineType;
  }) => {
    if (!accountId) {
      showError('로그인이 필요합니다.')
      return false
    }

    if (!inputs.mediaSetId) {
      showError('미디어 세트를 선택해주세요.')
      return false
    }

    setIsImageAnalyzing(true)
    try {
      const response = await createImageAnalysisOnlyMutation.mutateAsync({
        inputs
      })
      
      console.log('Image analysis only prescription created:', response)
      
      if (response && response.analysisJobId) {
        showSuccess('이미지 분석이 시작되었습니다! (LLM 분석 제외)')
        // 분석 진행 페이지로 이동
        navigate(ROUTES.ANALYSIS_PROGRESS.replace(':analysisJobId', response.analysisJobId))
      } else {
        showSuccess('이미지 분석 처방이 생성되었습니다!')
      }
      
      // 미디어 세트 목록 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.mediaSets, 'list']
      })
      
      return true
    } catch (error) {
      console.error('Create image analysis only prescription error:', error)
      showError('이미지 분석 처방 생성 중 오류가 발생했습니다.')
      return false
    } finally {
      setIsImageAnalyzing(false)
    }
  }, [createImageAnalysisOnlyMutation, accountId, navigate, queryClient, showError, showSuccess])

  return {
    createPrescription,
    createImageAnalysisOnly,
    isCreating,
    isImageAnalyzing
  }
}
