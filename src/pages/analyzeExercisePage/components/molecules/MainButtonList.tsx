import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MainButton } from '../../../../components/common/atoms';
import { ROUTES } from '../../../../constants/routes';
import { useAccountAuth } from '../../../../contexts/AccountAuthContext';
import { extractAccountIdFromToken } from '../../../../utils/auth';

const ALLOWED_TEST_ACCOUNT_ID = '6891fa0d5e2478655ff03ac2'; // 테스트 전용 계정

export const MainButtonList = () => {
    const navigate = useNavigate();
    const { token } = useAccountAuth();
    const accountId = token ? extractAccountIdFromToken(token) : null;

    const handleNewPrescription = () => {
        console.log('신규 운동 처방 받기 클릭');
        navigate(ROUTES.CREATE_PRESCRIPTION);
    };

    const handlePastRecords = () => {
        console.log('처방 기록 보기 클릭');
        navigate(ROUTES.PRESCRIPTION_HISTORY);
    };

    const handleTestPrescription = () => {
        console.log('개발용 테스트 처방 클릭');
        navigate(ROUTES.TEST_CREATE_PRESCRIPTION);
    };

    const handleProcessVideo = () => {
        console.log('비디오 가공 클릭');
        navigate(ROUTES.PROCESS_VIDEO);
    };

    return (
        <div className="space-y-4">
            <MainButton 
                title="신규 운동 처방 받기" 
                onClick={handleNewPrescription}
                variant="compact"
            />
            <MainButton 
                title="처방 기록 보기" 
                onClick={handlePastRecords}
                variant="compact"
            />
            <MainButton 
                title="비디오 가공" 
                onClick={handleProcessVideo}
                variant="compact"
            />
            
            {/* 특정 계정에서만 표시되는 테스트 버튼 */}
            {accountId === ALLOWED_TEST_ACCOUNT_ID && (
                <div className="mt-6 pt-6 border-t-2 border-red-200">
                    <div className="mb-2 text-xs text-red-600 font-semibold">🔧 개발 테스트용 (권한 계정만)</div>
                    <button
                        onClick={handleTestPrescription}
                        className="w-full px-6 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-md"
                    >
                        개발용 신규 운동 처방 받기
                    </button>
                </div>
            )}
        </div>
    );
};
