import { Prescription } from '../../../services/prescriptionService';

export const formatConfidence = (confidence: number): string => {
  return `${(confidence * 100).toFixed(1)}%`;
};

export const calculateAverageConfidence = (result: Prescription): number => {
  // 통합 포즈 분석 결과 우선 확인 (HybrIK/BlazePose 통합)
  const poseResults = result.poseAnalysis || result.blazePoseResults;
  
  if (!poseResults?.results?.[0]) return 0;
  
  const firstResult = poseResults.results[0] as any;
  
  // 1. overallConfidence 값이 있고 유효하며 0보다 크면 사용
  if (typeof firstResult.overallConfidence === 'number' && 
      !isNaN(firstResult.overallConfidence) && 
      isFinite(firstResult.overallConfidence) &&
      firstResult.overallConfidence > 0) {
    return firstResult.overallConfidence;
  }
  
  // 2. HybrIK 데이터 처리 (hybrikData 구조 또는 최상위 confidence)
  const hybrikConfidence = firstResult.hybrikData?.confidence || firstResult.confidence;
  if (hybrikConfidence && Array.isArray(hybrikConfidence) && hybrikConfidence.length > 0) {
    // 중첩 배열 처리: [[0.995], [0.993]] → [0.995, 0.993]
    const flattenedConfidence = hybrikConfidence.map((conf: any) => 
      Array.isArray(conf) ? conf[0] : conf
    );
    const validConfidence = flattenedConfidence.filter((conf: any) => 
      typeof conf === 'number' && !isNaN(conf) && isFinite(conf) && conf >= 0 && conf <= 1
    );
    if (validConfidence.length > 0) {
      return Math.max(0, Math.min(1, 
        validConfidence.reduce((sum: number, conf: number) => sum + conf, 0) / validConfidence.length
      ));
    }
  }
  
  // 3. BlazePose 데이터 처리 (하위 호환성)
  const landmarks = firstResult.blazePoseData?.landmarks || firstResult.landmarks;
  if (landmarks && Array.isArray(landmarks) && landmarks.length > 0) {
    const totalVisibility = landmarks.reduce((sum: number, landmark: any) => {
      return sum + (landmark.visibility || 0);
    }, 0);
    return totalVisibility / landmarks.length;
  }
  
  return 0;
};

export const convertToFileResults = (result: Prescription) => {
  // 통합 포즈 분석 결과 우선 확인
  const poseResults = result.poseAnalysis || result.blazePoseResults;
  if (!poseResults?.results) return [];
  
  return poseResults.results.map((fileResult: any, index: number) => {
    // 신뢰도 계산 - overallConfidence 우선 사용, 없으면 계산
    let averageConfidence = 0;
    
    if (typeof fileResult.overallConfidence === 'number' && 
        !isNaN(fileResult.overallConfidence) && 
        isFinite(fileResult.overallConfidence)) {
      averageConfidence = fileResult.overallConfidence;
    } else {
      // HybrIK 신뢰도 계산
      if (fileResult.hybrikData?.confidence && Array.isArray(fileResult.hybrikData.confidence)) {
        // 🔧 중첩 배열 처리: [[0.995], [0.993]] 형태를 [0.995, 0.993]로 변환
        const flattenedConfidence = fileResult.hybrikData.confidence.map((conf: any) => 
          Array.isArray(conf) ? conf[0] : conf
        );
        const validConfidence = flattenedConfidence.filter((conf: any) => 
          typeof conf === 'number' && !isNaN(conf) && isFinite(conf) && conf >= 0 && conf <= 1
        );
        if (validConfidence.length > 0) {
          averageConfidence = Math.max(0, Math.min(1, 
            validConfidence.reduce((sum: number, conf: number) => sum + conf, 0) / validConfidence.length
          ));
        }
      } 
      // BlazePose 신뢰도 계산 (하위 호환성)
      else {
        const landmarks = fileResult.blazePoseData?.landmarks || fileResult.landmarks || [];
        if (landmarks.length > 0) {
          averageConfidence = landmarks.reduce((sum: number, landmark: any) => sum + (landmark.visibility || 0), 0) / landmarks.length;
        }
      }
    }

    // 이미지 정보 추출 - 통합 구조 우선
    let estimatedImages = fileResult.estimatedImages || [];
    
    // HybrIK의 경우 estimatedImages 추가 처리
    if (fileResult.hybrikData?.estimatedImages) {
      estimatedImages = fileResult.hybrikData.estimatedImages;
    }
    
    // 하위 호환성: 기존 estimatedImageUrls가 있으면 변환
    if (estimatedImages.length === 0 && fileResult.estimatedImageUrls && fileResult.estimatedImageUrls.length > 0) {
      estimatedImages = fileResult.estimatedImageUrls.map((urlItem: any, imgIndex: number) => ({
        key: fileResult.estimatedKeys?.[imgIndex] || `estimated_${imgIndex}`,
        url: urlItem.downloadUrl,
        expiresAt: undefined
      }));
    }

    // 관절 정보 추출
    const landmarks = fileResult.blazePoseData?.landmarks || fileResult.landmarks || [];
    const worldLandmarks = fileResult.blazePoseData?.worldLandmarks || fileResult.worldLandmarks || [];

    // 🔍 변환 결과 구조 확인
    const convertedResult = {
      fileId: `file_${index}`,
      fileName: fileResult.fileName || `파일 ${index + 1}`,
      confidence: averageConfidence,
      landmarks: landmarks,
      worldLandmarks: worldLandmarks,
      estimatedImages: estimatedImages,
      overlayImageUrl: undefined,
      error: undefined,
      // HybrIK 데이터 추가
      hybrikData: fileResult.hybrikData
    };

    // HybrIK 데이터 구조 적응: hybrikData 또는 최상위 joints3d 지원
    if (!fileResult.hybrikData && 
        fileResult.joints3d && 
        Array.isArray(fileResult.joints3d) && 
        fileResult.joints3d.length > 0) {
      // 최상위 joints3d/confidence를 hybrikData 구조로 재구성 (Type Safe)
      convertedResult.hybrikData = {
        joints3d: fileResult.joints3d,
        confidence: Array.isArray(fileResult.confidence) ? fileResult.confidence : []
      };
    }

    return convertedResult;
  });
};