import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useDeleteFile, useDownloadUrl } from '../services/fileService'
import { useStartAnalysis } from '../services/blazePoseService'
import { QUERY_KEYS } from '../services/common/queryKey'
import { ROUTES } from '../constants/routes'

export const useFileActions = (profileId: string, userId: string) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const deleteFileMutation = useDeleteFile()
  const startAnalysisMutation = useStartAnalysis()
  const downloadUrlMutation = useDownloadUrl()
  
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const deleteFile = useCallback(async (fileId: string) => {
    try {
      await deleteFileMutation.mutateAsync({ fileId, profileId })
      
      // 파일 목록 쿼리 무효화하여 자동 갱신
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.files, 'list', userId, profileId]
      })
      
      return true
    } catch (error) {
      console.error('Delete file error:', error)
      return false
    }
  }, [deleteFileMutation, queryClient, userId, profileId])

  const downloadFile = useCallback(async (file: any) => {
    try {
      // 다운로드 URL 생성
      const downloadUrlResponse = await downloadUrlMutation.mutateAsync({ 
        fileId: file._id, 
        profileId 
      })
      
      // 새 창에서 다운로드
      const link = document.createElement('a')
      link.href = downloadUrlResponse.downloadUrl
      link.download = file.fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Download file error:', error)
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류'
      alert(`파일 다운로드 중 오류가 발생했습니다: ${errorMessage}`)
    }
  }, [downloadUrlMutation, profileId])

  const startAnalysis = useCallback(async (fileIds: string[]) => {
    if (fileIds.length === 0) {
      alert('분석할 파일을 선택해주세요.')
      return false
    }

    setIsAnalyzing(true)
    try {
      const response = await startAnalysisMutation.mutateAsync({
        fileIds,
        profileId
      })
      
      console.log('Analysis started:', response)
      
      // 분석 결과 페이지로 이동
      if (response && response.analysisId) {
        navigate(ROUTES.ANALYSIS_RESULT.replace(':analysisId', response.analysisId))
      } else {
        alert('분석이 시작되었습니다!')
      }
      
      return true
    } catch (error) {
      console.error('Analysis error:', error)
      alert('분석 시작 중 오류가 발생했습니다.')
      return false
    } finally {
      setIsAnalyzing(false)
    }
  }, [startAnalysisMutation, profileId, navigate])

  const deleteMultipleFiles = useCallback(async (fileIds: string[]) => {
    const results = await Promise.all(
      fileIds.map(fileId => deleteFile(fileId))
    )
    return results.every(result => result)
  }, [deleteFile])

  const downloadMultipleFiles = useCallback(async (files: any[]) => {
    for (const file of files) {
      await downloadFile(file)
    }
  }, [downloadFile])

  return {
    deleteFile,
    downloadFile,
    startAnalysis,
    deleteMultipleFiles,
    downloadMultipleFiles,
    isAnalyzing
  }
}
