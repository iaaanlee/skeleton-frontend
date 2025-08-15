import React from 'react';
import ActionButton from '../atoms/ActionButton';

type ActionButtonGroupProps = {
  onSave: () => void;
  onPrint: () => void;
  className?: string;
};

const ActionButtonGroup: React.FC<ActionButtonGroupProps> = ({
  onSave,
  onPrint,
  className = ''
}) => {
  return (
    <div className={`flex justify-center space-x-4 ${className}`}>
      <ActionButton onClick={onSave} variant="primary">
        결과 저장
      </ActionButton>
      <ActionButton onClick={onPrint} variant="secondary">
        결과 출력
      </ActionButton>
    </div>
  );
};

export default ActionButtonGroup;