import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetProfilesByAccountId } from "../../../../services/profileService";
import { useAccountAuth } from "../../../../contexts/AccountAuthContext";
import { useProfile } from '../../../../contexts/ProfileContext';
import { Header } from "../molecules/Header";
import { ProfileList } from "../organisms/ProfileList";
import { ROUTES } from '../../../../constants/routes';

const SelectProfileLayout: React.FC = () => {
    const navigate = useNavigate();
    const { logout, isAuthenticated } = useAccountAuth();
    const { selectProfile, clearProfile, currentProfile } = useProfile();
    const { data: profilesData, isLoading } = useGetProfilesByAccountId(isAuthenticated);
    const [isSelecting, setIsSelecting] = useState(false);
    const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
    
    // 인증 상태 확인
    useEffect(() => {
        if (!isAuthenticated) {
            navigate(ROUTES.LOGIN, { replace: true });
        }
    }, [isAuthenticated, navigate]);

    // 프로필이 선택되면 메인 페이지로 이동
    useEffect(() => {
        if (currentProfile && isSelecting && selectedProfileId) {
            // 실제로 선택한 프로필 ID와 현재 프로필 ID가 일치하는지 확인
            if (currentProfile.profileId === selectedProfileId) {
                // 상태 초기화
                setIsSelecting(false);
                setSelectedProfileId(null);
                navigate(ROUTES.MAIN);
            }
        }
    }, [currentProfile, isSelecting, selectedProfileId, navigate]);
    
    const profiles = profilesData?.data || [];
    
    const handleProfileClick = async (profileId: string) => {
        try {
            // 이미 선택된 프로필이면 바로 메인 페이지로 이동
            if (currentProfile?.profileId === profileId) {
                navigate(ROUTES.MAIN);
                return;
            }

            setIsSelecting(true);
            setSelectedProfileId(profileId);
            // 백엔드를 통해 프로필 선택
            await selectProfile(profileId);
            // 프로필 선택 완료 후 useEffect에서 자동으로 페이지 이동
        } catch (error) {
            console.error('프로필 선택 중 오류:', error);
            setIsSelecting(false);
            setSelectedProfileId(null);
            // 오류 처리 (필요시 토스트 메시지 등)
        }
    };
    
    const handleCreateProfile = () => {
        navigate(ROUTES.CREATE_PROFILE);
    };
    
    const handleLogout = async () => {
        try {
            // 현재 선택된 프로필 해제
            await clearProfile();
            // 계정 로그아웃
            logout();
            navigate(ROUTES.LOGIN);
        } catch (error) {
            console.error('로그아웃 중 오류:', error);
            // 오류가 발생해도 강제로 로그아웃
            logout();
            navigate(ROUTES.LOGIN);
        }
    };
    
    return (
        <div className="min-h-screen bg-gray-50">
            <Header onLogout={handleLogout} />
            
            {/* 메인 컨텐츠 */}
            <main className="flex-1 flex items-center justify-center py-12">
                <ProfileList
                    profiles={profiles}
                    onProfileClick={handleProfileClick}
                    onCreateProfile={handleCreateProfile}
                    isLoading={isLoading}
                />
            </main>
        </div>
    );
};

export default SelectProfileLayout;