// 완료된 자세 분석 미디어세트 관련 타입 정의

export type CompletedPoseAnalysisMediaSet = {
  _id: string;
  name: string | null;
  poseDescription: string | null;
  mediaType: 'video' | 'image';
  files: MediaSetFile[];
  thumbnailUrl: string | null;
  analysisJob: {
    analysisJobId: string;
    status: 'pose_completed' | 'analysis_completed';
    completedAt: string;
    progress: {
      total: number;
      completed: number;
      failed: number;
      percentage: number;
    };
    estimatedImageUrls: string[];
  };
  createdAt: string;
  updatedAt: string;
};

export type MediaSetFile = {
  fileName: string;
  originalKey: string;
  thumbnailKey?: string;
  preProcessedKeys?: string[];
  estimatedKeys?: string[];
  fileSize: number;
  contentType: string;
  uploadedAt: string;
};

export type CompletedPoseAnalysisResponse = {
  mediaSets: CompletedPoseAnalysisMediaSet[];
  totalCount: number;
  hasMore: boolean;
};

export type CompletedPoseAnalysisApiResponse = {
  success: boolean;
  data: CompletedPoseAnalysisResponse;
  error?: string;
};