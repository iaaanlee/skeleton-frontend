import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MainButton } from '../../../../components/common/atoms';
import { ROUTES } from '../../../../constants/routes';

export const MainButtonList = () => {
    const navigate = useNavigate();

    const handleWorkoutProgram = () => {
        console.log('운동 프로그램 클릭');
        // TODO: 운동 프로그램 페이지로 이동
    };

    const handleExerciseAnalysis = () => {
        console.log('운동 분석 클릭');
        navigate(ROUTES.ANALYZE_EXERCISE);
    };

    const handleBodyStatusCheck = () => {
        console.log('내 신체 상태 체크 클릭');
        // TODO: 내 신체 상태 체크 페이지로 이동
    };

    return (
        <div className="space-y-4">
            <MainButton 
                title="운동 프로그램" 
                onClick={handleWorkoutProgram}
                variant="default"
            />
            <MainButton 
                title="운동 분석" 
                onClick={handleExerciseAnalysis}
                variant="default"
            />
            <MainButton 
                title="내 신체 상태 체크" 
                onClick={handleBodyStatusCheck}
                variant="default"
            />
        </div>
    );
};
