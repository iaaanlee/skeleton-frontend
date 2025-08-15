import { useNavigate } from "react-router-dom";
import { useGetProfilesByAccountId } from "../../services/profileService";
import { useAccountAuth } from "../../contexts/AccountAuthContext";
import { useProfile } from '../../contexts/ProfileContext';
import { useEffect } from "react";
import { Header } from "./components/molecules/Header";
import { ProfileList } from "./components/organisms/ProfileList";
import { ROUTES } from '../../constants/routes';

export const SelectProfilePage = () => {
    const navigate = useNavigate();
    const { logout, isAuthenticated } = useAccountAuth();
    const { selectProfile, clearProfile } = useProfile();
    const { data: profilesData, isLoading } = useGetProfilesByAccountId(isAuthenticated);
    
    // 인증 상태 확인
    useEffect(() => {
        if (!isAuthenticated) {
            navigate(ROUTES.LOGIN, { replace: true });
        }
    }, [isAuthenticated, navigate]);
    
    // 로그인되지 않은 경우 로딩 표시
    if (!isAuthenticated) {
        return <div className="min-h-screen flex items-center justify-center">로그인 중...</div>;
    }
    
    const profiles = profilesData?.data || [];
    
    const handleProfileClick = async (profileId: string) => {
        try {
            // 백엔드를 통해 프로필 선택
            await selectProfile(profileId);
            // 메인페이지로 이동
            navigate(ROUTES.MAIN);
        } catch (error) {
            console.error('프로필 선택 중 오류:', error);
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