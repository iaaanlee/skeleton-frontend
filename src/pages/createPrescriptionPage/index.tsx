import React from 'react';
import { useProfile } from '../../contexts/ProfileAuthContext';
import { useNavigate } from 'react-router-dom';
import { BackButton } from '../../components/common/organisms/BackButton';
import { ROUTES } from '../../constants/routes';
import PrescriptionUploadSection from './components/organisms/PrescriptionUploadSection';
import { ServerFile } from '../../types/files';

export const CreatePrescriptionPage = () => {
    const navigate = useNavigate();
    const { selectedProfile } = useProfile();

    const handleUploadSuccess = (file: ServerFile) => {
        console.log('File uploaded successfully:', file);
    };

    const handleUploadError = (error: string) => {
        console.error('Upload error:', error);
    };

    const handleFileSelect = (file: ServerFile) => {
        console.log('File selected:', file);
    };

    const handleFileDelete = (fileId: string) => {
        console.log('File deleted:', fileId);
    };

    const handleFileDownload = (file: ServerFile) => {
        console.log('File download:', file);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
                <div className="flex items-center">
                    <BackButton backRoute={ROUTES.ANALYZE_EXERCISE} />
                    <h1 className="text-xl font-semibold text-gray-900 ml-4">신규 운동 분석</h1>
                </div>
            </div>
            
            <div className="p-4">
                <div className="max-w-4xl mx-auto">
                    <PrescriptionUploadSection
                        profileId={selectedProfile?._id || ''}
                        onUploadSuccess={handleUploadSuccess}
                        onUploadError={handleUploadError}
                        onFileSelect={handleFileSelect}
                        onFileDelete={handleFileDelete}
                        onFileDownload={handleFileDownload}
                    />
                </div>
            </div>
        </div>
    );
};
