import React from 'react';

type PageTitleProps = {
  title: string;
  className?: string;
};

const PageTitle: React.FC<PageTitleProps> = ({ title, className = '' }) => {
  return (
    <h1 className={`text-2xl font-bold text-gray-900 mb-2 ${className}`}>
      {title}
    </h1>
  );
};

export default PageTitle;