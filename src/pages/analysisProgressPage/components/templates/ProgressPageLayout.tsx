import React from 'react';
import PageHeader from '../organisms/PageHeader';
import ProgressContent from '../organisms/ProgressContent';
import { AnalysisStatus } from '../../../../types/analysis/analysis';

export type ProgressPageLayoutProps = {
  status: AnalysisStatus;
  message?: string;
  className?: string;
};

const ProgressPageLayout: React.FC<ProgressPageLayoutProps> = ({
  status,
  message,
  className = ""
}) => {
  return (
    <div className={`min-h-screen flex flex-col bg-gray-50 ${className}`}>
      <PageHeader />
      <ProgressContent 
        status={status}
        message={message}
      />
    </div>
  );
};

export default ProgressPageLayout;