import React, { useState, useCallback } from 'react'
import { usePrescriptionActions } from '../../../../hooks/usePrescriptionActions'
import { useAccountAuth } from '../../../../contexts/AccountAuthContext'
import { useProfile } from '../../../../contexts/ProfileContext'
import { extractAccountIdFromToken } from '../../../../utils/auth'
import { MediaSetList } from '../molecules/MediaSetList'
import { DescriptionSection } from '../molecules/DescriptionSection'
import { PoseEngineSelector } from '../molecules/PoseEngineSelector'
import { AnalysisStartButton } from '../molecules/AnalysisStartButton'
import { PoseEngineType } from '../../../../types/poseEngine'

type PrescriptionUploadSectionProps = {
  className?: string
}

export const PrescriptionUploadSection: React.FC<PrescriptionUploadSectionProps> = ({
  className = ''
}) => {
  const { currentProfile } = useProfile()
  const { token } = useAccountAuth()
  const accountId = token ? extractAccountIdFromToken(token) : null
  
  const [selectedMediaSetId, setSelectedMediaSetId] = useState<string | null>(null)
  const [selectedEngine, setSelectedEngine] = useState<PoseEngineType>('blazepose') // 기본값: BlazePose
  const [description, setDescription] = useState({
    ans1: '',
    ans2: ''
  })

  const { createPrescription, isCreating, createImageAnalysisOnly, isImageAnalyzing } = usePrescriptionActions(accountId || '')

  const handleMediaSetSelectionChange = useCallback((mediaSetId: string | null) => {
    setSelectedMediaSetId(mediaSetId)
  }, [])

  const handleDescriptionChange = useCallback((newDescription: { ans1: string; ans2: string }) => {
    setDescription(newDescription)
  }, [])

  const handleEngineChange = useCallback((engine: PoseEngineType) => {
    setSelectedEngine(engine)
  }, [])


  const handleAnalysisStart = async (inputs: {
    mediaSetId: string;
    description: {
      ans1: string;
      ans2: string;
    };
    isTest?: boolean;
  }) => {
    // 포즈 엔진 정보를 추가하여 요청
    const requestWithEngine = {
      ...inputs,
      poseEngine: selectedEngine
    };
    await createPrescription(requestWithEngine)
  }

  const handleImageAnalysisStart = async (inputs: {
    mediaSetId: string;
    description: {
      ans1: string;
      ans2: string;
    };
  }) => {
    // 포즈 엔진 정보를 추가하여 요청
    const requestWithEngine = {
      ...inputs,
      poseEngine: selectedEngine
    };
    await createImageAnalysisOnly(requestWithEngine)
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 미디어 세트 선택 섹션 */}
      <MediaSetList 
        profileId={currentProfile?.profileId || ''}
        onSelectionChange={handleMediaSetSelectionChange}
      />

      {/* 포즈 추정 엔진 선택 섹션 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <PoseEngineSelector
          selectedEngine={selectedEngine}
          onEngineChange={handleEngineChange}
        />
      </div>

      {/* 운동 분석 요청사항 */}
      <DescriptionSection
        value={description}
        onChange={handleDescriptionChange}
      />

      {/* 분석 시작 버튼 */}
      <AnalysisStartButton
        selectedMediaSetId={selectedMediaSetId}
        description={description}
        onAnalysisStart={handleAnalysisStart}
        onImageAnalysisStart={handleImageAnalysisStart}
        isCreating={isCreating}
        isImageAnalyzing={isImageAnalyzing}
      />
    </div>
  )
}
