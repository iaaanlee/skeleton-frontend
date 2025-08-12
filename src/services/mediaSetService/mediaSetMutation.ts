import { useMutation, useQueryClient } from '@tanstack/react-query'
import { mediaSetService } from './mediaSetService'
import { QUERY_KEYS } from '../common/queryKey'
import { CreateMediaSetRequest, UploadInitRequest, UploadCompleteRequest } from './mediaSetService'

export const useCreateMediaSet = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (request: CreateMediaSetRequest) => mediaSetService.createMediaSet(request),
    onSuccess: (data, variables) => {
      // 미디어 세트 목록 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.mediaSets, 'list']
      })
    }
  })
}

export const useDeleteMediaSet = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ mediaSetId, profileId }: { mediaSetId: string; profileId: string }) => 
      mediaSetService.deleteMediaSet(mediaSetId, profileId),
    onSuccess: () => {
      // 미디어 세트 목록 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.mediaSets, 'list']
      })
    }
  })
}

export const useInitUpload = () => {
  return useMutation({
    mutationFn: (request: UploadInitRequest) => mediaSetService.initUpload(request)
  })
}

export const useCompleteUpload = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (request: UploadCompleteRequest) => mediaSetService.completeUpload(request),
    onSuccess: () => {
      // 미디어 세트 목록 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.mediaSets, 'list']
      })
    }
  })
}

export const useUploadToS3 = () => {
  return useMutation({
    mutationFn: ({ uploadUrl, file }: { uploadUrl: string; file: File }) => 
      mediaSetService.uploadToS3(uploadUrl, file)
  })
}
