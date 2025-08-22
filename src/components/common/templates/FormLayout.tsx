import React from 'react';
import { PageHeader } from '../molecules';

type FormLayoutProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl';
  titleAlign?: 'left' | 'center' | 'right';
  className?: string;
  contentClassName?: string;
  scrollable?: boolean;
};

const FormLayout: React.FC<FormLayoutProps> = ({
  title,
  description,
  children,
  maxWidth = '4xl',
  titleAlign = 'center',
  className = '',
  contentClassName = '',
  scrollable = true
}) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md', 
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '6xl': 'max-w-6xl'
  };

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  const containerClass = scrollable 
    ? `p-5 ${maxWidthClasses[maxWidth]} mx-auto min-h-0 ${className}`
    : `p-5 ${maxWidthClasses[maxWidth]} mx-auto ${className}`;

  return (
    <div className={containerClass}>
      <PageHeader
        title={title}
        description={description}
        titleClassName={alignClasses[titleAlign]}
        descriptionClassName={alignClasses[titleAlign]}
      />
      <div className={`${contentClassName} ${scrollable ? 'pb-20' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default FormLayout;