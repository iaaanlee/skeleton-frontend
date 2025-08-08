import React from 'react';

interface CloseButtonProps {
    onClick: () => void;
}

export const CloseButton = ({ onClick }: CloseButtonProps) => {
    return (
        <button
            onClick={onClick}
            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    );
};
