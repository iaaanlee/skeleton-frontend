import React from 'react';
import { ProfileInfo } from '../../../../types/profile/profile';
import { UpdateProfileRequest } from '../../../../types/profile/request';
import { EditProfileForm } from '../molecules/EditProfileForm';
import { profileService } from '../../../../services/profileService/profileService';

interface EditProfileContentProps {
    profile: ProfileInfo;
    onUpdateSuccess: (updatedProfile: any) => void;
    onUpdateError: (error: string) => void;
}

export const EditProfileContent = ({ profile, onUpdateSuccess, onUpdateError }: EditProfileContentProps) => {
    const [isPending, setIsPending] = React.useState(false);

    const handleSubmit = async (data: UpdateProfileRequest) => {
        setIsPending(true);
        
        try {
            const response = await profileService.updateProfile({
                profileId: profile._id,
                ...data
            });
            
            // 업데이트된 프로필 정보 반환
            const updatedProfile = response.data.profile;
            onUpdateSuccess(updatedProfile);
        } catch (error) {
            onUpdateError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
        } finally {
            setIsPending(false);
        }
    };

    return (
        <EditProfileForm 
            profile={profile}
            onSubmit={handleSubmit}
            isPending={isPending}
        />
    );
};
