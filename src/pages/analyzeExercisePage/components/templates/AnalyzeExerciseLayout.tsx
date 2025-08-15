import React from 'react';
import { Header } from '../../../../components/common/templates/Header';
import { BottomBar } from '../../../../components/common/templates/BottomBar';
import { MainContent } from '../organisms/MainContent';
import { ROUTES } from '../../../../constants/routes';

const AnalyzeExerciseLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header backRoute={ROUTES.MAIN} />
      <MainContent />
      <BottomBar />
    </div>
  );
};

export default AnalyzeExerciseLayout;