import { BlazePoseResultsFromBackend } from "../blazePose";

// 분석 작업 상태 타입
export type AnalysisStatus = 
  | 'pending'
  | 'blazepose_processing'
  | 'blazepose_completed'
  | 'llm_processing'
  | 'llm_completed'
  | 'failed'
  | 'blazepose_server_failed'
  | 'blazepose_pose_failed'
  | 'llm_server_failed'
  | 'llm_api_failed'
  | 'llm_failed';

// 분석 작업 정보
export type AnalysisJob = {
  _id: string;
  accountId: string;
  profileId: string;
  mediaSetId: string;
  description: {
    ans1: string;
    ans2: string;
  };
  promptId: string;
  status: AnalysisStatus;
  blazePoseResults?: BlazePoseResultsFromBackend;
  llmResults?: {
    analysisText: string;
  };
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

// 분석 상태 정보
export type AnalysisStatusInfo = {
  analysisJobId: string;
  status: AnalysisStatus;
  message: string;
  completedSteps: Array<{
    step: string;
    completedAt: string;
    description: string;
  }>;
  error: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
}

// 분석 시작 요청
export type StartAnalysisRequest = {
  fileIds: string[];
}

// 분석 시작 응답
export type StartAnalysisResponse = {
  analysisId: string;
  status: string;
  message: string;
}

// 분석 진행 단계
export type AnalysisStage = 
  | 'pending'
  | 'blazepose_processing'
  | 'blazepose_completed'
  | 'llm_processing'
  | 'llm_completed';

// 분석 단계 정보
export type AnalysisStageInfo = {
  stage: AnalysisStage;
  isCompleted: boolean;
  isActive: boolean;
  text: string;
}