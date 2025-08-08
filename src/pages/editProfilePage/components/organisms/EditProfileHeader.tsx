import React from 'react';
import { EditProfileHeaderContent } from '../molecules/EditProfileHeaderContent';

export const EditProfileHeader = () => {
    return (
        <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <EditProfileHeaderContent />
            </div>
        </header>
    );
};
