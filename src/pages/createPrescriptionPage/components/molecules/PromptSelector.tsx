import React, { useEffect } from 'react'
import { useActivePrompts } from '../../../../services/promptService'

type PromptSelectorProps = {
  onSelectionChange: (promptId: string | null) => void
  selectedPromptId?: string | null
  className?: string
}

export const PromptSelector: React.FC<PromptSelectorProps> = ({
  onSelectionChange,
  selectedPromptId,
  className = ''
}) => {
  const { data: promptList, isLoading, error } = useActivePrompts()

  // 첫 번째 프롬프트를 기본으로 선택
  useEffect(() => {
    if (promptList?.prompts && promptList.prompts.length > 0 && !selectedPromptId) {
      onSelectionChange(promptList.prompts[0]._id)
    }
  }, [promptList, selectedPromptId, onSelectionChange])

  const handlePromptClick = (promptId: string) => {
    if (selectedPromptId === promptId) {
      onSelectionChange(null)
    } else {
      onSelectionChange(promptId)
    }
  }

  if (isLoading) {
    return (
      <div className={`p-4 ${className}`}>
        <div className="text-center text-gray-500">프롬프트를 불러오는 중...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`p-4 ${className}`}>
        <div className="text-center text-red-500">프롬프트 목록을 불러오는데 실패했습니다.</div>
      </div>
    )
  }

  if (!promptList?.prompts || promptList.prompts.length === 0) {
    return (
      <div className={`p-4 ${className}`}>
        <div className="text-center text-gray-500">사용 가능한 프롬프트가 없습니다.</div>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900">분석 프롬프트 선택</h3>
      <div className="space-y-3">
        {promptList.prompts.map((prompt: any) => (
          <div
            key={prompt._id}
            onClick={() => handlePromptClick(prompt._id)}
            className={`
              cursor-pointer rounded-lg border-2 p-4 transition-all duration-200
              ${selectedPromptId === prompt._id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
              }
            `}
          >
            <div className="text-sm font-medium text-gray-900 mb-2">
              프롬프트 {prompt._id.substring(0, 8)}...
            </div>
            <div className="text-xs text-gray-600 line-clamp-3">
              {prompt.contents}
            </div>
            
            {/* 선택 표시 */}
            {selectedPromptId === prompt._id && (
              <div className="mt-2 flex items-center text-blue-600">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-xs">선택됨</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
