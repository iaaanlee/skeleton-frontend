import React from 'react';
import { Header } from '../../../../components/common/templates/Header';
import { BottomBar } from '../../../../components/common/templates/BottomBar';
import { ROUTES } from '../../../../constants/routes';

type NoResultStateProps = {
  onBack: () => void;
};

const NoResultState: React.FC<NoResultStateProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header backRoute={ROUTES.CREATE_PRESCRIPTION} />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            분석 결과가 없습니다
          </h2>
          <p className="text-gray-600 mb-4">
            분석이 완료되었지만 결과를 찾을 수 없습니다.
          </p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            돌아가기
          </button>
        </div>
      </div>
      <BottomBar />
    </div>
  );
};

export default NoResultState;