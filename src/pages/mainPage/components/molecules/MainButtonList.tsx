import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MainButton } from '../atoms/MainButton';
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

    const handleAnalysisResults = () => {
        console.log('분석 결과 보기 클릭');
        // 임시로 테스트용 analysisId 사용 (실제로는 사용자의 최근 분석 결과를 조회해야 함)
        navigate('/analysis-result/test-analysis-id');
    };

    return (
        <div className="space-y-4">
            <MainButton 
                title="운동 프로그램" 
                onClick={handleWorkoutProgram}
            />
            <MainButton 
                title="운동 분석" 
                onClick={handleExerciseAnalysis}
            />
            <MainButton 
                title="내 신체 상태 체크" 
                onClick={handleBodyStatusCheck}
            />
            <MainButton 
                title="분석 결과 보기" 
                onClick={handleAnalysisResults}
            />
        </div>
    );
};
