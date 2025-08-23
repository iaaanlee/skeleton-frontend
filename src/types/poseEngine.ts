// 포즈 추정 엔진 관련 타입 정의

export type PoseEngineType = 'blazepose' | 'hybrik';

export type PoseEngineOption = {
  id: PoseEngineType;
  name: string;
  description: string;
  features: string[];
  isDefault?: boolean;
  isAvailable?: boolean;
};

export const POSE_ENGINES: PoseEngineOption[] = [
  {
    id: 'blazepose',
    name: 'BlazePose',
    description: '2D 포즈 추정을 통한 빠르고 정확한 관절 좌표 분석',
    features: [
      '33개 관절 포인트',
      '2D 좌표 분석',
      '빠른 처리 속도',
      '일반적인 운동 분석'
    ],
    isDefault: true,
    isAvailable: true
  },
  {
    id: 'hybrik',
    name: 'HybrIK',
    description: '3D 포즈 추정을 통한 정밀한 입체적 자세 분석',
    features: [
      '24개 관절 포인트',
      '3D 좌표 분석',
      '정밀한 공간 분석',
      '고급 운동 분석'
    ],
    isDefault: false,
    isAvailable: true
  }
];

// HybrIK 관련 타입 정의
export type HybrIKJoint3D = {
  x: number;
  y: number;
  z: number;
};

export type HybrIKJoint2D = {
  x: number;
  y: number;
};

export type HybrIKResult = {
  joints3d: HybrIKJoint3D[];
  joints2d: HybrIKJoint2D[];
  confidence: number[];
  meta: Record<string, any>;
  estimatedImages: Array<{
    key: string;
    url?: string;
    expiresAt?: string;
  }>;
};

// 통합 포즈 분석 결과 타입
export type UnifiedPoseResult = {
  fileIndex: number;
  fileName: string;
  
  // 엔진별 원본 데이터
  blazePoseData?: {
    landmarks: Array<{
      x: number;
      y: number;
      z: number;
      visibility: number;
    }>;
    confidence: number[];
    estimatedImages: Array<{
      key: string;
      url?: string;
      expiresAt?: string;
    }>;
  };
  
  hybrikData?: HybrIKResult;
  
  // 정규화된 공통 데이터 (24개 관절)
  normalizedJoints: Array<{
    x: number;
    y: number;
    z: number;
    confidence: number;
  }>;
  overallConfidence: number;
};

export type PoseAnalysisResult = {
  engine: PoseEngineType;
  totalFiles: number;
  results: UnifiedPoseResult[];
  completedAt: string;
  stats?: {
    successRate: number;
    processingTime: number;
  };
};