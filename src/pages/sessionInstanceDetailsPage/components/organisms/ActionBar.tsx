import React from 'react';
import type { SessionDetail } from '../../../../types/workout';

type Props = {
  sessionDetail: SessionDetail;
  onModifySession: () => void;
  onStartSession: () => void;
};

/**
 * 문서 Phase 3.3: 하단 액션바 동적 동작
 * PRD 요구사항: 상태별 "시작하기"→"이어하기" 변경, completed시 비활성
 */
export const ActionBar: React.FC<Props> = ({ sessionDetail, onModifySession, onStartSession }) => {
  // 문서 기준: 상태별 버튼 상태 결정
  const getButtonState = () => {
    switch (sessionDetail.status) {
      case 'scheduled':
        return {
          modifyEnabled: true,
          startLabel: '시작하기',
          startEnabled: true
        };
      case 'started':
        return {
          modifyEnabled: false,
          startLabel: '이어하기',
          startEnabled: true
        };
      case 'completed':
        return {
          modifyEnabled: false,
          startLabel: '시작하기',
          startEnabled: false
        };
      default:
        return {
          modifyEnabled: false,
          startLabel: '시작하기',
          startEnabled: false
        };
    }
  };

  const { modifyEnabled, startLabel, startEnabled } = getButtonState();

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t safe-area-padding">
      <div className="flex gap-3">
        <button
          className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
            modifyEnabled
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!modifyEnabled}
          onClick={modifyEnabled ? onModifySession : undefined}
        >
          수정하기
        </button>
        <button
          className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
            startEnabled
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!startEnabled}
          onClick={startEnabled ? onStartSession : undefined}
        >
          {startLabel}
        </button>
      </div>
    </div>
  );
};