import React from 'react';

export const NotificationButton = () => {
    return (
        <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
            <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
            >
                <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M15 17h5l-5 5v-5zM4.83 4.83a4 4 0 015.66 0H10a4 4 0 00-4 4v2.17a4 4 0 01-1.17 2.83L4.83 4.83zM20 17h-5v5l5-5z"
                />
            </svg>
        </button>
    );
};
