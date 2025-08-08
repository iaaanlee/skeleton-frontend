import React, { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useProfile } from '../../contexts/ProfileAuthContext';
import { useNavigate } from 'react-router-dom';
import { ProfileHeader } from './components/organisms/ProfileHeader';
import { ProfileContent } from './components/organisms/ProfileContent';
import { BottomBar } from '../../components/common/templates/BottomBar';
import { ROUTES } from '../../constants/routes';

export const ProfilePage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { selectedProfile, clearSelectedProfile } = useProfile();

    const handleLogout = useCallback(() => {
        // 계정과 프로필 모두 로그아웃
        navigate(ROUTES.LOGIN);
    }, [navigate]);

    const handleSelectOtherProfile = useCallback(() => {
        // 프로필 관련 쿼리 무효화
        queryClient.invalidateQueries({ queryKey: ['profiles'] });
        // 현재 선택된 프로필 해제
        clearSelectedProfile();
        // 프로필 선택 페이지로 이동
        navigate(ROUTES.SELECT_PROFILE);
    }, [queryClient, clearSelectedProfile, navigate]);

    const handleEditProfile = useCallback(() => {
        navigate(ROUTES.EDIT_PROFILE);
    }, [navigate]);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <ProfileHeader />
            <ProfileContent 
                profileName={selectedProfile!.profileName}
                onLogout={handleLogout}
                onSelectOtherProfile={handleSelectOtherProfile}
                onEditProfile={handleEditProfile}
            />
            <BottomBar />
        </div>
    );
};
