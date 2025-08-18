import React, { useState } from 'react';
import { axiosHttpClient } from '../../../../services/common';

export const GPTTestSection: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [gptResponse, setGptResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async () => {
    if (!inputText.trim()) {
      setError('입력 텍스트를 작성해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setGptResponse('');

      // GPT 테스트 API 호출
      const response = await axiosHttpClient.post<{
        success: boolean;
        data?: {
          response: string;
          model: string;
          tokens: number;
        };
        error?: string;
      }>('/llm/test-gpt', {
        prompt: inputText
      });

      if (response.success && response.data) {
        setGptResponse(response.data.response);
      } else {
        setError(response.error || 'GPT 응답을 받지 못했습니다.');
      }
    } catch (err: any) {
      console.error('GPT test error:', err);
      setError(err.message || 'GPT 테스트 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 space-y-6">
      {/* GPT 직접 테스트 섹션 */}
      <div className="p-6 bg-blue-50 border-2 border-blue-300 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-700 mb-4">
          🤖 GPT 직접 테스트 (API 연결 확인용)
        </h3>
        
        {/* 입력 섹션 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            GPT에 보낼 텍스트 입력:
          </label>
          <div className="flex gap-2">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="예: 안녕하세요. 오늘 날씨가 어떤가요?"
              className="flex-1 p-3 border border-gray-300 rounded-lg resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSubmit}
              disabled={isLoading || !inputText.trim()}
              className={`px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${
                isLoading || !inputText.trim()
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>전송 중...</span>
                </div>
              ) : (
                'LLM 제출'
              )}
            </button>
          </div>
        </div>

        {/* 에러 표시 */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 rounded text-red-700">
            {error}
          </div>
        )}

        {/* 결과 섹션 */}
        <div>
          <h4 className="text-md font-semibold text-gray-700 mb-2">GPT 응답 결과:</h4>
          <div className="bg-white border border-gray-300 rounded-lg p-4 min-h-[200px] max-h-[400px] overflow-y-auto">
            {gptResponse ? (
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                {gptResponse}
              </pre>
            ) : (
              <p className="text-gray-400 italic">
                LLM 제출 버튼을 클릭하면 여기에 GPT 응답이 표시됩니다.
              </p>
            )}
          </div>
        </div>

        <div className="mt-3 text-xs text-blue-600">
          ℹ️ 이 섹션은 GPT API 연결을 직접 테스트하는 용도입니다.
        </div>
      </div>
    </div>
  );
};