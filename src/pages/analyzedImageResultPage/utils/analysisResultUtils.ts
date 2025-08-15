import { Prescription } from '../../../services/prescriptionService';
import { BlazePoseFileResultFromBackend } from '../../../types/blazePose';

export const formatConfidence = (confidence: number): string => {
  return `${(confidence * 100).toFixed(1)}%`;
};

export const calculateAverageConfidence = (result: Prescription): number => {
  if (!result.blazePoseResults?.results?.[0]?.landmarks?.[0]) return 0;
  
  const landmarks = result.blazePoseResults.results[0].landmarks[0];
  const totalVisibility = landmarks.reduce((sum, landmark) => sum + landmark.visibility, 0);
  return totalVisibility / landmarks.length;
};

export const convertToFileResults = (result: Prescription) => {
  if (!result.blazePoseResults?.results) return [];
  
  return result.blazePoseResults.results.map((fileResult: BlazePoseFileResultFromBackend, index: number) => {
    // 신뢰도 계산 (해당 파일의 모든 관절 평균 visibility)
    const landmarks = fileResult.landmarks?.[0] || [];
    const averageConfidence = landmarks.length > 0 
      ? landmarks.reduce((sum, landmark) => sum + landmark.visibility, 0) / landmarks.length
      : 0;

    // pre-signed URL 사용 (백엔드에서 생성된 URL)
    const estimatedImageUrl = fileResult.estimatedImageUrls?.[0]?.downloadUrl || undefined;

    return {
      fileId: `file_${index}`,
      fileName: fileResult.fileName || `파일 ${index + 1}`,
      confidence: averageConfidence,
      analysisTime: 0, // TODO: 실제 분석 시간 추가
      landmarks: landmarks,
      estimatedImageUrl: estimatedImageUrl,
      overlayImageUrl: undefined,
      error: undefined
    };
  });
};