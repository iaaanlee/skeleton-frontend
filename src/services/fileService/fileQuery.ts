import { useQuery } from '@tanstack/react-query'
import { fileService } from './fileService'
import { QUERY_KEYS } from '../common/queryKey'

export const useFileList = (userId: string, profileId: string, limit: number = 20, offset: number = 0) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.files, userId, profileId, limit, offset],
    queryFn: () => fileService.getFileList(userId, profileId, limit, offset),
    enabled: !!userId && !!profileId,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  })
}
