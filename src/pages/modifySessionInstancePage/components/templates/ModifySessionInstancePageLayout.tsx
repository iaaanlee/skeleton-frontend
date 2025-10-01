import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionDetail } from '../../../../services/workoutService/sessionDetailService';
import { useModifySession } from '../../../../services/workoutService/sessionModificationService';
import { SessionDraftManager } from '../../../../utils/sessionDraftManager';
import { triggerAutoCleanupAfterDrag } from '../../../../utils/autoCleanup';
import {
  ModifySessionTopBar,
  WorkoutPlanEditor
} from '../organisms';
import { ExerciseSelectionBottomSheet } from '../molecules';
import { SessionInfoCard, ExerciseAddFAB } from '../atoms';
import { DndContextProvider } from '../../../../contexts/DndContextProvider';
import type { ModifySessionRequest, PartModification, SetModification, ExerciseModification, ActiveItem } from '../../../../types/workout';
import type { DragEndEvent } from '@dnd-kit/core';
import type { DragEventCallback } from '../../../../hooks/useDragAndDrop';

type Props = {
  sessionId: string;
};

export const ModifySessionInstancePageLayout: React.FC<Props> = ({ sessionId }) => {
  const navigate = useNavigate();
  const [isModified, setIsModified] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<ModifySessionRequest>({});
  const [isDragActive, setIsDragActive] = useState(false);
  const [showExerciseSelection, setShowExerciseSelection] = useState(false);
  const [activeItem, setActiveItem] = useState<ActiveItem>(null);

  const { data: sessionDetail, isLoading, error } = useSessionDetail(sessionId);
  const modifySessionMutation = useModifySession();

  const handleBack = () => {
    if (isModified) {
      if (window.confirm('저장하지 않은 변경사항이 있습니다. 정말 나가시겠습니까?')) {
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  };

  const handleSave = async () => {
    try {
      await modifySessionMutation.mutateAsync({
        sessionId,
        data: pendingChanges
      });
      setIsModified(false);
      setPendingChanges({});
      alert('세션이 성공적으로 수정되었습니다.');
      navigate(-1);
    } catch (error) {
      console.error('세션 수정 실패:', error);
      alert('세션 수정에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleChanges = (changes: Partial<ModifySessionRequest>) => {
    const updatedChanges = { ...pendingChanges, ...changes };
    setPendingChanges(updatedChanges);
    setIsModified(true);

    // 자동 draft 저장 (500ms debounce)
    SessionDraftManager.saveDraft(sessionId, updatedChanges);
  };

  // DnD 핸들러
  const handleDragStart = () => {
    setIsDragActive(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    console.log('드래그 종료:', event);
    setIsDragActive(false);
    // 드래그 앤 드롭 이벤트는 useDragAndDrop 훅의 콜백에서 처리됨
  };


  // FAB 핸들러
  const handleAddExercise = () => {
    setShowExerciseSelection(true);
  };

  const handleCloseExerciseSelection = () => {
    setShowExerciseSelection(false);
  };

  const handleExerciseSelected = (exercise: any) => {
    console.log('운동 선택됨:', exercise, '활성 아이템:', activeItem);

    if (!sessionDetail?.effectiveBlueprint) {
      console.error('세션 정보가 없어서 운동을 추가할 수 없습니다.');
      return;
    }

    let targetPartIndex = 0;
    let targetSetIndex = 0;
    let insertPosition = 1; // 기본값: 첫 번째 위치

    // ActiveItem 기반 스마트 위치 결정
    if (activeItem) {
      if (activeItem.level === 'part') {
        // 활성 파트의 첫 번째 세트 끝에 추가
        targetPartIndex = sessionDetail.effectiveBlueprint.findIndex(
          part => part.partSeedId === activeItem.id
        );
        targetSetIndex = 0; // 첫 번째 세트
        insertPosition = sessionDetail.effectiveBlueprint[targetPartIndex]?.sets[0]?.exercises.length + 1 || 1;

      } else if (activeItem.level === 'set') {
        // 활성 세트 끝에 추가
        for (let partIdx = 0; partIdx < sessionDetail.effectiveBlueprint.length; partIdx++) {
          const setIdx = sessionDetail.effectiveBlueprint[partIdx].sets.findIndex(
            set => set.setSeedId === activeItem.id
          );
          if (setIdx !== -1) {
            targetPartIndex = partIdx;
            targetSetIndex = setIdx;
            insertPosition = sessionDetail.effectiveBlueprint[partIdx].sets[setIdx].exercises.length + 1;
            break;
          }
        }

      } else if (activeItem.level === 'move') {
        // 활성 운동 바로 다음에 추가
        for (let partIdx = 0; partIdx < sessionDetail.effectiveBlueprint.length; partIdx++) {
          for (let setIdx = 0; setIdx < sessionDetail.effectiveBlueprint[partIdx].sets.length; setIdx++) {
            const exerciseIdx = sessionDetail.effectiveBlueprint[partIdx].sets[setIdx].exercises.findIndex(
              (ex, idx) => ex.exerciseTemplateId === activeItem.id ||
                    `exercise-${partIdx}-${setIdx}-${idx}-${ex.exerciseTemplateId}` === activeItem.id
            );
            if (exerciseIdx !== -1) {
              targetPartIndex = partIdx;
              targetSetIndex = setIdx;
              insertPosition = exerciseIdx + 2; // 다음 위치
              break;
            }
          }
        }
      }
    }

    // 유효성 검사
    if (targetPartIndex >= sessionDetail.effectiveBlueprint.length ||
        targetSetIndex >= sessionDetail.effectiveBlueprint[targetPartIndex].sets.length) {
      console.warn('유효하지 않은 위치, 기본 위치로 폴백:', { targetPartIndex, targetSetIndex });
      targetPartIndex = 0;
      targetSetIndex = 0;
      insertPosition = 1;
    }

    console.log('운동 추가 위치 결정:', {
      targetPartIndex,
      targetSetIndex,
      insertPosition,
      activeItem
    });

    // 운동 추가 로직 실행
    const exerciseModification: ExerciseModification = {
      exerciseTemplateId: exercise.exerciseTemplateId,
      action: 'add',
      order: insertPosition,
      spec: {
        load: { type: 'none', value: null, text: '' },
        goal: { type: 'reps', value: 10, rule: 'exact' },
        timeLimit: null
      }
    };

    const setModification: SetModification = {
      setSeedId: sessionDetail.effectiveBlueprint[targetPartIndex].sets[targetSetIndex].setSeedId,
      action: 'modify',
      exerciseModifications: [exerciseModification]
    };

    const partModification: PartModification = {
      partSeedId: sessionDetail.effectiveBlueprint[targetPartIndex].partSeedId,
      action: 'modify',
      setModifications: [setModification]
    };

    handleChanges({
      partModifications: [partModification]
    });

    setShowExerciseSelection(false);

    // 파트와 세트 자동 펼침 이벤트 발생
    const targetPart = sessionDetail.effectiveBlueprint[targetPartIndex];
    const targetSet = targetPart.sets[targetSetIndex];

    // 1. 파트 자동 펼침 이벤트
    const partId = `part-${targetPartIndex}-${targetPart.partSeedId}`;
    const expandPartEvent = new CustomEvent('auto-expand-part', {
      detail: { partId }
    });
    document.dispatchEvent(expandPartEvent);
    console.log('🔄 파트 자동 펼침 이벤트 발생:', partId);

    // 2. 세트 자동 펼침 이벤트
    const expandSetEvent = new CustomEvent('auto-expand-set', {
      detail: { setSeedId: targetSet.setSeedId }
    });
    document.dispatchEvent(expandSetEvent);
    console.log('🔄 세트 자동 펼침 이벤트 발생:', targetSet.setSeedId);

    console.log(`✅ "${exercise.exerciseName}" 운동이 스마트 위치에 추가되었습니다.`);
  };

  // DnD 콜백 구현
  const dragCallbacks: DragEventCallback = {
    onItemMove: (moveData) => {
      console.log('🚨 아이템 이동 디버깅:', {
        itemId: moveData.itemId,
        itemType: moveData.itemType,
        fromIndices: moveData.fromIndices,
        toIndices: moveData.toIndices,
        newParentId: moveData.newParentId
      });

      const { itemType, fromIndices, toIndices } = moveData;

      // 실제 위치 변화가 있는지 확인
      const hasPositionChanged =
        fromIndices.partIndex !== toIndices.partIndex ||
        fromIndices.setIndex !== toIndices.setIndex ||
        fromIndices.exerciseIndex !== toIndices.exerciseIndex;

      if (!hasPositionChanged) {
        console.log('같은 위치로 드롭됨 - 변경사항 없음');
        return; // 변경사항 없으므로 처리하지 않음
      }

      if (itemType === 'exercise') {
        // 운동 이동
        const fromPartIndex = fromIndices.partIndex ?? 0;
        const fromSetIndex = fromIndices.setIndex ?? 0;
        const toPartIndex = toIndices.partIndex ?? fromPartIndex;
        const toSetIndex = toIndices.setIndex ?? fromSetIndex;

        // 같은 세트 내에서의 순서 변경인지, 다른 세트로의 이동인지 확인
        if (fromPartIndex === toPartIndex && fromSetIndex === toSetIndex) {
          // 같은 세트 내 순서 변경
          const exerciseModification: ExerciseModification = {
            exerciseTemplateId: 'to-be-moved', // 실제로는 운동 ID 필요
            action: 'modify',
            order: toIndices.exerciseIndex ?? 0
          };

          const setModification: SetModification = {
            setSeedId: sessionDetail?.effectiveBlueprint[fromPartIndex]?.sets[fromSetIndex]?.setSeedId,
            action: 'modify',
            exerciseModifications: [exerciseModification]
          };

          const partModification: PartModification = {
            partSeedId: sessionDetail?.effectiveBlueprint[fromPartIndex]?.partSeedId,
            action: 'modify',
            setModifications: [setModification]
          };

          handleChanges({
            partModifications: [partModification]
          });
        } else {
          // 다른 세트로 이동 (삭제 + 추가)
          const originalExercise = sessionDetail?.effectiveBlueprint[fromPartIndex]?.sets[fromSetIndex]?.exercises[fromIndices.exerciseIndex ?? 0];

          if (originalExercise) {
            // 기존 위치에서 삭제
            const deleteExerciseModification: ExerciseModification = {
              exerciseTemplateId: originalExercise.exerciseTemplateId,
              action: 'delete'
            };

            // 새 위치에 추가
            const addExerciseModification: ExerciseModification = {
              exerciseTemplateId: originalExercise.exerciseTemplateId,
              action: 'add',
              order: toIndices.exerciseIndex ?? 1,
              spec: originalExercise.spec
            };

            const fromSetModification: SetModification = {
              setSeedId: sessionDetail?.effectiveBlueprint[fromPartIndex]?.sets[fromSetIndex]?.setSeedId,
              action: 'modify',
              exerciseModifications: [deleteExerciseModification]
            };

            const toSetModification: SetModification = {
              setSeedId: sessionDetail?.effectiveBlueprint[toPartIndex]?.sets[toSetIndex]?.setSeedId,
              action: 'modify',
              exerciseModifications: [addExerciseModification]
            };

            const partModifications: PartModification[] = [];

            if (fromPartIndex === toPartIndex) {
              // 같은 파트 내에서 다른 세트로 이동
              partModifications.push({
                partSeedId: sessionDetail?.effectiveBlueprint[fromPartIndex]?.partSeedId,
                action: 'modify',
                setModifications: [fromSetModification, toSetModification]
              });
            } else {
              // 다른 파트의 다른 세트로 이동
              partModifications.push({
                partSeedId: sessionDetail?.effectiveBlueprint[fromPartIndex]?.partSeedId,
                action: 'modify',
                setModifications: [fromSetModification]
              });
              partModifications.push({
                partSeedId: sessionDetail?.effectiveBlueprint[toPartIndex]?.partSeedId,
                action: 'modify',
                setModifications: [toSetModification]
              });
            }

            handleChanges({
              partModifications
            });
          }
        }

      } else if (itemType === 'set') {
        // 세트 이동 (같은 파트 내에서만 가능)
        const partIndex = fromIndices.partIndex ?? 0;

        const setModification: SetModification = {
          setSeedId: sessionDetail?.effectiveBlueprint[partIndex]?.sets[fromIndices.setIndex ?? 0]?.setSeedId,
          action: 'modify',
          order: toIndices.setIndex ?? 0
        };

        const partModification: PartModification = {
          partSeedId: sessionDetail?.effectiveBlueprint[partIndex]?.partSeedId,
          action: 'modify',
          setModifications: [setModification]
        };

        handleChanges({
          partModifications: [partModification]
        });

      } else if (itemType === 'part') {
        // 파트 순서 변경
        const partModification: PartModification = {
          partSeedId: sessionDetail?.effectiveBlueprint[fromIndices.partIndex ?? 0]?.partSeedId,
          action: 'modify',
          order: toIndices.partIndex ?? 0
        };

        handleChanges({
          partModifications: [partModification]
        });

        // 파트 이동 후 자동 정리 (빈 컨테이너 제거)
        if (sessionDetail?.effectiveBlueprint) {
          triggerAutoCleanupAfterDrag(sessionDetail.effectiveBlueprint, handleChanges);
        }
      }
    },

    onItemDuplicate: (duplicateData) => {
      console.log('아이템 복제:', duplicateData);

      const { item, targetIndices } = duplicateData;

      if (item.type === 'exercise') {
        // 운동 복제: 같은 세트 내에 복사본 추가
        const partIndex = targetIndices.partIndex ?? 0;
        const setIndex = targetIndices.setIndex ?? 0;

        const duplicateExerciseModification: ExerciseModification = {
          exerciseTemplateId: item.data.exercise?.exerciseTemplateId || item.data.name || 'unknown',
          action: 'add',
          order: (item.indices.exerciseIndex ?? 0) + 1, // 현재 운동 다음에 추가
          spec: item.data.exercise?.spec
        };

        const setModification: SetModification = {
          setSeedId: sessionDetail?.effectiveBlueprint[partIndex]?.sets[setIndex]?.setSeedId,
          action: 'modify',
          exerciseModifications: [duplicateExerciseModification]
        };

        const partModification: PartModification = {
          partSeedId: sessionDetail?.effectiveBlueprint[partIndex]?.partSeedId,
          action: 'modify',
          setModifications: [setModification]
        };

        handleChanges({
          partModifications: [partModification]
        });

      } else if (item.type === 'set') {
        // 세트 복제: 같은 파트 내에 복사본 추가
        const partIndex = targetIndices.partIndex ?? 0;
        const originalSet = sessionDetail?.effectiveBlueprint[partIndex]?.sets[item.indices.setIndex ?? 0];

        if (originalSet) {
          const duplicateSetModification: SetModification = {
            action: 'add',
            order: (item.indices.setIndex ?? 0) + 1,
            restTime: originalSet.restTime,
            timeLimit: originalSet.timeLimit,
            exerciseModifications: originalSet.exercises.map((exercise, index) => ({
              exerciseTemplateId: exercise.exerciseTemplateId,
              action: 'add',
              order: index + 1,
              spec: exercise.spec
            }))
          };

          const partModification: PartModification = {
            partSeedId: sessionDetail?.effectiveBlueprint[partIndex]?.partSeedId,
            action: 'modify',
            setModifications: [duplicateSetModification]
          };

          handleChanges({
            partModifications: [partModification]
          });
        }
      }
    },

    onItemDelete: (deleteData) => {
      console.log('아이템 삭제:', deleteData);

      const { itemType, indices } = deleteData;

      if (itemType === 'exercise') {
        // 운동 삭제
        const partIndex = indices.partIndex ?? 0;
        const setIndex = indices.setIndex ?? 0;

        const exerciseModification: ExerciseModification = {
          exerciseTemplateId: 'to-be-deleted', // 실제로는 ID를 사용해야 함
          action: 'delete'
        };

        const setModification: SetModification = {
          setSeedId: sessionDetail?.effectiveBlueprint[partIndex]?.sets[setIndex]?.setSeedId,
          action: 'modify',
          exerciseModifications: [exerciseModification]
        };

        const partModification: PartModification = {
          partSeedId: sessionDetail?.effectiveBlueprint[partIndex]?.partSeedId,
          action: 'modify',
          setModifications: [setModification]
        };

        handleChanges({
          partModifications: [partModification]
        });

      } else if (itemType === 'set') {
        // 세트 삭제
        const partIndex = indices.partIndex ?? 0;

        const setModification: SetModification = {
          setSeedId: sessionDetail?.effectiveBlueprint[partIndex]?.sets[indices.setIndex ?? 0]?.setSeedId,
          action: 'delete'
        };

        const partModification: PartModification = {
          partSeedId: sessionDetail?.effectiveBlueprint[partIndex]?.partSeedId,
          action: 'modify',
          setModifications: [setModification]
        };

        handleChanges({
          partModifications: [partModification]
        });

      } else if (itemType === 'part') {
        // 파트 삭제
        const partModification: PartModification = {
          partSeedId: sessionDetail?.effectiveBlueprint[indices.partIndex ?? 0]?.partSeedId,
          action: 'delete'
        };

        handleChanges({
          partModifications: [partModification]
        });
      }

      // 삭제 후 자동 정리 (빈 컨테이너 제거) - 모든 삭제 타입에 대해
      if (sessionDetail?.effectiveBlueprint) {
        triggerAutoCleanupAfterDrag(sessionDetail.effectiveBlueprint, handleChanges);
      }
    },

    onContainerCreate: (createData) => {
      console.log('컨테이너 생성:', createData);

      const { containerType, dragItem, targetIndices } = createData;

      if (containerType === 'part') {
        // 새 파트 생성
        const newPartModification: PartModification = {
          action: 'add',
          partName: `새 파트 ${(sessionDetail?.effectiveBlueprint.length || 0) + 1}`,
          order: (targetIndices.partIndex ?? 0) + 1,
          setModifications: [{
            action: 'add',
            order: 1,
            restTime: 60, // 기본 휴식 시간
            timeLimit: null,
            exerciseModifications: [{
              exerciseTemplateId: dragItem.data.exercise?.exerciseTemplateId || dragItem.data.name || 'unknown',
              action: 'add',
              order: 1,
              spec: dragItem.data.exercise?.spec
            }]
          }]
        };

        handleChanges({
          partModifications: [newPartModification]
        });

      } else if (containerType === 'set') {
        // 새 세트 생성
        const targetPartIndex = targetIndices.partIndex ?? 0;
        const newSetModification: SetModification = {
          action: 'add',
          order: (targetIndices.setIndex ?? 0) + 1,
          restTime: 60, // 기본 휴식 시간
          timeLimit: null,
          exerciseModifications: [{
            exerciseTemplateId: dragItem.data.exercise?.exerciseTemplateId || dragItem.data.name || 'unknown',
            action: 'add',
            order: 1,
            spec: dragItem.data.exercise?.spec
          }]
        };

        const partModification: PartModification = {
          partSeedId: sessionDetail?.effectiveBlueprint[targetPartIndex]?.partSeedId,
          action: 'modify',
          setModifications: [newSetModification]
        };

        handleChanges({
          partModifications: [partModification]
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="animate-pulse">
          {/* Top bar skeleton */}
          <div className="bg-white border-b p-4">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 bg-gray-200 rounded" />
              <div className="w-32 h-6 bg-gray-200 rounded" />
              <div className="w-16 h-8 bg-gray-200 rounded" />
            </div>
          </div>

          {/* Session editor skeleton */}
          <div className="p-4 space-y-4">
            <div className="bg-white rounded-lg p-4 border space-y-3">
              <div className="h-6 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded" />
            </div>

            <div className="bg-white rounded-lg p-4 border space-y-3">
              <div className="h-6 bg-gray-200 rounded w-1/3" />
              <div className="space-y-2">
                <div className="h-16 bg-gray-200 rounded" />
                <div className="h-16 bg-gray-200 rounded" />
                <div className="h-16 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">세션을 불러올 수 없습니다</h2>
          <p className="text-gray-600 text-sm">{error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'}</p>
        </div>
      </div>
    );
  }

  if (!sessionDetail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">세션 정보가 없습니다.</p>
        </div>
      </div>
    );
  }

  // Check if session can be modified
  if (sessionDetail.status !== 'scheduled') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-amber-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">수정할 수 없는 세션입니다</h2>
          <p className="text-gray-600 text-sm">
            {sessionDetail.status === 'started' ? '진행 중인 세션은 수정할 수 없습니다.' : '완료된 세션은 수정할 수 없습니다.'}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <DndContextProvider
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      dragCallbacks={dragCallbacks}
    >
      <div className="min-h-screen bg-gray-50" data-scroll-container>
        {/* Top Bar */}
        <ModifySessionTopBar
          sessionName={sessionDetail.sessionName}
          isModified={isModified}
          isSaving={modifySessionMutation.isPending}
          onBack={handleBack}
          onSave={handleSave}
        />

        {/* Session Info Card (Redesigned) */}
        <div className="p-4">
          <SessionInfoCard
            sessionDetail={sessionDetail}
          />
        </div>

        {/* Workout Plan Editor */}
        <div className="px-4 pb-32">
          <WorkoutPlanEditor
            effectiveBlueprint={sessionDetail.effectiveBlueprint}
            sessionId={sessionId}
            onChange={handleChanges}
            onActiveItemChange={setActiveItem}
          />
        </div>

        {/* Exercise Add FAB - PRD Compliant */}
        <ExerciseAddFAB
          isVisible={!isDragActive}
          onClick={handleAddExercise}
        />

        {/* Fixed Save Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-30">
          <div className="flex space-x-3">
            <button
              onClick={handleBack}
              className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              disabled={modifySessionMutation.isPending}
            >
              취소
            </button>
            <button
              onClick={handleSave}
              disabled={!isModified || modifySessionMutation.isPending}
              className="flex-1 py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {modifySessionMutation.isPending ? '저장 중...' : '저장하기'}
            </button>
          </div>
        </div>

        {/* Exercise Selection Bottom Sheet */}
        <ExerciseSelectionBottomSheet
          isOpen={showExerciseSelection}
          onClose={handleCloseExerciseSelection}
          onSelectExercise={handleExerciseSelected}
        />
      </div>
    </DndContextProvider>
  );
};