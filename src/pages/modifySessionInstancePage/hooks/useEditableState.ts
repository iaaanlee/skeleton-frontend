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
   * Move exercise (DnD support)
   */
  const moveExercise = useCallback((
    fromPartIndex: number,
    fromSetIndex: number,
    fromExerciseIndex: number,
    toPartIndex: number,
    toSetIndex: number,
    toExerciseIndex: number
  ) => {
    setEditable(prev => {
      const newState = [...prev];

      // 1. 원본 운동 추출
      const fromPart = { ...newState[fromPartIndex] };
      const fromSets = [...fromPart.sets];
      const fromSet = { ...fromSets[fromSetIndex] };
      const fromExercises = [...fromSet.exercises];
      const [movedExercise] = fromExercises.splice(fromExerciseIndex, 1);

      // 2. 같은 세트인지 확인
      const isSameSet = fromPartIndex === toPartIndex && fromSetIndex === toSetIndex;

      if (isSameSet) {
        // Case A: 같은 세트 내 이동
        fromExercises.splice(toExerciseIndex, 0, movedExercise);

        // order 재정렬
        fromExercises.forEach((ex, idx) => { ex.order = idx; });

        fromSet.exercises = fromExercises;
        fromSet._isModified = true;
        fromSets[fromSetIndex] = fromSet;
        fromPart.sets = fromSets;
        newState[fromPartIndex] = fromPart;

      } else {
        // Case B: 다른 세트로 이동

        // 2a. fromSet 업데이트 (제거)
        fromExercises.forEach((ex, idx) => { ex.order = idx; });
        fromSet.exercises = fromExercises;
        fromSet._isModified = true;
        fromSets[fromSetIndex] = fromSet;
        fromPart.sets = fromSets;
        newState[fromPartIndex] = fromPart;

        // 2b. toSet 업데이트 (삽입)
        const toPart = { ...newState[toPartIndex] };
        const toSets = [...toPart.sets];
        const toSet = { ...toSets[toSetIndex] };
        const toExercises = [...toSet.exercises];

        toExercises.splice(toExerciseIndex, 0, movedExercise);
        toExercises.forEach((ex, idx) => { ex.order = idx; });

        toSet.exercises = toExercises;
        toSet._isModified = true;
        toSets[toSetIndex] = toSet;
        toPart.sets = toSets;
        toPart._isModified = true;
        newState[toPartIndex] = toPart;
      }

      console.log('✅ [useEditableState] Exercise moved:', {
        from: { partIndex: fromPartIndex, setIndex: fromSetIndex, exerciseIndex: fromExerciseIndex },
        to: { partIndex: toPartIndex, setIndex: toSetIndex, exerciseIndex: toExerciseIndex },
        exerciseTemplateId: movedExercise.exerciseTemplateId
      });

      return newState;
    });
  }, []);

  /**
   * Move set (DnD support)
   */
  const moveSet = useCallback((
    fromPartIndex: number,
    fromSetIndex: number,
    toPartIndex: number,
    toSetIndex: number
  ) => {
    setEditable(prev => {
      const newState = [...prev];

      // 1. 원본 세트 추출
      const fromPart = { ...newState[fromPartIndex] };
      const fromSets = [...fromPart.sets];
      const [movedSet] = fromSets.splice(fromSetIndex, 1);

      // 2. 같은 파트인지 확인
      const isSamePart = fromPartIndex === toPartIndex;

      if (isSamePart) {
        // Case A: 같은 파트 내 이동
        fromSets.splice(toSetIndex, 0, movedSet);

        // order 재정렬
        fromSets.forEach((set, idx) => { set.order = idx; });

        fromPart.sets = fromSets;
        fromPart._isModified = true;
        newState[fromPartIndex] = fromPart;

      } else {
        // Case B: 다른 파트로 이동

        // 2a. fromPart 업데이트 (제거)
        fromSets.forEach((set, idx) => { set.order = idx; });
        fromPart.sets = fromSets;
        fromPart._isModified = true;
        newState[fromPartIndex] = fromPart;

        // 2b. toPart 업데이트 (삽입)
        const toPart = { ...newState[toPartIndex] };
        const toSets = [...toPart.sets];

        toSets.splice(toSetIndex, 0, movedSet);
        toSets.forEach((set, idx) => { set.order = idx; });

        toPart.sets = toSets;
        toPart._isModified = true;
        newState[toPartIndex] = toPart;
      }

      console.log('✅ [useEditableState] Set moved:', {
        from: { partIndex: fromPartIndex, setIndex: fromSetIndex },
        to: { partIndex: toPartIndex, setIndex: toSetIndex },
        setSeedId: movedSet.setSeedId
      });

      return newState;
    });
  }, []);

  /**
   * Move part (DnD support)
   */
  const movePart = useCallback((
    fromPartIndex: number,
    toPartIndex: number
  ) => {
    setEditable(prev => {
      const newState = [...prev];

      // 1. 원본 파트 추출
      const [movedPart] = newState.splice(fromPartIndex, 1);

      // 2. 새 위치에 삽입
      newState.splice(toPartIndex, 0, movedPart);

      // 3. 전체 파트 order 재정렬
      newState.forEach((part, idx) => {
        part.order = idx;
        part._isModified = true;
      });

      console.log('✅ [useEditableState] Part moved:', {
        from: fromPartIndex,
        to: toPartIndex,
        partName: movedPart.partName
      });

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
    moveExercise,
    moveSet,
    movePart,
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
