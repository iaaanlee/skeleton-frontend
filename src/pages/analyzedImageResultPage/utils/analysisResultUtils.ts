import { Prescription } from '../../../services/prescriptionService';
import { BlazePoseFileResultFromBackend } from '../../../types/blazePose';

export const formatConfidence = (confidence: number): string => {
  return `${(confidence * 100).toFixed(1)}%`;
};

export const calculateAverageConfidence = (result: Prescription): number => {
  if (!result.blazePoseResults?.results?.[0]?.landmarks) return 0;
  
  const landmarks = result.blazePoseResults.results[0].landmarks;
  if (!Array.isArray(landmarks) || landmarks.length === 0) return 0;
  
  const totalVisibility = landmarks.reduce((sum, landmark) => {
    return sum + (landmark.visibility || 0);
  }, 0);
  return totalVisibility / landmarks.length;
};

export const convertToFileResults = (result: Prescription) => {
  if (!result.blazePoseResults?.results) return [];
  
  return result.blazePoseResults.results.map((fileResult: BlazePoseFileResultFromBackend, index: number) => {
    // 신뢰도 계산 (해당 파일의 모든 관절 평균 visibility)
    const landmarks = fileResult.landmarks || [];
    const averageConfidence = landmarks.length > 0 
      ? landmarks.reduce((sum, landmark) => sum + (landmark.visibility || 0), 0) / landmarks.length
      : 0;

    // 새로운 통일된 구조 사용 (하위 호환성 고려)
    let estimatedImages = fileResult.estimatedImages || [];
    
    // 하위 호환성: 기존 estimatedImageUrls가 있으면 변환
    if (estimatedImages.length === 0 && fileResult.estimatedImageUrls && fileResult.estimatedImageUrls.length > 0) {
      estimatedImages = fileResult.estimatedImageUrls.map((urlItem, index) => ({
        key: fileResult.estimatedKeys?.[index] || `estimated_${index}`,
        url: urlItem.downloadUrl,
        expiresAt: undefined
      }));
    }

    return {
      fileId: `file_${index}`,
      fileName: fileResult.fileName || `파일 ${index + 1}`,
      confidence: averageConfidence,
      analysisTime: 0, // TODO: 실제 분석 시간 추가
      landmarks: landmarks,
      estimatedImages: estimatedImages,
      overlayImageUrl: undefined,
      error: undefined
    };
  });
};