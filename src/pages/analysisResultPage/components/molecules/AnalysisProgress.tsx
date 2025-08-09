import React from 'react';
import ProgressBar from '../../../../components/common/molecules/ProgressBar';

type AnalysisProgressProps = {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  message: string;
  estimatedTime?: number;
  error?: string;
};

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({
  status,
  progress,
  message,
  estimatedTime,
  error
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return 'text-blue-600';
      case 'processing':
        return 'text-yellow-600';
      case 'completed':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'processing':
        return '🔄';
      case 'completed':
        return '✅';
      case 'failed':
        return '❌';
      default:
        return '📊';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return '대기 중';
      case 'processing':
        return '분석 중';
      case 'completed':
        return '완료';
      case 'failed':
        return '실패';
      default:
        return '알 수 없음';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">{getStatusIcon()}</div>
        <h3 className={`text-lg font-semibold ${getStatusColor()}`}>
          {getStatusText()}
        </h3>
        <p className="text-gray-600 mt-2">{message}</p>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">진행률</span>
          <span className="text-sm text-gray-500">{progress}%</span>
        </div>
        <ProgressBar 
          progress={progress}
          type="linear"
          size={60}
          color={status === 'failed' ? 'red' : status === 'completed' ? 'green' : 'blue'}
        />
      </div>

      {estimatedTime && status === 'processing' && (
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600">
            예상 소요 시간: {estimatedTime}초
          </p>
        </div>
      )}

      {error && status === 'failed' && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {status === 'processing' && (
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-xs text-gray-500 mt-2">잠시만 기다려주세요...</p>
        </div>
      )}
    </div>
  );
};
