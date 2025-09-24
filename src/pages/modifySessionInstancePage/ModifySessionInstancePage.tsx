import React from 'react';
import { useParams } from 'react-router-dom';
import { ModifySessionInstancePageLayout } from './components';

export const ModifySessionInstancePage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();

  if (!sessionId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">세션 ID가 필요합니다.</p>
        </div>
      </div>
    );
  }

  return <ModifySessionInstancePageLayout sessionId={sessionId} />;
};