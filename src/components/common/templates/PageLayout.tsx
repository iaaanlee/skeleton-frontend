import React from 'react';
import { Header } from './Header';
import { BottomBar } from './BottomBar';
import { RouteValue } from '../../../constants/routes';

type PageLayoutProps = {
  children: React.ReactNode;
  backRoute?: RouteValue;
  showHeader?: boolean;
  showBottomBar?: boolean;
  className?: string;
  contentClassName?: string;
};

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  backRoute,
  showHeader = true,
  showBottomBar = true,
  className = '',
  contentClassName = ''
}) => {
  return (
    <div className={`min-h-screen flex flex-col bg-gray-50 ${className}`}>
      {showHeader && <Header backRoute={backRoute} />}
      
      <div className={`flex-1 ${contentClassName}`}>
        {children}
      </div>
      
      {showBottomBar && <BottomBar />}
    </div>
  );
};

export default PageLayout;