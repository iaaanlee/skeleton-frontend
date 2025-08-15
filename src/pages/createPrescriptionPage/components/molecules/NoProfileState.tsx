import React from 'react';
import { Header } from '../../../../components/common/templates/Header';
import { BottomBar } from '../../../../components/common/templates/BottomBar';
import { ROUTES } from '../../../../constants/routes';

const NoProfileState: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header backRoute={ROUTES.ANALYZE_EXERCISE} />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">👤</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            프로필을 선택해주세요
          </h2>
          <p className="text-gray-600">
            운동 분석을 위해 프로필을 먼저 선택해주세요.
          </p>
        </div>
      </div>
      <BottomBar />
    </div>
  );
};

export default NoProfileState;