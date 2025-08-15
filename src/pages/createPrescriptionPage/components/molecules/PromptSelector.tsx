import React from 'react';
import PromptSelectionContent from '../organisms/PromptSelectionContent';

type PromptSelectorProps = {
  onSelectionChange: (promptId: string | null) => void;
  selectedPromptId?: string | null;
  className?: string;
};

export const PromptSelector: React.FC<PromptSelectorProps> = ({
  onSelectionChange,
  selectedPromptId,
  className = ''
}) => {
  return (
    <PromptSelectionContent
      onSelectionChange={onSelectionChange}
      selectedPromptId={selectedPromptId}
      className={className}
    />
  );
};
