/**
 * dragIdGenerator.ts - 일관된 드래그 ID 생성 유틸리티
 *
 * ID 충돌 방지를 위한 결정적 ID 생성 패턴
 */

export interface DragIdParams {
  partIndex?: number;
  setIndex?: number;
  exerciseIndex?: number;
  templateId?: string;
  seedId?: string;
}

/**
 * 파트 드래그 ID 생성
 * 패턴: part-{partIndex}-{partSeedId}
 */
export const generatePartDragId = (partIndex: number, partSeedId: string): string => {
  return `part-${partIndex}-${partSeedId}`;
};

/**
 * 세트 드래그 ID 생성
 * 패턴: set-{partIndex}-{setIndex}-{setSeedId}
 */
export const generateSetDragId = (partIndex: number, setIndex: number, setSeedId: string): string => {
  return `set-${partIndex}-${setIndex}-${setSeedId}`;
};

/**
 * 운동 드래그 ID 생성
 * 패턴: exercise-{partIndex}-{setIndex}-{exerciseIndex}-{templateId}
 */
export const generateExerciseDragId = (
  partIndex: number,
  setIndex: number,
  exerciseIndex: number,
  templateId: string
): string => {
  return `exercise-${partIndex}-${setIndex}-${exerciseIndex}-${templateId}`;
};

/**
 * 드롭존 ID 생성
 */
export const generateDropZoneId = (type: 'container' | 'new-set' | 'new-part', params: DragIdParams): string => {
  if (type === 'container') {
    if (params.exerciseIndex !== undefined) {
      return `exercise-${params.partIndex || 0}-${params.setIndex || 0}-${params.exerciseIndex}`;
    }
    if (params.setIndex !== undefined) {
      return `set-${params.partIndex || 0}-${params.setIndex}`;
    }
    return `part-${params.partIndex || 0}`;
  }

  if (type === 'new-set') {
    return `new-set-${params.partIndex || 0}`;
  }

  if (type === 'new-part') {
    return `new-part-${params.partIndex || 0}`;
  }

  return `unknown-${Date.now()}`;
};

/**
 * ID 파싱 유틸리티
 */
export const parseDragId = (id: string): DragIdParams | null => {
  const parts = id.split('-');

  if (parts[0] === 'part') {
    return {
      partIndex: parseInt(parts[1]),
      seedId: parts.slice(2).join('-')
    };
  }

  if (parts[0] === 'set') {
    return {
      partIndex: parseInt(parts[1]),
      setIndex: parseInt(parts[2]),
      seedId: parts.slice(3).join('-')
    };
  }

  if (parts[0] === 'exercise') {
    return {
      partIndex: parseInt(parts[1]),
      setIndex: parseInt(parts[2]),
      exerciseIndex: parseInt(parts[3]),
      templateId: parts.slice(4).join('-')
    };
  }

  return null;
};

/**
 * 디버깅용 ID 검증
 */
export const validateDragId = (id: string): boolean => {
  const parsed = parseDragId(id);
  return parsed !== null;
};

/**
 * 고유성 보장을 위한 ID 체크
 */
export const ensureUniqueId = (id: string, existingIds: Set<string>): string => {
  if (!existingIds.has(id)) {
    return id;
  }

  let counter = 1;
  let uniqueId = `${id}-${counter}`;

  while (existingIds.has(uniqueId)) {
    counter++;
    uniqueId = `${id}-${counter}`;
  }

  return uniqueId;
};