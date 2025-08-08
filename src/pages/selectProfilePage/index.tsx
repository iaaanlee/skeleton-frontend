import { useNavigate } from "react-router-dom";
import { useGetProfilesByAccountId } from "../../services/profileService";
import { useAccountAuth } from "../../contexts/AccountAuthContext";
import { useProfile } from "../../contexts/ProfileAuthContext";
import { useEffect } from "react";
import { Header } from "./components/molecules/Header";
import { ProfileList } from "./components/organisms/ProfileList";
import { ROUTES } from '../../constants/routes';

export const SelectProfilePage = () => {
    const navigate = useNavigate();
    const { logout, isAuthenticated } = useAccountAuth();
    const { setSelectedProfile, clearSelectedProfile, clearAllProfileData } = useProfile();
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
    
    const handleProfileClick = (profileId: string) => {
        // 선택된 프로필 찾기
        const selectedProfile = profiles.find(profile => profile._id === profileId);
        if (selectedProfile) {
            // 프로필 상태에 저장
            setSelectedProfile(selectedProfile);
            // 메인페이지로 이동
            navigate(ROUTES.MAIN);
        }
    };
    
    const handleCreateProfile = () => {
        navigate(ROUTES.CREATE_PROFILE);
    };
    
    const handleLogout = () => {
        clearSelectedProfile(); // 현재 프로필 상태 초기화
        clearAllProfileData(); // 모든 프로필 데이터 정리
        logout();
        navigate(ROUTES.LOGIN);
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