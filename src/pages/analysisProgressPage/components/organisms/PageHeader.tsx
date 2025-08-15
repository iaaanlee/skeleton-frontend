import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../constants/routes';

export type PageHeaderProps = {
  title?: string;
  backButtonText?: string;
  onBackClick?: () => void;
  className?: string;
};

const PageHeader: React.FC<PageHeaderProps> = ({
  title = "운동 분석 진행 중",
  backButtonText = "← 돌아가기",
  onBackClick,
  className = ""
}) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(ROUTES.CREATE_PRESCRIPTION);
    }
  };

  return (
    <div className={`bg-white shadow-sm border-b ${className}`}>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          </div>
          <button
            onClick={handleBackClick}
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            {backButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;