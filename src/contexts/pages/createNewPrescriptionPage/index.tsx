import React from 'react';
import { useProfile } from '../../ProfileAuthContext';
import { useNavigate } from 'react-router-dom';
import { BackButton } from '../../../components/common/organisms/BackButton';
import { ROUTES } from '../../../constants/routes';

export const CreateNewPrescriptionPage = () => {
    const navigate = useNavigate();
    const { selectedProfile } = useProfile();

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
                <div className="flex items-center">
                    <BackButton backRoute={ROUTES.ANALYZE_EXERCISE} />
                    <h1 className="text-xl font-semibold text-gray-900 ml-4">신규 운동 분석</h1>
                </div>
            </div>
            
            <div className="p-4">
                {/* 여기에 페이지 내용이 들어갈 예정입니다 */}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <p className="text-gray-600 text-center">페이지 내용이 여기에 표시됩니다.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
