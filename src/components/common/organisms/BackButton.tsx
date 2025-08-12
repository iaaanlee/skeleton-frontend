import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RouteValue } from '../../../constants/routes';

interface BackButtonProps {
    backRoute: RouteValue;
    className?: string;
}

export const BackButton = ({ backRoute, className = "" }: BackButtonProps) => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(backRoute);
    };

    return (
        <button
            onClick={handleBack}
            className={`p-2 text-gray-600 hover:text-gray-900 transition-colors ${className}`}
        >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
        </button>
    );
};
