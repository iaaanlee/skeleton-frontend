import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../constants/routes';

export type ErrorStateProps = {
  message?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  className?: string;
};

const ErrorState: React.FC<ErrorStateProps> = ({ 
  message = "분석 상태를 불러올 수 없습니다.",
  buttonText = "처방 생성 페이지로 돌아가기",
  onButtonClick,
  className = ""
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else {
      navigate(ROUTES.CREATE_PRESCRIPTION);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col bg-gray-50 ${className}`}>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{message}</p>
          <button
            onClick={handleClick}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;