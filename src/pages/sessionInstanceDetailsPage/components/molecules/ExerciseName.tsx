import React from 'react';
import { useExerciseTemplate } from '../../../../services/workoutService/sessionModificationService';

type Props = {
  exerciseTemplateId: string;
  className?: string;
};

export const ExerciseName: React.FC<Props> = ({ exerciseTemplateId, className = "" }) => {
  const { data: exerciseTemplate, isLoading, error } = useExerciseTemplate(exerciseTemplateId);

  if (isLoading) {
    return (
      <span className={`text-gray-400 ${className}`}>
        운동 로딩중...
      </span>
    );
  }

  if (error || !exerciseTemplate) {
    return (
      <span className={`text-gray-500 ${className}`}>
        운동 {exerciseTemplateId}
      </span>
    );
  }

  return (
    <span className={className}>
      {exerciseTemplate.exerciseName}
    </span>
  );
};