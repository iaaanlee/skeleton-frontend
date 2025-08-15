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
};

const FormLayout: React.FC<FormLayoutProps> = ({
  title,
  description,
  children,
  maxWidth = '4xl',
  titleAlign = 'center',
  className = '',
  contentClassName = ''
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

  return (
    <div className={`p-5 ${maxWidthClasses[maxWidth]} mx-auto ${className}`}>
      <PageHeader
        title={title}
        description={description}
        titleClassName={alignClasses[titleAlign]}
        descriptionClassName={alignClasses[titleAlign]}
      />
      <div className={contentClassName}>
        {children}
      </div>
    </div>
  );
};

export default FormLayout;