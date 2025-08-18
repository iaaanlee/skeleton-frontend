import React from 'react';
import { useProfile } from '../../contexts/ProfileContext';
import { NoProfileState } from '../createPrescriptionPage/components/molecules';
import { TestCreatePrescriptionLayout } from './components/templates';

export const TestCreatePrescriptionPage = () => {
    const { currentProfile } = useProfile();

    // 조건부 렌더링
    if (!currentProfile) {
        return <NoProfileState />;
    }

    return (
        <TestCreatePrescriptionLayout />
    );
};