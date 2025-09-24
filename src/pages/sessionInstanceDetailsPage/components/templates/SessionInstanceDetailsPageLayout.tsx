import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionDetail } from '../../../../services/workoutService/sessionDetailService';
import { ROUTES } from '../../../../constants/routes';
import {
  SessionDetailTopBar,
  SessionInfoCard,
  SessionDetailTabs,
  WorkoutPlanTab,
  WorkoutSummaryTab
} from '../organisms';

type Props = {
  sessionId: string;
};

export const SessionInstanceDetailsPageLayout: React.FC<Props> = ({ sessionId }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'plan' | 'summary'>('plan');

  const { data: sessionDetail, isLoading, error } = useSessionDetail(sessionId);

  const handleModifySession = () => {
    navigate(ROUTES.MODIFY_SESSION_INSTANCE.replace(':sessionId', sessionId));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="animate-pulse">
          {/* Top bar skeleton */}
          <div className="bg-white border-b p-4">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 bg-gray-200 rounded" />
              <div className="w-32 h-6 bg-gray-200 rounded" />
              <div className="w-8 h-8 bg-gray-200 rounded" />
            </div>
          </div>

          {/* Session info card skeleton */}
          <div className="p-4">
            <div className="bg-white rounded-lg p-4 border">
              <div className="h-6 bg-gray-200 rounded mb-3" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          </div>

          {/* Tabs skeleton */}
          <div className="p-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <div className="flex-1 h-10 bg-gray-200 rounded m-1" />
              <div className="flex-1 h-10 bg-gray-200 rounded m-1" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">세션을 불러올 수 없습니다</h2>
          <p className="text-gray-600 text-sm">{error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'}</p>
        </div>
      </div>
    );
  }

  if (!sessionDetail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">세션 정보가 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <SessionDetailTopBar
        sessionName={sessionDetail.sessionName}
        status={sessionDetail.status}
      />

      {/* Session Info Card */}
      <div className="p-4">
        <SessionInfoCard sessionDetail={sessionDetail} />
      </div>

      {/* Tab Navigation */}
      <div className="px-4">
        <SessionDetailTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Tab Content */}
      <div className="flex-1 px-4 pb-4">
        {activeTab === 'plan' ? (
          <WorkoutPlanTab
            effectiveBlueprint={sessionDetail.effectiveBlueprint}
            sessionStatus={sessionDetail.status}
          />
        ) : (
          <WorkoutSummaryTab
            sessionDetail={sessionDetail}
          />
        )}
      </div>

      {/* Action Buttons (if needed) */}
      {sessionDetail.status === 'scheduled' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
          <div className="flex space-x-3">
            <button
              onClick={handleModifySession}
              className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              수정하기
            </button>
            <button className="flex-1 py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
              시작하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};