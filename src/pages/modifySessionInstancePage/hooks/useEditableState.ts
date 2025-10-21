import { useState, useCallback, useMemo } from 'react';
import type {
  EffectivePartBlueprint,
  EditablePartBlueprint,
  EditableSetBlueprint,
  EditableExerciseBlueprint,
  ExerciseSpec
} from '../../../types/workout';

/**
 * Editable State Manager Hook - Stage 4B.3
 * Manages local editable state converted from effectiveBlueprint
 *
 * Purpose:
 * - Convert server data (effectiveBlueprint) to local editable state
 * - Track modifications with _isModified metadata
 * - Support DnD with _originalOrder for rollback
 * - Provide immutable update functions
 */
export const useEditableState = (effectiveBlueprint: EffectivePartBlueprint[]) => {
  // Initialize editable state with deep clone and metadata
  const [editable, setEditable] = useState<EditablePartBlueprint[]>(() =>
    convertToEditable(effectiveBlueprint)
  );

  // Track if any changes have been made
  const isModified = useMemo(() => {
    return editable.some(part =>
      part._isModified ||
      part.sets.some(set =>
        set._isModified ||
        set.exercises.some(ex => ex._isModified)
      )
    );
  }, [editable]);

  /**
   * Update exercise spec
   */
  const updateExerciseSpec = useCallback((
    partIndex: number,
    setIndex: number,
    exerciseIndex: number,
    spec: ExerciseSpec
  ) => {
    setEditable(prev => {
      const newState = [...prev];
      const part = { ...newState[partIndex] };
      const sets = [...part.sets];
      const set = { ...sets[setIndex] };
      const exercises = [...set.exercises];
      const exercise = { ...exercises[exerciseIndex] };

      // Update spec and mark as modified
      exercise.spec = spec;
      exercise._isModified = true;

      exercises[exerciseIndex] = exercise;
      set.exercises = exercises;
      sets[setIndex] = set;
      part.sets = sets;
      newState[partIndex] = part;

      return newState;
    });
  }, []);

  /**
   * Update set properties (restTime, timeLimit)
   */
  const updateSetProperties = useCallback((
    partIndex: number,
    setIndex: number,
    properties: { restTime?: number; timeLimit?: number | null }
  ) => {
    setEditable(prev => {
      const newState = [...prev];
      const part = { ...newState[partIndex] };
      const sets = [...part.sets];
      const set = { ...sets[setIndex] };

      // Update properties and mark as modified
      if (properties.restTime !== undefined) {
        set.restTime = properties.restTime;
      }
      if (properties.timeLimit !== undefined) {
        set.timeLimit = properties.timeLimit;
      }
      set._isModified = true;

      sets[setIndex] = set;
      part.sets = sets;
      newState[partIndex] = part;

      return newState;
    });
  }, []);

  /**
   * Update part name
   */
  const updatePartName = useCallback((
    partIndex: number,
    partName: string
  ) => {
    setEditable(prev => {
      const newState = [...prev];
      const part = { ...newState[partIndex] };

      // Update name and mark as modified
      part.partName = partName;
      part._isModified = true;

      newState[partIndex] = part;
      return newState;
    });
  }, []);

  /**
   * Add exercise to a set
   */
  const addExercise = useCallback((
    partIndex: number,
    setIndex: number,
    exercise: Omit<EditableExerciseBlueprint, '_isModified' | '_originalOrder'>
  ) => {
    setEditable(prev => {
      const newState = [...prev];
      const part = { ...newState[partIndex] };
      const sets = [...part.sets];
      const set = { ...sets[setIndex] };
      const exercises = [...set.exercises];

      // Add new exercise with metadata
      const newExercise: EditableExerciseBlueprint = {
        ...exercise,
        _isModified: true,
        _originalOrder: exercise.order
      };

      // 🔧 order 위치에 삽입 (splice 사용)
      exercises.splice(exercise.order, 0, newExercise);

      // 🔧 삽입 후 order 재정렬
      exercises.forEach((ex, idx) => {
        ex.order = idx;
      });

      set.exercises = exercises;
      set._isModified = true;
      sets[setIndex] = set;
      part.sets = sets;
      newState[partIndex] = part;

      console.log('✅ [useEditableState] Exercise added at position:', {
        partIndex,
        setIndex,
        insertPosition: exercise.order,
        totalExercises: exercises.length
      });

      return newState;
    });
  }, []);

  /**
   * Delete exercise from a set
   */
  const deleteExercise = useCallback((
    partIndex: number,
    setIndex: number,
    exerciseIndex: number
  ) => {
    setEditable(prev => {
      const newState = [...prev];
      const part = { ...newState[partIndex] };
      const sets = [...part.sets];
      const set = { ...sets[setIndex] };
      const exercises = [...set.exercises];

      // Remove exercise
      exercises.splice(exerciseIndex, 1);

      set.exercises = exercises;
      set._isModified = true;
      sets[setIndex] = set;
      part.sets = sets;
      newState[partIndex] = part;

      return newState;
    });
  }, []);

  /**
   * Add set to a part
   */
  const addSet = useCallback((
    partIndex: number,
    set: Omit<EditableSetBlueprint, '_isModified' | '_originalOrder'>
  ) => {
    setEditable(prev => {
      const newState = [...prev];
      const part = { ...newState[partIndex] };
      const sets = [...part.sets];

      // Add new set with metadata
      sets.push({
        ...set,
        _isModified: true,
        _originalOrder: set.order
      });

      part.sets = sets;
      part._isModified = true;
      newState[partIndex] = part;

      return newState;
    });
  }, []);

  /**
   * Delete set from a part
   */
  const deleteSet = useCallback((
    partIndex: number,
    setIndex: number
  ) => {
    setEditable(prev => {
      const newState = [...prev];
      const part = { ...newState[partIndex] };
      const sets = [...part.sets];

      // Remove set
      sets.splice(setIndex, 1);

      part.sets = sets;
      part._isModified = true;
      newState[partIndex] = part;

      return newState;
    });
  }, []);

  /**
   * Add part
   */
  const addPart = useCallback((
    part: Omit<EditablePartBlueprint, '_isModified' | '_originalOrder'>
  ) => {
    setEditable(prev => {
      const newState = [...prev];

      // Add new part with metadata
      newState.push({
        ...part,
        _isModified: true,
        _originalOrder: part.order
      });

      return newState;
    });
  }, []);

  /**
   * Delete part
   */
  const deletePart = useCallback((
    partIndex: number
  ) => {
    setEditable(prev => {
      const newState = [...prev];
      newState.splice(partIndex, 1);
      return newState;
    });
  }, []);

  /**
   * Update exercise order (for DnD)
   */
  const updateExerciseOrder = useCallback((
    partIndex: number,
    setIndex: number,
    exerciseIndex: number,
    newOrder: number
  ) => {
    setEditable(prev => {
      const newState = [...prev];
      const part = { ...newState[partIndex] };
      const sets = [...part.sets];
      const set = { ...sets[setIndex] };
      const exercises = [...set.exercises];
      const exercise = { ...exercises[exerciseIndex] };

      exercise.order = newOrder;
      // Don't set _isModified for order changes (DnD)
      // _originalOrder is preserved for rollback

      exercises[exerciseIndex] = exercise;
      set.exercises = exercises;
      sets[setIndex] = set;
      part.sets = sets;
      newState[partIndex] = part;

      return newState;
    });
  }, []);

  /**
   * Reset to original effectiveBlueprint
   */
  const reset = useCallback(() => {
    setEditable(convertToEditable(effectiveBlueprint));
  }, [effectiveBlueprint]);

  return {
    editable,
    isModified,
    updateExerciseSpec,
    updateSetProperties,
    updatePartName,
    addExercise,
    deleteExercise,
    addSet,
    deleteSet,
    addPart,
    deletePart,
    updateExerciseOrder,
    reset
  };
};

/**
 * Deep clone utility: Convert EffectivePartBlueprint[] to EditablePartBlueprint[]
 * Adds metadata fields: _isModified, _originalOrder
 */
function convertToEditable(effective: EffectivePartBlueprint[]): EditablePartBlueprint[] {
  return effective.map(part => ({
    ...part,
    _isModified: false,
    _originalOrder: part.order,
    sets: part.sets.map(set => ({
      ...set,
      _isModified: false,
      _originalOrder: set.order,
      exercises: set.exercises.map(exercise => ({
        ...exercise,
        _isModified: false,
        _originalOrder: exercise.order,
        spec: {
          ...exercise.spec,
          goal: { ...exercise.spec.goal },
          load: { ...exercise.spec.load }
        }
      }))
    }))
  }));
}
