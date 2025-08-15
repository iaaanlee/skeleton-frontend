import React from 'react';
import { Header } from '../templates/Header';
import { BottomBar } from '../templates/BottomBar';
import LoadingSpinner from '../atoms/LoadingSpinner';
import { ROUTES, RouteValue } from '../../../constants/routes';

type LoadingStateVariant = 'simple' | 'spinner' | 'fullPage';

type LoadingStateProps = {
  variant?: LoadingStateVariant;
  message?: string;
  backRoute?: RouteValue;
  className?: string;
};

const LoadingState: React.FC<LoadingStateProps> = ({ 
  variant = 'spinner',
  message = '로딩 중...',
  backRoute = ROUTES.MAIN,
  className = ''
}) => {
  const renderContent = () => {
    switch (variant) {
      case 'simple':
        return (
          <div className={`text-center text-gray-600 ${className}`}>
            {message}
          </div>
        );

      case 'spinner':
        return (
          <div className={`text-center py-12 ${className}`}>
            <LoadingSpinner className="mx-auto mb-4" />
            <p className="text-gray-600">{message}</p>
          </div>
        );

      case 'fullPage':
        return (
          <div className="min-h-screen flex flex-col bg-gray-50">
            <Header backRoute={backRoute} />
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <LoadingSpinner size="lg" className="mx-auto mb-4" />
                <p className="text-gray-600">{message}</p>
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

export default LoadingState;