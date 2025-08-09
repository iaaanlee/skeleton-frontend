import { useState, useCallback } from 'react'

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
