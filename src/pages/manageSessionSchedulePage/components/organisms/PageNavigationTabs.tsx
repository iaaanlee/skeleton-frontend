import React from 'react';
import { useNavigate } from 'react-router-dom';

type Tab = 'schedule' | 'progress' | 'analysis';

type Props = {
  activeTab: Tab;
};

export const PageNavigationTabs: React.FC<Props> = ({ activeTab }) => {
  const navigate = useNavigate();

  const tabs: { key: Tab; label: string; route: string }[] = [
    { key: 'schedule', label: '일정 관리', route: '/manage-session-schedule' },
    { key: 'progress', label: '운동 진척', route: '/workout-progress' }, // TODO: Stage 2+에서 구현
    { key: 'analysis', label: '분석 결과', route: '/workout-analysis' }, // TODO: Stage 2+에서 구현
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => navigate(tab.route)}
            className={`flex-1 py-3 px-4 text-center text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};