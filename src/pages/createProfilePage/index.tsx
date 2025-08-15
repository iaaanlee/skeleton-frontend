import React from 'react';
import { useAccountAuth } from "../../contexts/AccountAuthContext";
import { CreateProfileLayout } from './components';
import { LoadingState } from '../../components/common/molecules';

export const CreateProfilePage = () => {
    const { isAuthenticated } = useAccountAuth();
    
    if (!isAuthenticated) {
        return <LoadingState variant="simple" message="로그인 중..." />;
    }

    return <CreateProfileLayout />;
};