import React from 'react';

type Props = {
  message: string;
  onDismiss: () => void;
};

/**
 * UI 힌트 말풍선 컴포넌트
 * PRD Line 359-360: DnD/편집 처음 사용 시 파란 말풍선 힌트 표시
 */
export const HintTooltip: React.FC<Props> = ({
  message,
  onDismiss
}) => {
  return (
    <div className="fixed bottom-28 right-4 z-50 animate-fadeIn">
      <div className="relative bg-blue-500 text-white text-sm px-4 py-2 rounded-lg shadow-lg max-w-md whitespace-normal">
        {/* 말풍선 화살표 (아래쪽 FAB 방향) */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full border-l-8 border-r-8 border-t-8 border-transparent border-t-blue-500" />

        {/* 메시지 */}
        <p className="text-center">{message}</p>

        {/* 닫기 버튼 */}
        <button
          onClick={onDismiss}
          className="absolute -top-1 -right-1 w-5 h-5 bg-white text-blue-500 rounded-full flex items-center justify-center text-xs font-bold hover:bg-blue-100 transition-colors"
          aria-label="힌트 닫기"
        >
          ×
        </button>
      </div>
    </div>
  );
};
