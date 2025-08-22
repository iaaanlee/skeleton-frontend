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
  estimatedImages?: Array<{
    key: string;
    url?: string;
    expiresAt?: string;
  }>;
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

// 자세 분석 상세 정보 관련 타입
export type PoseAnalysisDetail = {
  analysisJobId: string;
  mediaSetId: string;
  analysisImages: PoseAnalysisImage[];
  jointCoordinates: JointCoordinateData[];
  completedAt: string;
  totalFrames: number;
};

export type PoseAnalysisImage = {
  frameIndex: number;
  imageUrl: string;
  timestamp: number; // 비디오에서의 시점 (초)
  confidence: number;
};

export type JointCoordinateData = {
  frameIndex: number;
  timestamp: number;
  worldLandmarks: WorldLandmark[];
  poseLandmarks: PoseLandmark[];
};

export type WorldLandmark = {
  jointIndex: number;
  jointName: string;
  x: number; // 실제 3D 좌표 (미터 단위)
  y: number;
  z: number;
  visibility: number; // 신뢰도
};

export type PoseLandmark = {
  jointIndex: number;
  jointName: string;
  x: number; // 정규화된 2D 좌표 (0-1 범위)
  y: number; // 정규화된 2D 좌표 (0-1 범위)  
  z: number; // depth 정보
  visibility: number; // 신뢰도
};

// 33개 관절 정보 (JointDataFormatter.js와 동일)
export const JOINT_NAMES_33 = [
  '코',
  '왼쪽 눈 안쪽', 
  '왼쪽 눈',
  '왼쪽 눈 바깥쪽',
  '오른쪽 눈 안쪽',
  '오른쪽 눈',
  '오른쪽 눈 바깥쪽',
  '왼쪽 귀',
  '오른쪽 귀',
  '입 왼쪽',
  '입 오른쪽',
  '왼쪽 어깨',
  '오른쪽 어깨',
  '왼쪽 팔꿈치',
  '오른쪽 팔꿈치',
  '왼쪽 손목',
  '오른쪽 손목',
  '왼쪽 새끼손가락',
  '오른쪽 새끼손가락',
  '왼쪽 검지',
  '오른쪽 검지',
  '왼쪽 엄지',
  '오른쪽 엄지',
  '왼쪽 엉덩이',
  '오른쪽 엉덩이',
  '왼쪽 무릎',
  '오른쪽 무릎',
  '왼쪽 발목',
  '오른쪽 발목',
  '왼쪽 발뒤꿈치',
  '오른쪽 발뒤꿈치',
  '왼쪽 발가락',
  '오른쪽 발가락'
];

export type PoseAnalysisDetailApiResponse = {
  success: boolean;
  data: PoseAnalysisDetail;
  error?: string;
};