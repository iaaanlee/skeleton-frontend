import { useState, useCallback } from 'react';
import type { PinState, PinChangeEvent } from '../../../types/workout';
import { PinSystemHelpers } from '../../../types/workout';

/**
 * Pin State Manager Hook - Stage 4B
 * Manages Pin states and detects changes that require pin promotion
 */
export const usePinStateManager = () => {
  const [sessionPinState, setSessionPinState] = useState<PinState>({
    sessionPin: false,
    partPin: false,
    setPin: false,
    exercisePin: false
  });

  const [partPinStates, setPartPinStates] = useState<Record<number, PinState>>({});
  const [setPinStates, setSetPinStates] = useState<Record<string, PinState>>({});
  const [exercisePinStates, setExercisePinStates] = useState<Record<string, PinState>>({});

  /**
   * Get Pin State for specific element
   */
  const getPinState = useCallback((
    level: 'session' | 'part' | 'set' | 'exercise',
    partIndex?: number,
    setIndex?: number,
    exerciseIndex?: number
  ): PinState => {
    switch (level) {
      case 'session':
        return sessionPinState;
      case 'part':
        if (partIndex !== undefined) {
          return partPinStates[partIndex] || sessionPinState;
        }
        break;
      case 'set':
        if (partIndex !== undefined && setIndex !== undefined) {
          const setKey = `${partIndex}-${setIndex}`;
          return setPinStates[setKey] || partPinStates[partIndex] || sessionPinState;
        }
        break;
      case 'exercise':
        if (partIndex !== undefined && setIndex !== undefined && exerciseIndex !== undefined) {
          const exerciseKey = `${partIndex}-${setIndex}-${exerciseIndex}`;
          return exercisePinStates[exerciseKey] ||
                 setPinStates[`${partIndex}-${setIndex}`] ||
                 partPinStates[partIndex] ||
                 sessionPinState;
        }
        break;
    }

    // Fallback to session state
    return sessionPinState;
  }, [sessionPinState, partPinStates, setPinStates, exercisePinStates]);

  /**
   * Handle Pin State Change Event
   */
  const handlePinChangeEvent = useCallback((event: PinChangeEvent) => {
    const shouldPromote = PinSystemHelpers.shouldPromotePin(event);

    if (!shouldPromote) {
      // Only exercisePin needed for spec changes
      if (event.targetIndex.partIndex !== undefined &&
          event.targetIndex.setIndex !== undefined &&
          event.targetIndex.exerciseIndex !== undefined) {
        const exerciseKey = `${event.targetIndex.partIndex}-${event.targetIndex.setIndex}-${event.targetIndex.exerciseIndex}`;
        setExercisePinStates(prev => ({
          ...prev,
          [exerciseKey]: {
            ...prev[exerciseKey] || { sessionPin: false, partPin: false, setPin: false, exercisePin: false },
            exercisePin: true
          }
        }));
      }
      return;
    }

    // Calculate promoted pin state
    const currentPinState = getPinState(
      event.level,
      event.targetIndex.partIndex,
      event.targetIndex.setIndex,
      event.targetIndex.exerciseIndex
    );

    const newPinState = PinSystemHelpers.calculatePromotedPinState(event, currentPinState);

    // Apply pin state based on level
    switch (event.level) {
      case 'session':
        setSessionPinState(newPinState);
        // Clear all lower-level pins when session is pinned
        setPartPinStates({});
        setSetPinStates({});
        setExercisePinStates({});
        break;

      case 'part':
        if (event.targetIndex.partIndex !== undefined) {
          setPartPinStates(prev => ({
            ...prev,
            [event.targetIndex.partIndex!]: newPinState
          }));

          // Clear lower-level pins for this part
          if (newPinState.partPin) {
            const keysToRemove = Object.keys(setPinStates).filter(key =>
              key.startsWith(`${event.targetIndex.partIndex}-`)
            );
            setSetPinStates(prev => {
              const newState = { ...prev };
              keysToRemove.forEach(key => delete newState[key]);
              return newState;
            });

            const exerciseKeysToRemove = Object.keys(exercisePinStates).filter(key =>
              key.startsWith(`${event.targetIndex.partIndex}-`)
            );
            setExercisePinStates(prev => {
              const newState = { ...prev };
              exerciseKeysToRemove.forEach(key => delete newState[key]);
              return newState;
            });
          }
        }
        break;

      case 'set':
        if (event.targetIndex.partIndex !== undefined && event.targetIndex.setIndex !== undefined) {
          const setKey = `${event.targetIndex.partIndex}-${event.targetIndex.setIndex}`;
          setSetPinStates(prev => ({
            ...prev,
            [setKey]: newPinState
          }));

          // Clear lower-level pins for this set
          if (newPinState.setPin) {
            const exerciseKeysToRemove = Object.keys(exercisePinStates).filter(key =>
              key.startsWith(`${event.targetIndex.partIndex}-${event.targetIndex.setIndex}-`)
            );
            setExercisePinStates(prev => {
              const newState = { ...prev };
              exerciseKeysToRemove.forEach(key => delete newState[key]);
              return newState;
            });
          }
        }
        break;

      case 'exercise':
        if (event.targetIndex.partIndex !== undefined &&
            event.targetIndex.setIndex !== undefined &&
            event.targetIndex.exerciseIndex !== undefined) {
          const exerciseKey = `${event.targetIndex.partIndex}-${event.targetIndex.setIndex}-${event.targetIndex.exerciseIndex}`;
          setExercisePinStates(prev => ({
            ...prev,
            [exerciseKey]: newPinState
          }));
        }
        break;
    }

    // Log pin promotion for debugging
    console.log('Pin promoted:', {
      event,
      oldPinState: currentPinState,
      newPinState,
      level: event.level
    });
  }, [getPinState]);

  /**
   * Trigger Pin Change Events for common operations
   */
  const triggerStructureChange = useCallback((
    level: 'session' | 'part' | 'set' | 'exercise',
    changeType: 'add' | 'delete' | 'reorder' | 'modify',
    partIndex?: number,
    setIndex?: number,
    exerciseIndex?: number
  ) => {
    const event: PinChangeEvent = {
      type: 'structure_change',
      level,
      targetIndex: {
        partIndex,
        setIndex,
        exerciseIndex
      },
      changeType,
      shouldPromotePin: true,
      newPinState: {}
    };

    handlePinChangeEvent(event);
  }, [handlePinChangeEvent]);

  const triggerSpecChange = useCallback((
    partIndex: number,
    setIndex: number,
    exerciseIndex: number
  ) => {
    const event: PinChangeEvent = {
      type: 'spec_change',
      level: 'exercise',
      targetIndex: {
        partIndex,
        setIndex,
        exerciseIndex
      },
      changeType: 'modify',
      shouldPromotePin: false,
      newPinState: {}
    };

    handlePinChangeEvent(event);
  }, [handlePinChangeEvent]);

  /**
   * Reset all pin states
   */
  const resetPinStates = useCallback(() => {
    setSessionPinState({
      sessionPin: false,
      partPin: false,
      setPin: false,
      exercisePin: false
    });
    setPartPinStates({});
    setSetPinStates({});
    setExercisePinStates({});
  }, []);

  /**
   * Get all pin states for debugging
   */
  const getAllPinStates = useCallback(() => {
    return {
      session: sessionPinState,
      parts: partPinStates,
      sets: setPinStates,
      exercises: exercisePinStates
    };
  }, [sessionPinState, partPinStates, setPinStates, exercisePinStates]);

  return {
    // State getters
    getPinState,
    getAllPinStates,

    // Event handlers
    handlePinChangeEvent,
    triggerStructureChange,
    triggerSpecChange,

    // Utilities
    resetPinStates
  };
};