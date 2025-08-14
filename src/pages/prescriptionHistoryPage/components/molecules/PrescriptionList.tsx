import React from 'react';
import { PrescriptionItem } from './PrescriptionItem';

type PrescriptionListProps = {
  prescriptions: any[];
  isLoading: boolean;
  error: any;
  onPrescriptionClick: (prescriptionId: string) => void;
};

export const PrescriptionList: React.FC<PrescriptionListProps> = ({
  prescriptions,
  isLoading,
  error,
  onPrescriptionClick
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">처방 기록을 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-2xl mb-2">⚠️</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          처방 기록을 불러올 수 없습니다
        </h3>
        <p className="text-gray-500">
          {error.message || '알 수 없는 오류가 발생했습니다.'}
        </p>
      </div>
    );
  }

  if (prescriptions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-2xl mb-2">📋</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          처방 기록이 없습니다
        </h3>
        <p className="text-gray-500">
          아직 받은 처방이 없습니다. 운동 분석을 시작해보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {prescriptions.map((prescription) => (
        <PrescriptionItem
          key={prescription.id}
          prescription={prescription}
          onClick={() => onPrescriptionClick(prescription.analysisId)}
        />
      ))}
    </div>
  );
};
