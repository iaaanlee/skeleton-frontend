// Frontend workout types (aligned with backend)

export type SessionStatus = 'scheduled' | 'started' | 'completed';
export type CreationType = 'single' | 'series';
export type SeriesStatus = 'scheduled' | 'started' | 'completed';

// Session Summary for lists
export type SessionSummary = {
  sessionId: string;
  sessionName: string;
  status: SessionStatus;
  scheduledAt: Date;
  startedAt?: Date;
  endedAt?: Date;
  seriesId?: string;
  seriesName?: string;
  estimatedDurationMinutes?: number;
  completionRate?: number;
};

// Date Session Summary for calendar
export type DateSessionSummary = {
  date: string; // YYYY-MM-DD
  totalSessions: number;
  completedSessions: number;
  scheduledSessions: number;
  inProgressSessions: number;
  sessions: SessionSummary[];
};

// Calendar Dot
export type CalendarDot = {
  date: string; // YYYY-MM-DD
  dotType: 'gray' | 'empty';
  sessionCount: number;
  completedCount: number;
};

// Series Summary
export type SeriesSummary = {
  seriesId: string;
  seriesName: string;
  description?: string;
  status: SeriesStatus;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedDurationMinutes?: number;
  totalSessions?: number;
};

// API Response Types
export type SessionListResponse = {
  sessions: SessionSummary[];
  totalCount: number;
  hasMore: boolean;
};

export type ScheduleResponse = {
  dateRange: {
    startDate: string;
    endDate: string;
  };
  dailySummaries: DateSessionSummary[];
  totalSessions: number;
  seriesInfo?: {
    seriesId: string;
    seriesName: string;
    totalSessions: number;
  }[];
};

export type CalendarDotsResponse = {
  dateRange: {
    startDate: string;
    endDate: string;
  };
  calendarDots: CalendarDot[];
};

// UI State Types
export type CalendarMode = 'week' | 'month';

export type ScheduleViewState = {
  calendarMode: CalendarMode;
  selectedDate: string; // YYYY-MM-DD
  scrollAnchors: {
    seriesStrip: number;
    sessionList: number;
  };
};

// Session Detail 활성화 시스템 (PRD 요구사항)
export type ActiveItem = {
  level: 'part' | 'set' | 'move';
  id: string;
} | null;

// Session Detail 관련 타입 (Stage 2)
export type EffectivePartBlueprint = {
  partBlueprintId: string | null;
  partSeedId: string;
  partName: string;
  order: number;
  sets: EffectiveSetBlueprint[];
};

export type EffectiveSetBlueprint = {
  setBlueprintId: string | null;
  setSeedId: string;
  order: number;
  restTime: number;        // seconds
  timeLimit: number | null; // seconds
  exercises: EffectiveExerciseBlueprint[];
};

export type EffectiveExerciseBlueprint = {
  exerciseSeedId: string;              // 임시 ID (매칭 불가)
  exerciseBlueprintId: string | null;  // Pin 전 매칭용
  exerciseLocalId?: string;            // Pin 후 매칭용
  exerciseTemplateId: string;
  order: number;
  spec: ExerciseSpec;
};

// Editable Blueprint Types (Stage 4B: Modify Page State Management)
// effectiveBlueprint를 로컬에서 편집 가능한 상태로 변환한 타입
export type EditableExerciseBlueprint = {
  exerciseSeedId: string;              // 임시 ID (매칭 불가)
  exerciseBlueprintId: string | null;  // Pin 전 매칭용
  exerciseLocalId?: string;            // Pin 후 매칭용
  exerciseTemplateId: string;
  order: number;
  spec: ExerciseSpec;
  // 편집 메타데이터
  _isModified?: boolean;      // spec이 변경되었는지
  _originalOrder?: number;    // DnD 전 원래 순서 (복원용)
};

export type EditableSetBlueprint = {
  setBlueprintId: string | null;
  setSeedId: string;
  order: number;
  restTime: number;
  timeLimit: number | null;
  exercises: EditableExerciseBlueprint[];
  // 편집 메타데이터
  _isModified?: boolean;      // restTime/timeLimit이 변경되었는지
  _originalOrder?: number;    // DnD 전 원래 순서
  _isNew?: boolean;           // 새로 추가된 세트인지 (저장 후 false로 변경)
};

export type EditablePartBlueprint = {
  partBlueprintId: string | null;
  partSeedId: string;
  partName: string;
  order: number;
  sets: EditableSetBlueprint[];
  // 편집 메타데이터
  _isModified?: boolean;      // partName이 변경되었는지
  _originalOrder?: number;    // DnD 전 원래 순서
};

// PRD 타입 시스템 (WORKOUT_MANAGEMENT_IMPLEMENTATION_PLAN.md Line 798-801)
// loadType: 'free' | 'g' | 'mm' | 'second'
// goalType: 'rep' | 'second' | 'mm' | 'g'
export type ExerciseSpec = {
  goal: {
    type: 'rep' | 'second' | 'mm' | 'g';
    value: number;
    rule: 'exact' | 'min' | 'max';
  };
  load: {
    type: 'free' | 'g' | 'mm' | 'second';
    value: number | null;
    text?: string;  // 'free' 타입만 사용 (optional)
  };
  timeLimit: number | null; // seconds
};

export type SessionDetail = {
  sessionId: string;
  profileId: string;       // 프로필 ID 추가
  sessionName: string;
  status: SessionStatus;
  creationType: CreationType;
  scheduledAt: string;     // ISO date string
  startedAt?: string;      // ISO date string
  completedAt?: string;    // ISO date string
  seriesId?: string;
  seriesName?: string;
  effectiveBlueprint: EffectivePartBlueprint[];
  preview: SessionPreview;
};

export type SessionPreview = {
  totalParts: number;
  totalSets: number;
  totalExercises: number;
  estimatedDurationMinutes: number;
};

// Session Modification 관련 타입 (Stage 3)
export type PartModification = {
  partSeedId?: string;           // 기존 파트 수정 시
  partBlueprintId?: string | null;  // 참조 Blueprint ID
  action: 'add' | 'modify' | 'delete';
  partName?: string;
  order?: number;
  setModifications?: SetModification[];
};

export type SetModification = {
  setSeedId?: string;            // 기존 세트 수정 시
  setBlueprintId?: string | null;   // 참조 Blueprint ID
  action: 'add' | 'modify' | 'delete';
  order?: number;
  restTime?: number;
  timeLimit?: number | null;
  exerciseModifications?: ExerciseModification[];
};

export type ExerciseModification = {
  exerciseSeedId?: string;       // 기존 운동 수정/삭제 시 (modify/delete에 필수)
  exerciseBlueprintId?: string | null;  // Blueprint 운동 식별자
  exerciseLocalId?: string;      // Pin 후 매칭용 (setPin:true 스냅샷에서 필수)
  exerciseTemplateId: string;
  action: 'add' | 'modify' | 'delete';
  order?: number;
  spec?: ExerciseSpec;
};

export type ModifySessionRequest = {
  sessionName?: string;
  scheduledAt?: string;
  partModifications?: PartModification[];
};

export type ModifySessionResponse = {
  success: boolean;
  sessionId: string;
  modifiedPartCount: number;
  modifiedSetCount: number;
  modifiedExerciseCount: number;
};

// Exercise Template 관련 타입 (PRD 준수 - Lines 1352-1388)
export type ExerciseTemplate = {
  _id: string;
  profileId: string;
  exerciseName: string;
  creationType: 'preset' | 'custom';
  presetExerciseTemplateId: string | null;
  isDeleted: boolean;
  thumbnailUrl: string | null;
  specBlueprint: {
    goal: {
      type: 'rep' | 'g' | 'mm' | 'second';
      value: number;
      rule: 'eq' | 'min' | 'max';
    };
    load: {
      type: 'g' | 'mm' | 'second' | 'free';
      value?: number;
      text: string;
    };
    timeLimit: number | null;
  };
  exerciseInfo: {
    note: string;
    exercisePresetId: string | null;
    categoryId: string | null;
    '운동 유형 및 목적': string[];
    '운동 부위': string[];
    '운동 기구': string[];
  };
  timeStamp: {
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  };
};

export type ExerciseSearchParams = {
  profileId: string;       // 프로필 ID (필수)
  q?: string;              // 검색어
  category?: string;       // 카테고리 필터
  difficulty?: string;     // 난이도 필터
  equipment?: string;      // 장비 필터
  limit?: number;
  offset?: number;
};

export type ExerciseSearchResponse = {
  exercises: ExerciseTemplate[];
  totalCount: number;
  hasMore: boolean;
};

export type ExerciseCategory = {
  name: string;
  count: number;
};

// Common API Response wrapper
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Pin System Types (Stage 4B)
export * from './pinSystem';