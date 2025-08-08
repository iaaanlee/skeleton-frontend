import React from 'react';

interface SelectOtherProfileButtonProps {
    onClick: () => void;
}

export const SelectOtherProfileButton = ({ onClick }: SelectOtherProfileButtonProps) => {
    return (
        <button
            onClick={onClick}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
        >
            다른 프로필 선택
        </button>
    );
};
