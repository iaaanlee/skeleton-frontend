import { HybrIKJoint3D, HybrIKJoint2D } from '../../../types/poseEngine';
import { 
  HYBRIK_JOINT_NAMES, 
  HYBRIK_SKELETON_CONNECTIONS,
  HYBRIK_JOINT_DISPLAY_NAMES,
  HYBRIK_JOINT_CATEGORIES,
  HYBRIK_JOINT_COLORS
} from '../../../constants/hybrik';

/**
 * HybrIK 관절을 BlazePose 호환 형식으로 변환하는 어댑터
 * 
 * HybrIK 24개 관절 → BlazePose 호환 Landmark 형식
 */

// HybrIK 관절 카테고리 매핑
export const getHybrIKJointCategory = (index: number): 'face' | 'upper_body' | 'lower_body' => {
  if (index === 15) return 'face'; // jaw
  if (index >= 12 && index <= 23) return 'upper_body'; // neck, collar, shoulders, arms
  return 'lower_body'; // pelvis, legs, feet
};

// HybrIK 관절 연결 구조 (constants/hybrik.ts에서 가져옴)
export const HYBRIK_CONNECTIONS = HYBRIK_SKELETON_CONNECTIONS;

/**
 * HybrIK 관절명 반환
 */
export const getHybrIKJointName = (index: number): string => {
  return HYBRIK_JOINT_NAMES[index] || `joint_${index}`;
};

/**
 * HybrIK 카테고리 색상 반환 (BlazePose와 동일한 색상 체계)
 */
export const getHybrIKCategoryColor = (category: 'face' | 'upper_body' | 'lower_body'): string => {
  switch (category) {
    case 'face': return '#fb923c'; // orange-400
    case 'upper_body': return '#3b82f6'; // blue-500  
    case 'lower_body': return '#ef4444'; // red-500
    default: return '#6b7280'; // gray-500
  }
};

/**
 * HybrIK 3D 관절을 BlazePose 호환 Landmark 형식으로 변환
 * @param joints3d HybrIK 3D 관절 좌표
 * @param confidence HybrIK 신뢰도 배열
 * @returns BlazePose 호환 Landmark 배열
 */
export const convertHybrIK3DToLandmarks = (
  joints3d: HybrIKJoint3D[], 
  confidence: number[]
): Array<{ x: number, y: number, z: number, visibility: number }> => {
  if (!joints3d || joints3d.length === 0) {
    return [];
  }

  return joints3d.map((joint, index) => {
    let x, y, z;

    try {
      // joint가 배열인지 객체인지 확인하고 처리
      if (Array.isArray(joint) && joint.length >= 3) {
        // joint가 [x, y, z] 형태의 배열인 경우
        [x, y, z] = joint;
      } else if (joint && typeof joint === 'object' && joint !== null) {
        // joint가 {x, y, z} 형태의 객체인 경우
        x = joint.x;
        y = joint.y;
        z = joint.z;
      } else {
        // 예상치 못한 형태의 데이터인 경우 기본값 설정
        console.warn(`⚠️ Unexpected 3D joint data structure at index ${index}:`, joint);
        x = y = z = 0;
      }

      // 각 좌표값에 대해 추가 검증
      if (typeof x !== 'number' || isNaN(x) || !isFinite(x)) x = 0;
      if (typeof y !== 'number' || isNaN(y) || !isFinite(y)) y = 0;
      if (typeof z !== 'number' || isNaN(z) || !isFinite(z)) z = 0;

    } catch (error) {
      console.error(`⚠️ Error parsing 3D joint data at index ${index}:`, error, joint);
      x = y = z = 0;
    }

    return {
      x,
      y,
      z,
      visibility: (confidence?.[index] !== undefined && typeof confidence[index] === 'number') ? confidence[index] : 0.0
    };
  });
};

/**
 * HybrIK 2D 관절을 BlazePose 호환 형식으로 변환 (Z=0으로 설정)
 * @param joints2d HybrIK 2D 관절 좌표  
 * @param confidence HybrIK 신뢰도 배열
 * @returns BlazePose 호환 Landmark 배열
 */
export const convertHybrIK2DToLandmarks = (
  joints2d: HybrIKJoint2D[],
  confidence: number[]
): Array<{ x: number, y: number, z: number, visibility: number }> => {
  if (!joints2d || joints2d.length === 0) {
    return [];
  }

  return joints2d.map((joint, index) => {
    let x, y;

    try {
      // joint가 배열인지 객체인지 확인하고 처리
      if (Array.isArray(joint) && joint.length >= 2) {
        // joint가 [x, y] 형태의 배열인 경우
        [x, y] = joint;
      } else if (joint && typeof joint === 'object' && joint !== null) {
        // joint가 {x, y} 형태의 객체인 경우
        x = joint.x;
        y = joint.y;
      } else {
        // 예상치 못한 형태의 데이터인 경우 기본값 설정
        console.warn(`⚠️ Unexpected 2D joint data structure at index ${index}:`, joint);
        x = y = 0;
      }

      // 각 좌표값에 대해 추가 검증
      if (typeof x !== 'number' || isNaN(x) || !isFinite(x)) x = 0;
      if (typeof y !== 'number' || isNaN(y) || !isFinite(y)) y = 0;

    } catch (error) {
      console.error(`⚠️ Error parsing 2D joint data at index ${index}:`, error, joint);
      x = y = 0;
    }

    return {
      x,
      y,
      z: 0, // 2D 좌표이므로 Z=0
      visibility: (confidence?.[index] !== undefined && typeof confidence[index] === 'number') ? confidence[index] : 0.0
    };
  });
};

/**
 * HybrIK 결과를 BlazePose 그래프에서 사용 가능한 형태로 변환
 * @param hybrikData HybrIK 결과 데이터
 * @returns BlazePose 호환 landmarks와 worldLandmarks
 */
export const convertHybrIKForVisualization = (hybrikData: {
  joints3d?: HybrIKJoint3D[];
  joints2d?: HybrIKJoint2D[];
  confidence?: number[];
}) => {
  const { joints3d, joints2d, confidence = [] } = hybrikData;

  // 3D 좌표를 worldLandmarks로 사용 (실제 3D 좌표)
  const worldLandmarks = joints3d ? convertHybrIK3DToLandmarks(joints3d, confidence) : undefined;
  
  // 2D 좌표를 landmarks로 사용 (이미지 좌표)
  const landmarks = joints2d ? convertHybrIK2DToLandmarks(joints2d, confidence) : undefined;

  return {
    landmarks,      // 2D 이미지 좌표 (BlazePose landmarks와 유사)
    worldLandmarks  // 3D 실제 좌표 (BlazePose worldLandmarks와 유사)
  };
};

/**
 * HybrIK 통계 계산 (BlazePose와 동일한 형식)
 */
export const calculateHybrIKStatistics = (landmarks: Array<{ visibility: number }>) => {
  const total = landmarks.length;
  const highConfidence = landmarks.filter(l => l.visibility > 0.7).length;
  const mediumConfidence = landmarks.filter(l => l.visibility > 0.5 && l.visibility <= 0.7).length;
  const lowConfidence = landmarks.filter(l => l.visibility <= 0.5).length;

  return { total, highConfidence, mediumConfidence, lowConfidence };
};

/**
 * HybrIK 카테고리별 관절 그룹핑 (BlazePose landmarkUtils와 유사)
 */
export const groupHybrIKLandmarksByCategory = (landmarks: Array<{ x: number, y: number, z: number, visibility: number }>) => {
  const grouped: Record<string, { landmarks: typeof landmarks, indices: number[] }> = {
    face: { landmarks: [], indices: [] },
    upper_body: { landmarks: [], indices: [] },
    lower_body: { landmarks: [], indices: [] }
  };

  landmarks.forEach((landmark, index) => {
    const category = getHybrIKJointCategory(index);
    grouped[category].landmarks.push(landmark);
    grouped[category].indices.push(index);
  });

  return grouped;
};