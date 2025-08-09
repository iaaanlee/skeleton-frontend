import React, { useState } from 'react';
import { useProfile } from '../../contexts/ProfileAuthContext';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/common/templates/Header';
import { BottomBar } from '../../components/common/templates/BottomBar';
import { ROUTES } from '../../constants/routes';
import PrescriptionUploadSection from './components/organisms/PrescriptionUploadSection';
import { ServerFile } from '../../types/files';


export const CreatePrescriptionPage = () => {
    const navigate = useNavigate();
    const { selectedProfile } = useProfile();
    const [uploadedFiles, setUploadedFiles] = useState<ServerFile[]>([]);
    

    const handleUploadSuccess = (file: ServerFile) => {
        // console.log('File uploaded successfully:', file);
        setUploadedFiles(prev => [...prev, file]);
    };

    const handleUploadError = (error: string) => {
        console.error('Upload error:', error);
        // TODO: 에러 토스트 메시지 표시
    };

    const handleFileSelect = (file: ServerFile) => {
        // console.log('File selected:', file);
    };

    const handleFileDelete = (fileId: string) => {
        // console.log('File deleted:', fileId);
        setUploadedFiles(prev => prev.filter(file => file._id !== fileId));
    };

      const handleFileDownload = (file: ServerFile) => {
    // console.log('File download:', file);
  };

      const handleAnalysisStart = (fileIds: string[]) => {
        console.log('Analysis started for files:', fileIds);
        // 분석 시작 후 결과 페이지로 이동하는 로직은 여기에 추가할 수 있습니다
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header backRoute={ROUTES.ANALYZE_EXERCISE} />
            
            <div className="flex-1 p-4">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">신규 운동 분석</h1>
                        <p className="text-gray-600">분석하고 싶은 운동 이미지를 업로드하고 분석을 시작하세요.</p>
                    </div>
                    
                                               <PrescriptionUploadSection
                               profileId={selectedProfile?._id || ''}
                               onUploadSuccess={handleUploadSuccess}
                               onUploadError={handleUploadError}
                               onFileSelect={handleFileSelect}
                               onFileDelete={handleFileDelete}
                               onFileDownload={handleFileDownload}
                               onAnalysisStart={handleAnalysisStart}
                           />


                </div>
            </div>
            
            <BottomBar />
        </div>
    );
};
