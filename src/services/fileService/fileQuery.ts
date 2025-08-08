import { useQuery } from '@tanstack/react-query'
import { fileService } from './fileService'
import { QUERY_KEYS } from '../common/queryKey'

export const useFileList = (userId: string, profileId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.files, userId, profileId],
    queryFn: () => fileService.getFileList(userId, profileId),
    enabled: !!userId && !!profileId,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  })
}

export const useDownloadUrl = (fileId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.files, 'download', fileId],
    queryFn: () => fileService.getDownloadUrl(fileId),
    enabled: enabled && !!fileId,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  })
}
