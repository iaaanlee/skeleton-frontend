import { useProfile } from '../../contexts/ProfileContext';
import { useNavigate } from 'react-router-dom';
import { useGetCurrentProfileDetails } from '../../services/profileService';
import { EditProfileHeader } from './components/organisms/EditProfileHeader';
import { EditProfileContent } from './components/organisms/EditProfileContent';
import { ROUTES } from '../../constants/routes';

export const EditProfilePage = () => {
    const navigate = useNavigate();
    const { currentProfile } = useProfile();
    
    // 현재 선택된 프로필의 전체 정보 조회
    const { data: fullProfile, isLoading, error } = useGetCurrentProfileDetails();

    const handleUpdateSuccess = (updatedProfile: any) => {
        // TODO: 프로필 업데이트 성공 처리
        alert('프로필이 성공적으로 수정되었습니다!');
        navigate(ROUTES.PROFILE);
    };

    const handleUpdateError = (error: string) => {
        alert(`프로필 수정 중 오류가 발생했습니다: ${error}`);
    };

    // 프로필이 없거나 로딩 중이면 로딩 화면 표시
    if (!currentProfile || isLoading) {
        return <div className="min-h-screen flex items-center justify-center">프로필 정보를 불러오는 중...</div>;
    }

    // 에러가 있으면 에러 화면 표시
    if (error || !fullProfile?.data?.profile) {
        return <div className="min-h-screen flex items-center justify-center">프로필 정보를 불러오는 중 오류가 발생했습니다.</div>;
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
