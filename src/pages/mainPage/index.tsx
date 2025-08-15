import React from 'react';
import { useProfile } from '../../contexts/ProfileContext';
import { MainPageLayout } from './components';

export const MainPage = () => {
    const { currentProfile } = useProfile();

    return (
        <MainPageLayout profileName={currentProfile?.profileName} />
    );
};
