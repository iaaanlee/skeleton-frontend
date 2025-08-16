import { useState, useMemo } from 'react'
import { ServerFile } from '../types/files'

type SortOption = 'date' | 'name' | 'size'

export const useFileSorting = (files: ServerFile[]) => {
  const [sortBy, setSortBy] = useState<SortOption>('date')

  const sortedFiles = useMemo(() => {
    return [...files].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        case 'name':
          return a.fileName.localeCompare(b.fileName)
        case 'size':
          return b.fileSize - a.fileSize
        default:
          return 0
      }
    })
  }, [files, sortBy])

  const handleSortChange = (newSortBy: SortOption) => {
    setSortBy(newSortBy)
  }

  return {
    sortBy,
    sortedFiles,
    handleSortChange
  }
}
