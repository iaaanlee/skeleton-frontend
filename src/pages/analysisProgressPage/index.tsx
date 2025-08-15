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
  
  // 현재 표시 상태 관리
  const [displayStatus, setDisplayStatus] = useState<string>('pending');
  const [stageStartTime, setStageStartTime] = useState<number>(Date.now());

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

  // 페이지 마운트 시 상태 초기화 (재진입 시에도 항상 초기화)
  useEffect(() => {
    console.log('AnalysisProgressPage 마운트됨, 상태 초기화');
    setDisplayStatus('pending');
    setStageStartTime(Date.now());
  }, []); // 빈 dependency 배열로 마운트 시에만 실행

  // 서버 상태에 따른 표시 상태 업데이트
  useEffect(() => {
    if (!status?.status) return;

    console.log('서버 상태:', status.status, '현재 표시 상태:', displayStatus);

    // 이미 완료된 분석이라면 바로 prescription-history로 이동
    if (status.status === 'llm_completed') {
      console.log('이미 완료된 분석 발견, prescription-history로 즉시 이동');
      navigate(ROUTES.PRESCRIPTION_HISTORY);
      return;
    }

    // 서버 상태가 변경되면 바로 표시 상태도 업데이트
    if (status.status !== displayStatus) {
      console.log('상태 업데이트:', displayStatus, '→', status.status);
      setDisplayStatus(status.status);
      setStageStartTime(Date.now());
    }
  }, [status?.status]);

  // 상태에 따른 네비게이션 처리
  useEffect(() => {
    // 완료 시 네비게이션 (분석 진행 중 완료된 경우에만 타이머 사용)
    if (displayStatus === 'llm_completed') {
      console.log('분석 완료, 네비게이션 준비');
      const finalTimer = setTimeout(() => {
        console.log('처방 기록 페이지로 이동');
        navigate(ROUTES.PRESCRIPTION_HISTORY);
      }, ANALYSIS_STAGE_MIN_DURATION.LLM_COMPLETED);
      
      return () => clearTimeout(finalTimer);
    }

    // BlazePose 서버 실패 시 create-prescription 페이지로 돌아가기
    if (displayStatus === 'blazepose_server_failed') {
      console.log('BlazePose 서버 실패 감지, create-prescription 페이지로 돌아가기 준비');
      
      const failedTimer = setTimeout(() => {
        console.log('create-prescription 페이지로 이동');
        navigate(ROUTES.CREATE_PRESCRIPTION);
      }, ANALYSIS_STAGE_MIN_DURATION.BLAZEPOSE_FAILED);
      
      return () => clearTimeout(failedTimer);
    }

    // BlazePose 포즈 감지 실패 시 create-prescription 페이지로 돌아가기
    if (displayStatus === 'blazepose_pose_failed') {
      console.log('BlazePose 포즈 감지 실패 감지, create-prescription 페이지로 돌아가기 준비');
      
      const failedTimer = setTimeout(() => {
        console.log('create-prescription 페이지로 이동');
        navigate(ROUTES.CREATE_PRESCRIPTION);
      }, ANALYSIS_STAGE_MIN_DURATION.BLAZEPOSE_FAILED);
      
      return () => clearTimeout(failedTimer);
    }

    // 기타 실패 시 처방 기록 페이지로 이동
    if (displayStatus === 'failed') {
      console.log('분석 실패, 처방 기록 페이지로 이동');
      const failedTimer = setTimeout(() => {
        navigate(ROUTES.PRESCRIPTION_HISTORY);
      }, ANALYSIS_STAGE_MIN_DURATION.BLAZEPOSE_FAILED);
      
      return () => clearTimeout(failedTimer);
    }
  }, [displayStatus, status?.error, analysisJobId, navigate]);

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

  const getStatusText = (statusStr: string) => {
    switch (statusStr) {
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
      case 'blazepose_server_failed':
        return ANALYSIS_STAGE_TEXT.BLAZEPOSE_FAILED;
      case 'blazepose_pose_failed':
        return '포즈 감지 실패';
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
      case 'blazepose_server_failed':
      case 'blazepose_pose_failed':
      case 'failed':
        return 0;
      default:
        return 10;
    }
  };

  // 단계별 완료 상태 확인 (서버 상태 기준)
  const isStageCompleted = (stage: string) => {
    const serverStatus = status?.status || 'pending';
    
    // 각 단계별 완료 조건
    switch (stage) {
      case 'pending':
        return ['blazepose_processing', 'blazepose_completed', 'llm_processing', 'llm_completed'].includes(serverStatus);
      case 'blazepose_processing':
        return ['blazepose_completed', 'llm_processing', 'llm_completed'].includes(serverStatus);
      case 'blazepose_completed':
        return ['llm_processing', 'llm_completed'].includes(serverStatus);
      case 'llm_processing':
        return ['llm_completed'].includes(serverStatus);
      case 'llm_completed':
        return serverStatus === 'llm_completed';
      default:
        return false;
    }
  };

  // 단계별 활성 상태 확인 (서버 상태 기준)
  const isStageActive = (stage: string) => {
    return status?.status === stage;
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
              {(displayStatus === 'failed' || displayStatus === 'blazepose_server_failed' || displayStatus === 'blazepose_pose_failed') && (
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
                {displayStatus === 'blazepose_server_failed'
                  ? '자세 분석 서버 연결에 실패했습니다. 잠시 후 운동 처방 페이지로 돌아갑니다.'
                  : displayStatus === 'blazepose_pose_failed'
                  ? '업로드하신 이미지에서 포즈를 감지할 수 없습니다. 다른 이미지로 다시 시도해주세요.'
                  : status?.message || '분석이 진행 중입니다. 잠시만 기다려주세요.'}
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
