import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetProfilesByAccountId } from '../../../../services/profileService';
import { useAccountAuth } from '../../../../contexts/AccountAuthContext';
import { useProfile } from '../../../../contexts/ProfileContext';
import { ROUTES } from '../../../../constants/routes';
import { Header } from '../molecules/Header';
import { ProfileList } from './ProfileList';
import AuthenticationGuard from '../molecules/AuthenticationGuard';

const SelectProfileContainer: React.FC = () => {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAccountAuth();
  const { selectProfile, clearProfile } = useProfile();
  const { data: profilesData, isLoading } = useGetProfilesByAccountId(isAuthenticated);

  const profiles = profilesData?.data || [];

  const handleProfileClick = async (profileId: string) => {
    try {
      // 프로필 선택 후 바로 이동
      await selectProfile(profileId);
      navigate(ROUTES.MAIN);
    } catch (error) {
      console.error('프로필 선택 중 오류:', error);
    }
  };

  const handleCreateProfile = () => {
    navigate(ROUTES.CREATE_PROFILE);
  };

  const handleLogout = async () => {
    try {
      await clearProfile();
      logout();
      navigate(ROUTES.LOGIN);
    } catch (error) {
      console.error('로그아웃 중 오류:', error);
      logout();
      navigate(ROUTES.LOGIN);
    }
  };

  return (
    <AuthenticationGuard>
      <div className="min-h-screen bg-gray-50">
        <Header onLogout={handleLogout} />
        
        <main className="flex-1 flex items-center justify-center py-12">
          <ProfileList
            profiles={profiles}
            onProfileClick={handleProfileClick}
            onCreateProfile={handleCreateProfile}
            isLoading={isLoading}
          />
        </main>
      </div>
    </AuthenticationGuard>
  );
};

export default SelectProfileContainer;