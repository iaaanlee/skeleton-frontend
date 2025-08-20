import React, { useState, useRef, useEffect } from 'react';
import { useVideoUploadInit, useVideoFileUpload, useVideoUploadComplete } from '../../../../services/videoUploadService';
import { useToast } from '../../../../contexts/ToastContext';

type VideoUploadSectionProps = {
  className?: string;
  onUploadSuccess?: () => void;
};

export const VideoUploadSection: React.FC<VideoUploadSectionProps> = ({
  className = '',
  onUploadSuccess
}) => {
  const { showSuccess, showError } = useToast();
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [exerciseDescription, setExerciseDescription] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(5);
  // const [currentTime, setCurrentTime] = useState<number>(0); // 현재 사용하지 않음
  const [isVideoReady, setIsVideoReady] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // React Query 훅들
  const uploadInitMutation = useVideoUploadInit();
  const fileUploadMutation = useVideoFileUpload();
  const uploadCompleteMutation = useVideoUploadComplete();

  const handleVideoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 비디오 파일 타입 검증
      if (file.type.startsWith('video/')) {
        setSelectedVideo(file);
        
        // 기존 URL 정리
        if (videoUrl) {
          URL.revokeObjectURL(videoUrl);
        }
        
        // 새 URL 생성하여 비디오 프리뷰 표시
        const newVideoUrl = URL.createObjectURL(file);
        setVideoUrl(newVideoUrl);
        setIsVideoReady(false);
      } else {
        showError('비디오 파일만 업로드 가능합니다.');
      }
    }
  };

  // 비디오 메타데이터 로드 시 호출
  const handleVideoLoadedMetadata = () => {
    if (videoRef.current) {
      const duration = videoRef.current.duration;
      setVideoDuration(duration);
      setEndTime(Math.min(5, duration)); // 최대 5초 또는 비디오 전체 길이
      setIsVideoReady(true);
    }
  };

  // 비디오 시간 업데이트 (현재 미사용)
  // const handleVideoTimeUpdate = () => {
  //   if (videoRef.current) {
  //     setCurrentTime(videoRef.current.currentTime);
  //   }
  // };

  // 시작/종료 시간 변경 핸들러
  const handleStartTimeChange = (time: number) => {
    setStartTime(time);
    if (time >= endTime) {
      setEndTime(Math.min(time + 1, videoDuration));
    }
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleEndTimeChange = (time: number) => {
    setEndTime(time);
    if (time <= startTime) {
      setStartTime(Math.max(time - 1, 0));
    }
  };

  // 선택된 구간 길이 계산
  const selectedDuration = endTime - startTime;

  // 컴포넌트 언마운트 시 URL 정리
  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  const handleUpload = async () => {
    if (!selectedVideo) {
      showError('비디오 파일을 선택해주세요.');
      return;
    }
    if (!exerciseDescription.trim()) {
      showError('운동 설명을 입력해주세요.');
      return;
    }
    if (selectedDuration > 5) {
      showError('선택된 구간이 5초를 초과합니다. 구간을 조정해주세요.');
      return;
    }

    setIsUploading(true);
    
    try {
      // 1단계: Pre-signed URL 생성
      setUploadProgress('업로드 URL 생성 중...');
      const initResponse = await uploadInitMutation.mutateAsync({
        fileName: selectedVideo.name,
        fileSize: selectedVideo.size,
        contentType: selectedVideo.type
      });

      // 2단계: S3에 파일 업로드
      setUploadProgress('비디오 파일 업로드 중...');
      await fileUploadMutation.mutateAsync({
        file: selectedVideo,
        uploadUrl: initResponse.uploadUrl
      });

      // 3단계: 업로드 완료 처리 (비디오 처리 및 DB 저장)
      setUploadProgress('비디오 처리 중...');
      const completeResponse = await uploadCompleteMutation.mutateAsync({
        objectKey: initResponse.objectKey,
        fileName: selectedVideo.name,
        fileSize: selectedVideo.size,
        poseDescription: exerciseDescription.trim(),
        startTime: startTime,
        endTime: endTime
      });

      setUploadProgress('업로드 완료!');
      showSuccess('비디오가 성공적으로 업로드되었습니다!');
      
      // 업로드 성공 콜백 호출
      onUploadSuccess?.();
      
      // 업로드 완료 후 폼 리셋
      setSelectedVideo(null);
      setExerciseDescription('');
      setVideoUrl(null);
      setIsVideoReady(false);
      setStartTime(0);
      setEndTime(5);
      
      // 파일 input 리셋
      const fileInput = document.getElementById('video-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }

    } catch (error) {
      console.error('비디오 업로드 에러:', error);
      showError('비디오 업로드 중 오류가 발생했습니다.');
      setUploadProgress('업로드 실패');
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(''), 3000); // 3초 후 메시지 제거
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-4">
          운동 영상 업로드
        </h3>
        
        <div className="space-y-4">
          {/* 운동 설명 입력 */}
          <div>
            <label htmlFor="exercise-description" className="block text-sm font-medium text-gray-700 mb-2">
              운동 설명 *
            </label>
            <input
              id="exercise-description"
              type="text"
              value={exerciseDescription}
              onChange={(e) => setExerciseDescription(e.target.value)}
              placeholder="예: 스쿼트, 데드리프트, 턱걸이 등"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={100}
            />
            <p className="text-xs text-gray-500 mt-1">
              어떤 운동인지 간단히 설명해주세요. (최대 100자)
            </p>
          </div>

          {/* 비디오 파일 선택 */}
          <div>
            <label htmlFor="video-upload" className="block text-sm font-medium text-gray-700 mb-2">
              비디오 파일 선택 *
            </label>
            <input
              id="video-upload"
              type="file"
              accept="video/*"
              onChange={handleVideoSelect}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              최대 5초 길이의 운동 영상을 업로드하세요. (MP4, MOV, AVI 등 지원)
            </p>
          </div>

          {/* 선택된 파일 정보 */}
          {selectedVideo && (
            <div className="p-3 bg-green-100 border border-green-300 rounded-lg">
              <p className="text-sm text-green-800">
                <span className="font-medium">선택된 파일:</span> {selectedVideo.name}
              </p>
              <p className="text-xs text-green-700 mt-1">
                크기: {(selectedVideo.size / 1024 / 1024).toFixed(2)} MB
                {isVideoReady && (
                  <span className="ml-4">
                    전체 길이: {videoDuration.toFixed(1)}초
                  </span>
                )}
              </p>
            </div>
          )}

          {/* 비디오 프리뷰 및 트리밍 섹션 */}
          {selectedVideo && videoUrl && (
            <div className="border border-gray-300 rounded-lg p-4 bg-white">
              <h4 className="text-sm font-medium text-gray-700 mb-3">비디오 구간 선택</h4>
              
              {/* 비디오 플레이어 */}
              <div className="mb-4">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  controls
                  className="w-full max-w-md mx-auto rounded-lg"
                  onLoadedMetadata={handleVideoLoadedMetadata}
                  // onTimeUpdate={handleVideoTimeUpdate} // 현재 미사용
                >
                  비디오를 재생할 수 없습니다.
                </video>
              </div>

              {isVideoReady && (
                <div className="space-y-4">
                  {/* 시간 슬라이더 */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        시작 시간: {startTime.toFixed(1)}초
                      </label>
                      <input
                        type="range"
                        min={0}
                        max={Math.max(0, videoDuration - 1)}
                        step={0.1}
                        value={startTime}
                        onChange={(e) => handleStartTimeChange(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb-blue"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        종료 시간: {endTime.toFixed(1)}초
                      </label>
                      <input
                        type="range"
                        min={Math.min(startTime + 0.5, videoDuration)}
                        max={videoDuration}
                        step={0.1}
                        value={endTime}
                        onChange={(e) => handleEndTimeChange(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb-blue"
                      />
                    </div>
                  </div>

                  {/* 선택된 구간 정보 */}
                  <div className={`p-3 rounded-lg border ${
                    selectedDuration <= 5 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        선택된 구간: {selectedDuration.toFixed(1)}초
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        selectedDuration <= 5
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedDuration <= 5 ? '✓ 업로드 가능' : '⚠ 5초 초과'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {startTime.toFixed(1)}초 ~ {endTime.toFixed(1)}초
                    </p>
                  </div>

                  {/* 빠른 선택 버튼들 */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        handleStartTimeChange(0);
                        handleEndTimeChange(Math.min(5, videoDuration));
                      }}
                      className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      처음 5초
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const middle = videoDuration / 2;
                        handleStartTimeChange(Math.max(0, middle - 2.5));
                        handleEndTimeChange(Math.min(videoDuration, middle + 2.5));
                      }}
                      className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      중간 5초
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleStartTimeChange(Math.max(0, videoDuration - 5));
                        handleEndTimeChange(videoDuration);
                      }}
                      className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      마지막 5초
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 업로드 진행 상태 */}
          {isUploading && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <svg className="animate-spin h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="text-yellow-800 font-medium">{uploadProgress}</span>
              </div>
            </div>
          )}

          {/* 업로드 버튼 */}
          <button
            onClick={handleUpload}
            disabled={
              !selectedVideo || 
              !exerciseDescription.trim() || 
              selectedDuration > 5 ||
              !isVideoReady ||
              isUploading
            }
            className={`
              w-full px-6 py-3 rounded-lg font-medium transition-colors
              ${selectedVideo && 
                exerciseDescription.trim() && 
                selectedDuration <= 5 && 
                isVideoReady &&
                !isUploading
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            {isUploading
              ? '업로드 중...'
              : !isVideoReady && selectedVideo 
              ? '비디오 로딩 중...' 
              : selectedDuration > 5
              ? '구간을 5초 이하로 조정해주세요'
              : '비디오 업로드'
            }
          </button>
        </div>

        {/* 안내사항 */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">📖 업로드 안내</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• 비디오 파일을 선택하면 프리뷰가 표시됩니다.</li>
            <li>• 슬라이더를 사용하여 원하는 구간을 선택할 수 있습니다.</li>
            <li>• 선택된 구간은 최대 5초로 제한됩니다.</li>
            <li>• 운동의 한 사이클(시작-중간-끝)이 포함된 구간을 선택하는 것이 이상적입니다.</li>
            <li>• 선택된 구간은 0.2초 간격으로 이미지로 분할되어 분석됩니다.</li>
            <li>• 관절 좌표 분석을 통해 운동의 피크 지점을 자동으로 감지합니다.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};