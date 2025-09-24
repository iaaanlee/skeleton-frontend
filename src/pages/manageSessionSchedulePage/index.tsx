import React from 'react';
import { useProfile } from '../../contexts/ProfileContext';
import { ManageSessionSchedulePageLayout } from './components';

export const ManageSessionSchedulePage = () => {
    const { currentProfile } = useProfile();

    if (!currentProfile) {
        return <div>프로필을 선택해주세요.</div>;
    }

    return (
        <ManageSessionSchedulePageLayout profileId={currentProfile.profileId} />
    );
};