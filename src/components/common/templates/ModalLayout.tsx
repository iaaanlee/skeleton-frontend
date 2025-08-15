import React from 'react';

type ModalLayoutProps = {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl';
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
};

const ModalLayout: React.FC<ModalLayoutProps> = ({
  title,
  children,
  onClose,
  footer,
  maxWidth = '2xl',
  className = '',
  headerClassName = '',
  contentClassName = '',
  footerClassName = ''
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

  const defaultFooter = (
    <div className={`flex justify-end space-x-3 p-6 border-t ${footerClassName}`}>
      <button
        onClick={onClose}
        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
      >
        닫기
      </button>
    </div>
  );

  return (
    <div className={`bg-white rounded-lg shadow-xl ${maxWidthClasses[maxWidth]} w-full mx-4 max-h-[90vh] overflow-y-auto ${className}`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-6 border-b ${headerClassName}`}>
        <h2 className="text-xl font-semibold text-gray-900">
          {title}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className={`p-6 ${contentClassName}`}>
        {children}
      </div>

      {/* Footer */}
      {footer || defaultFooter}
    </div>
  );
};

export default ModalLayout;