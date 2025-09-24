import React from 'react';
import { useProfile } from '../../contexts/ProfileContext';
import { ManageSessionSchedulePageLayout } from './components';

type Props = {};

export const ManageSessionSchedulePage: React.FC<Props> = () => {
  const { currentProfile } = useProfile();

  if (!currentProfile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">프로필을 선택해주세요.</p>
        </div>
      </div>
    );
  }

  return <ManageSessionSchedulePageLayout profileId={currentProfile.profileId} />;
};