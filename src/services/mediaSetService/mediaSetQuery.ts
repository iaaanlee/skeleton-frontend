import { useQuery } from '@tanstack/react-query'
import { mediaSetService } from './mediaSetService'
import { QUERY_KEYS } from '../common/queryKey'

export const useMediaSetList = (
  limit: number = 20,
  offset: number = 0
) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.mediaSets, 'list', limit, offset],
    queryFn: () => mediaSetService.getMediaSetList(limit, offset),
  })
}

export const useMediaSetById = (mediaSetId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.mediaSets, 'detail', mediaSetId],
    queryFn: () => mediaSetService.getMediaSetById(mediaSetId),
    enabled: !!mediaSetId,
  })
}
