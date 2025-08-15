import React from 'react';
import { useProfile } from '../../contexts/ProfileAuthContext';
import {
  NoProfileState,
  CreatePrescriptionLayout
} from './components';

export const CreatePrescriptionPage = () => {
    const { selectedProfile } = useProfile();

    // 조건부 렌더링
    if (!selectedProfile?._id) {
        return <NoProfileState />;
    }

    return (
        <CreatePrescriptionLayout profileId={selectedProfile._id} />
    );
};
