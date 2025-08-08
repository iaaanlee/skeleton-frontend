import React from 'react';

interface DropdownButtonProps {
    label: string;
    onClick: () => void;
    isDanger?: boolean;
}

export const DropdownButton = ({ label, onClick, isDanger = false }: DropdownButtonProps) => {
    return (
        <button
            onClick={onClick}
            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                isDanger ? 'text-red-600 hover:text-red-700' : 'text-gray-700'
            }`}
        >
            {label}
        </button>
    );
};
