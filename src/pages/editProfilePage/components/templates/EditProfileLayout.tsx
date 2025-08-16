import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../../../contexts/ProfileContext';
import { useGetCurrentProfileDetails } from '../../../../services/profileService';
import { EditProfileHeader } from '../organisms/EditProfileHeader';
import { EditProfileContent } from '../organisms/EditProfileContent';
import LoadingState from '../molecules/LoadingState';
import ErrorState from '../molecules/ErrorState';
import { ROUTES } from '../../../../constants/routes';
import { ProfileInfo } from '../../../../types/profile/profile';

const EditProfileLayout: React.FC = () => {
    const navigate = useNavigate();
    const { currentProfile } = useProfile();
    
    const { data: fullProfile, isLoading, error } = useGetCurrentProfileDetails();

    const handleUpdateSuccess = (updatedProfile: ProfileInfo) => {
        alert('프로필이 성공적으로 수정되었습니다!');
        navigate(ROUTES.PROFILE);
    };

    const handleUpdateError = (error: string) => {
        alert(`프로필 수정 중 오류가 발생했습니다: ${error}`);
    };

    if (!currentProfile || isLoading) {
        return <LoadingState />;
    }

    if (error || !fullProfile?.data?.profile) {
        return <ErrorState />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <EditProfileHeader />
            <EditProfileContent 
                profile={fullProfile.data.profile}
                onUpdateSuccess={handleUpdateSuccess}
                onUpdateError={handleUpdateError}
            />
        </div>
    );
};

export default EditProfileLayout;