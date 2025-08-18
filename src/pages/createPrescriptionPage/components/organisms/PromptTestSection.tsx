import React, { useState } from 'react';
import { useProfile } from '../../../../contexts/ProfileContext';
import { axiosHttpClient } from '../../../../services/common';

type PromptTestSectionProps = {
  description?: {
    ans1?: string;
    ans2?: string;
  };
};

export const PromptTestSection: React.FC<PromptTestSectionProps> = ({ description }) => {
  const [fullPrompt, setFullPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const { currentProfile } = useProfile();

  const handleTestClick = async () => {
    try {
      setIsLoading(true);
      setError('');
      setFullPrompt('');

      if (!currentProfile) {
        setError('프로필이 선택되지 않았습니다.');
        return;
      }

      // 테스트용 API 호출
      const response = await axiosHttpClient.post<{
        success: boolean;
        data?: {
          fullPrompt: string;
          promptLength: number;
          llmGuideId: string;
          profileId: string;
        };
        error?: string;
      }>('/llm/test-prompt', {
        profileId: currentProfile.profileId,
        description: description || { ans1: '', ans2: '' },
        // 테스트용 관절 좌표 (빈 배열 또는 더미 데이터)
        jointPositions: [
          {
            landmarks: [
              { x: 0.5, y: 0.5, z: 0, visibility: 1 },
              { x: 0.45, y: 0.48, z: 0, visibility: 0.95 }
            ]
          }
        ]
      });

      if (response.success && response.data) {
        setFullPrompt(response.data.fullPrompt);
      } else {
        setError('프롬프트 생성에 실패했습니다.');
      }
    } catch (err: any) {
      console.error('Test prompt error:', err);
      setError(err.message || '테스트 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 p-6 bg-red-50 border-2 border-red-300 rounded-lg">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-red-700 mb-2">
          🔧 테스트 영역 (개발용 - 나중에 삭제됨)
        </h3>
        <button
          onClick={handleTestClick}
          disabled={isLoading}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            isLoading
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
        >
          {isLoading ? '생성 중...' : '테스트용 버튼'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 rounded text-red-700">
          {error}
        </div>
      )}

      <div className="mt-4">
        <h4 className="text-md font-semibold text-gray-700 mb-2">Full Prompt:</h4>
        <div className="bg-white border border-gray-300 rounded-lg p-4 min-h-[200px] max-h-[600px] overflow-y-auto">
          {fullPrompt ? (
            <pre className="whitespace-pre-wrap text-xs text-gray-600 font-mono">
              {fullPrompt}
            </pre>
          ) : (
            <p className="text-gray-400 italic">
              테스트용 버튼을 클릭하면 여기에 Full Prompt가 표시됩니다.
            </p>
          )}
        </div>
      </div>

      <div className="mt-2 text-xs text-red-600">
        ⚠️ 이 섹션은 개발 테스트용이며 프로덕션에서는 제거됩니다.
      </div>
    </div>
  );
};