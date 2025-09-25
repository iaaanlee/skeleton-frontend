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
  exerciseTemplateId: string;
  order: number;
  spec: ExerciseSpec;
};

export type ExerciseSpec = {
  goal: {
    type: 'reps' | 'time' | 'distance' | 'weight';
    value: number;
    rule: 'exact' | 'min' | 'max';
  };
  load: {
    type: 'bodyweight' | 'weight' | 'resistance' | 'none';
    value: number | null;
    text: string;
  };
  timeLimit: number | null; // seconds
};

export type SessionDetail = {
  sessionId: string;
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

// Exercise Template 관련 타입
export type ExerciseTemplate = {
  _id: string;
  exerciseName: string;
  description?: string;
  category: string;
  targetMuscles: string[];
  equipment?: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  defaultSpec?: ExerciseSpec;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ExerciseSearchParams = {
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