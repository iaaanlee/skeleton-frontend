import React, { useState } from 'react';
import { BlazePoseLandmark, EstimatedImage } from '../../../../types/blazePose';
import { BlazePoseGraphGrid } from './BlazePoseGraphGrid';
import { HybrIKGraphGrid } from './HybrIKGraphGrid';
import { convertHybrIKForVisualization } from '../../utils/hybrikDataAdapter';

type FileResultForDisplay = {
  fileId: string;
  fileName: string;
  confidence: number;
  landmarks: BlazePoseLandmark[];
  worldLandmarks?: BlazePoseLandmark[];
  estimatedImages: EstimatedImage[];
  overlayImageUrl?: string; // deprecated - 하위 호환성용
  error?: string;
  qualityScore?: number; // 이미지 전처리 품질 점수
  hybrikData?: any; // HybrIK 데이터 추가
};

type FileResultItemProps = {
  fileResult: FileResultForDisplay;
  index: number;
  totalFiles: number;
  formatConfidence: (confidence: number) => string;
  getConfidenceColor: (confidence: number) => string;
  getConfidenceBadge: (confidence: number) => string;
};

export const FileResultItem: React.FC<FileResultItemProps> = ({
  fileResult,
  index,
  totalFiles,
  formatConfidence,
  getConfidenceColor,
  getConfidenceBadge
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // placeholder 이미지 대신 data URL 사용
    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04MCAxMDBDODAgODkuNTQ0IDg4LjU0NCA4MSA5OSA4MUgxMDFDMTExLjQ1NiA4MSAxMjAgODkuNTQ0IDEyMCAxMDBWMTEwQzEyMCAxMjAuNDU2IDExMS40NTYgMTI5IDEwMSAxMjlIOTlDODguNTQ0IDEyOSA4MCAxMjAuNDU2IDgwIDExMFYxMDBaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik04MCAxNDBDODAgMTI5LjU0NCA4OC41NDQgMTIxIDk5IDEyMUgxMDFDMTExLjQ1NiAxMjEgMTIwIDEyOS41NDQgMTIwIDE0MFYxNTBDMTIwIDE2MC40NTYgMTExLjQ1NiAxNjkgMTAxIDE2OUg5OUM4OC41NDQgMTY5IDgwIDE2MC40NTYgODAgMTUwVjE0MFoiIGZpbGw9IiM5QjlCQTAiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyQzIgMTcuNTIgNi40OCAyMiAxMiAyMkMxNy41MiAyMiAyMiAxNy41MiAyMiAxMkMyMiA2LjQ4IDE3LjUyIDIgMTIgMloiIGZpbGw9IiM5QjlCQTAiLz4KPHBhdGggZD0iTTEyIDZDMTAuMzQgNiA5IDcuMzQgOSA5QzkgMTAuNjYgMTAuMzQgMTIgMTIgMTJDMTMuNjYgMTIgMTUgMTAuNjYgMTUgOUMxNSA3LjM0IDEzLjY2IDYgMTIgNloiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xMiAxNEM5LjMzIDE0IDcgMTEuNjcgNyA5QzcgNi4zMyA5LjMzIDQgMTIgNEMxNC42NyA0IDE3IDYuMzMgMTcgOUMxNyAxMS42NyAxNC42NyAxNCAxMiAxNFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo8L3N2Zz4K';
    e.currentTarget.style.opacity = '0.6';
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
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className={`text-lg font-bold ${getConfidenceColor(fileResult.confidence)}`}>
            {formatConfidence(fileResult.confidence)}
          </div>
          <div className="text-xs text-gray-600">포즈 신뢰도</div>
        </div>
        
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-lg font-bold text-blue-600">
            {fileResult.landmarks?.length || 0}
          </div>
          <div className="text-xs text-gray-600">감지 관절 수</div>
        </div>
        
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-lg font-bold text-purple-600">
            {fileResult.estimatedImages?.length || 1}
          </div>
          <div className="text-xs text-gray-600">분석 이미지</div>
        </div>
      </div>

      {/* 분석 결과 이미지 */}
      {(fileResult.estimatedImages?.length > 0 || fileResult.overlayImageUrl) && (
        <div className="mb-4">
          <h5 className="font-medium text-gray-900 mb-2">분석 결과 이미지</h5>
          <div className="relative">
            <img
              src={fileResult.estimatedImages?.[0]?.url || fileResult.overlayImageUrl}
              alt={`${fileResult.fileName} 분석 결과`}
              className="w-full max-w-md rounded-lg border border-gray-200"
              onError={handleImageError}
            />
            <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getConfidenceBadge(fileResult.confidence)}`}>
              {formatConfidence(fileResult.confidence)}
            </span>
          </div>
          {fileResult.estimatedImages?.length > 1 && (
            <p className="text-sm text-gray-600 mt-2">
              총 {fileResult.estimatedImages.length}개의 분석 이미지가 있습니다.
            </p>
          )}
        </div>
      )}

      {/* 관절 좌표 그래프 */}
      {(() => {
        // HybrIK 데이터가 있는 경우 (3D 좌표만 체크)
        if (fileResult.hybrikData && 
            fileResult.hybrikData.joints3d?.length > 0) {
          // 🗑️ joints2d 체크 제거 - 3D 좌표만 사용
          
          const { landmarks, worldLandmarks } = convertHybrIKForVisualization(fileResult.hybrikData);
          
          return (
            <div className="mb-4">
              <HybrIKGraphGrid 
                landmarks={landmarks}
                worldLandmarks={worldLandmarks}
              />
            </div>
          );
        }
        
        // BlazePose 데이터가 있는 경우
        if (fileResult.landmarks?.length > 0 || 
            (fileResult.worldLandmarks && fileResult.worldLandmarks.length > 0)) {
          return (
            <div className="mb-4">
              <BlazePoseGraphGrid 
                landmarks={fileResult.landmarks}
                worldLandmarks={fileResult.worldLandmarks}
              />
            </div>
          );
        }
        
        return null;
      })()}

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
                <div>이미지 개수: {fileResult.estimatedImages?.length || 1}개</div>
              </div>
            </div>
            
            <div>
              <h6 className="font-medium text-gray-700 mb-2">분석 결과</h6>
              <div className="space-y-1 text-sm text-gray-600">
                <div>신뢰도: {formatConfidence(fileResult.confidence)}</div>
                <div>관절 좌표 수: {fileResult.landmarks?.length || 0}개</div>
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
