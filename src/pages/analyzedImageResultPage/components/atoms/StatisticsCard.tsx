import React from 'react';

type StatisticsCardProps = {
  value: string | number;
  label: string;
  color?: 'blue' | 'green' | 'purple' | 'gray';
  className?: string;
};

const StatisticsCard: React.FC<StatisticsCardProps> = ({
  value,
  label,
  color = 'blue',
  className = ''
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    gray: 'bg-gray-50 text-gray-600'
  };

  return (
    <div className={`text-center p-4 ${colorClasses[color]} rounded-lg ${className}`}>
      <div className={`text-2xl font-bold ${colorClasses[color].split(' ')[1]}`}>
        {value}
      </div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
};

export default StatisticsCard;