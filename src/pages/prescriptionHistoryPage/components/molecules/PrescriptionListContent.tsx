import React from 'react';
import { PrescriptionItem } from './PrescriptionItem';

type PrescriptionListContentProps = {
  prescriptions: any[];
  onPrescriptionClick: (prescriptionId: string) => void;
};

const PrescriptionListContent: React.FC<PrescriptionListContentProps> = ({
  prescriptions,
  onPrescriptionClick
}) => {
  return (
    <div className="space-y-4">
      {prescriptions.map((prescription, index) => (
        <PrescriptionItem
          key={prescription.id || prescription._id || index}
          prescription={prescription}
          onClick={() => onPrescriptionClick(prescription.analysisId || prescription.analysisJobId)}
        />
      ))}
    </div>
  );
};

export default PrescriptionListContent;