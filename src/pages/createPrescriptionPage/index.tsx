import React from 'react';
import { useProfile } from '../../contexts/ProfileAuthContext';
import { Header } from '../../components/common/templates/Header';
import { BottomBar } from '../../components/common/templates/BottomBar';
import { ROUTES } from '../../constants/routes';
import { PrescriptionUploadSection } from './components/organisms/PrescriptionUploadSection';

export const CreatePrescriptionPage = () => {
    const { selectedProfile } = useProfile();

    if (!selectedProfile?._id) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Header backRoute={ROUTES.ANALYZE_EXERCISE} />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-gray-400 text-6xl mb-4">👤</div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            프로필을 선택해주세요
                        </h2>
                        <p className="text-gray-600">
                            운동 분석을 위해 프로필을 먼저 선택해주세요.
                        </p>
                    </div>
                </div>
                <BottomBar />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header backRoute={ROUTES.ANALYZE_EXERCISE} />
            
            <div className="flex-1 p-4">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">신규 운동 분석</h1>
                        <p className="text-gray-600">분석하고 싶은 운동 이미지를 업로드하고 분석을 시작하세요.</p>
                    </div>
                    
                    <PrescriptionUploadSection profileId={selectedProfile._id} />
                </div>
            </div>
            
            <BottomBar />
        </div>
    );
};
