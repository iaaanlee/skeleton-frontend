import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFileActions } from '../../../../hooks'
import { useAccountAuth } from '../../../../contexts/AccountAuthContext'
import { extractUserIdFromToken } from '../../../../utils/auth'
import { PrescriptionFileList } from '../molecules/PrescriptionFileList'
import { DescriptionSection } from '../molecules/DescriptionSection'
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
  const userId = token ? extractUserIdFromToken(token) : null
  
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [description, setDescription] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const { startAnalysis } = useFileActions(profileId, userId || '')

  const handleSelectionChange = useCallback((files: string[]) => {
    setSelectedFiles(files)
  }, [])

  const handleAnalysisStart = async (fileIds: string[], descriptionText: string) => {
    if (!userId) {
      alert('로그인이 필요합니다.')
      return
    }

    setIsAnalyzing(true)
    try {
      const success = await startAnalysis(fileIds)
      if (success) {
        // startAnalysis 함수 내에서 이미 분석 결과 페이지로 이동하므로
        // 여기서는 추가 작업이 필요하지 않음
        console.log('분석이 시작되었습니다.')
      }
    } catch (error) {
      console.error('Analysis start error:', error)
      alert('분석 시작 중 오류가 발생했습니다.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 파일 업로드 섹션 */}
      {/* <PrescriptionFileUpload profileId={profileId} /> */}

      {/* 파일 목록 섹션 */}
      <PrescriptionFileList 
        profileId={profileId}
        onSelectionChange={handleSelectionChange}
      />

      {/* 운동 분석 요청사항 */}
      <DescriptionSection
        value={description}
        onChange={setDescription}
      />

      {/* 분석 시작 버튼 */}
      <AnalysisStartButton
        selectedFiles={selectedFiles}
        description={description}
        onAnalysisStart={handleAnalysisStart}
        isAnalyzing={isAnalyzing}
      />
    </div>
  )
}
