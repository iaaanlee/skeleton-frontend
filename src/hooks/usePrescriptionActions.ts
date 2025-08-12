import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useCreatePrescription } from '../services/prescriptionService'
import { QUERY_KEYS } from '../services/common/queryKey'
import { ROUTES } from '../constants/routes'

export const usePrescriptionActions = (profileId: string, accountId: string) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const createPrescriptionMutation = useCreatePrescription()
  
  const [isCreating, setIsCreating] = useState(false)

  const createPrescription = useCallback(async (inputs: {
    mediaSetId: string;
    description: {
      ans1: string;
      ans2: string;
    };
    promptId: string;
  }) => {
    if (!accountId) {
      alert('로그인이 필요합니다.')
      return false
    }

    if (!inputs.mediaSetId) {
      alert('미디어 세트를 선택해주세요.')
      return false
    }

    // if (!inputs.description.ans1 || !inputs.description.ans2) {
    //   alert('운동 분석 요청사항을 모두 입력해주세요.')
    //   return false
    // }

    if (!inputs.promptId) {
      alert('분석 프롬프트를 선택해주세요.')
      return false
    }

    setIsCreating(true)
    try {
      const response = await createPrescriptionMutation.mutateAsync({
        profileId,
        inputs
      })
      
      console.log('Prescription created:', response)
      
      // 분석 진행 페이지로 이동
      if (response && response.analysisJobId) {
        navigate(ROUTES.ANALYSIS_PROGRESS.replace(':analysisJobId', response.analysisJobId))
      } else {
        alert('처방이 생성되었습니다!')
      }
      
      // 미디어 세트 목록 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.mediaSets, 'list', accountId, profileId]
      })
      
      return true
    } catch (error) {
      console.error('Create prescription error:', error)
      alert('처방 생성 중 오류가 발생했습니다.')
      return false
    } finally {
      setIsCreating(false)
    }
  }, [createPrescriptionMutation, profileId, accountId, navigate, queryClient])

  return {
    createPrescription,
    isCreating
  }
}
