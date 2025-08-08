import { ProfileButton } from "../atoms/ProfileButton";
import { ProfileInfo } from "../../../../types/profile/profile";

interface ProfileListProps {
    profiles: ProfileInfo[];
    onProfileClick: (profileId: string) => void;
    onCreateProfile: () => void;
    isLoading: boolean;
}

export const ProfileList = ({ profiles, onProfileClick, onCreateProfile, isLoading }: ProfileListProps) => {
    if (isLoading) {
        return <div className="text-gray-600">로딩 중...</div>;
    }

    const hasProfiles = profiles.length > 0;

    return (
        <div className="text-center">
            {/* 프로필 목록 */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
                {profiles.map((profile) => (
                    <ProfileButton
                        key={profile._id}
                        profileName={profile.profileName}
                        onClick={() => onProfileClick(profile._id)}
                    />
                ))}
                
                {/* 새 프로필 생성 버튼 */}
                <ProfileButton
                    profileName=""
                    onClick={onCreateProfile}
                    isCreateButton={true}
                />
            </div>
            
            <p className="text-gray-600">
                {hasProfiles ? '프로필을 클릭하여 관리하거나 + 버튼으로 새 프로필을 생성하세요' : '프로필을 생성하세요'}
            </p>
        </div>
    );
}; 