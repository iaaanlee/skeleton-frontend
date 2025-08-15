import React from 'react';

type ErrorStateProps = {
  error: any;
};

const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  return (
    <div className="text-center py-12">
      <div className="text-red-500 text-2xl mb-2">⚠️</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        처방 기록을 불러올 수 없습니다
      </h3>
      <p className="text-gray-500">
        {error?.message || '알 수 없는 오류가 발생했습니다.'}
      </p>
    </div>
  );
};

export default ErrorState;