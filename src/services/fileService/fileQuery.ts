import { useQuery } from '@tanstack/react-query'
import { fileService } from './fileService'
import { QUERY_KEYS } from '../common/queryKey'

export const useFileList = (limit: number = 20, offset: number = 0) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.files, limit, offset],
    queryFn: () => fileService.getFileList(limit, offset),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  })
}
