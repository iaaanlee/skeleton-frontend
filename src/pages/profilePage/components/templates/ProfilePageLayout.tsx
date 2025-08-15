import React, { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useProfile } from '../../../../contexts/ProfileContext';
import { useNavigate } from 'react-router-dom';
import { ProfileHeader } from '../organisms/ProfileHeader';
import { ProfileContent } from '../organisms/ProfileContent';
import { PageLayout } from '../../../../components/common/templates';
import { ROUTES } from '../../../../constants/routes';

const ProfilePageLayout: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { currentProfile, clearProfile } = useProfile();

    const handleLogout = useCallback(() => {
        navigate(ROUTES.LOGIN);
    }, [navigate]);

    const handleSelectOtherProfile = useCallback(async () => {
        queryClient.invalidateQueries({ queryKey: ['profiles'] });
        await clearProfile();
        navigate(ROUTES.SELECT_PROFILE);
    }, [queryClient, clearProfile, navigate]);

    const handleEditProfile = useCallback(() => {
        navigate(ROUTES.EDIT_PROFILE);
    }, [navigate]);

    return (
        <PageLayout showHeader={false}>
            <ProfileHeader />
            <ProfileContent 
                profileName={currentProfile!.profileName}
                onLogout={handleLogout}
                onSelectOtherProfile={handleSelectOtherProfile}
                onEditProfile={handleEditProfile}
            />
        </PageLayout>
    );
};

export default ProfilePageLayout;