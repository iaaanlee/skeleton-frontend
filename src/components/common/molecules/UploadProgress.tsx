import React from 'react'
import ProgressBar from './ProgressBar'

type UploadProgressProps = {
  status: 'idle' | 'uploading' | 'success' | 'error'
  progress: number
  error?: string
  className?: string
}

export const UploadProgress: React.FC<UploadProgressProps> = ({
  status,
  progress,
  error,
  className = ''
}) => {
  if (status === 'idle') return null

  return (
    <div className={`space-y-3 ${className}`}>
      {/* 업로드 진행률 */}
      {status === 'uploading' && (
        <>
          <div className="flex items-center justify-center">
            <ProgressBar
              progress={progress}
              type="circular"
              size={80}
              showPercentage={true}
            />
          </div>
          <p className="text-center text-sm text-gray-600">
            파일을 업로드하고 있습니다...
          </p>
        </>
      )}

      {/* 성공 메시지 */}
      {status === 'success' && (
        <div className="text-center py-4">
          <div className="text-green-500 text-lg font-medium">
            업로드 완료!
          </div>
          <p className="text-sm text-gray-600 mt-1">
            파일이 성공적으로 업로드되었습니다.
          </p>
        </div>
      )}

      {/* 오류 메시지 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-700 text-sm whitespace-pre-line">{error}</p>
        </div>
      )}
    </div>
  )
}
