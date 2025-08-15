import React from 'react';
import { Header } from '../../../../components/common/templates/Header';
import { BottomBar } from '../../../../components/common/templates/BottomBar';
import { ROUTES, RouteValue } from '../../../../constants/routes';

export type ResultSelectionLayoutProps = {
  analysisId: string;
  onAnalyzedImageClick: () => void;
  onGptAnalysisClick: () => void;
  onBack: () => void;
  backRoute?: RouteValue;
  className?: string;
};

const ResultSelectionLayout: React.FC<ResultSelectionLayoutProps> = ({
  analysisId,
  onAnalyzedImageClick,
  onGptAnalysisClick,
  onBack,
  backRoute = ROUTES.CREATE_PRESCRIPTION,
  className = ""
}) => {
  return (
    <div className={`min-h-screen flex flex-col bg-gray-50 ${className}`}>
      <Header backRoute={backRoute} />
      
      <div className="flex-1 p-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">분석 결과</h1>
            <p className="text-gray-600">
              분석이 완료되었습니다. 원하는 결과를 선택해주세요.
            </p>
          </div>

          <div className="space-y-4">
            {/* 자세 분석 사진 버튼 */}
            <button
              onClick={onAnalyzedImageClick}
              className="w-full p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 text-left"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">자세 분석 사진</h3>
                  <p className="text-sm text-gray-600">
                    관절 좌표가 분석된 이미지와 상세 정보를 확인하세요.
                  </p>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            {/* 분석 결과 설명 버튼 */}
            <button
              onClick={onGptAnalysisClick}
              className="w-full p-6 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200 text-left"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">분석 결과 설명</h3>
                  <p className="text-sm text-gray-600">
                    AI가 분석한 자세에 대한 상세한 설명을 확인하세요.
                  </p>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>

          {/* 분석 ID 정보 */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 text-center">
              분석 ID: {analysisId}
            </p>
          </div>
        </div>
      </div>
      
      <BottomBar />
    </div>
  );
};

export default ResultSelectionLayout;