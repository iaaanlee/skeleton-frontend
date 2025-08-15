import React, { useEffect } from 'react';
import { useActivePrompts } from '../../../../services/promptService';
import PromptLoadingState from '../molecules/PromptLoadingState';
import PromptErrorState from '../molecules/PromptErrorState';
import EmptyPromptState from '../molecules/EmptyPromptState';
import PromptList from '../molecules/PromptList';

type PromptSelectionContentProps = {
  onSelectionChange: (promptId: string | null) => void;
  selectedPromptId?: string | null;
  className?: string;
};

const PromptSelectionContent: React.FC<PromptSelectionContentProps> = ({
  onSelectionChange,
  selectedPromptId,
  className = ''
}) => {
  const { data: promptList, isLoading, error } = useActivePrompts();

  useEffect(() => {
    if (promptList?.prompts && promptList.prompts.length > 0 && !selectedPromptId) {
      onSelectionChange(promptList.prompts[0]._id);
    }
  }, [promptList, selectedPromptId, onSelectionChange]);

  const handlePromptClick = (promptId: string) => {
    if (selectedPromptId === promptId) {
      onSelectionChange(null);
    } else {
      onSelectionChange(promptId);
    }
  };

  if (isLoading) {
    return <PromptLoadingState className={className} />;
  }

  if (error) {
    return <PromptErrorState className={className} />;
  }

  if (!promptList?.prompts || promptList.prompts.length === 0) {
    return <EmptyPromptState className={className} />;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900">분석 프롬프트 선택</h3>
      <PromptList
        prompts={promptList.prompts}
        selectedPromptId={selectedPromptId}
        onPromptClick={handlePromptClick}
      />
    </div>
  );
};

export default PromptSelectionContent;