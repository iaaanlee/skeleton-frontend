import React from 'react';

const PageHeader: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">분석 결과</h1>
      <p className="text-gray-600">
        분석이 완료되었습니다. 원하는 결과를 선택해주세요.
      </p>
    </div>
  );
};

export default PageHeader;