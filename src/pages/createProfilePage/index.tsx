import React from 'react';
import { useAccountAuth } from "../../contexts/AccountAuthContext";
import { CreateProfileLayout, LoadingState } from './components';

export const CreateProfilePage = () => {
    const { isAuthenticated } = useAccountAuth();
    
    if (!isAuthenticated) {
        return <LoadingState />;
    }

    return <CreateProfileLayout />;
};