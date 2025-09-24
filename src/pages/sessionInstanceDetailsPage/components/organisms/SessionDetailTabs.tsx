import React from 'react';

type Props = {
  activeTab: 'plan' | 'summary';
  onTabChange: (tab: 'plan' | 'summary') => void;
};

export const SessionDetailTabs: React.FC<Props> = ({ activeTab, onTabChange }) => {
  return (
    <div className="bg-gray-100 rounded-lg p-1">
      <div className="flex">
        <button
          onClick={() => onTabChange('plan')}
          className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'plan'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center justify-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            운동 계획
          </div>
        </button>
        <button
          onClick={() => onTabChange('summary')}
          className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'summary'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center justify-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2 2z" />
            </svg>
            운동 요약
          </div>
        </button>
      </div>
    </div>
  );
};