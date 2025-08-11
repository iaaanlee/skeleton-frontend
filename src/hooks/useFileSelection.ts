import { useState, useCallback, useMemo } from 'react'

export const useFileSelection = () => {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])

  const selectFile = useCallback((fileId: string) => {
    setSelectedFiles(prev => {
      if (prev.includes(fileId)) {
        return prev.filter(id => id !== fileId)
      } else {
        return [...prev, fileId]
      }
    })
  }, [])

  const deselectFile = useCallback((fileId: string) => {
    setSelectedFiles(prev => prev.filter(id => id !== fileId))
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedFiles([])
  }, [])

  const selectMultiple = useCallback((fileIds: string[]) => {
    setSelectedFiles(fileIds)
  }, [])

  const isSelected = useCallback((fileId: string) => {
    return selectedFiles.includes(fileId)
  }, [selectedFiles])

  return {
    selectedFiles,
    selectFile,
    deselectFile,
    clearSelection,
    selectMultiple,
    isSelected,
    selectedCount: selectedFiles.length
  }
}

// 단일 선택을 위한 훅
export const useSingleFileSelection = () => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null)

  const selectFile = useCallback((fileId: string) => {
    setSelectedFile(prev => prev === fileId ? null : fileId)
  }, [])

  const deselectFile = useCallback(() => {
    setSelectedFile(null)
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedFile(null)
  }, [])

  const selectFileDirect = useCallback((fileId: string) => {
    setSelectedFile(fileId)
  }, [])

  const isSelected = useCallback((fileId: string) => {
    return selectedFile === fileId
  }, [selectedFile])

  // 다중 선택과 호환성을 위해 배열 형태로도 반환
  const selectedFiles = useMemo(() => selectedFile ? [selectedFile] : [], [selectedFile])

  return {
    selectedFile,
    selectedFiles,
    selectFile,
    deselectFile,
    clearSelection,
    selectFileDirect,
    isSelected,
    selectedCount: selectedFile ? 1 : 0
  }
}
