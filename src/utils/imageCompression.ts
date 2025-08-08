import { IMAGE_COMPRESSION } from '../constants/upload'
import { ImageCompressionOptions, ImageProcessingResult } from '../types/files/utils'

// Canvas를 사용한 이미지 압축
export const compressImage = async (
  file: File,
  options: ImageCompressionOptions = {}
): Promise<ImageProcessingResult> => {
  const {
    quality = IMAGE_COMPRESSION.QUALITY,
    maxWidth = IMAGE_COMPRESSION.MAX_WIDTH,
    maxHeight = IMAGE_COMPRESSION.MAX_HEIGHT,
    format = IMAGE_COMPRESSION.FORMAT
  } = options

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      try {
        // 원본 크기
        const originalWidth = img.width
        const originalHeight = img.height

        // 새로운 크기 계산 (비율 유지)
        let newWidth = originalWidth
        let newHeight = originalHeight

        if (originalWidth > maxWidth || originalHeight > maxHeight) {
          const ratio = Math.min(maxWidth / originalWidth, maxHeight / originalHeight)
          newWidth = originalWidth * ratio
          newHeight = originalHeight * ratio
        }

        // Canvas 크기 설정
        canvas.width = newWidth
        canvas.height = newHeight

        // 이미지 그리기
        ctx?.drawImage(img, 0, 0, newWidth, newHeight)

        // 압축된 이미지를 Blob으로 변환
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const originalSize = file.size
              const processedSize = blob.size
              const compressionRatio = ((originalSize - processedSize) / originalSize * 100)

              resolve({
                original: file,
                processed: blob,
                originalSize,
                processedSize,
                compressionRatio,
                width: newWidth,
                height: newHeight
              })
            } else {
              reject(new Error('이미지 압축에 실패했습니다.'))
            }
          },
          `image/${format}`,
          quality / 100
        )
      } catch (error) {
        reject(error)
      }
    }

    img.onerror = () => {
      reject(new Error('이미지를 불러올 수 없습니다.'))
    }

    // File을 URL로 변환하여 이미지 로드
    img.src = URL.createObjectURL(file)
  })
}

// 파일 크기 포맷팅
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 이미지 파일 검증
export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `파일 크기가 너무 큽니다. (최대 ${formatFileSize(maxSize)})`
    }
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: '지원하지 않는 파일 형식입니다. (JPEG, JPG, PNG만 지원)'
    }
  }

  return { isValid: true }
}

// 여러 이미지 압축
export const compressMultipleImages = async (
  files: File[],
  options: ImageCompressionOptions = {}
): Promise<ImageProcessingResult[]> => {
  const results: ImageProcessingResult[] = []

  for (const file of files) {
    try {
      const result = await compressImage(file, options)
      results.push(result)
    } catch (error) {
      console.error(`이미지 압축 실패: ${file.name}`, error)
      // 압축 실패 시 원본 파일 반환
      results.push({
        original: file,
        processed: file,
        originalSize: file.size,
        processedSize: file.size,
        compressionRatio: 0,
        width: 0,
        height: 0
      })
    }
  }

  return results
}
