/**
 * autoCleanup.ts - Empty Container Auto-cleanup Utility
 *
 * Automatically removes empty sets and parts after drag operations
 */

import type { EffectivePartBlueprint, EffectiveSetBlueprint, ModifySessionRequest, PartModification, SetModification } from '../types/workout';

/**
 * 자동 정리 설정
 */
interface AutoCleanupConfig {
  /** 빈 세트 제거 여부 */
  removeEmptySets: boolean;
  /** 빈 파트 제거 여부 */
  removeEmptyParts: boolean;
  /** 최소 파트 수 (이 수 이하로는 파트를 제거하지 않음) */
  minParts: number;
  /** 최소 세트 수 (이 수 이하로는 세트를 제거하지 않음) */
  minSetsPerPart: number;
}

/**
 * 기본 자동 정리 설정
 */
const DEFAULT_CONFIG: AutoCleanupConfig = {
  removeEmptySets: true,
  removeEmptyParts: true,
  minParts: 1, // 최소 1개 파트는 유지
  minSetsPerPart: 1 // 파트당 최소 1개 세트는 유지
};

/**
 * 세트가 비어있는지 확인
 */
export const isSetEmpty = (set: EffectiveSetBlueprint): boolean => {
  return !set.exercises || set.exercises.length === 0;
};

/**
 * 파트가 비어있는지 확인 (모든 세트가 비어있거나 세트가 없음)
 */
export const isPartEmpty = (part: EffectivePartBlueprint): boolean => {
  if (!part.sets || part.sets.length === 0) {
    return true;
  }
  return part.sets.every(set => isSetEmpty(set));
};

/**
 * 세트 제거가 가능한지 확인
 */
export const canRemoveSet = (part: EffectivePartBlueprint, setIndex: number, config: AutoCleanupConfig): boolean => {
  if (!config.removeEmptySets) return false;
  if (part.sets.length <= config.minSetsPerPart) return false;
  if (setIndex < 0 || setIndex >= part.sets.length) return false;

  return isSetEmpty(part.sets[setIndex]);
};

/**
 * 파트 제거가 가능한지 확인
 */
export const canRemovePart = (blueprint: EffectivePartBlueprint[], partIndex: number, config: AutoCleanupConfig): boolean => {
  if (!config.removeEmptyParts) return false;
  if (blueprint.length <= config.minParts) return false;
  if (partIndex < 0 || partIndex >= blueprint.length) return false;

  return isPartEmpty(blueprint[partIndex]);
};

/**
 * 블루프린트에서 빈 컨테이너를 찾아서 제거할 수정사항 생성
 */
export const generateCleanupModifications = (
  blueprint: EffectivePartBlueprint[],
  config: AutoCleanupConfig = DEFAULT_CONFIG
): PartModification[] => {
  const modifications: PartModification[] = [];

  blueprint.forEach((part, partIndex) => {
    const setModifications: SetModification[] = [];

    // 1. 빈 세트 찾기 및 제거 마킹
    part.sets.forEach((set, setIndex) => {
      if (canRemoveSet(part, setIndex, config)) {
        console.log(`빈 세트 제거 마킹: Part ${partIndex}, Set ${setIndex}`);
        setModifications.push({
          setSeedId: set.setSeedId,
          action: 'delete'
        });
      }
    });

    // 2. 파트 수준 수정사항 추가
    if (setModifications.length > 0) {
      modifications.push({
        partSeedId: part.partSeedId,
        action: 'modify',
        setModifications
      });
    }

    // 3. 세트 제거 후 파트가 비게 되는지 확인하여 파트 제거 마킹
    const remainingSets = part.sets.filter((set, setIndex) =>
      !canRemoveSet(part, setIndex, config)
    );

    if (remainingSets.length === 0 && canRemovePart(blueprint, partIndex, config)) {
      console.log(`빈 파트 제거 마킹: Part ${partIndex}`);
      modifications.push({
        partSeedId: part.partSeedId,
        action: 'delete'
      });
    }
  });

  return modifications;
};

/**
 * 자동 정리 실행 - 메인 함수
 */
export const performAutoCleanup = (
  blueprint: EffectivePartBlueprint[],
  config: AutoCleanupConfig = DEFAULT_CONFIG
): ModifySessionRequest | null => {
  const cleanupModifications = generateCleanupModifications(blueprint, config);

  if (cleanupModifications.length === 0) {
    console.log('정리할 빈 컨테이너가 없습니다.');
    return null;
  }

  console.log('자동 정리 실행:', {
    cleanupCount: cleanupModifications.length,
    modifications: cleanupModifications
  });

  return {
    partModifications: cleanupModifications
  };
};

/**
 * 드래그 앤 드롭 후 자동 정리 트리거
 */
export const triggerAutoCleanupAfterDrag = (
  blueprint: EffectivePartBlueprint[],
  onCleanup: (cleanupRequest: ModifySessionRequest) => void,
  config: AutoCleanupConfig = DEFAULT_CONFIG
): void => {
  // 드래그 완료 후 약간의 지연을 두고 정리 (UI 안정성)
  setTimeout(() => {
    const cleanupRequest = performAutoCleanup(blueprint, config);
    if (cleanupRequest) {
      console.log('드래그 후 자동 정리 트리거');
      onCleanup(cleanupRequest);
    }
  }, 500); // 500ms 지연
};

export type { AutoCleanupConfig };