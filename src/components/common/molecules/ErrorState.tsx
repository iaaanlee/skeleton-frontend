import React from 'react';
import { Header } from '../templates/Header';
import { BottomBar } from '../templates/BottomBar';
import { ROUTES, RouteValue } from '../../../constants/routes';

type ErrorStateVariant = 'simple' | 'detailed' | 'fullPage';

type ErrorStateProps = {
  variant?: ErrorStateVariant;
  title?: string;
  message?: string;
  error?: any;
  backRoute?: RouteValue;
  className?: string;
};

const ErrorState: React.FC<ErrorStateProps> = ({ 
  variant = 'detailed',
  title = '오류가 발생했습니다',
  message,
  error,
  backRoute = ROUTES.MAIN,
  className = ''
}) => {
  const getErrorMessage = () => {
    if (message) return message;
    if (error?.message) return error.message;
    return '알 수 없는 오류가 발생했습니다.';
  };

  const renderContent = () => {
    switch (variant) {
      case 'simple':
        return (
          <div className={`mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-center ${className}`}>
            {getErrorMessage()}
          </div>
        );

      case 'detailed':
        return (
          <div className={`text-center py-12 ${className}`}>
            <div className="text-red-500 text-2xl mb-2">⚠️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {title}
            </h3>
            <p className="text-gray-500">
              {getErrorMessage()}
            </p>
          </div>
        );

      case 'fullPage':
        return (
          <div className="min-h-screen flex flex-col bg-gray-50">
            <Header backRoute={backRoute} />
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-red-500 text-4xl mb-4">⚠️</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  {title}
                </h3>
                <p className="text-gray-500">
                  {getErrorMessage()}
                </p>
              </div>
            </div>
            <BottomBar />
          </div>
        );

      default:
        return null;
    }
  };

  if (variant === 'fullPage') {
    return renderContent();
  }

  return <>{renderContent()}</>;
};

export default ErrorState;