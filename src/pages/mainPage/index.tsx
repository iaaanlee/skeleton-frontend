import React from 'react';
import { useProfile } from '../../contexts/ProfileAuthContext';
import { MainPageLayout } from './components';

export const MainPage = () => {
    const { selectedProfile } = useProfile();

    return (
        <MainPageLayout profileName={selectedProfile?.profileName} />
    );
};
