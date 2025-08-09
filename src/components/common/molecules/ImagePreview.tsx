import React, { useState, useCallback } from 'react'
import { ImagePreviewProps } from '../../../types/files/components'

const ImagePreview: React.FC<ImagePreviewProps> = ({
  file,
  className = '',
  width = 200,
  height = 200,
  alt = 'Image preview'
}) => {
  const [imageUrl, setImageUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')

  // File 객체를 URL로 변환
  React.useEffect(() => {
    if (typeof file === 'string') {
      setImageUrl(file)
      setIsLoading(false)
    } else if (file instanceof File) {
      const url = URL.createObjectURL(file)
      setImageUrl(url)
      setIsLoading(false)

      // 메모리 정리
      return () => URL.revokeObjectURL(url)
    }
  }, [file])

  const handleImageLoad = useCallback(() => {
    setIsLoading(false)
    setError('')
  }, [])

  const handleImageError = useCallback(() => {
    setIsLoading(false)
    setError('이미지를 불러올 수 없습니다.')
  }, [])

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`} style={{ width, height }}>
        <div className="text-center text-gray-500">
          <svg className="mx-auto h-8 w-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden rounded-lg bg-gray-100 ${className}`} style={{ width, height }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {imageUrl && (
        <img
          src={imageUrl}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-200 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}
    </div>
  )
}

export default ImagePreview
