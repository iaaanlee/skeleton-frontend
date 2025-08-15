import React from 'react';

type PageDescriptionProps = {
  description: string;
  className?: string;
};

const PageDescription: React.FC<PageDescriptionProps> = ({ description, className = '' }) => {
  return (
    <p className={`text-gray-600 ${className}`}>
      {description}
    </p>
  );
};

export default PageDescription;