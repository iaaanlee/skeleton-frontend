import React, { useState, useCallback } from 'react'
import { usePrescriptionActions } from '../../../../hooks/usePrescriptionActions'
import { useAccountAuth } from '../../../../contexts/AccountAuthContext'
import { useProfile } from '../../../../contexts/ProfileContext'
import { extractAccountIdFromToken } from '../../../../utils/auth'
import { MediaSetList, DescriptionSection } from '../../../createPrescriptionPage/components/molecules'
import { TestAnalysisStartButton } from '../molecules/TestAnalysisStartButton'

type TestPrescriptionUploadSectionProps = {
  className?: string
}

export const TestPrescriptionUploadSection: React.FC<TestPrescriptionUploadSectionProps> = ({
  className = ''
}) => {
  const { currentProfile } = useProfile()
  const { token } = useAccountAuth()
  const accountId = token ? extractAccountIdFromToken(token) : null
  
  const [selectedMediaSetId, setSelectedMediaSetId] = useState<string | null>(null)
  const [description, setDescription] = useState({
    ans1: '',
    ans2: ''
  })

  const { createPrescription, isCreating } = usePrescriptionActions(accountId || '')

  const handleMediaSetSelectionChange = useCallback((mediaSetId: string | null) => {
    setSelectedMediaSetId(mediaSetId)
  }, [])

  const handleDescriptionChange = useCallback((newDescription: { ans1: string; ans2: string }) => {
    setDescription(newDescription)
  }, [])


  const handleAnalysisStart = async (inputs: {
    mediaSetId: string;
    description: {
      ans1: string;
      ans2: string;
    };
    isTest?: boolean;
  }) => {
    // 테스트 모드는 항상 true로 설정
    await createPrescription({ ...inputs, isTest: true })
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 미디어 세트 선택 섹션 */}
      <MediaSetList 
        profileId={currentProfile?.profileId || ''}
        onSelectionChange={handleMediaSetSelectionChange}
      />

      {/* 운동 분석 요청사항 */}
      <DescriptionSection
        value={description}
        onChange={handleDescriptionChange}
      />

      {/* 테스트 분석 시작 버튼만 표시 */}
      <TestAnalysisStartButton
        selectedMediaSetId={selectedMediaSetId}
        description={description}
        onAnalysisStart={handleAnalysisStart}
        isCreating={isCreating}
      />
    </div>
  )
}