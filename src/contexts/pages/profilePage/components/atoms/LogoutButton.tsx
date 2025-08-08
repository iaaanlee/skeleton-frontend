import React from 'react';

interface LogoutButtonProps {
    onClick: () => void;
}

export const LogoutButton = ({ onClick }: LogoutButtonProps) => {
    return (
        <button
            onClick={onClick}
            className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors"
        >
            로그아웃
        </button>
    );
};
