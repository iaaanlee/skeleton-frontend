import React from 'react';

type EstimatedTimeProps = {
  timeText?: string;
  className?: string;
};

const EstimatedTime: React.FC<EstimatedTimeProps> = ({ 
  timeText = "약 1-2분",
  className = '' 
}) => {
  return (
    <div className={`mt-8 text-center ${className}`}>
      <p className="text-sm text-gray-500">
        예상 소요 시간: {timeText}
      </p>
    </div>
  );
};

export default EstimatedTime;