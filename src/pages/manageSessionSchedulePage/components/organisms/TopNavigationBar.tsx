import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../../../contexts/ProfileContext';

export const TopNavigationBar: React.FC = () => {
  const navigate = useNavigate();
  const { currentProfile } = useProfile();

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-3 p-2 rounded-md hover:bg-gray-100"
            aria-label="뒤로가기"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">WORKOUT</h1>
        </div>

        <button
          onClick={() => navigate('/profile')}
          className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100"
        >
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-2">
            <span className="text-white text-sm font-medium">
              {currentProfile?.profileName?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          <span className="text-sm font-medium text-gray-700">
            {currentProfile?.profileName || '프로필'}
          </span>
        </button>
      </div>
    </div>
  );
};