import React from 'react';

interface BottomBarButtonProps {
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}

export const BottomBarButton = ({ icon, label, isActive, onClick }: BottomBarButtonProps) => {
    return (
        <button
            onClick={onClick}
            disabled={isActive}
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                isActive
                    ? 'bg-blue-600 text-white cursor-not-allowed'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
            }`}
        >
            <div className="mb-1">{icon}</div>
            <span className="text-xs">{label}</span>
        </button>
    );
};
