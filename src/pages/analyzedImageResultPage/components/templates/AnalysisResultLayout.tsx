import React from 'react';
import { Header } from '../../../../components/common/templates/Header';
import { BottomBar } from '../../../../components/common/templates/BottomBar';
import { AnalysisResultContent } from '../organisms/AnalysisResultContent';
import { ROUTES } from '../../../../constants/routes';
import { Prescription } from '../../../../services/prescriptionService';

type AnalysisResultLayoutProps = {
  result: Prescription;
  onSaveResult: () => void;
};

const AnalysisResultLayout: React.FC<AnalysisResultLayoutProps> = ({
  result,
  onSaveResult
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header backRoute={ROUTES.PRESCRIPTION_HISTORY} />
      
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
              onClick={onSaveResult}
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

export default AnalysisResultLayout;