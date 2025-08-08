import { useProfile } from '../../contexts/ProfileAuthContext';
import { useNavigate } from 'react-router-dom';
import { EditProfileHeader } from './components/organisms/EditProfileHeader';
import { EditProfileContent } from './components/organisms/EditProfileContent';
import { ROUTES } from '../../constants/routes';

export const EditProfilePage = () => {
    const navigate = useNavigate();
    const { selectedProfile } = useProfile();

    const handleUpdateSuccess = (updatedProfile: any) => {
        // TODO: 프로필 업데이트 성공 처리
        alert('프로필이 성공적으로 수정되었습니다!');
        navigate(ROUTES.PROFILE);
    };

    const handleUpdateError = (error: string) => {
        alert(`프로필 수정 중 오류가 발생했습니다: ${error}`);
    };

    // 프로필이 없으면 로딩 화면 표시
    if (!selectedProfile) {
        return <div className="min-h-screen flex items-center justify-center">프로필 정보를 불러오는 중...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <EditProfileHeader />
            <EditProfileContent 
                profile={selectedProfile}
                onUpdateSuccess={handleUpdateSuccess}
                onUpdateError={handleUpdateError}
            />
        </div>
    );
};
