import React from 'react';
import { HYBRIK_JOINT_NAMES, HYBRIK_JOINT_DISPLAY_NAMES } from '../../../../constants/hybrik';
import { HybrIKJoint3D } from '../../../../types/poseEngine';

type HybrIK3DCoordinatesDisplayProps = {
  joints3d: HybrIKJoint3D[];
  confidence: number[];
  className?: string;
};

export const HybrIK3DCoordinatesDisplay: React.FC<HybrIK3DCoordinatesDisplayProps> = ({
  joints3d,
  confidence,
  className = ''
}) => {
  // 기본 데이터 유효성 검사
  if (!joints3d || !Array.isArray(joints3d) || joints3d.length === 0) {
    console.warn('⚠️ HybrIK3DCoordinatesDisplay: Invalid joints3d data', { joints3d, confidence });
    return (
      <div className={`bg-gray-50 rounded-lg p-6 text-center ${className}`}>
        <div className="text-gray-400 text-2xl mb-2">📐</div>
        <p className="text-gray-500 text-sm">3D 좌표 데이터가 없습니다</p>
        <p className="text-gray-400 text-xs mt-1">데이터 타입: {typeof joints3d}</p>
      </div>
    );
  }

  // 디버깅 로그 추가
  console.log('🔍 HybrIK3DCoordinatesDisplay Data:', {
    joints3d_length: joints3d.length,
    joints3d_sample: joints3d.slice(0, 2),
    confidence_length: confidence?.length,
    confidence_sample: confidence?.slice(0, 2)
  });

  // 신뢰도별 관절 분류
  const highConfidenceJoints = joints3d.filter((_, idx) => (confidence[idx] || 0) > 0.7);
  const mediumConfidenceJoints = joints3d.filter((_, idx) => {
    const conf = confidence[idx] || 0;
    return conf > 0.5 && conf <= 0.7;
  });
  const lowConfidenceJoints = joints3d.filter((_, idx) => (confidence[idx] || 0) <= 0.5);

  const formatCoordinate = (value: any): string => {
    // 안전한 숫자 변환 및 기본값 처리
    if (value === null || value === undefined || value === '' || isNaN(Number(value))) {
      return '0.00';
    }
    
    const numValue = Number(value);
    // 추가 검증: 변환된 숫자가 유효한지 확인
    if (isNaN(numValue) || !isFinite(numValue)) {
      return '0.00';
    }
    
    return numValue.toFixed(2);
  };

  const getConfidenceColor = (conf: number): string => {
    if (conf > 0.7) return 'text-green-600';
    if (conf > 0.5) return 'text-yellow-600';
    return 'text-red-500';
  };

  const getConfidenceBackground = (conf: number): string => {
    if (conf > 0.7) return 'bg-green-50 border-green-200';
    if (conf > 0.5) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-medium text-gray-900 flex items-center">
          <span className="mr-2">🏗️</span>
          HybrIK 3D 관절 좌표
        </h4>
        
        <div className="text-xs text-gray-500 space-x-4">
          <span className="text-green-600">높음: {highConfidenceJoints.length}</span>
          <span className="text-yellow-600">보통: {mediumConfidenceJoints.length}</span>
          <span className="text-red-500">낮음: {lowConfidenceJoints.length}</span>
        </div>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {joints3d.map((joint, index) => {
          // 안전한 신뢰도 값 처리
          const conf = (confidence && confidence[index] !== undefined) ? confidence[index] : 0;
          const jointName = HYBRIK_JOINT_NAMES[index] || `joint_${index}`;
          const displayName = HYBRIK_JOINT_DISPLAY_NAMES[jointName] || jointName;
          
          // 디버깅을 위한 로그 (첫 5개만)
          if (index < 5) {
            console.log(`🔍 Joint ${index}:`, { joint, jointName, displayName });
          }
          
          // joint가 배열인지 객체인지 확인하고 처리
          let x, y, z;
          
          try {
            if (Array.isArray(joint) && joint.length >= 3) {
              // joint가 [x, y, z] 형태의 배열인 경우
              [x, y, z] = joint;
            } else if (joint && typeof joint === 'object' && joint !== null) {
              // joint가 {x, y, z} 형태의 객체인 경우
              x = joint.x;
              y = joint.y; 
              z = joint.z;
            } else {
              // 예상치 못한 형태의 데이터인 경우 기본값 설정
              console.warn(`⚠️ Unexpected joint data structure at index ${index}:`, joint);
              x = y = z = 0;
            }
            
            // 각 좌표값에 대해 추가 검증
            if (typeof x !== 'number' && x !== null && x !== undefined) {
              console.warn(`⚠️ Invalid x coordinate at index ${index}:`, x);
              x = 0;
            }
            if (typeof y !== 'number' && y !== null && y !== undefined) {
              console.warn(`⚠️ Invalid y coordinate at index ${index}:`, y);
              y = 0;
            }
            if (typeof z !== 'number' && z !== null && z !== undefined) {
              console.warn(`⚠️ Invalid z coordinate at index ${index}:`, z);
              z = 0;
            }
          } catch (error) {
            console.error(`⚠️ Error parsing joint data at index ${index}:`, error, joint);
            x = y = z = 0;
          }
          
          return (
            <div
              key={index}
              className={`p-2 rounded border ${getConfidenceBackground(conf)} transition-all hover:shadow-sm`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono bg-gray-100 px-1 rounded">
                    {index.toString().padStart(2, '0')}
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {displayName}
                  </span>
                  <span className="text-xs text-gray-500 font-mono">
                    ({jointName})
                  </span>
                </div>
                
                <span className={`text-xs font-medium ${getConfidenceColor(conf)}`}>
                  {(conf * 100).toFixed(1)}%
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <div className="bg-white px-2 py-1 rounded border">
                  <span className="text-red-600 font-bold">X:</span> {formatCoordinate(x)}
                </div>
                <div className="bg-white px-2 py-1 rounded border">
                  <span className="text-green-600 font-bold">Y:</span> {formatCoordinate(y)}
                </div>
                <div className="bg-white px-2 py-1 rounded border">
                  <span className="text-blue-600 font-bold">Z:</span> {formatCoordinate(z)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* 요약 통계 */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-gray-600">전체 관절:</span>
            <span className="ml-1 font-medium">{joints3d.length}/24</span>
          </div>
          <div>
            <span className="text-gray-600">평균 신뢰도:</span>
            <span className="ml-1 font-medium">
              {confidence && confidence.length > 0 
                ? (confidence.reduce((sum, conf) => sum + (conf || 0), 0) / confidence.length * 100).toFixed(1)
                : 0}%
            </span>
          </div>
        </div>
        
        <div className="mt-2 text-xs text-gray-500">
          <strong>좌표계:</strong> X(좌-우), Y(상-하), Z(앞-뒤) | 단위: mm (밀리미터)
        </div>
      </div>
    </div>
  );
};