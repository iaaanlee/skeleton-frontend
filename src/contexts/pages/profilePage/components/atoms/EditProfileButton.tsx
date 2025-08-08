import React from 'react';

interface EditProfileButtonProps {
    onClick: () => void;
}

export const EditProfileButton = ({ onClick }: EditProfileButtonProps) => {
    return (
        <button
            onClick={onClick}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
        >
            프로필 정보 수정
        </button>
    );
};
