import { useMutation, useQueryClient } from '@tanstack/react-query'
import { fileService } from './fileService'
import { QUERY_KEYS } from '../common/queryKey'
import { UploadInitRequest, UploadCompleteRequest } from '../../types/files'

export const useInitUpload = () => {
  return useMutation({
    mutationFn: (request: UploadInitRequest) => fileService.initUpload(request),
    onError: (error) => {
      console.error('Upload init error:', error)
    }
  })
}

export const useCompleteUpload = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (request: UploadCompleteRequest) => fileService.completeUpload(request),
    onSuccess: (_, variables) => {
      // 파일 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.files })
    },
    onError: (error) => {
      console.error('Upload complete error:', error)
    }
  })
}

export const useDeleteFile = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (fileId: string) => fileService.deleteFile(fileId),
    onSuccess: (_, fileId) => {
      // 파일 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.files })
      
      // 다운로드 URL 캐시 무효화
      queryClient.invalidateQueries({ 
        queryKey: [...QUERY_KEYS.files, 'download', fileId] 
      })
    },
    onError: (error) => {
      console.error('Delete file error:', error)
    }
  })
}

export const useUploadToS3 = () => {
  return useMutation({
    mutationFn: ({ uploadUrl, file }: { uploadUrl: string; file: File }) => 
      fileService.uploadToS3(uploadUrl, file),
    onError: (error) => {
      console.error('S3 upload error:', error)
    }
  })
}
