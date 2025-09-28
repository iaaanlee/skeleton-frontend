/**
 * EditBottomSheet 모달 시스템 공통 타입 정의
 *
 * Phase 1: 바텀시트 모달 편집 시스템 기반 구축
 * PRD 참조 이미지: ::b.png, ::c.png, ::d.png
 */

import type { EffectiveExerciseBlueprint, EffectiveSetBlueprint, ExerciseSpec } from './workout';

/**
 * 기본 바텀시트 모달 Props
 */
export type BaseEditBottomSheetProps = {
  /** 모달 열림/닫힘 상태 */
  isOpen: boolean;
  /** 모달 닫기 핸들러 */
  onClose: () => void;
  /** 모달 제목 (PRD 요구사항에 따라 다양함) */
  title: string;
  /** 휴지통 아이콘 표시 여부 (::c.png 운동 편집 전용) */
  showDeleteIcon?: boolean;
  /** 삭제 핸들러 (showDeleteIcon=true일 때만 사용) */
  onDelete?: () => void;
  /** 모달 내용 */
  children: React.ReactNode;
};

/**
 * 휴식시간 편집 모달 Props (::b.png)
 * "파트1 - 세트 1 | 휴식 시간" 패턴
 */
export type RestTimeEditBottomSheetProps = {
  /** 모달 열림/닫힘 상태 */
  isOpen: boolean;
  /** 모달 닫기 핸들러 */
  onClose: () => void;
  /** 현재 휴식시간 (초) */
  currentRestTime: number;
  /** 파트명 (예: "파트1") */
  partName: string;
  /** 세트 인덱스 (1-based, 표시용) */
  setIndex: number;
  /** 저장 핸들러 */
  onSave: (restTime: number, applyToAll: boolean) => void;
};

/**
 * 운동 편집 모달 Props (::c.png)
 * "중량 턱걸이" + 휴지통 아이콘 + 최근 기록 힌트
 */
export type ExerciseEditBottomSheetProps = {
  /** 모달 열림/닫힘 상태 */
  isOpen: boolean;
  /** 모달 닫기 핸들러 */
  onClose: () => void;
  /** 편집할 운동 데이터 */
  exercise: EffectiveExerciseBlueprint;
  /** 저장 핸들러 */
  onSave: (updatedSpec: ExerciseSpec, applyToAll: boolean) => void;
  /** 삭제 핸들러 (우상단 휴지통 아이콘) */
  onDelete: () => void;
  /** 최근 기록 정보 (선택사항, "가장 최근 기록: 10kg x 10회") */
  recentRecord?: string;
};

/**
 * 시간제한 편집 모달 Props (::d.png)
 * "운동 시간 제한" + 설명 텍스트
 */
export type TimeLimitEditBottomSheetProps = {
  /** 모달 열림/닫힘 상태 */
  isOpen: boolean;
  /** 모달 닫기 핸들러 */
  onClose: () => void;
  /** 현재 시간제한 (초, null이면 제한 없음) */
  currentTimeLimit: number | null;
  /** 저장 핸들러 */
  onSave: (timeLimit: number | null, applyToAll: boolean) => void;
};

/**
 * 모달 상태 관리를 위한 유틸 타입들
 */
export type EditModalType = 'restTime' | 'exercise' | 'timeLimit';

export type EditModalState = {
  type: EditModalType | null;
  isOpen: boolean;
  data?: any; // 모달별 특정 데이터
};

/**
 * 일괄 적용 관련 공통 타입
 * PRD 핵심 요구사항: 모든 편집 모달에 일괄 적용 토글 존재
 */
export type BatchApplyOptions = {
  /** "이 세션 내 모든 휴식에 변경 사항 적용" */
  applyToAllRest?: boolean;
  /** "이 세션 내 모든 동일한 운동에 변경 사항 적용" */
  applyToSameExercise?: boolean;
  /** "이 세션 내 모든 시간 제한에 변경 사항 적용" */
  applyToAllTimeLimit?: boolean;
};