import React from 'react';
import { Header } from '../../../../components/common/templates/Header';
import { BottomBar } from '../../../../components/common/templates/BottomBar';
import { PrescriptionList } from '../molecules/PrescriptionList';
import { ROUTES, RouteValue } from '../../../../constants/routes';

type PrescriptionHistoryContentProps = {
  prescriptions: any[];
  isLoading: boolean;
  error: any;
  onPrescriptionClick: (prescriptionId: string) => void;
  onBack: () => void;
  backRoute?: RouteValue;
};

export const PrescriptionHistoryContent: React.FC<PrescriptionHistoryContentProps> = ({
  prescriptions,
  isLoading,
  error,
  onPrescriptionClick,
  onBack,
  backRoute = ROUTES.ANALYZE_EXERCISE
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header backRoute={backRoute} />
      
      <div className="flex-1 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">처방 기록</h1>
            <p className="text-gray-600">
              지금까지 받은 모든 처방 기록을 확인할 수 있습니다.
            </p>
          </div>

          <PrescriptionList
            prescriptions={prescriptions}
            isLoading={isLoading}
            error={error}
            onPrescriptionClick={onPrescriptionClick}
          />
        </div>
      </div>
      
      <BottomBar />
    </div>
  );
};
