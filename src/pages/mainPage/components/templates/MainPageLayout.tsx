import React from 'react';
import { Header } from '../../../../components/common/templates/Header';
import { BottomBar } from '../../../../components/common/templates/BottomBar';
import { MainContent } from '../organisms/MainContent';

type MainPageLayoutProps = {
  profileName?: string;
};

const MainPageLayout: React.FC<MainPageLayoutProps> = ({ profileName }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header profileName={profileName} />
      <MainContent />
      <BottomBar />
    </div>
  );
};

export default MainPageLayout;