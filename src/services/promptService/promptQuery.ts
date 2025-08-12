import { useQuery } from '@tanstack/react-query'
import { promptService } from './promptService'
import { QUERY_KEYS } from '../common/queryKey'

export const useActivePrompts = () => {
  return useQuery({
    queryKey: [...QUERY_KEYS.prompts, 'active'],
    queryFn: () => promptService.getActivePrompts(),
  })
}

export const useAllPrompts = () => {
  return useQuery({
    queryKey: [...QUERY_KEYS.prompts, 'all'],
    queryFn: () => promptService.getAllPrompts(),
  })
}

export const usePromptById = (promptId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.prompts, 'detail', promptId],
    queryFn: () => promptService.getPromptById(promptId),
    enabled: !!promptId,
  })
}
