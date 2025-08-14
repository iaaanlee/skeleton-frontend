import React from 'react';
import { BlazePoseLandmark } from '../../../../types/blazePose';

type LandmarksVisualizationProps = {
  landmarks: BlazePoseLandmark[];
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

  const getJointName = (index: number) => {
    const jointNames: Record<number, string> = {
      0: '코',
      1: '왼쪽 눈',
      2: '오른쪽 눈',
      3: '왼쪽 귀',
      4: '오른쪽 귀',
      5: '왼쪽 어깨',
      6: '오른쪽 어깨',
      7: '왼쪽 팔꿈치',
      8: '오른쪽 팔꿈치',
      9: '왼쪽 손목',
      10: '오른쪽 손목',
      11: '왼쪽 엉덩이',
      12: '오른쪽 엉덩이',
      13: '왼쪽 무릎',
      14: '오른쪽 무릎',
      15: '왼쪽 발목',
      16: '오른쪽 발목'
    };
    return jointNames[index] || `관절 ${index}`;
  };

  const getJointCategory = (index: number) => {
    if (index <= 4) {
      return 'head';
    } else if (index <= 10) {
      return 'upper_body';
    } else if (index <= 16) {
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
    const category = getJointCategory(landmark.index);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(landmark);
    return acc;
  }, {} as Record<string, BlazePoseLandmark[]>);

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
                  key={`${landmark.index}-${index}`}
                  className="p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm text-gray-900">
                      {getJointName(landmark.index)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(category)}`}>
                      {formatConfidence(landmark.visibility)}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-xs text-gray-600">
                    <div>X: {landmark.x.toFixed(2)}</div>
                    <div>Y: {landmark.y.toFixed(2)}</div>
                    <div>신뢰도: {formatConfidence(landmark.visibility)}</div>
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
              {landmarks.filter(l => l.visibility >= 0.8).length}
            </div>
            <div className="text-gray-600">높은 신뢰도</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-yellow-600">
              {landmarks.filter(l => l.visibility >= 0.6 && l.visibility < 0.8).length}
            </div>
            <div className="text-gray-600">보통 신뢰도</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-red-600">
              {landmarks.filter(l => l.visibility < 0.6).length}
            </div>
            <div className="text-gray-600">낮은 신뢰도</div>
          </div>
        </div>
      </div>
    </div>
  );
};
