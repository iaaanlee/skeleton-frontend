import React from 'react';
import { ProfileHeaderContent } from '../molecules/ProfileHeaderContent';

export const ProfileHeader = () => {
    return (
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
            <ProfileHeaderContent />
        </header>
    );
};
