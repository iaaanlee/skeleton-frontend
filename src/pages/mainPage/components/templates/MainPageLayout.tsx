import React from 'react';
import { PageLayout } from '../../../../components/common/templates';
import { Header } from '../../../../components/common/templates/Header';
import { MainContent } from '../organisms/MainContent';

type MainPageLayoutProps = {
  profileName?: string;
};

const MainPageLayout: React.FC<MainPageLayoutProps> = ({ profileName }) => {
  return (
    <PageLayout showHeader={false}>
      <Header profileName={profileName} />
      <MainContent />
    </PageLayout>
  );
};

export default MainPageLayout;