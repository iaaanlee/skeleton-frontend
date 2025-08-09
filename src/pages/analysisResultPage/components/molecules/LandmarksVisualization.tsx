import React from 'react';
import { JointCoordinate } from '../../../../types/blazePose';

type LandmarksVisualizationProps = {
  landmarks: JointCoordinate[];
  confidence: number;
};

export const LandmarksVisualization: React.FC<LandmarksVisualizationProps> = ({
  landmarks,
  confidence
}) => {
  const formatConfidence = (confidence: number) => {
    return `${(confidence * 100).toFixed(1)}%`;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getJointName = (jointType: string) => {
    const jointNames: Record<string, string> = {
      nose: '코',
      left_eye: '왼쪽 눈',
      right_eye: '오른쪽 눈',
      left_ear: '왼쪽 귀',
      right_ear: '오른쪽 귀',
      left_shoulder: '왼쪽 어깨',
      right_shoulder: '오른쪽 어깨',
      left_elbow: '왼쪽 팔꿈치',
      right_elbow: '오른쪽 팔꿈치',
      left_wrist: '왼쪽 손목',
      right_wrist: '오른쪽 손목',
      left_hip: '왼쪽 엉덩이',
      right_hip: '오른쪽 엉덩이',
      left_knee: '왼쪽 무릎',
      right_knee: '오른쪽 무릎',
      left_ankle: '왼쪽 발목',
      right_ankle: '오른쪽 발목'
    };
    return jointNames[jointType] || jointType;
  };

  const getJointCategory = (jointType: string) => {
    if (jointType.includes('eye') || jointType.includes('ear') || jointType === 'nose') {
      return 'head';
    } else if (jointType.includes('shoulder') || jointType.includes('elbow') || jointType.includes('wrist')) {
      return 'upper_body';
    } else if (jointType.includes('hip') || jointType.includes('knee') || jointType.includes('ankle')) {
      return 'lower_body';
    }
    return 'other';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'head':
        return 'bg-blue-100 text-blue-800';
      case 'upper_body':
        return 'bg-green-100 text-green-800';
      case 'lower_body':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const groupedLandmarks = landmarks.reduce((acc, landmark) => {
    const category = getJointCategory(landmark.jointType);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(landmark);
    return acc;
  }, {} as Record<string, JointCoordinate[]>);

  if (landmarks.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 text-4xl mb-4">🦴</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          관절 좌표가 없습니다
        </h3>
        <p className="text-gray-600">
          분석된 관절 좌표가 없거나 데이터를 불러올 수 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 전체 신뢰도 */}
      <div className="text-center p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">전체 신뢰도</h4>
        <div className={`text-2xl font-bold ${getConfidenceColor(confidence)}`}>
          {formatConfidence(confidence)}
        </div>
      </div>

      {/* 관절별 좌표 */}
      <div className="space-y-4">
        {Object.entries(groupedLandmarks).map(([category, categoryLandmarks]) => (
          <div key={category} className="border border-gray-200 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 mb-3 capitalize">
              {category === 'head' ? '머리' : 
               category === 'upper_body' ? '상체' : 
               category === 'lower_body' ? '하체' : '기타'} 관절
            </h5>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {categoryLandmarks.map((landmark, index) => (
                <div
                  key={`${landmark.jointType}-${index}`}
                  className="p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm text-gray-900">
                      {getJointName(landmark.jointType)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(category)}`}>
                      {formatConfidence(landmark.confidence)}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-xs text-gray-600">
                    <div>X: {landmark.x.toFixed(2)}</div>
                    <div>Y: {landmark.y.toFixed(2)}</div>
                    <div>신뢰도: {formatConfidence(landmark.confidence)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 통계 정보 */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h5 className="font-medium text-gray-900 mb-3">분석 통계</h5>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="font-bold text-blue-600">{landmarks.length}</div>
            <div className="text-gray-600">총 관절 수</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-green-600">
              {landmarks.filter(l => l.confidence >= 0.8).length}
            </div>
            <div className="text-gray-600">높은 신뢰도</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-yellow-600">
              {landmarks.filter(l => l.confidence >= 0.6 && l.confidence < 0.8).length}
            </div>
            <div className="text-gray-600">보통 신뢰도</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-red-600">
              {landmarks.filter(l => l.confidence < 0.6).length}
            </div>
            <div className="text-gray-600">낮은 신뢰도</div>
          </div>
        </div>
      </div>
    </div>
  );
};
