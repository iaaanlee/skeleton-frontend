import { Prescription } from '../../../services/prescriptionService';
import { BlazePoseFileResultFromBackend } from '../../../types/blazePose';

export const formatConfidence = (confidence: number): string => {
  return `${(confidence * 100).toFixed(1)}%`;
};

export const calculateAverageConfidence = (result: Prescription): number => {
  // 통합 포즈 분석 결과 우선 확인 (HybrIK/BlazePose 통합)
  const poseResults = result.poseAnalysis || result.blazePoseResults;
  
  if (!poseResults?.results?.[0]) return 0;
  
  const firstResult = poseResults.results[0] as any;
  
  // 1. overallConfidence 값이 있고 유효하면 사용
  if (typeof firstResult.overallConfidence === 'number' && 
      !isNaN(firstResult.overallConfidence) && 
      isFinite(firstResult.overallConfidence)) {
    return firstResult.overallConfidence;
  }
  
  // 2. HybrIK 데이터 처리
  if (firstResult.hybrikData?.confidence) {
    const confidenceArray = firstResult.hybrikData.confidence;
    if (Array.isArray(confidenceArray) && confidenceArray.length > 0) {
      const validConfidence = confidenceArray.filter((conf: any) => 
        typeof conf === 'number' && !isNaN(conf) && isFinite(conf)
      );
      if (validConfidence.length > 0) {
        return validConfidence.reduce((sum: number, conf: number) => sum + conf, 0) / validConfidence.length;
      }
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
        const validConfidence = fileResult.hybrikData.confidence.filter((conf: any) => 
          typeof conf === 'number' && !isNaN(conf) && isFinite(conf)
        );
        if (validConfidence.length > 0) {
          averageConfidence = validConfidence.reduce((sum: number, conf: number) => sum + conf, 0) / validConfidence.length;
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

    return {
      fileId: `file_${index}`,
      fileName: fileResult.fileName || `파일 ${index + 1}`,
      confidence: averageConfidence,
      landmarks: landmarks,
      worldLandmarks: worldLandmarks,
      estimatedImages: estimatedImages,
      overlayImageUrl: undefined,
      error: undefined
    };
  });
};