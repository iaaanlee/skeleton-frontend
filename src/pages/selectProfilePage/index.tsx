import { useNavigate } from "react-router-dom";
import { useGetProfilesByAccountId } from "../../services/profileService";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect } from "react";
import { Header } from "./components/molecules/Header";
import { ProfileList } from "./components/organisms/ProfileList";

export const SelectProfilePage = () => {
    const navigate = useNavigate();
    const { logout, isAuthenticated } = useAuth();
    const { data: profilesData, isLoading } = useGetProfilesByAccountId(isAuthenticated);
    
    // 인증 상태 확인
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', { replace: true });
        }
    }, [isAuthenticated, navigate]);
    
    // 로그인되지 않은 경우 로딩 표시
    if (!isAuthenticated) {
        return <div className="min-h-screen flex items-center justify-center">로그인 중...</div>;
    }
    
    const profiles = profilesData?.data || [];
    
    const handleProfileClick = (profileId: string) => {
        // TODO: 프로필 상세 페이지로 이동
        console.log('Profile clicked:', profileId);
    };
    
    const handleCreateProfile = () => {
        navigate('/create-profile');
    };
    
    const handleLogout = () => {
        logout();
        navigate('/login');
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