import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { SessionStatus } from '../../../../types/workout';

type Props = {
  sessionName: string;
  status: SessionStatus;
};

export const SessionDetailTopBar: React.FC<Props> = ({ sessionName, status }) => {
  const navigate = useNavigate();

  const getStatusBadge = (status: SessionStatus) => {
    switch (status) {
      case 'scheduled':
        return <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">예정</span>;
      case 'started':
        return <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">진행중</span>;
      case 'completed':
        return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">완료</span>;
      default:
        return <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">알 수 없음</span>;
    }
  };

  return (
    <div className="bg-white border-b">
      <div className="flex items-center justify-between px-4 py-3">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* 세션명과 상태 */}
        <div className="flex-1 text-center">
          <h1 className="text-lg font-semibold text-gray-900 truncate px-4">
            {sessionName}
          </h1>
          <div className="mt-1">
            {getStatusBadge(status)}
          </div>
        </div>

        {/* 메뉴 버튼 */}
        <button className="p-2 -mr-2 text-gray-600 hover:text-gray-900 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
};