import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../../components/common/templates/Header';
import { BottomBar } from '../../components/common/templates/BottomBar';
import { ROUTES } from '../../constants/routes';
import { useAnalysisResult } from '../../services/blazePoseService';
import { AnalysisResultContent } from './components/organisms/AnalysisResultContent';
import { AnalysisProgress } from './components/molecules/AnalysisProgress';

export const AnalysisResultPage = () => {
  const { analysisId } = useParams<{ analysisId: string }>();
  const navigate = useNavigate();

  const { data: result, isLoading, error } = useAnalysisResult(analysisId || '');

  const handleBack = () => {
    navigate(ROUTES.CREATE_PRESCRIPTION);
  };

  const handleSaveResult = () => {
    // TODO: 분석 결과 저장 로직 구현
    console.log('분석 결과 저장:', result);
    alert('분석 결과가 저장되었습니다.');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header backRoute={ROUTES.CREATE_PRESCRIPTION} />
        <div className="flex-1 flex items-center justify-center">
          <AnalysisProgress 
            status="processing"
            progress={50}
            message="분석 결과를 불러오는 중..."
          />
        </div>
        <BottomBar />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header backRoute={ROUTES.CREATE_PRESCRIPTION} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              분석 결과를 불러올 수 없습니다
            </h2>
            <p className="text-gray-600 mb-4">
              {error.message || '알 수 없는 오류가 발생했습니다.'}
            </p>
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              돌아가기
            </button>
          </div>
        </div>
        <BottomBar />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header backRoute={ROUTES.CREATE_PRESCRIPTION} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              분석 결과가 없습니다
            </h2>
            <p className="text-gray-600 mb-4">
              분석이 완료되지 않았거나 결과를 찾을 수 없습니다.
            </p>
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              돌아가기
            </button>
          </div>
        </div>
        <BottomBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header backRoute={ROUTES.CREATE_PRESCRIPTION} />
      
      <div className="flex-1 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">운동 분석 결과</h1>
            <p className="text-gray-600">
              BlazePose를 통해 분석된 운동 자세 결과입니다.
            </p>
          </div>

          <AnalysisResultContent 
            result={result}
          />

          {/* 액션 버튼 */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleSaveResult}
              className="px-8 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
            >
              결과 저장
            </button>
            <button
              onClick={() => window.print()}
              className="px-8 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors font-medium"
            >
              결과 출력
            </button>
          </div>
        </div>
      </div>

      <BottomBar />
    </div>
  );
};
