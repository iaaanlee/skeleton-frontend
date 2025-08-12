import { useMutation, useQueryClient } from '@tanstack/react-query'
import { promptService } from './promptService'
import { QUERY_KEYS } from '../common/queryKey'
import { CreatePromptRequest, UpdatePromptRequest } from './promptService'

export const useCreatePrompt = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (request: CreatePromptRequest) => promptService.createPrompt(request),
    onSuccess: () => {
      // 프롬프트 목록 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.prompts]
      })
    }
  })
}

export const useUpdatePrompt = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ promptId, request }: { promptId: string; request: UpdatePromptRequest }) => 
      promptService.updatePrompt(promptId, request),
    onSuccess: () => {
      // 프롬프트 목록 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.prompts]
      })
    }
  })
}

export const useDeletePrompt = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (promptId: string) => promptService.deletePrompt(promptId),
    onSuccess: () => {
      // 프롬프트 목록 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.prompts]
      })
    }
  })
}
