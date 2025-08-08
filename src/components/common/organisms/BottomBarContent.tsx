import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BottomBarButton } from '../atoms/BottomBarButton';
import { ROUTES } from '../../../constants/routes';

export const BottomBarContent = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const buttons = [
        {
            id: 'main',
            label: '메인',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
            path: ROUTES.MAIN,
            onClick: () => navigate(ROUTES.MAIN)
        },
        {
            id: 'calendar',
            label: '캘린더',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            path: ROUTES.CALENDAR,
            onClick: () => console.log('캘린더 클릭')
        },
        {
            id: 'c',
            label: 'C',
            icon: <span className="text-lg font-bold">C</span>,
            path: ROUTES.C,
            onClick: () => console.log('C 클릭')
        },
        {
            id: 'd',
            label: 'D',
            icon: <span className="text-lg font-bold">D</span>,
            path: ROUTES.D,
            onClick: () => console.log('D 클릭')
        },
        {
            id: 'profile',
            label: '내정보',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
            path: ROUTES.PROFILE,
            onClick: () => navigate(ROUTES.PROFILE)
        }
    ];

    // 현재 경로가 analyzeExercise인 경우 메인 버튼을 활성화
    const isAnalyzeExercise = location.pathname === ROUTES.ANALYZE_EXERCISE;

    return (
        <div className="flex justify-between items-center">
            {buttons.map((button) => (
                <BottomBarButton
                    key={button.id}
                    icon={button.icon}
                    label={button.label}
                    isActive={location.pathname === button.path || (button.id === 'main' && isAnalyzeExercise)}
                    onClick={button.onClick}
                />
            ))}
        </div>
    );
};
