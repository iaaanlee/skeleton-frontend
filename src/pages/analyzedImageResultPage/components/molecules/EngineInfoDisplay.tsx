import React from 'react';
import { PoseEngineType, POSE_ENGINES } from '../../../../types/poseEngine';

type EngineInfoDisplayProps = {
  engine: PoseEngineType;
  className?: string;
};

export const EngineInfoDisplay: React.FC<EngineInfoDisplayProps> = ({
  engine,
  className = ''
}) => {
  const engineInfo = POSE_ENGINES.find(e => e.id === engine);
  
  if (!engineInfo) return null;

  return (
    <div className={`bg-gray-50 border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start space-x-4">
        {/* 엔진 아이콘 */}
        <div className="flex-shrink-0">
          <div className={`
            w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-sm
            ${engine === 'hybrik' ? 'bg-purple-500' : 'bg-blue-500'}
          `}>
            {engine === 'hybrik' ? '3D' : '2D'}
          </div>
        </div>

        {/* 엔진 정보 */}
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {engineInfo.name}
            </h3>
            {engineInfo.isDefault && (
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                기본값
              </span>
            )}
          </div>
          
          <p className="text-sm text-gray-600 mb-3">
            {engineInfo.description}
          </p>
          
          {/* 특징 목록 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {engineInfo.features.map((feature, index) => (
              <div key={index} className="flex items-center text-xs text-gray-500">
                <svg className="w-3 h-3 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* 추가 정보 */}
        <div className="flex-shrink-0 text-right">
          <div className="text-xs text-gray-500 mb-1">관절 포인트</div>
          <div className="text-2xl font-bold text-gray-900">
            {engine === 'hybrik' ? '24' : '33'}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {engine === 'hybrik' ? '3D 좌표' : '2D 좌표'}
          </div>
        </div>
      </div>

      {/* HybrIK 전용 추가 정보 */}
      {engine === 'hybrik' && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-sm">
            <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-700 font-medium">3D 포즈 추정</span>
            <span className="text-gray-500">· 공간적 좌표 분석 · SMPL 모델 기반</span>
          </div>
        </div>
      )}

      {/* BlazePose 전용 추가 정보 */}
      {engine === 'blazepose' && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-sm">
            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-700 font-medium">고속 2D 분석</span>
            <span className="text-gray-500">· 얼굴 & 손 랜드마크 · 실시간 처리</span>
          </div>
        </div>
      )}
    </div>
  );
};