import React from 'react';

type PageHeaderProps = {
  title: string;
  description?: string;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
};

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  description,
  className = '',
  titleClassName = '',
  descriptionClassName = ''
}) => {
  return (
    <div className={`mb-6 ${className}`}>
      <h1 className={`text-2xl font-bold text-gray-900 mb-2 ${titleClassName}`}>
        {title}
      </h1>
      {description && (
        <p className={`text-gray-600 ${descriptionClassName}`}>
          {description}
        </p>
      )}
    </div>
  );
};

export default PageHeader;