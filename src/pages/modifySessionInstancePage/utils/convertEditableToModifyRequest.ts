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
 * Exercise 변환 함수
 */
function convertExerciseModifications(
  originalExercises: EffectiveExerciseBlueprint[],
  editableExercises: EditableExerciseBlueprint[]
): ExerciseModification[] {
  const modifications: ExerciseModification[] = [];

  // 1. 삭제된 Exercise 처리
  const deletedExerciseIds = findDeletedItems(
    originalExercises,
    editableExercises,
    'exerciseTemplateId'
  );

  deletedExerciseIds.forEach((exerciseTemplateId) => {
    modifications.push({
      exerciseTemplateId,
      action: 'delete',
    });
  });

  // 2. Add/Modify Exercise 처리
  editableExercises.forEach((exercise) => {
    const original = originalExercises.find(
      (e) => e.exerciseTemplateId === exercise.exerciseTemplateId
    );

    if (!original) {
      // 새로 추가된 Exercise
      modifications.push({
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
        modifications.push({
          setSeedId: set.setSeedId,
          setBlueprintId: set.setBlueprintId,
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

  return modifications;
}

/**
 * Part 변환 함수 (메인 엔트리 포인트)
 */
export function convertEditableToModifyRequest(
  original: EffectivePartBlueprint[],
  editable: EditablePartBlueprint[]
): ModifySessionRequest {
  const partModifications: PartModification[] = [];

  // 1. 삭제된 Part 처리
  const deletedPartIds = findDeletedItems(original, editable, 'partSeedId');

  deletedPartIds.forEach((partSeedId) => {
    const originalPart = original.find((p) => p.partSeedId === partSeedId);
    partModifications.push({
      partSeedId,
      partBlueprintId: originalPart?.partBlueprintId ?? null,
      action: 'delete',
    });
  });

  // 2. Add/Modify Part 처리
  editable.forEach((part) => {
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
          partBlueprintId: part.partBlueprintId,
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
