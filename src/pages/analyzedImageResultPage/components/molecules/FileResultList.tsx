import React from 'react';
import { BlazePoseLandmark, EstimatedImage } from '../../../../types/blazePose';
import { FileResultItem } from './FileResultItem';

// 실제 사용하는 타입 정의
type FileResultForDisplay = {
  fileId: string;
  fileName: string;
  confidence: number;
  landmarks: BlazePoseLandmark[];
  worldLandmarks?: BlazePoseLandmark[];
  estimatedImages: EstimatedImage[];
  overlayImageUrl?: string; // deprecated - 하위 호환성용
  error?: string;
};

type FileResultListProps = {
  fileResults: FileResultForDisplay[];
};

export const FileResultList: React.FC<FileResultListProps> = ({ fileResults }) => {
  const formatConfidence = (confidence: number) => {
    return `${(confidence * 100).toFixed(1)}%`;
  };

  // formatTime 함수 제거됨

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-4">
      {fileResults.map((fileResult, index) => (
        <FileResultItem
          key={fileResult.fileId}
          fileResult={fileResult}
          index={index + 1}
          totalFiles={fileResults.length}
          formatConfidence={formatConfidence}
          getConfidenceColor={getConfidenceColor}
          getConfidenceBadge={getConfidenceBadge}
        />
      ))}

      {fileResults.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-4">📊</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            분석 결과가 없습니다
          </h3>
          <p className="text-gray-600">
            분석된 파일이 없거나 결과를 불러올 수 없습니다.
          </p>
        </div>
      )}
    </div>
  );
};
