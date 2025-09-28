import React from 'react';

type Props = {
  isVisible: boolean;
  onClick: () => void;
};

/**
 * Exercise Add FAB - PRD Requirements
 * 우하단 고정, 드래그 시 사라짐
 */
export const ExerciseAddFAB: React.FC<Props> = ({
  isVisible,
  onClick
}) => {
  if (!isVisible) return null;

  return (
    <button
      onClick={onClick}
      className={`
        fixed bottom-24 right-6 z-40
        w-14 h-14 rounded-full
        bg-blue-600 hover:bg-blue-700
        text-white shadow-lg hover:shadow-xl
        flex items-center justify-center
        transition-all duration-200
        transform hover:scale-105
      `}
      title="운동 추가"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    </button>
  );
};