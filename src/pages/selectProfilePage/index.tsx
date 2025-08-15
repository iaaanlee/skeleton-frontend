import React from 'react';
import { useAccountAuth } from "../../contexts/AccountAuthContext";
import { SelectProfileLayout, LoadingState } from './components';

export const SelectProfilePage = () => {
    const { isAuthenticated } = useAccountAuth();
    
    if (!isAuthenticated) {
        return <LoadingState />;
    }

    return <SelectProfileLayout />;
}; 