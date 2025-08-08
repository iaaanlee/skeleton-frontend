import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MainButton } from '../atoms/MainButton';
import { ROUTES } from '../../../../../constants/routes';

export const MainButtonList = () => {
    const navigate = useNavigate();

    const handleNewPrescription = () => {
        console.log('신규 운동 처방 받기 클릭');
        navigate(ROUTES.CREATE_PRESCRIPTION);
    };

    const handlePastRecords = () => {
        console.log('과거 처방 기록 보기 클릭');
        // TODO: 과거 처방 기록 페이지로 이동
    };

    return (
        <div className="space-y-4">
            <MainButton 
                title="신규 운동 처방 받기" 
                onClick={handleNewPrescription}
            />
            <MainButton 
                title="과거 처방 기록 보기" 
                onClick={handlePastRecords}
            />
        </div>
    );
};
