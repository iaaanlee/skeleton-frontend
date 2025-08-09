import React, { useState } from 'react';
import { BlazePoseFileResult } from '../../../../types/blazePose';

type FileResultItemProps = {
  fileResult: BlazePoseFileResult;
  index: number;
  totalFiles: number;
  formatConfidence: (confidence: number) => string;
  formatTime: (milliseconds: number) => string;
  getConfidenceColor: (confidence: number) => string;
  getConfidenceBadge: (confidence: number) => string;
};

export const FileResultItem: React.FC<FileResultItemProps> = ({
  fileResult,
  index,
  totalFiles,
  formatConfidence,
  formatTime,
  getConfidenceColor,
  getConfidenceBadge
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/placeholder-image.png'; // 기본 이미지
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
            {index}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{fileResult.fileName}</h4>
            <p className="text-sm text-gray-500">파일 {index} / {totalFiles}</p>
          </div>
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          {isExpanded ? '접기' : '자세히 보기'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className={`text-lg font-bold ${getConfidenceColor(fileResult.confidence)}`}>
            {formatConfidence(fileResult.confidence)}
          </div>
          <div className="text-xs text-gray-600">신뢰도</div>
        </div>
        
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-purple-600">
            {formatTime(fileResult.analysisTime)}
          </div>
          <div className="text-xs text-gray-600">분석 시간</div>
        </div>
        
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-blue-600">
            {fileResult.landmarks.length}
          </div>
          <div className="text-xs text-gray-600">관절 좌표</div>
        </div>
      </div>

      {/* 오버레이 이미지 */}
      {fileResult.overlayImageUrl && (
        <div className="mb-4">
          <h5 className="font-medium text-gray-900 mb-2">분석 결과 이미지</h5>
          <div className="relative">
            <img
              src={fileResult.overlayImageUrl}
              alt={`${fileResult.fileName} 분석 결과`}
              className="w-full max-w-md rounded-lg border border-gray-200"
              onError={handleImageError}
            />
            <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getConfidenceBadge(fileResult.confidence)}`}>
              {formatConfidence(fileResult.confidence)}
            </span>
          </div>
        </div>
      )}

      {/* 확장된 정보 */}
      {isExpanded && (
        <div className="border-t border-gray-200 pt-4 mt-4">
          <h5 className="font-medium text-gray-900 mb-3">상세 정보</h5>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h6 className="font-medium text-gray-700 mb-2">파일 정보</h6>
              <div className="space-y-1 text-sm text-gray-600">
                <div>파일명: {fileResult.fileName}</div>
                <div>파일 ID: {fileResult.fileId}</div>
                <div>분석 시간: {formatTime(fileResult.analysisTime)}</div>
              </div>
            </div>
            
            <div>
              <h6 className="font-medium text-gray-700 mb-2">분석 결과</h6>
              <div className="space-y-1 text-sm text-gray-600">
                <div>신뢰도: {formatConfidence(fileResult.confidence)}</div>
                <div>관절 좌표 수: {fileResult.landmarks.length}개</div>
                <div>상태: {fileResult.error ? '오류' : '성공'}</div>
              </div>
            </div>
          </div>

          {/* 오류 정보 */}
          {fileResult.error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <h6 className="font-medium text-red-800 mb-1">분석 오류</h6>
              <p className="text-sm text-red-700">{fileResult.error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
