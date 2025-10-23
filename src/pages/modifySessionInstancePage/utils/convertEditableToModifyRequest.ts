/**
 * 변환 함수: EditablePartBlueprint[] → ModifySessionRequest
 *
 * Day 4 Phase 1: Save API Integration
 *
 * 로컬 편집 상태(editable)와 서버 원본 데이터(original)를 비교하여
 * 백엔드 ModifySessionRequest 형식으로 변환
 *
 * 변환 로직:
 * 1. Delete 판단: original에는 있지만 editable에 없으면 삭제
 * 2. Add 판단: blueprintId === null이면 새로 추가
 * 3. Modify 판단: _isModified === true 또는 order 변경 시
 */

import type {
  EffectivePartBlueprint,
  EffectiveSetBlueprint,
  EffectiveExerciseBlueprint,
  EditablePartBlueprint,
  EditableSetBlueprint,
  EditableExerciseBlueprint,
  ModifySessionRequest,
  PartModification,
  SetModification,
  ExerciseModification,
} from '../../../types/workout';

/**
 * Order 재정렬 헬퍼 함수 (0, 10, 20, 30...)
 */
function resequenceOrders<T extends { order: number }>(items: T[]): T[] {
  return items.map((item, idx) => ({
    ...item,
    order: idx * 10
  }));
}

/**
 * 비어있는 세트/파트 제거 및 order 재정렬
 * - exercises가 빈 세트 제거
 * - sets가 빈 파트 제거
 * - 남은 항목들의 order 재정렬 (0, 10, 20, 30...)
 */
function removeEmptyAndResequence(editable: EditablePartBlueprint[]): EditablePartBlueprint[] {
  // 1. 각 파트의 세트 필터링 (비어있는 세트 제거 & order 재정렬)
  const partsWithFilteredSets = editable.map(part => {
    const nonEmptySets = part.sets.filter(set => set.exercises.length > 0);
    const resequencedSets = resequenceOrders(nonEmptySets);
    return {
      ...part,
      sets: resequencedSets
    };
  });

  // 2. 비어있는 파트 제거 (세트가 없는 파트)
  const nonEmptyParts = partsWithFilteredSets.filter(part => part.sets.length > 0);

  // 3. 남은 파트들의 order 재정렬
  const resequencedParts = resequenceOrders(nonEmptyParts);

  return resequencedParts;
}

/**
 * 삭제된 아이템 찾기 헬퍼 함수
 */
function findDeletedItems<T extends { [key: string]: any }>(
  original: T[],
  editable: T[],
  idKey: string
): string[] {
  const editableIds = new Set(editable.map((item) => item[idKey]));
  return original
    .map((item) => item[idKey])
    .filter((id) => !editableIds.has(id));
}

/**
 * Exercise 매칭 헬퍼 함수
 * Pin 후 → exerciseLocalId 매칭
 * Pin 전 → exerciseBlueprintId 매칭
 */
function findMatchingExercise(
  original: EffectiveExerciseBlueprint,
  editableExercises: EditableExerciseBlueprint[]
): EditableExerciseBlueprint | undefined {
  // Pin 후 → localId 매칭
  if (original.exerciseLocalId) {
    return editableExercises.find(
      (e) => e.exerciseLocalId && e.exerciseLocalId === original.exerciseLocalId
    );
  }
  // Pin 전 → blueprintId 매칭
  if (original.exerciseBlueprintId !== null) {
    return editableExercises.find(
      (e) => e.exerciseBlueprintId === original.exerciseBlueprintId
    );
  }
  // blueprintId도 null인 경우 (신규 추가된 항목)
  return undefined;
}

/**
 * Exercise 변환 함수
 */
function convertExerciseModifications(
  originalExercises: EffectiveExerciseBlueprint[],
  editableExercises: EditableExerciseBlueprint[]
): ExerciseModification[] {
  const modifications: ExerciseModification[] = [];

  // 1. 삭제된 Exercise 처리 (blueprintId/localId 기반 매칭)
  originalExercises.forEach((original) => {
    const matched = findMatchingExercise(original, editableExercises);
    if (!matched) {
      // editable에 없으면 삭제된 것
      modifications.push({
        exerciseSeedId: original.exerciseSeedId,
        exerciseBlueprintId: original.exerciseBlueprintId,
        // 🔧 BUG #8 FIX: Delete 시 exerciseLocalId 필수 (setPin:true 스냅샷 정확한 매칭용)
        // exerciseTemplateId는 unique하지 않음 (같은 운동 여러 번 사용 가능)
        exerciseLocalId: original.exerciseLocalId,
        exerciseTemplateId: original.exerciseTemplateId,
        action: 'delete',
      });
    }
  });

  // 2. Add/Modify Exercise 처리 (blueprintId/localId 기반 매칭)
  editableExercises.forEach((exercise) => {
    // original에서 매칭되는 항목 찾기
    let original: EffectiveExerciseBlueprint | undefined;

    if (exercise.exerciseLocalId) {
      // Pin 후 → localId 매칭
      original = originalExercises.find(
        (e) => e.exerciseLocalId && e.exerciseLocalId === exercise.exerciseLocalId
      );
    } else if (exercise.exerciseBlueprintId !== null) {
      // Pin 전 → blueprintId 매칭
      original = originalExercises.find(
        (e) => e.exerciseBlueprintId === exercise.exerciseBlueprintId
      );
    }

    if (!original) {
      // 새로 추가된 Exercise (blueprintId === null)
      modifications.push({
        exerciseSeedId: exercise.exerciseSeedId,
        exerciseBlueprintId: exercise.exerciseBlueprintId,
        exerciseTemplateId: exercise.exerciseTemplateId,
        action: 'add',
        order: exercise.order,
        spec: exercise.spec,
      });
    } else {
      // 기존 Exercise 수정 여부 확인
      const isSpecModified = exercise._isModified === true;
      const isOrderChanged = exercise.order !== original.order;

      if (isSpecModified || isOrderChanged) {
        modifications.push({
          exerciseSeedId: exercise.exerciseSeedId,
          // 🔧 BUG #5 FIX: editable state에서 exerciseBlueprintId가 손실된 경우 original에서 복원
          exerciseBlueprintId: exercise.exerciseBlueprintId ?? original.exerciseBlueprintId,
          // 🔧 EXERCISE MATCHING FIX: exerciseLocalId 보존 (setPin:true 스냅샷 매칭용)
          // PRD Line 264, 594: setPin:true 시 exerciseLocalId 필수
          exerciseLocalId: exercise.exerciseLocalId ?? original.exerciseLocalId,
          exerciseTemplateId: exercise.exerciseTemplateId,
          action: 'modify',
          order: exercise.order,
          spec: exercise.spec,
        });
      }
    }
  });

  return modifications;
}

/**
 * Set 변환 함수
 */
function convertSetModifications(
  originalSets: EffectiveSetBlueprint[],
  editableSets: EditableSetBlueprint[]
): SetModification[] {
  const modifications: SetModification[] = [];

  // 🔍 DIAGNOSTIC: Log input data
  console.log('🔍 [DIAGNOSTIC] convertSetModifications input:', {
    originalSetsCount: originalSets.length,
    editableSetsCount: editableSets.length,
    originalSets: originalSets.map((s, idx) => ({
      index: idx,
      setSeedId: s.setSeedId,
      setBlueprintId: s.setBlueprintId,
      order: s.order
    })),
    editableSets: editableSets.map((s, idx) => ({
      index: idx,
      setSeedId: s.setSeedId,
      setBlueprintId: s.setBlueprintId,
      order: s.order,
      _isModified: s._isModified
    }))
  });

  // 1. 삭제된 Set 처리
  const deletedSetIds = findDeletedItems(originalSets, editableSets, 'setSeedId');

  deletedSetIds.forEach((setSeedId) => {
    const original = originalSets.find((s) => s.setSeedId === setSeedId);
    modifications.push({
      setSeedId,
      setBlueprintId: original?.setBlueprintId ?? null,
      action: 'delete',
    });
  });

  // 2. Add/Modify Set 처리
  editableSets.forEach((set) => {
    const original = originalSets.find((s) => s.setSeedId === set.setSeedId);

    if (!original) {
      // 새로 추가된 Set (setBlueprintId === null이어야 함)
      const exerciseModifications =
        set.exercises.length > 0
          ? convertExerciseModifications([], set.exercises)
          : undefined;

      modifications.push({
        setSeedId: set.setSeedId,
        setBlueprintId: set.setBlueprintId,
        action: 'add',
        order: set.order,
        restTime: set.restTime,
        timeLimit: set.timeLimit,
        exerciseModifications,
      });
    } else {
      // 기존 Set 수정 여부 확인
      const isSetModified = set._isModified === true;
      const isOrderChanged = set.order !== original.order;
      const exerciseModifications = convertExerciseModifications(
        original.exercises,
        set.exercises
      );
      const hasExerciseChanges = exerciseModifications.length > 0;

      if (isSetModified || isOrderChanged || hasExerciseChanges) {
        const finalBlueprintId = set.setBlueprintId ?? original.setBlueprintId;
        console.log('🔍 [DIAGNOSTIC] Creating set modification:', {
          setSeedId: set.setSeedId,
          setBlueprintId_editable: set.setBlueprintId,
          setBlueprintId_original: original.setBlueprintId,
          setBlueprintId_final: finalBlueprintId,
          action: 'modify'
        });
        modifications.push({
          setSeedId: set.setSeedId,
          // 🔧 BUG #5 FIX: editable state에서 setBlueprintId가 손실된 경우 original에서 복원
          // Series blueprint 세트를 수정할 때 blueprintId가 필요함 (PRD Line 389-396)
          setBlueprintId: finalBlueprintId,
          action: 'modify',
          order: set.order,
          restTime: set.restTime,
          timeLimit: set.timeLimit,
          exerciseModifications:
            exerciseModifications.length > 0 ? exerciseModifications : undefined,
        });
      }
    }
  });

  console.log('🔍 [DIAGNOSTIC] convertSetModifications output:', {
    modificationsCount: modifications.length,
    modifications: modifications.map(m => ({
      action: m.action,
      setSeedId: m.setSeedId,
      setBlueprintId: m.setBlueprintId
    }))
  });

  return modifications;
}

/**
 * Part 변환 함수 (메인 엔트리 포인트)
 */
export function convertEditableToModifyRequest(
  original: EffectivePartBlueprint[],
  editable: EditablePartBlueprint[]
): ModifySessionRequest {
  // 0. 저장 전처리: 비어있는 세트/파트 제거 및 order 재정렬
  const cleanedEditable = removeEmptyAndResequence(editable);

  const partModifications: PartModification[] = [];

  // 1. 삭제된 Part 처리
  const deletedPartIds = findDeletedItems(original, cleanedEditable, 'partSeedId');

  deletedPartIds.forEach((partSeedId) => {
    const originalPart = original.find((p) => p.partSeedId === partSeedId);
    partModifications.push({
      partSeedId,
      partBlueprintId: originalPart?.partBlueprintId ?? null,
      action: 'delete',
    });
  });

  // 2. Add/Modify Part 처리
  cleanedEditable.forEach((part) => {
    const originalPart = original.find((p) => p.partSeedId === part.partSeedId);

    if (!originalPart) {
      // 새로 추가된 Part (partBlueprintId === null이어야 함)
      const setModifications =
        part.sets.length > 0 ? convertSetModifications([], part.sets) : undefined;

      partModifications.push({
        partSeedId: part.partSeedId,
        partBlueprintId: part.partBlueprintId,
        action: 'add',
        partName: part.partName,
        order: part.order,
        setModifications,
      });
    } else {
      // 기존 Part 수정 여부 확인
      const isPartModified = part._isModified === true;
      const isOrderChanged = part.order !== originalPart.order;
      const setModifications = convertSetModifications(originalPart.sets, part.sets);
      const hasSetChanges = setModifications.length > 0;

      if (isPartModified || isOrderChanged || hasSetChanges) {
        partModifications.push({
          partSeedId: part.partSeedId,
          // 🔧 BUG #5 FIX: editable state에서 partBlueprintId가 손실된 경우 original에서 복원
          // Series blueprint 파트를 수정할 때 blueprintId가 필요함 (PRD Line 389-396)
          partBlueprintId: part.partBlueprintId ?? originalPart.partBlueprintId,
          action: 'modify',
          partName: part.partName,
          order: part.order,
          setModifications: setModifications.length > 0 ? setModifications : undefined,
        });
      }
    }
  });

  return {
    partModifications: partModifications.length > 0 ? partModifications : undefined,
  };
}

/**
 * Editable state가 수정되었는지 확인하는 헬퍼 함수
 * (handleSave에서 저장 버튼 활성화 여부 판단용)
 */
export function isEditableModified(
  original: EffectivePartBlueprint[],
  editable: EditablePartBlueprint[]
): boolean {
  const request = convertEditableToModifyRequest(original, editable);
  return request.partModifications !== undefined && request.partModifications.length > 0;
}
