import React from 'react';

interface MainButtonProps {
    title: string;
    onClick: () => void;
}

export const MainButton = ({ title, onClick }: MainButtonProps) => {
    return (
        <button
            onClick={onClick}
            className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow flex justify-between items-center"
        >
            <span className="text-lg font-medium text-gray-900">{title}</span>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
        </button>
    );
};
