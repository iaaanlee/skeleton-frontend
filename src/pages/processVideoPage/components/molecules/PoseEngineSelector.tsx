import React from 'react';
import { PoseEngineType, POSE_ENGINES } from '../../../../types/poseEngine';

type PoseEngineSelectorProps = {
  selectedEngine: PoseEngineType;
  onEngineChange: (engine: PoseEngineType) => void;
  className?: string;
};

export const PoseEngineSelector: React.FC<PoseEngineSelectorProps> = ({
  selectedEngine,
  onEngineChange,
  className = ''
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          포즈 추정 엔진 선택
        </h3>
        <span className="text-sm text-gray-500">
          비디오 분석에 사용할 엔진을 선택하세요
        </span>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2">
        {POSE_ENGINES.map((engine) => {
          const isSelected = selectedEngine === engine.id;
          const isDisabled = !engine.isAvailable;
          
          return (
            <button
              key={engine.id}
              type="button"
              onClick={() => !isDisabled && onEngineChange(engine.id)}
              disabled={isDisabled}
              className={`
                relative p-4 border rounded-lg text-left transition-all duration-200
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500 ring-opacity-20' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
                }
                ${isDisabled 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'cursor-pointer hover:shadow-sm'
                }
              `}
            >
              {/* 선택 인디케이터 */}
              <div className="absolute top-3 right-3">
                {isSelected ? (
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                )}
              </div>

              {/* 엔진 정보 */}
              <div className="pr-8">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="text-base font-medium text-gray-900">
                    {engine.name}
                  </h4>
                  {engine.isDefault && (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      기본값
                    </span>
                  )}
                  {!engine.isAvailable && (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                      비활성화
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 mb-3">
                  {engine.description}
                </p>
                
                <div className="space-y-1">
                  {engine.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-xs text-gray-500">
                      <svg className="w-3 h-3 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      {/* 비디오 분석 관련 추가 정보 */}
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
        <div className="flex">
          <svg className="w-5 h-5 text-amber-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div className="text-sm">
            <p className="text-amber-800 font-medium">비디오 분석 시 고려사항</p>
            <p className="text-amber-700 mt-1">
              비디오 분석은 이미지 분석보다 처리 시간이 오래 걸릴 수 있습니다. 
              HybrIK 엔진의 경우 3D 분석으로 더 정밀하지만 처리 시간이 더 소요됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};