import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { ANALYSIS_STAGE_MIN_DURATION, ANALYSIS_STAGE_TEXT, ANALYSIS_STAGES } from '../../constants/analysis';
import { useAnalysisStatus } from '../../services/analysisService/analysisQuery';
import { usePrescriptionByAnalysisJob } from '../../services/prescriptionService/prescriptionQuery';
import { useProfile } from '../../contexts/ProfileAuthContext';

export const AnalysisProgressPage = () => {
  const { analysisJobId } = useParams<{ analysisJobId: string }>();
  const navigate = useNavigate();
  const { selectedProfile } = useProfile();
  
  // 최소 대기 시간 관리를 위한 상태
  const [displayStatus, setDisplayStatus] = useState<string>('pending');
  const [stageStartTime, setStageStartTime] = useState<number>(Date.now());
  const stageTimersRef = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const [serverStatusHistory, setServerStatusHistory] = useState<string[]>(['pending']);
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);

  // 분석 상태 조회
  const { 
    data: status, 
    isLoading: statusLoading, 
    error: statusError 
  } = useAnalysisStatus(analysisJobId || '', selectedProfile?._id);

  // 처방 정보 조회 (현재는 사용하지 않지만 향후 확장을 위해 유지)
  const {
    isLoading: prescriptionLoading
  } = usePrescriptionByAnalysisJob(analysisJobId || '');

  // 서버 상태 히스토리 업데이트
  useEffect(() => {
    if (!status?.status) return;

    console.log('서버 상태:', status.status, '현재 표시 상태:', displayStatus);

    // 서버 상태 히스토리에 새로운 상태 추가 (중복 제거)
    setServerStatusHistory(prev => {
      if (!prev.includes(status.status)) {
        console.log('서버 상태 히스토리 업데이트:', [...prev, status.status]);
        return [...prev, status.status];
      }
      return prev;
    });
  }, [status?.status]);

  // 단계별 순차 진행
  useEffect(() => {
    const currentTime = Date.now();
    const elapsedTime = currentTime - stageStartTime;

    // 현재 표시 상태의 최소 대기 시간
    const getMinDuration = (s: string) => {
      switch (s) {
        case 'pending':
          return ANALYSIS_STAGE_MIN_DURATION.PENDING;
        case 'blazepose_processing':
          return ANALYSIS_STAGE_MIN_DURATION.BLAZEPOSE_PROCESSING;
        case 'blazepose_completed':
          return ANALYSIS_STAGE_MIN_DURATION.BLAZEPOSE_COMPLETED;
        case 'llm_processing':
          return ANALYSIS_STAGE_MIN_DURATION.LLM_PROCESSING;
        case 'llm_completed':
          return ANALYSIS_STAGE_MIN_DURATION.LLM_COMPLETED;
        default:
          return 0;
      }
    };

    const currentMinDuration = getMinDuration(displayStatus);
    const canAdvance = elapsedTime >= currentMinDuration;

    // 다음 단계로 진행할 수 있는지 확인
    const nextStageIndex = currentStageIndex + 1;
    const nextStage = serverStatusHistory[nextStageIndex];

    if (canAdvance && nextStage && nextStage !== displayStatus) {
      console.log('다음 단계로 진행:', displayStatus, '→', nextStage);
      setDisplayStatus(nextStage);
      setCurrentStageIndex(nextStageIndex);
      setStageStartTime(currentTime);
    } else if (!canAdvance && nextStage) {
      // 최소 시간이 안 지났지만 다음 단계가 있으면 타이머 설정
      const remainingTime = currentMinDuration - elapsedTime;
      console.log(`${remainingTime}ms 후 다음 단계 진행 예정:`, nextStage);
      
      if (stageTimersRef.current['nextStage']) {
        clearTimeout(stageTimersRef.current['nextStage']);
      }
      
      stageTimersRef.current['nextStage'] = setTimeout(() => {
        console.log('타이머로 다음 단계 진행:', nextStage);
        setDisplayStatus(nextStage);
        setCurrentStageIndex(nextStageIndex);
        setStageStartTime(Date.now());
      }, remainingTime) as unknown as NodeJS.Timeout;
    }

    // 완료 시 네비게이션
    if (displayStatus === 'llm_completed' || displayStatus === 'failed') {
      console.log('분석 완료, 네비게이션 준비');
      const finalTimer = setTimeout(() => {
        console.log('처방 기록 페이지로 이동');
        navigate(ROUTES.PRESCRIPTION_HISTORY);
      }, ANALYSIS_STAGE_MIN_DURATION.LLM_COMPLETED);
      
      return () => clearTimeout(finalTimer);
    }

    // 언마운트 시 타이머 정리
    return () => {
      Object.values(stageTimersRef.current).forEach(timer => {
        if (timer) clearTimeout(timer);
      });
    };
  }, [serverStatusHistory, currentStageIndex, displayStatus, stageStartTime, navigate]);

  // 로딩 중
  if (statusLoading || prescriptionLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">분석 상태를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  // 에러 처리
  if (statusError) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">분석 상태를 불러올 수 없습니다.</p>
            <button
              onClick={() => navigate(ROUTES.CREATE_PRESCRIPTION)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              처방 생성 페이지로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return ANALYSIS_STAGE_TEXT.PENDING;
      case 'blazepose_processing':
        return ANALYSIS_STAGE_TEXT.BLAZEPOSE_PROCESSING;
      case 'blazepose_completed':
        return ANALYSIS_STAGE_TEXT.BLAZEPOSE_COMPLETED;
      case 'llm_processing':
        return ANALYSIS_STAGE_TEXT.LLM_PROCESSING;
      case 'llm_completed':
        return ANALYSIS_STAGE_TEXT.LLM_COMPLETED;
      case 'failed':
        return '분석 실패';
      default:
        return '분석 중...';
    }
  };

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case 'pending':
        return 10;
      case 'blazepose_processing':
        return 30;
      case 'blazepose_completed':
        return 60;
      case 'llm_processing':
        return 80;
      case 'llm_completed':
        return 100;
      case 'failed':
        return 0;
      default:
        return 10;
    }
  };

  // 단계별 완료 상태 확인
  const isStageCompleted = (stage: string) => {
    const stageIndex = ANALYSIS_STAGES.indexOf(stage as typeof ANALYSIS_STAGES[number]);
    const currentIndex = ANALYSIS_STAGES.indexOf(displayStatus as typeof ANALYSIS_STAGES[number]);
    return stageIndex <= currentIndex;
  };

  // 단계별 활성 상태 확인
  const isStageActive = (stage: string) => {
    return displayStatus === stage;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">운동 분석 진행 중</h1>
              <p className="text-gray-600 mt-1">
                {getStatusText(displayStatus)}
              </p>
            </div>
            <button
              onClick={() => navigate(ROUTES.CREATE_PRESCRIPTION)}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              ← 돌아가기
            </button>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* 진행률 바 */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">분석 진행률</span>
                <span className="text-sm text-gray-500">
                  {getProgressPercentage(displayStatus)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${getProgressPercentage(displayStatus)}%` }}
                ></div>
              </div>
            </div>

            {/* 상태 메시지 */}
            <div className="text-center mb-8">
              {displayStatus !== 'llm_completed' && displayStatus !== 'failed' && (
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              )}
              {displayStatus === 'llm_completed' && (
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
              {displayStatus === 'failed' && (
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              )}
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {getStatusText(displayStatus)}
              </h2>
              <p className="text-gray-600">
                {status?.message || '분석이 진행 중입니다. 잠시만 기다려주세요.'}
              </p>
            </div>

            {/* 분석 단계 표시 */}
            <div className="space-y-4">
              {ANALYSIS_STAGES.map((stage, index) => (
                <div
                  key={stage}
                  className={`flex items-center p-3 rounded-lg transition-all duration-300 ${
                    isStageCompleted(stage)
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 transition-all duration-300 ${
                    isStageCompleted(stage)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {isStageCompleted(stage) ? (
                      '✓'
                    ) : isStageActive(stage) ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      ''
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {ANALYSIS_STAGE_TEXT[stage.toUpperCase() as keyof typeof ANALYSIS_STAGE_TEXT] || stage}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 예상 시간 */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                예상 소요 시간: 약 1-2분
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
