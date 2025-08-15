import React, { useState, useCallback } from 'react'
import { usePrescriptionActions } from '../../../../hooks/usePrescriptionActions'
import { useAccountAuth } from '../../../../contexts/AccountAuthContext'
import { extractAccountIdFromToken } from '../../../../utils/auth'
import { MediaSetList } from '../molecules/MediaSetList'
import { DescriptionSection } from '../molecules/DescriptionSection'
import { PromptSelector } from '../molecules/PromptSelector'
import { AnalysisStartButton } from '../molecules/AnalysisStartButton'

type PrescriptionUploadSectionProps = {
  profileId: string
  className?: string
}

export const PrescriptionUploadSection: React.FC<PrescriptionUploadSectionProps> = ({
  profileId,
  className = ''
}) => {
  const { token } = useAccountAuth()
  const accountId = token ? extractAccountIdFromToken(token) : null
  
  const [selectedMediaSetId, setSelectedMediaSetId] = useState<string | null>(null)
  const [description, setDescription] = useState({
    ans1: '',
    ans2: ''
  })
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null)

  const { createPrescription, isCreating } = usePrescriptionActions(profileId, accountId || '')

  const handleMediaSetSelectionChange = useCallback((mediaSetId: string | null) => {
    setSelectedMediaSetId(mediaSetId)
  }, [])

  const handleDescriptionChange = useCallback((newDescription: { ans1: string; ans2: string }) => {
    setDescription(newDescription)
  }, [])

  const handlePromptSelectionChange = useCallback((promptId: string | null) => {
    setSelectedPromptId(promptId)
  }, [])

  const handleAnalysisStart = async (inputs: {
    mediaSetId: string;
    description: {
      ans1: string;
      ans2: string;
    };
    promptId: string;
  }) => {
    await createPrescription(inputs)
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 미디어 세트 선택 섹션 */}
      <MediaSetList 
        profileId={profileId}
        onSelectionChange={handleMediaSetSelectionChange}
      />

      {/* 운동 분석 요청사항 */}
      <DescriptionSection
        value={description}
        onChange={handleDescriptionChange}
      />

      {/* 프롬프트 선택 섹션 */}
      <PromptSelector
        onSelectionChange={handlePromptSelectionChange}
        selectedPromptId={selectedPromptId}
      />

      {/* 분석 시작 버튼 */}
      <AnalysisStartButton
        selectedMediaSetId={selectedMediaSetId}
        description={description}
        selectedPromptId={selectedPromptId}
        onAnalysisStart={handleAnalysisStart}
        isCreating={isCreating}
      />
    </div>
  )
}
