import React from 'react';
import StatisticsCard from '../atoms/StatisticsCard';

type StatisticsItem = {
  value: string | number;
  label: string;
  color?: 'blue' | 'green' | 'purple' | 'gray';
};

type StatisticsGridProps = {
  items: StatisticsItem[];
  className?: string;
};

const StatisticsGrid: React.FC<StatisticsGridProps> = ({
  items,
  className = ''
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
      {items.map((item, index) => (
        <StatisticsCard
          key={index}
          value={item.value}
          label={item.label}
          color={item.color}
        />
      ))}
    </div>
  );
};

export default StatisticsGrid;