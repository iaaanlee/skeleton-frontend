import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useAnalysisStatus } from '../../services/analysisService';
import { AnalysisResultContent } from './components/organisms';
import { useProfile } from '../../contexts/ProfileAuthContext';

export const AnalysisResultPage = () => {
  const { analysisId } = useParams<{ analysisId: string }>();
  const navigate = useNavigate();
  const { selectedProfile } = useProfile();

  // 분석 상태 조회
  const { 
    data: status, 
    isLoading: statusLoading, 
    error: statusError 
  } = useAnalysisStatus(analysisId || '', selectedProfile?._id || '');

  // 페이지 로드 시 자동으로 Prescription으로 저장
  useEffect(() => {
    if (status?.status === 'llm_completed' && analysisId) {
      // TODO: Prescription으로 자동 저장 로직 구현
      console.log('분석 결과를 Prescription으로 자동 저장:', analysisId);
    }
  }, [status?.status, analysisId]);

  const handleBack = () => {
    navigate(ROUTES.CREATE_PRESCRIPTION);
  };

  const handleAnalyzedImageClick = () => {
    if (analysisId) {
      navigate(ROUTES.ANALYZED_IMAGE_RESULT.replace(':analysisId', analysisId));
    }
  };

  const handleGptAnalysisClick = () => {
    // TODO: GPT 분석 결과 페이지 구현
    console.log('GPT 분석 결과 페이지로 이동 (준비 중)');
  };

  // 로딩 중
  if (statusLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">분석 결과를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (statusError) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-2xl mb-2">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              분석 결과를 불러올 수 없습니다
            </h2>
            <p className="text-gray-600 mb-4">
              {statusError.message || '알 수 없는 오류가 발생했습니다.'}
            </p>
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 분석 진행 중
  if (status && ['pending', 'blazepose_processing', 'llm_processing'].includes(status.status)) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              분석을 진행 중입니다
            </h2>
            <p className="text-gray-600">
              {status.message || '잠시만 기다려주세요...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 분석 완료 - 결과 선택 페이지
  if (status?.status === 'llm_completed') {
    return (
      <AnalysisResultContent
        analysisId={analysisId || ''}
        onAnalyzedImageClick={handleAnalyzedImageClick}
        onGptAnalysisClick={handleGptAnalysisClick}
        onBack={handleBack}
      />
    );
  }

  // 예상치 못한 상태
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-2xl mb-2">❓</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            예상치 못한 상태입니다
          </h2>
          <p className="text-gray-600 mb-4">
            분석 상태를 확인할 수 없습니다.
          </p>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};
