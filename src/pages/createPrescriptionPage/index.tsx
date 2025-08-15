import React from 'react';
import { useProfile } from '../../contexts/ProfileContext';
import {
  NoProfileState,
  CreatePrescriptionLayout
} from './components';

export const CreatePrescriptionPage = () => {
    const { currentProfile } = useProfile();

    // 조건부 렌더링
    if (!currentProfile) {
        return <NoProfileState />;
    }

    return (
        <CreatePrescriptionLayout />
    );
};
