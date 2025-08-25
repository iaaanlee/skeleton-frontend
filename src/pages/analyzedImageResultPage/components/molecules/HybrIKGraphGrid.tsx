import React from 'react';
import { HybrIKGraph } from './HybrIKGraph';

type HybrIKLandmark = {
  x: number;
  y: number;
  z: number;
  visibility: number;
};

type HybrIKGraphGridProps = {
  landmarks?: HybrIKLandmark[];
  worldLandmarks?: HybrIKLandmark[];
};

export const HybrIKGraphGrid: React.FC<HybrIKGraphGridProps> = ({
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
            HybrIK 관절 좌표 그래프
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
          HybrIK 3D 관절 좌표 그래프 (24개 관절)
        </h4>
        <div className="text-sm text-gray-500">
          {worldLandmarks && worldLandmarks.length > 0 && `3D 좌표: ${worldLandmarks.length}개`}
        </div>
      </div>

      {/* 3D World Coordinates (worldLandmarks) - HybrIK는 3D만 표시 */}
      {worldLandmarks && worldLandmarks.length > 0 && (
        <div>
          <h5 className="text-sm font-medium text-gray-800 mb-3">3D 카메라 공간 좌표</h5>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <HybrIKGraph
              worldLandmarks={worldLandmarks}
              coordinateType="world_landmarks"
              projectionType="xy"
              title="3D 좌표 - X-Y 평면 (정면)"
            />
            <HybrIKGraph
              worldLandmarks={worldLandmarks}
              coordinateType="world_landmarks"
              projectionType="yz"
              title="3D 좌표 - Y-Z 평면 (측면)"
            />
          </div>
        </div>
      )}

      {/* Information Panel */}
      <div className="bg-green-50 rounded-lg p-4">
        <h6 className="font-medium text-green-900 mb-2">HybrIK 3D 좌표 시스템 정보</h6>
        <div className="text-sm text-green-800 space-y-1">
          <div><strong>3D 카메라 공간 좌표:</strong> 실제 3D 공간에서의 관절 위치, 정밀한 자세 분석 가능</div>
          <div><strong>X-Y 평면 (정면):</strong> 정면에서 본 모습 - 가로(X)와 세로(Y) 좌표</div>
          <div><strong>Y-Z 평면 (측면):</strong> 측면에서 본 모습 - 깊이(Z)와 세로(Y) 좌표</div>
          <div><strong>관절 구조:</strong> 24개 SMPL 관절 (골반 중심, 척추-팔-다리 구조)</div>
          <div><strong>관절 표시:</strong> 신뢰도 0.5 이상일 때 관절 번호와 한글 이름 표시</div>
          <div><strong>연결선 표시:</strong> 실선(신뢰도 높음), 점선(신뢰도 낮음)</div>
          <div><strong>색상 구분:</strong> <span className="text-orange-500">주황(얼굴)</span>, <span className="text-blue-500">파랑(상체)</span>, <span className="text-red-500">빨강(하체)</span></div>
        </div>
      </div>
    </div>
  );
};