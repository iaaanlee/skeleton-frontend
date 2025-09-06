import { HybrIKJoint3D } from '../../../types/poseEngine';
// 🗑️ HybrIKJoint2D import 제거 - 더 이상 사용하지 않음
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
 * HybrIK 관절명 반환 (한글 표시명)
 */
export const getHybrIKJointName = (index: number): string => {
  const englishName = HYBRIK_JOINT_NAMES[index];
  if (!englishName) return `관절_${index}`;
  
  // HYBRIK_JOINT_DISPLAY_NAMES을 타입 체크하여 안전하게 접근
  return (HYBRIK_JOINT_DISPLAY_NAMES as any)[englishName] || englishName;
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
  confidence: number[] | number[][]
): Array<{ x: number, y: number, z: number, visibility: number }> => {
  if (!joints3d || joints3d.length === 0) {
    return [];
  }

  // Confidence 배열 평탄화 처리
  let flatConfidence: number[] = [];
  if (confidence && confidence.length > 0) {
    flatConfidence = confidence.map((conf: any) => {
      // 중첩 배열 처리: [[0.995], [0.993]] 형태를 [0.995, 0.993]로 변환
      if (Array.isArray(conf)) {
        return conf[0] || 0.0;
      }
      return typeof conf === 'number' ? conf : 0.0;
    });
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

    // confidence 값 설정 (기본값 0.95로 설정 - HybrIK는 일반적으로 높은 신뢰도)
    const visibilityValue = flatConfidence[index] !== undefined ? flatConfidence[index] : 0.95;

    return {
      x,
      y,
      z,
      visibility: visibilityValue
    };
  });
};

/**
 * 🗑️ HybrIK 2D 좌표 변환 메서드 완전 제거
 * joints2d 데이터를 더 이상 사용하지 않음
 * 3D 좌표의 X,Y 성분으로 대체 사용
 */

/**
 * HybrIK 3D 좌표에서 2D 좌표 생성 (X,Y 성분 사용)
 * joints2d 대체 함수
 */
export const generate2DFromHybrIK3D = (
  joints3d: HybrIKJoint3D[],
  confidence: number[] | number[][]
): Array<{ x: number, y: number, z: number, visibility: number }> => {
  if (!joints3d || joints3d.length === 0) {
    return [];
  }

  // Confidence 배열 평탄화 처리
  let flatConfidence: number[] = [];
  if (confidence && confidence.length > 0) {
    flatConfidence = confidence.map((conf: any) => {
      if (Array.isArray(conf)) {
        return conf[0] || 0.0;
      }
      return typeof conf === 'number' ? conf : 0.0;
    });
  }

  return joints3d.map((joint, index) => {
    let x, y;

    try {
      if (Array.isArray(joint) && joint.length >= 3) {
        // 3D 좌표에서 X,Y 성분만 사용
        [x, y] = joint; // Z는 무시
      } else if (joint && typeof joint === 'object' && joint !== null) {
        x = joint.x;
        y = joint.y;
      } else {
        console.warn(`⚠️ Unexpected 3D joint data structure at index ${index}:`, joint);
        x = y = 0;
      }

      if (typeof x !== 'number' || isNaN(x) || !isFinite(x)) x = 0;
      if (typeof y !== 'number' || isNaN(y) || !isFinite(y)) y = 0;

    } catch (error) {
      console.error(`⚠️ Error parsing 3D joint data for 2D projection at index ${index}:`, error, joint);
      x = y = 0;
    }

    const visibilityValue = flatConfidence[index] !== undefined ? flatConfidence[index] : 0.95;

    return {
      x,
      y,
      z: 0, // 2D 투영이므로 Z=0
      visibility: visibilityValue
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
  confidence?: number[] | number[][];
  // 🗑️ joints2d 완전 제거
}) => {
  // 방어 코드: 잘못된 입력 데이터 처리
  if (!hybrikData || typeof hybrikData !== 'object') {
    console.warn('⚠️ convertHybrIKForVisualization: Invalid hybrikData input');
    return { landmarks: undefined, worldLandmarks: undefined };
  }

  const { joints3d, confidence = [] } = hybrikData;

  // 방어 코드: joints3d 유효성 검사
  if (!joints3d || !Array.isArray(joints3d) || joints3d.length === 0) {
    return { landmarks: undefined, worldLandmarks: undefined };
  }

  // 3D 좌표를 worldLandmarks로 사용 (실제 3D 좌표)
  const worldLandmarks = convertHybrIK3DToLandmarks(joints3d, confidence);
  
  // 3D 좌표의 X,Y 성분을 landmarks로 사용 (2D 좌표 대체)
  const landmarks = generate2DFromHybrIK3D(joints3d, confidence);

  return {
    landmarks,      // 3D에서 생성한 2D 좌표 (joints2d 대체)
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