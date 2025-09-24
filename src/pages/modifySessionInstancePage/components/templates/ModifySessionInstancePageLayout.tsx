import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionDetail } from '../../../../services/workoutService/sessionDetailService';
import { useModifySession } from '../../../../services/workoutService/sessionModificationService';
import {
  ModifySessionTopBar,
  SessionInfoEditor,
  WorkoutPlanEditor
} from '../organisms';
import type { ModifySessionRequest } from '../../../../types/workout';

type Props = {
  sessionId: string;
};

export const ModifySessionInstancePageLayout: React.FC<Props> = ({ sessionId }) => {
  const navigate = useNavigate();
  const [isModified, setIsModified] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<ModifySessionRequest>({});

  const { data: sessionDetail, isLoading, error } = useSessionDetail(sessionId);
  const modifySessionMutation = useModifySession();

  const handleBack = () => {
    if (isModified) {
      if (window.confirm('저장하지 않은 변경사항이 있습니다. 정말 나가시겠습니까?')) {
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  };

  const handleSave = async () => {
    try {
      await modifySessionMutation.mutateAsync({
        sessionId,
        data: pendingChanges
      });
      setIsModified(false);
      setPendingChanges({});
      alert('세션이 성공적으로 수정되었습니다.');
      navigate(-1);
    } catch (error) {
      console.error('세션 수정 실패:', error);
      alert('세션 수정에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleChanges = (changes: Partial<ModifySessionRequest>) => {
    setPendingChanges(prev => ({ ...prev, ...changes }));
    setIsModified(true);
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
              <div className="w-16 h-8 bg-gray-200 rounded" />
            </div>
          </div>

          {/* Session editor skeleton */}
          <div className="p-4 space-y-4">
            <div className="bg-white rounded-lg p-4 border space-y-3">
              <div className="h-6 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded" />
            </div>

            <div className="bg-white rounded-lg p-4 border space-y-3">
              <div className="h-6 bg-gray-200 rounded w-1/3" />
              <div className="space-y-2">
                <div className="h-16 bg-gray-200 rounded" />
                <div className="h-16 bg-gray-200 rounded" />
                <div className="h-16 bg-gray-200 rounded" />
              </div>
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

  // Check if session can be modified
  if (sessionDetail.status !== 'scheduled') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-amber-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">수정할 수 없는 세션입니다</h2>
          <p className="text-gray-600 text-sm">
            {sessionDetail.status === 'started' ? '진행 중인 세션은 수정할 수 없습니다.' : '완료된 세션은 수정할 수 없습니다.'}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <ModifySessionTopBar
        sessionName={sessionDetail.sessionName}
        isModified={isModified}
        isSaving={modifySessionMutation.isPending}
        onBack={handleBack}
        onSave={handleSave}
      />

      {/* Session Info Editor */}
      <div className="p-4">
        <SessionInfoEditor
          sessionDetail={sessionDetail}
          onChange={handleChanges}
        />
      </div>

      {/* Workout Plan Editor */}
      <div className="px-4 pb-20">
        <WorkoutPlanEditor
          effectiveBlueprint={sessionDetail.effectiveBlueprint}
          sessionId={sessionId}
          onChange={handleChanges}
        />
      </div>

      {/* Fixed Save Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="flex space-x-3">
          <button
            onClick={handleBack}
            className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            disabled={modifySessionMutation.isPending}
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={!isModified || modifySessionMutation.isPending}
            className="flex-1 py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {modifySessionMutation.isPending ? '저장 중...' : '저장하기'}
          </button>
        </div>
      </div>
    </div>
  );
};