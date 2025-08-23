import React from 'react';
import { BlazePoseLandmark } from '../../../../types/blazePose';
import { BlazePoseGraph } from './BlazePoseGraph';

type BlazePoseGraphGridProps = {
  landmarks?: BlazePoseLandmark[];
  worldLandmarks?: BlazePoseLandmark[];
};

export const BlazePoseGraphGrid: React.FC<BlazePoseGraphGridProps> = ({
  landmarks,
  worldLandmarks
}) => {
  const hasData = (landmarks && landmarks.length > 0) || (worldLandmarks && worldLandmarks.length > 0);

  if (!hasData) {
    return (
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="text-center">
          <div className="text-gray-400 text-4xl mb-2">📊</div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            관절 좌표 그래프
          </h4>
          <p className="text-gray-600">
            관절 좌표 데이터가 없습니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-md font-semibold text-gray-900">
          관절 좌표 그래프
        </h4>
        <div className="text-sm text-gray-500">
          {landmarks && landmarks.length > 0 && `이미지 좌표: ${landmarks.length}개`}
          {landmarks && worldLandmarks && landmarks.length > 0 && worldLandmarks.length > 0 && ' | '}
          {worldLandmarks && worldLandmarks.length > 0 && `월드 좌표: ${worldLandmarks.length}개`}
        </div>
      </div>

      {/* Image Coordinates (landmarks) */}
      {landmarks && landmarks.length > 0 && (
        <div>
          <h5 className="text-sm font-medium text-gray-800 mb-3">이미지 좌표 (정규화된 좌표, 0-1 범위)</h5>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <BlazePoseGraph
              landmarks={landmarks}
              coordinateType="landmarks"
              projectionType="xy"
              title="이미지 좌표 - X-Y 평면"
            />
            <BlazePoseGraph
              landmarks={landmarks}
              coordinateType="landmarks"
              projectionType="yz"
              title="이미지 좌표 - Y-Z 평면"
            />
          </div>
        </div>
      )}

      {/* World Coordinates (worldLandmarks) */}
      {worldLandmarks && worldLandmarks.length > 0 && (
        <div>
          <h5 className="text-sm font-medium text-gray-800 mb-3">월드 좌표 (3D 실제 좌표, 미터 단위)</h5>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <BlazePoseGraph
              worldLandmarks={worldLandmarks}
              coordinateType="world_landmarks"
              projectionType="xy"
              title="월드 좌표 - X-Y 평면"
            />
            <BlazePoseGraph
              worldLandmarks={worldLandmarks}
              coordinateType="world_landmarks"
              projectionType="yz"
              title="월드 좌표 - Y-Z 평면"
            />
          </div>
        </div>
      )}

      {/* Information Panel */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h6 className="font-medium text-blue-900 mb-2">좌표 시스템 정보</h6>
        <div className="text-sm text-blue-800 space-y-1">
          <div><strong>이미지 좌표 (landmarks):</strong> 이미지 내에서 정규화된 좌표 (0-1 범위), 원근법 왜곡 포함</div>
          <div><strong>월드 좌표 (world_landmarks) ⭐ 권장:</strong> 실제 3D 공간 좌표 (미터 단위), 엉덩이 중심 기준, 더 정확함</div>
          <div><strong>X-Y 평면:</strong> 정면에서 본 모습 - 가로(X)와 세로(Y) 좌표</div>
          <div><strong>Y-Z 평면:</strong> 측면에서 본 모습 - 깊이(Z)와 세로(Y) 좌표</div>
          <div><strong>가시성 기준:</strong> 0.7 이상일 때 관절 번호와 이름 표시</div>
          <div><strong>연결선 표시:</strong> 실선(신뢰도 높음), 점선(신뢰도 낮음)</div>
          <div><strong>색상 구분:</strong> <span className="text-orange-500">주황(얼굴)</span>, <span className="text-blue-500">파랑(상체)</span>, <span className="text-red-500">빨강(하체)</span></div>
        </div>
      </div>
    </div>
  );
};