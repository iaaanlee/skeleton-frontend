import React from 'react'
// import { PROGRESS_TYPE } from '../../../constants/upload'
import { ProgressBarProps } from '../../../types/files/components'

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  type = 'circular',
  size = 60,
  className = '',
  showPercentage = true,
  color = '#3B82F6'
}) => {
  if (type === 'circular') {
    const radius = (size - 8) / 2
    const circumference = 2 * Math.PI * radius
    const strokeDasharray = circumference
    const strokeDashoffset = circumference - (progress / 100) * circumference

    return (
      <div className={`relative inline-flex items-center justify-center ${className}`}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* 배경 원 */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E5E7EB"
            strokeWidth="4"
            fill="none"
          />
          {/* 진행률 원 */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth="4"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.3s ease-in-out'
            }}
          />
        </svg>
        
        {/* 퍼센트 텍스트 */}
        {showPercentage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700">
              {Math.round(progress)}%
            </span>
          </div>
        )}
      </div>
    )
  }

  // 선형 프로그레스 바
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <div
        className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-in-out"
        style={{
          width: `${progress}%`,
          backgroundColor: color
        }}
      />
      {showPercentage && (
        <div className="text-xs text-gray-600 mt-1 text-center">
          {Math.round(progress)}%
        </div>
      )}
    </div>
  )
}

export default ProgressBar
