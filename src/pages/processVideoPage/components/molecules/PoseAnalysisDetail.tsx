import React, { useState } from 'react';
import { 
  CompletedPoseAnalysisMediaSet, 
  PoseAnalysisDetail as PoseAnalysisDetailType,
  JOINT_NAMES_33 
} from '../../../../types/completedPoseAnalysis';
import { JointCoordinateChart } from './JointCoordinateChart';

export type PoseAnalysisDetailProps = {
  selectedMediaSet: CompletedPoseAnalysisMediaSet;
  analysisDetail: PoseAnalysisDetailType | null;
  isLoading: boolean;
  error: string | null;
  className?: string;
};

export const PoseAnalysisDetail: React.FC<PoseAnalysisDetailProps> = ({
  selectedMediaSet,
  analysisDetail,
  isLoading,
  error,
  className = ''
}) => {
  const [isAnalysisImagesOpen, setIsAnalysisImagesOpen] = useState(false);
  const [isJointCoordinatesOpen, setIsJointCoordinatesOpen] = useState(false);
  const [isPoseCoordinatesOpen, setIsPoseCoordinatesOpen] = useState(false);
  const [openJointIndices, setOpenJointIndices] = useState<Set<number>>(new Set());
  const [openPoseJointIndices, setOpenPoseJointIndices] = useState<Set<number>>(new Set());

  const toggleJointCoordinate = (jointIndex: number) => {
    const newOpenJointIndices = new Set(openJointIndices);
    if (newOpenJointIndices.has(jointIndex)) {
      newOpenJointIndices.delete(jointIndex);
    } else {
      newOpenJointIndices.add(jointIndex);
    }
    setOpenJointIndices(newOpenJointIndices);
  };

  const togglePoseCoordinate = (jointIndex: number) => {
    const newOpenPoseJointIndices = new Set(openPoseJointIndices);
    if (newOpenPoseJointIndices.has(jointIndex)) {
      newOpenPoseJointIndices.delete(jointIndex);
    } else {
      newOpenPoseJointIndices.add(jointIndex);
    }
    setOpenPoseJointIndices(newOpenPoseJointIndices);
  };

  if (!selectedMediaSet) {
    return null;
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          포즈 분석 이미지 & 관절 좌표
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          선택된 미디어셋: {selectedMediaSet.poseDescription || '자세 설명 없음'}
        </p>
      </div>

      <div className="p-6 space-y-4">
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">분석 데이터를 불러오는 중...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {analysisDetail && (
          <div className="space-y-4">
            {/* 분석 이미지 토글 */}
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => setIsAnalysisImagesOpen(!isAnalysisImagesOpen)}
                className="w-full px-4 py-3 text-left flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-t-lg transition-colors"
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium text-gray-900">
                    분석 이미지 ({analysisDetail.analysisImages.length}개)
                  </span>
                </div>
                <svg 
                  className={`w-5 h-5 text-gray-500 transform transition-transform ${
                    isAnalysisImagesOpen ? 'rotate-180' : ''
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isAnalysisImagesOpen && (
                <div className="p-4 border-t border-gray-200">
                  {analysisDetail.analysisImages.length === 0 ? (
                    <div className="text-center py-8">
                      <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-500 text-sm">분석 이미지를 찾을 수 없습니다</p>
                      <p className="text-gray-400 text-xs mt-1">BlazePose 처리된 이미지가 없거나 로드에 실패했습니다</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {analysisDetail.analysisImages.map((image) => (
                        <div key={image.frameIndex} className="bg-gray-50 rounded-lg p-3">
                          <div className="aspect-video bg-gray-200 rounded-lg mb-2 overflow-hidden">
                            <img
                              src={image.imageUrl}
                              alt={`Frame ${image.frameIndex}`}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = `
                                    <div class="w-full h-full flex items-center justify-center text-gray-400">
                                      <div class="text-center">
                                        <svg class="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                        <p class="text-xs">이미지 로드 실패</p>
                                      </div>
                                    </div>
                                  `;
                                }
                              }}
                            />
                          </div>
                          <div className="text-xs text-gray-600">
                            <div>프레임 {image.frameIndex}</div>
                            <div>시점: {image.timestamp.toFixed(1)}초</div>
                            <div>신뢰도: {(image.confidence * 100).toFixed(1)}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 관절 좌표 토글 */}
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => setIsJointCoordinatesOpen(!isJointCoordinatesOpen)}
                className="w-full px-4 py-3 text-left flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-t-lg transition-colors"
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="font-medium text-gray-900">
                    관절 좌표_world_landmarks (33개 관절)
                  </span>
                </div>
                <svg 
                  className={`w-5 h-5 text-gray-500 transform transition-transform ${
                    isJointCoordinatesOpen ? 'rotate-180' : ''
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isJointCoordinatesOpen && (
                <div className="p-4 border-t border-gray-200">
                  {analysisDetail.jointCoordinates.length === 0 ? (
                    <div className="text-center py-8">
                      <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <p className="text-gray-500 text-sm">관절 좌표 데이터를 찾을 수 없습니다</p>
                      <p className="text-gray-400 text-xs mt-1">world_landmarks 데이터가 없거나 로드에 실패했습니다</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {JOINT_NAMES_33.map((jointName, jointIndex) => {
                        // 해당 관절의 모든 프레임 데이터 가져오기
                        const jointData = analysisDetail.jointCoordinates
                          .map(frame => frame.worldLandmarks.find(joint => joint.jointIndex === jointIndex))
                          .filter(Boolean);

                        const hasData = jointData.length > 0;

                        return (
                          <div key={jointIndex} className="border border-gray-200 rounded-lg">
                            <button
                              onClick={() => toggleJointCoordinate(jointIndex)}
                              className="w-full px-3 py-2 text-left flex items-center justify-between bg-white hover:bg-gray-50 rounded-lg transition-colors"
                            >
                              <div className="flex items-center">
                                <div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium mr-2">
                                  {jointIndex}
                                </div>
                                <span className="text-sm font-medium text-gray-900">
                                  {jointName}
                                </span>
                                {!hasData && (
                                  <span className="ml-2 text-xs text-gray-400">(데이터 없음)</span>
                                )}
                              </div>
                              <svg 
                                className={`w-4 h-4 text-gray-500 transform transition-transform ${
                                  openJointIndices.has(jointIndex) ? 'rotate-180' : ''
                                }`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            
                            {openJointIndices.has(jointIndex) && (
                              <div className="px-3 pb-3 border-t border-gray-100">
                                <div className="mt-3 bg-gray-50 rounded-lg p-3">
                                  {!hasData ? (
                                    <div className="text-center py-4 text-gray-500">
                                      <p className="text-sm">이 관절의 좌표 데이터가 없습니다</p>
                                    </div>
                                  ) : (
                                    <>
                                      <p className="text-sm text-gray-600 mb-3">
                                        {jointName} 좌표 데이터 ({jointData.length}개 프레임)
                                      </p>
                                      
                                      {/* 좌표 데이터 테이블 */}
                                      <div className="max-h-48 overflow-y-auto mb-3">
                                        <table className="w-full text-xs">
                                          <thead className="bg-gray-100 sticky top-0">
                                            <tr>
                                              <th className="px-2 py-1 text-left">프레임</th>
                                              <th className="px-2 py-1 text-left">X (m)</th>
                                              <th className="px-2 py-1 text-left">Y (m)</th>
                                              <th className="px-2 py-1 text-left">Z (m)</th>
                                              <th className="px-2 py-1 text-left">신뢰도</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {analysisDetail.jointCoordinates.map((frame, frameIdx) => {
                                              const joint = frame.worldLandmarks.find(j => j.jointIndex === jointIndex);
                                              return joint ? (
                                                <tr key={frameIdx} className="border-t border-gray-200">
                                                  <td className="px-2 py-1">{frame.frameIndex}</td>
                                                  <td className="px-2 py-1 font-mono">{joint.x.toFixed(3)}</td>
                                                  <td className="px-2 py-1 font-mono">{joint.y.toFixed(3)}</td>
                                                  <td className="px-2 py-1 font-mono">{joint.z.toFixed(3)}</td>
                                                  <td className="px-2 py-1">
                                                    <span className={`inline-block px-1 rounded text-xs ${
                                                      joint.visibility > 0.8 ? 'bg-green-100 text-green-800' :
                                                      joint.visibility > 0.6 ? 'bg-yellow-100 text-yellow-800' :
                                                      'bg-red-100 text-red-800'
                                                    }`}>
                                                      {(joint.visibility * 100).toFixed(0)}%
                                                    </span>
                                                  </td>
                                                </tr>
                                              ) : null;
                                            })}
                                          </tbody>
                                        </table>
                                      </div>

                                      {/* 실제 좌표 차트 */}
                                      <JointCoordinateChart
                                        jointCoordinates={analysisDetail.jointCoordinates}
                                        jointIndex={jointIndex}
                                        jointName={jointName}
                                        className="mb-2"
                                        dataType="world_landmarks"
                                      />

                                      <div className="flex items-center justify-center space-x-4 text-xs">
                                        <div className="flex items-center">
                                          <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                                          <span>X축</span>
                                        </div>
                                        <div className="flex items-center">
                                          <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                                          <span>Y축</span>
                                        </div>
                                        <div className="flex items-center">
                                          <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                                          <span>Z축</span>
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 관절 좌표_pose_landmarks 토글 */}
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => setIsPoseCoordinatesOpen(!isPoseCoordinatesOpen)}
                className="w-full px-4 py-3 text-left flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-t-lg transition-colors"
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="font-medium text-gray-900">
                    관절 좌표_pose_landmarks (33개 관절)
                  </span>
                </div>
                <svg 
                  className={`w-5 h-5 text-gray-500 transform transition-transform ${
                    isPoseCoordinatesOpen ? 'rotate-180' : ''
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isPoseCoordinatesOpen && (
                <div className="p-4 border-t border-gray-200">
                  {analysisDetail.jointCoordinates.length === 0 ? (
                    <div className="text-center py-8">
                      <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <p className="text-gray-500 text-sm">관절 좌표 데이터를 찾을 수 없습니다</p>
                      <p className="text-gray-400 text-xs mt-1">pose_landmarks 데이터가 없거나 로드에 실패했습니다</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {JOINT_NAMES_33.map((jointName, jointIndex) => {
                        // 해당 관절의 모든 프레임 데이터 가져오기 (pose_landmarks 사용)
                        const jointData = analysisDetail.jointCoordinates
                          .map(frame => frame.poseLandmarks.find(joint => joint.jointIndex === jointIndex))
                          .filter(Boolean);

                        const hasData = jointData.length > 0;

                        return (
                          <div key={jointIndex} className="border border-gray-200 rounded-lg">
                            <button
                              onClick={() => togglePoseCoordinate(jointIndex)}
                              className="w-full px-3 py-2 text-left flex items-center justify-between bg-white hover:bg-gray-50 rounded-lg transition-colors"
                            >
                              <div className="flex items-center">
                                <div className="w-6 h-6 bg-purple-100 text-purple-800 rounded-full flex items-center justify-center text-xs font-medium mr-2">
                                  {jointIndex}
                                </div>
                                <span className="text-sm font-medium text-gray-900">
                                  {jointName}
                                </span>
                                {!hasData && (
                                  <span className="ml-2 text-xs text-gray-400">(데이터 없음)</span>
                                )}
                              </div>
                              <svg 
                                className={`w-4 h-4 text-gray-500 transform transition-transform ${
                                  openPoseJointIndices.has(jointIndex) ? 'rotate-180' : ''
                                }`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            
                            {openPoseJointIndices.has(jointIndex) && (
                              <div className="px-3 pb-3 border-t border-gray-100">
                                <div className="mt-3 bg-gray-50 rounded-lg p-3">
                                  {!hasData ? (
                                    <div className="text-center py-4 text-gray-500">
                                      <p className="text-sm">이 관절의 좌표 데이터가 없습니다</p>
                                    </div>
                                  ) : (
                                    <>
                                      <p className="text-sm text-gray-600 mb-3">
                                        {jointName} 좌표 데이터 ({jointData.length}개 프레임)
                                      </p>
                                      
                                      {/* 좌표 데이터 테이블 */}
                                      <div className="max-h-48 overflow-y-auto mb-3">
                                        <table className="w-full text-xs">
                                          <thead className="bg-gray-100 sticky top-0">
                                            <tr>
                                              <th className="px-2 py-1 text-left">프레임</th>
                                              <th className="px-2 py-1 text-left">X</th>
                                              <th className="px-2 py-1 text-left">Y</th>
                                              <th className="px-2 py-1 text-left">Z</th>
                                              <th className="px-2 py-1 text-left">신뢰도</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {analysisDetail.jointCoordinates.map((frame, frameIdx) => {
                                              const joint = frame.poseLandmarks.find(j => j.jointIndex === jointIndex);
                                              return joint ? (
                                                <tr key={frameIdx} className="border-t border-gray-200">
                                                  <td className="px-2 py-1">{frame.frameIndex}</td>
                                                  <td className="px-2 py-1 font-mono">{joint.x.toFixed(3)}</td>
                                                  <td className="px-2 py-1 font-mono">{joint.y.toFixed(3)}</td>
                                                  <td className="px-2 py-1 font-mono">{joint.z.toFixed(3)}</td>
                                                  <td className="px-2 py-1">
                                                    <span className={`inline-block px-1 rounded text-xs ${
                                                      joint.visibility > 0.8 ? 'bg-green-100 text-green-800' :
                                                      joint.visibility > 0.6 ? 'bg-yellow-100 text-yellow-800' :
                                                      'bg-red-100 text-red-800'
                                                    }`}>
                                                      {(joint.visibility * 100).toFixed(0)}%
                                                    </span>
                                                  </td>
                                                </tr>
                                              ) : null;
                                            })}
                                          </tbody>
                                        </table>
                                      </div>

                                      {/* 실제 좌표 차트 */}
                                      <JointCoordinateChart
                                        jointCoordinates={analysisDetail.jointCoordinates}
                                        jointIndex={jointIndex}
                                        jointName={jointName}
                                        className="mb-2"
                                        dataType="landmarks"
                                      />

                                      <div className="flex items-center justify-center space-x-4 text-xs">
                                        <div className="flex items-center">
                                          <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                                          <span>X축</span>
                                        </div>
                                        <div className="flex items-center">
                                          <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                                          <span>Y축</span>
                                        </div>
                                        <div className="flex items-center">
                                          <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                                          <span>Z축</span>
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 분석 정보 요약 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">분석 정보</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">총 프레임:</span>
                  <span className="ml-2 font-medium">{analysisDetail.totalFrames}개</span>
                </div>
                <div>
                  <span className="text-gray-600">완료 시간:</span>
                  <span className="ml-2 font-medium">
                    {new Date(analysisDetail.completedAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};