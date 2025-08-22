import React from 'react';
import { Header } from './Header';
import { BottomBar } from './BottomBar';
import { RouteValue } from '../../../constants/routes';

type ScrollablePageLayoutProps = {
  children: React.ReactNode;
  backRoute?: RouteValue;
  showHeader?: boolean;
  showBottomBar?: boolean;
  className?: string;
  contentClassName?: string;
};

const ScrollablePageLayout: React.FC<ScrollablePageLayoutProps> = ({
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
      
      <main className={`flex-1 overflow-y-auto ${contentClassName}`}>
        {children}
      </main>
      
      {showBottomBar && <BottomBar />}
    </div>
  );
};

export default ScrollablePageLayout;