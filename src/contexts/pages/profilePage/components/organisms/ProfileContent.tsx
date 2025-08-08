import React from 'react';
import { ProfileInfoSection } from '../molecules/ProfileInfoSection';

interface ProfileContentProps {
    profileName: string;
    onLogout: () => void;
    onSelectOtherProfile: () => void;
    onEditProfile: () => void;
}

export const ProfileContent = ({ profileName, onLogout, onSelectOtherProfile, onEditProfile }: ProfileContentProps) => {
    return (
        <div className="flex-1 p-4">
            <div className="max-w-2xl mx-auto">
                <ProfileInfoSection 
                    profileName={profileName}
                    onLogout={onLogout}
                    onSelectOtherProfile={onSelectOtherProfile}
                    onEditProfile={onEditProfile}
                />
            </div>
        </div>
    );
};
